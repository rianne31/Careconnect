from django.contrib import admin
from .models import UserProfile, PatientProfile, AuctionItem, Bid, Donation, DonorTier, Transaction

admin.site.register(UserProfile)
admin.site.register(PatientProfile)
admin.site.register(AuctionItem)
admin.site.register(Bid)
admin.site.register(Donation)
admin.site.register(DonorTier)
admin.site.register(Transaction)
