from rest_framework.routers import DefaultRouter
from .views import FoodItemViewSet, OrderViewSet,StudentDuesViewSet
from django.urls import path, include
from .views import RegisterStudentView, LoginView
from django.conf import settings
from django.conf.urls.static import static
router = DefaultRouter()
router.register(r'foods', FoodItemViewSet, basename='foods')
router.register(r'orders', OrderViewSet, basename='orders')
router.register(r'student-dues', StudentDuesViewSet, basename='student-dues')

urlpatterns = [
    
]
urlpatterns += [
    path('', include(router.urls)),
    path('register/', RegisterStudentView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
