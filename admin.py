from django.contrib import admin 
from .models import PatientProfile, Donor, LoyaltyTier, AuctionItem, Bid, Donation

admin.site.register(PatientProfile)
admin.site.register(Donor)
admin.site.register(LoyaltyTier)
admin.site.register(AuctionItem)
admin.site.register(Bid)
admin.site.register(Donation)
