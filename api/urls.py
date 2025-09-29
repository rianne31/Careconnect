from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserProfileViewSet, PatientProfileViewSet, AuctionItemViewSet, BidViewSet,
    DonationViewSet, DonorTierViewSet, TransactionViewSet, RecommendationViewSet,
    register_user
)

router = DefaultRouter()
router.register(r'user-profiles', UserProfileViewSet)
router.register(r'patients', PatientProfileViewSet)
router.register(r'auctions', AuctionItemViewSet)
router.register(r'bids', BidViewSet)
router.register(r'donations', DonationViewSet)
router.register(r'donor-tiers', DonorTierViewSet)
router.register(r'transactions', TransactionViewSet)
router.register(r'recommendations', RecommendationViewSet, basename='recommendations')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', register_user, name='register'),
] 