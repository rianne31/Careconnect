from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('donor', 'Donor'),
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)

    def __str__(self):
        return f"{self.user.username} ({self.role})"

class PatientProfile(models.Model):
    # De-identified patient profile
    code = models.CharField(max_length=20, unique=True)
    age = models.PositiveIntegerField()
    diagnosis = models.CharField(max_length=255)
    needs = models.TextField()
    ai_priority = models.CharField(max_length=20, blank=True, null=True)  # e.g., Critical, High Priority, General Support
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Patient {self.code}"

class AuctionItem(models.Model):
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('closed', 'Closed'),
        ('pending', 'Pending'),
    ]
    title = models.CharField(max_length=255)
    description = models.TextField()
    image = models.ImageField(upload_to='auction_items/', blank=True, null=True)
    starting_bid = models.DecimalField(max_digits=10, decimal_places=2)
    current_bid = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='open')
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='auction_items')  # Admin
    ai_category = models.CharField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    ends_at = models.DateTimeField()

    def __str__(self):
        return self.title

class Bid(models.Model):
    auction_item = models.ForeignKey(AuctionItem, on_delete=models.CASCADE, related_name='bids')
    bidder = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bids')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.bidder.username} - {self.amount} on {self.auction_item.title}"

class Donation(models.Model):
    DONATION_TYPE_CHOICES = [
        ('monetary', 'Monetary'),
        ('item', 'Item'),
    ]
    donor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='donations')
    amount = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    item = models.CharField(max_length=255, blank=True, null=True)
    type = models.CharField(max_length=10, choices=DONATION_TYPE_CHOICES)
    date = models.DateTimeField(auto_now_add=True)
    blockchain_txn_id = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return f"{self.donor.username} - {self.type}"

class DonorTier(models.Model):
    TIER_CHOICES = [
        ('bronze', 'Bronze Champion'),
        ('silver', 'Silver Champion'),
        ('gold', 'Gold Champion'),
        ('platinum', 'Platinum Champion'),
    ]
    donor = models.OneToOneField(User, on_delete=models.CASCADE, related_name='tier')
    tier = models.CharField(max_length=10, choices=TIER_CHOICES)
    year = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.donor.username} - {self.tier} ({self.year})"

class Transaction(models.Model):
    # Blockchain transaction log
    donor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions')
    txn_hash = models.CharField(max_length=100, blank=True, null=True)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    date = models.DateTimeField(auto_now_add=True)
    auction_item = models.ForeignKey(AuctionItem, on_delete=models.SET_NULL, null=True, blank=True)
    donation = models.ForeignKey(Donation, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"Txn {self.txn_hash} by {self.donor.username}"
