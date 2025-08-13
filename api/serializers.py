from rest_framework import serializers
from .models import User, FoodItem, Order
from django.db.models import Sum

# User serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_student', 'is_manager', 'due_amount']

   

# FoodItem serializer
class FoodItemSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True)
    class Meta:
        model = FoodItem
        fields = '__all__'

# Order serializer
class OrderSerializer(serializers.ModelSerializer):
    food = FoodItemSerializer(read_only=True)
    food_id = serializers.PrimaryKeyRelatedField(queryset=FoodItem.objects.all(), source='food', write_only=True)

    class Meta:
        model = Order
        fields = ['id', 'student', 'food', 'food_id', 'quantity', 'total_price', 'ordered_at', 'cleared']
        read_only_fields = ['total_price', 'student']
