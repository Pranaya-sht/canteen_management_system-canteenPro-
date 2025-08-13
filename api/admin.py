# api/admin.py
from django.contrib import admin
from django.db.models import Sum, F, DecimalField, ExpressionWrapper
from django.db.models.functions import TruncMonth
from django.template.response import TemplateResponse
from django.urls import path
from django.utils import timezone
from .models import FoodItem, Order, User, Expense


@admin.register(FoodItem)
class FoodItemAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'cost_price', 'available')
    search_fields = ('name',)
    list_filter = ('available',)


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'student', 'food', 'quantity', 'total_price', 'ordered_at', 'cleared')
    list_filter = ('cleared', 'ordered_at', 'food')
    search_fields = ('student__username', 'food__name')


@admin.register(Expense)
class ExpenseAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'amount', 'date')
    list_filter = ('category', 'date')
    search_fields = ('title', 'notes')


admin.site.register(User)


# --- Mixin to add reports view to default admin.site ---
class ReportsAdminSiteMixin:
    def get_urls(self):
        urls = super().get_urls()
        my_urls = [
            path('reports/', self.admin_view(self.reports_view), name='canteen_reports'),
        ]
        return my_urls + urls

    def reports_view(self, request):
        # Parse date range params or default to last 90 days
        try:
            start = request.GET.get('start')
            end = request.GET.get('end')
            if start:
                start_date = timezone.datetime.fromisoformat(start).date()
            else:
                start_date = timezone.now().date() - timezone.timedelta(days=90)
            if end:
                end_date = timezone.datetime.fromisoformat(end).date()
            else:
                end_date = timezone.now().date()
        except Exception:
            start_date = timezone.now().date() - timezone.timedelta(days=90)
            end_date = timezone.now().date()

        # Filter cleared orders for income calculations
        paid_orders = Order.objects.filter(
            cleared=True,
            ordered_at__date__range=(start_date, end_date)
        ).select_related('food')

        # Total sales
        total_sales = paid_orders.aggregate(sales=Sum('total_price'))['sales'] or 0

        # Calculate COGS: quantity * food cost_price
        cogs_expr = ExpressionWrapper(
            F('quantity') * F('food__cost_price'),
            output_field=DecimalField(max_digits=12, decimal_places=2)
        )
        total_cogs = paid_orders.aggregate(cogs=Sum(cogs_expr))['cogs'] or 0

        gross_profit = total_sales - total_cogs

        # Expenses total
        expenses_qs = Expense.objects.filter(date__range=(start_date, end_date))
        total_expenses = expenses_qs.aggregate(expenses=Sum('amount'))['expenses'] or 0

        net_profit = gross_profit - total_expenses

        # Monthly time series data
        monthly_sales = paid_orders.annotate(month=TruncMonth('ordered_at')).values('month').annotate(
            amount=Sum('total_price')).order_by('month')
        monthly_cogs = paid_orders.annotate(month=TruncMonth('ordered_at')).values('month').annotate(
            amount=Sum(cogs_expr)).order_by('month')
        monthly_expenses = expenses_qs.annotate(month=TruncMonth('date')).values('month').annotate(
            amount=Sum('amount')).order_by('month')

        # Normalize labels (dates)
        def to_date(dt):
            if hasattr(dt, 'date'):
                return dt.date()
            return dt

        labels_set = {to_date(x['month']) for x in monthly_sales} | \
                     {to_date(x['month']) for x in monthly_cogs} | \
                     {to_date(x['month']) for x in monthly_expenses}
        labels = sorted(labels_set)

        fmt = lambda d: d.strftime('%Y-%m')
        label_strings = [fmt(d) for d in labels]

        def series_for(labels, data):
            lookup = {fmt(row['month']): float(row['amount']) for row in data}
            return [lookup.get(lbl, 0) for lbl in labels]

        sales_series = series_for(label_strings, monthly_sales)
        cogs_series = series_for(label_strings, monthly_cogs)
        expenses_series = series_for(label_strings, monthly_expenses)

        gross_series = [s - c for s, c in zip(sales_series, cogs_series)]
        net_series = [g - e for g, e in zip(gross_series, expenses_series)]

        context = dict(
            self.each_context(request),
            title='Canteen Business Reports',
            start_date=start_date,
            end_date=end_date,
            kpis={
                'total_sales': float(total_sales),
                'total_cogs': float(total_cogs),
                'gross_profit': float(gross_profit),
                'total_expenses': float(total_expenses),
                'net_profit': float(net_profit),
            },
            labels=label_strings,
            series={
                'sales': sales_series,
                'cogs': cogs_series,
                'expenses': expenses_series,
                'gross': gross_series,
                'net': net_series,
            },
        )

        return TemplateResponse(request, 'admin/canteen/reports.html', context)


# Patch the default admin site to include the ReportsAdminSiteMixin
from django.contrib.admin import site as default_admin_site

default_admin_site.__class__ = type(
    'CustomAdminSite',
    (ReportsAdminSiteMixin, default_admin_site.__class__),
    {}
)
