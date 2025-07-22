from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PatientProfileViewSet, DonorViewSet, LoyaltyTierViewSet, AuctionItemViewSet, BidViewSet, DonationViewSet

router = DefaultRouter()
router.register(r'patients', PatientProfileViewSet)
router.register(r'donors', DonorViewSet)
router.register(r'loyalty-tiers', LoyaltyTierViewSet)
router.register(r'auction-items', AuctionItemViewSet)
router.register(r'bids', BidViewSet)
router.register(r'donations', DonationViewSet)

urlpatterns = [
    path('', include(router.urls)),
] 