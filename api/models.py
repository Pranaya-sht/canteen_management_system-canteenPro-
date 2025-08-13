from django.contrib.auth.models import AbstractUser, UserManager
from django.db import models
from django.db.models import Sum, F
from django.utils import timezone

# Custom user model
class User(AbstractUser):
    is_student = models.BooleanField(default=False)
    is_manager = models.BooleanField(default=False)
    due_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)  # Store dues

    objects = UserManager()

    def update_due_amount(self):
        """Recalculate and update the due amount for this student."""
        # if self.is_student:
        total_ordered = Order.objects.filter(student=self).aggregate(total=Sum('total_price'))['total'] or 0
        total_cleared = Order.objects.filter(student=self, cleared=True).aggregate(total=Sum('total_price'))['total'] or 0
        self.due_amount = total_ordered - total_cleared
        self.save(update_fields=['due_amount'])


class FoodItem(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to='food_images/', blank=True, null=True)
    price = models.DecimalField(max_digits=8, decimal_places=2)   # selling price
    cost_price = models.DecimalField(max_digits=8, decimal_places=2, default=0)  # NEW: cost per unit
    available = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class Order(models.Model):
    student = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        limit_choices_to={'is_student': True}
    )
    food = models.ForeignKey(FoodItem, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    total_price = models.DecimalField(max_digits=8, decimal_places=2, blank=True)
    ordered_at = models.DateTimeField(auto_now_add=True)
    cleared = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        self.total_price = self.food.price * self.quantity
        super().save(*args, **kwargs)
        # Update student's due amount after saving
        self.student.update_due_amount()

    def delete(self, *args, **kwargs):
        super().delete(*args, **kwargs)
        # Update student's due amount after deleting an order
        self.student.update_due_amount()


# NEW: General business expense entries (rent, salaries, utilities, etc.)
class Expense(models.Model):
    CATEGORY_CHOICES = [
        ("COGS-Other", "COGS - other"),  # optional non-item COGS
        ("Payroll", "Payroll"),
        ("Rent", "Rent"),
        ("Utilities", "Utilities"),
        ("Supplies", "Supplies"),
        ("Marketing", "Marketing"),
        ("Misc", "Miscellaneous"),
    ]
    title = models.CharField(max_length=120)
    category = models.CharField(max_length=32, choices=CATEGORY_CHOICES, default="Misc")
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    date = models.DateField(default=timezone.now)
    notes = models.TextField(blank=True)

    class Meta:
        ordering = ["-date"]

    def __str__(self):
        return f"{self.title} - {self.amount}"