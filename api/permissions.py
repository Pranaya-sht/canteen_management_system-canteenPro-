from rest_framework.permissions import BasePermission

class IsStudent(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.is_student

class IsManager(BasePermission):
    """
    Custom permission to only allow managers (or superusers) to perform certain actions.
    """
    def has_permission(self, request, view):
        return bool(
            request.user
            and request.user.is_authenticated
            and (request.user.is_manager or request.user.is_superuser)
        )