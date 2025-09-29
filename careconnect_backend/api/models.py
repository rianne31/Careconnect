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
    ai_needs_tags = models.JSONField(default=list, blank=True)  # AI-extracted tags
    ai_urgency_score = models.IntegerField(default=50, blank=True, null=True)  # 0-100 urgency score
    ai_analysis_confidence = models.FloatField(default=0.0, blank=True, null=True)  # AI confidence score
    ai_last_analyzed = models.DateTimeField(auto_now=True, blank=True, null=True)
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
    ai_tags = models.JSONField(default=list, blank=True)  # AI-extracted tags
    ai_relevance_score = models.IntegerField(default=50, blank=True, null=True)  # 0-100 relevance score
    ai_categorization_confidence = models.FloatField(default=0.0, blank=True, null=True)  # AI confidence score
    ai_last_categorized = models.DateTimeField(auto_now=True, blank=True, null=True)
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

class AIRecommendation(models.Model):
    """AI-generated recommendations for patients and donors"""
    RECOMMENDATION_TYPE_CHOICES = [
        ('patient', 'Patient Recommendation'),
        ('donor', 'Donor Recommendation'),
        ('matching', 'Patient-Donor Matching'),
    ]
    
    recommendation_type = models.CharField(max_length=20, choices=RECOMMENDATION_TYPE_CHOICES)
    patient = models.ForeignKey(PatientProfile, on_delete=models.CASCADE, null=True, blank=True, related_name='ai_recommendations')
    auction_item = models.ForeignKey(AuctionItem, on_delete=models.CASCADE, null=True, blank=True, related_name='ai_recommendations')
    title = models.CharField(max_length=255)
    description = models.TextField()
    relevance_score = models.FloatField(default=0.0)  # 0.0 to 1.0
    ai_confidence = models.FloatField(default=0.0)  # AI confidence in recommendation
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['-relevance_score', '-created_at']
    
    def __str__(self):
        return f"{self.recommendation_type}: {self.title}"

class AITag(models.Model):
    """AI-extracted tags for categorization"""
    name = models.CharField(max_length=100, unique=True)
    category = models.CharField(max_length=50)  # e.g., 'medical_condition', 'support_type', 'equipment'
    frequency = models.IntegerField(default=1)  # How often this tag appears
    ai_confidence = models.FloatField(default=0.0)  # AI confidence in tag accuracy
    created_at = models.DateTimeField(auto_now_add=True)
    last_used = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-frequency', '-ai_confidence']
    
    def __str__(self):
        return f"{self.name} ({self.category})"

# --- Payments ---
class PaymentTransaction(models.Model):
    PROVIDER_CHOICES = [
        ('gcash', 'GCash'),
        ('maya', 'Maya'),
        ('paypal', 'PayPal'),
    ]
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('succeeded', 'Succeeded'),
        ('failed', 'Failed'),
        ('cancelled', 'Cancelled'),
    ]
    donor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payment_transactions')
    donation = models.ForeignKey(Donation, on_delete=models.SET_NULL, null=True, blank=True, related_name='payments')
    provider = models.CharField(max_length=20, choices=PROVIDER_CHOICES)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=10, default='PHP')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    external_id = models.CharField(max_length=100, blank=True, null=True)  # provider reference id
    callback_payload = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.provider}:{self.external_id or 'N/A'} ({self.status})"

# --- Messaging ---
class MessageThread(models.Model):
    donor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='message_threads')
    staff = models.ForeignKey(User, on_delete=models.CASCADE, related_name='assigned_threads')
    created_at = models.DateTimeField(auto_now_add=True)
    is_closed = models.BooleanField(default=False)

    def __str__(self):
        return f"Thread {self.id} ({self.donor.username} ↔ {self.staff.username})"

class Message(models.Model):
    thread = models.ForeignKey(MessageThread, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"Msg {self.id} in Thread {self.thread_id} by {self.sender.username}"

# --- Inventory & Delivery ---
class InventoryItem(models.Model):
    STATUS_CHOICES = [
        ('available', 'Available'),
        ('reserved', 'Reserved'),
        ('out', 'Checked Out'),
    ]
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    quantity = models.PositiveIntegerField(default=0)
    unit = models.CharField(max_length=50, default='pcs')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.quantity} {self.unit})"

class InventoryMovement(models.Model):
    MOVEMENT_TYPE_CHOICES = [
        ('in', 'Stock In'),
        ('out', 'Stock Out'),
    ]
    item = models.ForeignKey(InventoryItem, on_delete=models.CASCADE, related_name='movements')
    movement_type = models.CharField(max_length=10, choices=MOVEMENT_TYPE_CHOICES)
    quantity = models.PositiveIntegerField()
    related_donation = models.ForeignKey(Donation, on_delete=models.SET_NULL, null=True, blank=True, related_name='inventory_movements')
    created_at = models.DateTimeField(auto_now_add=True)
    note = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"{self.movement_type} {self.quantity} of {self.item.name}"

class Delivery(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_transit', 'In Transit'),
        ('delivered', 'Delivered'),
        ('failed', 'Failed'),
    ]
    donation = models.ForeignKey(Donation, on_delete=models.CASCADE, related_name='deliveries')
    courier = models.CharField(max_length=100, blank=True, null=True)
    tracking_number = models.CharField(max_length=100, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    delivered_at = models.DateTimeField(blank=True, null=True)
    notes = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Delivery for Donation {self.donation_id} ({self.status})"
