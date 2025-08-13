from rest_framework import viewsets, permissions,status
from .models import FoodItem, Order
from rest_framework.decorators import action
from .serializers import FoodItemSerializer, OrderSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import User,FoodItem, Order
from .serializers import FoodItemSerializer, OrderSerializer, UserSerializer
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .permissions import IsStudent, IsManager
from django.contrib.auth.models import BaseUserManager
from django.db.models import Sum

class FoodItemViewSet(viewsets.ModelViewSet):
    queryset = FoodItem.objects.all()
    serializer_class = FoodItemSerializer
    permission_classes = [permissions.IsAuthenticated]

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)
        
class RegisterStudentView(APIView):
    def post(self, request):
        data = request.data
        data['is_student'] = True
        serializer = UserSerializer(data=data)
        if serializer.is_valid():
            user = serializer.save()
            user.set_password(data['password'])
            user.save()
            return Response({"message": "Student registered successfully"}, status=201)
        return Response(serializer.errors, status=400)

class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': UserSerializer(user).data
            })
        return Response({"error": "Invalid credentials"}, status=401)
# ==== FOOD VIEWSET ====
class FoodItemViewSet(viewsets.ModelViewSet):
    queryset = FoodItem.objects.all()
    serializer_class = FoodItemSerializer

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsManager()]
        return [permissions.IsAuthenticated()]


# ==== ORDER VIEWSET ====
class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer

    def get_queryset(self):
        user = self.request.user
        if user.is_manager:
            return Order.objects.all()  # Manager sees all orders
        return Order.objects.filter(student=user)  # Student sees their own

    def get_permissions(self):
        if self.action in ['create']:
            return [IsStudent()]  # Only students can create orders
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)

    # ==== Manager clears an order ====
    @action(detail=True, methods=['put'], permission_classes=[IsManager])
    def clear(self, request, pk=None):
        try:
            order = Order.objects.get(pk=pk)
            order.cleared = True
            order.save()
            return Response({'message': 'Order cleared successfully'})
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=404)


# ==== VIEW DUES ====
class StudentDuesViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def list(self, request):
            if request.user.is_student:
                return Response({"due_amount": request.user.due_amount})
            return Response({"detail": "Only students can view dues."}, status=403)
        
    # ==== USER MANAGER ====
    class UserManager(BaseUserManager):
        def create_user(self, username, email=None, password=None, **extra_fields):
            if not username:
                raise ValueError('The Username must be set')
            email = self.normalize_email(email)
            user = self.model(username=username, email=email, **extra_fields)
            user.set_password(password)
            user.save(using=self._db)
            return user
    
        def create_superuser(self, username, email=None, password=None, **extra_fields):
            extra_fields.setdefault('is_staff', True)
            extra_fields.setdefault('is_superuser', True)
            extra_fields.setdefault('is_manager', True)  # set is_manager=True automatically for superusers
    
            if extra_fields.get('is_staff') is not True:
                raise ValueError('Superuser must have is_staff=True.')
            if extra_fields.get('is_superuser') is not True:
                raise ValueError('Superuser must have is_superuser=True.')
            if extra_fields.get('is_manager') is not True:
                raise ValueError('Superuser must have is_manager=True.')
    
            return self.create_user(username, email, password, **extra_fields)