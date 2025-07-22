from django.db import models
from django.contrib.auth.models import User
from encrypted_model_fields.fields import EncryptedCharField, EncryptedIntegerField

# PatientProfile: de-identified, encrypted fields for compliance
class PatientProfile(models.Model):
    # No direct identifiers (e.g., no name, no address)
    patient_code = EncryptedCharField(max_length=32, unique=True)  # e.g., generated code
    age = EncryptedIntegerField()
    diagnosis = EncryptedCharField(max_length=128)
    status = models.CharField(max_length=32, choices=[('critical', 'Critical'), ('high', 'High Priority'), ('general', 'General Support')])
    needs = EncryptedCharField(max_length=256)
    last_updated = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Patient {self.patient_code} ({self.status})"

    class Meta:
        app_label = 'api'
        verbose_name = 'Patient Profile'
        verbose_name_plural = 'Patient Profiles'

# Donor profile
class Donor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    organization = models.CharField(max_length=128, blank=True, null=True)
    loyalty_tier = models.ForeignKey('LoyaltyTier', on_delete=models.SET_NULL, null=True, blank=True)
    total_contributed = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    annual_contributed = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    last_donation = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return self.user.username

    class Meta:
        app_label = 'api'
        verbose_name = 'Donor'
        verbose_name_plural = 'Donors'

# Loyalty tiers for donor retention
class LoyaltyTier(models.Model):
    name = models.CharField(max_length=32)
    min_amount = models.DecimalField(max_digits=12, decimal_places=2)
    max_amount = models.DecimalField(max_digits=12, decimal_places=2)
    benefits = models.TextField()

    def __str__(self):
        return self.name

    class Meta:
        app_label = 'api'
        verbose_name = 'Loyalty Tier'
        verbose_name_plural = 'Loyalty Tiers'

# Auction items for donation
class AuctionItem(models.Model):
    title = models.CharField(max_length=128)
    description = models.TextField()
    image = models.ImageField(upload_to='auction_items/', null=True, blank=True)
    starting_bid = models.DecimalField(max_digits=10, decimal_places=2)
    current_bid = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    donor = models.ForeignKey(Donor, on_delete=models.SET_NULL, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    blockchain_tx = models.CharField(max_length=128, blank=True, null=True)  # For blockchain reference

    def __str__(self):
        return self.title

    class Meta:
        app_label = 'api'
        verbose_name = 'Auction Item'
        verbose_name_plural = 'Auction Items'

# Bids on auction items
class Bid(models.Model):
    auction_item = models.ForeignKey(AuctionItem, on_delete=models.CASCADE, related_name='bids')
    donor = models.ForeignKey(Donor, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    timestamp = models.DateTimeField(auto_now_add=True)
    blockchain_tx = models.CharField(max_length=128, blank=True, null=True)

    def __str__(self):
        return f"{self.donor} - {self.amount} on {self.auction_item}"

    class Meta:
        app_label = 'api'
        verbose_name = 'Bid'
        verbose_name_plural = 'Bids'

# Donation records (monetary)
class Donation(models.Model):
    donor = models.ForeignKey(Donor, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    date = models.DateTimeField(auto_now_add=True)
    blockchain_tx = models.CharField(max_length=128, blank=True, null=True)
    impact_report = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.donor} - {self.amount} ({self.date})"

    class Meta:
        app_label = 'api'
        verbose_name = 'Donation'
        verbose_name_plural = 'Donations'
