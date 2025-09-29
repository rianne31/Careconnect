#!/usr/bin/env python
"""
Setup admin user for demo
"""

import os
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'careconnect_backend.settings')
django.setup()

from django.contrib.auth.models import User

def setup_admin():
    """Setup admin user with known credentials"""
    try:
        # Check if admin user exists
        admin_user = User.objects.filter(username='admin').first()
        
        if admin_user:
            # Update password
            admin_user.set_password('admin123')
            admin_user.is_staff = True
            admin_user.is_superuser = True
            admin_user.save()
            print("✅ Admin user updated successfully!")
            print("   Username: admin")
            print("   Password: admin123")
        else:
            # Create new admin user
            admin_user = User.objects.create_user(
                username='admin',
                email='admin@careconnect.com',
                password='admin123',
                is_staff=True,
                is_superuser=True
            )
            print("✅ Admin user created successfully!")
            print("   Username: admin")
            print("   Password: admin123")
        
        return True
        
    except Exception as e:
        print(f"❌ Error setting up admin user: {e}")
        return False

if __name__ == "__main__":
    setup_admin() 