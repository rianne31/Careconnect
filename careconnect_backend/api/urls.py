from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserProfileViewSet, PatientProfileViewSet, AuctionItemViewSet, BidViewSet,
    DonationViewSet, DonorTierViewSet, TransactionViewSet, RecommendationViewSet,
    PaymentTransactionViewSet, MessageThreadViewSet, MessageViewSet,
    InventoryItemViewSet, InventoryMovementViewSet, DeliveryViewSet
)
from .ai_views import AIAnalysisViewSet, AIRecommendationViewSet, AITagViewSet

router = DefaultRouter()
router.register(r'user-profiles', UserProfileViewSet)
router.register(r'patients', PatientProfileViewSet)
router.register(r'auctions', AuctionItemViewSet)
router.register(r'bids', BidViewSet)
router.register(r'donations', DonationViewSet)
router.register(r'donor-tiers', DonorTierViewSet)
router.register(r'transactions', TransactionViewSet)
router.register(r'recommendations', RecommendationViewSet, basename='recommendations')
# Payments
router.register(r'payments', PaymentTransactionViewSet)
# Messaging
router.register(r'message-threads', MessageThreadViewSet)
router.register(r'messages', MessageViewSet)
# Inventory & Delivery
router.register(r'inventory/items', InventoryItemViewSet)
router.register(r'inventory/movements', InventoryMovementViewSet)
router.register(r'deliveries', DeliveryViewSet)

# AI-specific endpoints
router.register(r'ai/analysis', AIAnalysisViewSet, basename='ai-analysis')
router.register(r'ai/recommendations', AIRecommendationViewSet, basename='ai-recommendations')
router.register(r'ai/tags', AITagViewSet, basename='ai-tags')

urlpatterns = [
    path('', include(router.urls)),
] 