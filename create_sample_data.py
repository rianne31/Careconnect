#!/usr/bin/env python
"""
Create sample data for demo presentation
"""

import os
import django
from datetime import datetime, timedelta

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'careconnect_backend.settings')
django.setup()

from django.contrib.auth.models import User
from careconnect_backend.api.models import (
    UserProfile, PatientProfile, AuctionItem, 
    Bid, Donation, DonorTier, Transaction
)

def create_sample_data():
    """Create sample data for demo"""
    print("🚀 Creating sample data for demo...")
    
    try:
        # Get or create sample users
        print("Setting up sample users...")
        
        # Get existing admin user or create donor user
        donor_user = User.objects.filter(username='donor1').first()
        if not donor_user:
            donor_user = User.objects.create_user(
                username='donor1',
                email='donor1@example.com',
                password='donor123',
                first_name='John',
                last_name='Donor'
            )
            UserProfile.objects.create(user=donor_user, role='donor')
            print("✅ Created donor user")
        else:
            print("✅ Donor user already exists")
        
        # Get or create patient user
        patient_user = User.objects.filter(username='patient1').first()
        if not patient_user:
            patient_user = User.objects.create_user(
                username='patient1',
                email='patient1@example.com',
                password='patient123',
                first_name='Sarah',
                last_name='Patient'
            )
            UserProfile.objects.create(user=patient_user, role='patient')
            print("✅ Created patient user")
        else:
            print("✅ Patient user already exists")
        
        # Create sample patient profiles (only if they don't exist)
        print("Creating patient profiles...")
        if PatientProfile.objects.count() == 0:
            PatientProfile.objects.create(
                age=35,
                diagnosis='Cardiac condition requiring surgery',
                last_updated=datetime.now(),
                ai_priority='high',
                code='P001',
                needs='Cardiac surgery, post-operative care, medication'
            )
            
            PatientProfile.objects.create(
                age=28,
                diagnosis='Diabetes management',
                last_updated=datetime.now(),
                ai_priority='medium',
                code='P002',
                needs='Insulin, monitoring devices, dietary consultation'
            )
            print("✅ Created patient profiles")
        else:
            print("✅ Patient profiles already exist")
        
        # Create sample auction items (only if they don't exist)
        print("Creating auction items...")
        if AuctionItem.objects.count() == 0:
            auction1 = AuctionItem.objects.create(
                title='Vintage Medical Equipment',
                description='Rare 1950s stethoscope in excellent condition',
                starting_bid=100.00,
                current_bid=150.00,
                ends_at=datetime.now() + timedelta(days=7),
                owner=donor_user
            )
            
            auction2 = AuctionItem.objects.create(
                title='Medical Books Collection',
                description='Complete set of medical textbooks from 1980s',
                starting_bid=50.00,
                current_bid=75.00,
                ends_at=datetime.now() + timedelta(days=5),
                owner=donor_user
            )
            print("✅ Created auction items")
        else:
            print("✅ Auction items already exist")
        
        # Create sample bids (only if they don't exist)
        print("Creating sample bids...")
        if Bid.objects.count() == 0:
            auction1 = AuctionItem.objects.first()
            if auction1:
                Bid.objects.create(
                    amount=150.00,
                    timestamp=datetime.now(),
                    bidder=donor_user,
                    auction_item=auction1
                )
                print("✅ Created sample bids")
            else:
                print("⚠️  No auction items found for bids")
        else:
            print("✅ Bids already exist")
        
        # Create sample donations (only if they don't exist)
        print("Creating sample donations...")
        if Donation.objects.count() == 0:
            Donation.objects.create(
                amount=500.00,
                description='Monthly donation for patient care',
                donor=donor_user,
                is_recurring=True
            )
            
            Donation.objects.create(
                amount=1000.00,
                description='One-time donation for medical equipment',
                donor=donor_user,
                is_recurring=False
            )
            print("✅ Created sample donations")
        else:
            print("✅ Donations already exist")
        
        # Create donor tier (only if it doesn't exist)
        print("Creating donor tier...")
        if DonorTier.objects.count() == 0:
            DonorTier.objects.create(
                tier='gold',
                year=2025,
                donor=donor_user
            )
            print("✅ Created donor tier")
        else:
            print("✅ Donor tier already exists")
        
        # Create sample transactions (only if they don't exist)
        print("Creating sample transactions...")
        if Transaction.objects.count() == 0:
            auction1 = AuctionItem.objects.first()
            donation1 = Donation.objects.first()
            
            if auction1:
                Transaction.objects.create(
                    amount=150.00,
                    date=datetime.now(),
                    auction_item=auction1,
                    donor=donor_user,
                    txn_hash='0x1234567890abcdef1234567890abcdef12345678'
                )
            
            if donation1:
                Transaction.objects.create(
                    amount=500.00,
                    date=datetime.now(),
                    donation=donation1,
                    donor=donor_user,
                    txn_hash='0xabcdef1234567890abcdef1234567890abcdef12'
                )
            print("✅ Created sample transactions")
        else:
            print("✅ Transactions already exist")
        
        print("\n✅ Sample data setup completed!")
        print(f"   Users: {User.objects.count()}")
        print(f"   Patients: {PatientProfile.objects.count()}")
        print(f"   Auctions: {AuctionItem.objects.count()}")
        print(f"   Bids: {Bid.objects.count()}")
        print(f"   Donations: {Donation.objects.count()}")
        print(f"   Transactions: {Transaction.objects.count()}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error creating sample data: {e}")
        return False

if __name__ == "__main__":
    create_sample_data() 