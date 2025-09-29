from rest_framework import permissions

class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow admins to edit objects.
    """
    def has_permission(self, request, view):
        # Read permissions are allowed for any request
        if request.method in permissions.SAFE_METHODS:
            return True
        # Write permissions are only allowed to admin users
        return request.user.is_staff

class IsAdminOrOwner(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object or admins to edit it.
    """
    def has_object_permission(self, request, view, obj):
        # Admin users can edit anything
        if request.user.is_staff:
            return True
        
        # Check if the user is the owner
        if hasattr(obj, 'owner'):
            return obj.owner == request.user
        elif hasattr(obj, 'user'):
            return obj.user == request.user
        elif hasattr(obj, 'bidder'):
            return obj.bidder == request.user
        elif hasattr(obj, 'donor'):
            return obj.donor == request.user
        
        return False

class IsAdminOrPatientOwner(permissions.BasePermission):
    """
    Custom permission for patient profiles - only admins can edit
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_staff
    
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_staff
