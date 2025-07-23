from django.shortcuts import render
from rest_framework import viewsets, permissions
from django.contrib.auth.models import User
from .models import UserProfile, PatientProfile, AuctionItem, Bid, Donation, DonorTier, Transaction
from .serializers import (
    UserProfileSerializer, PatientProfileSerializer, AuctionItemSerializer, BidSerializer,
    DonationSerializer, DonorTierSerializer, TransactionSerializer
)
from rest_framework.permissions import IsAuthenticated, IsAdminUser, SAFE_METHODS
from rest_framework.decorators import action
from rest_framework.response import Response

# Create your views here.

class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return request.user.is_staff

class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAdminUser]

class PatientProfileViewSet(viewsets.ModelViewSet):
    queryset = PatientProfile.objects.all()
    serializer_class = PatientProfileSerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]

    @action(detail=True, methods=['post'], url_path='ai-tag')
    def ai_tag(self, request, pk=None):
        # Stub: AI tagging logic for patient needs
        patient = self.get_object()
        # Here you would call your AI model/framework
        patient.ai_priority = 'High Priority'  # Example stub
        patient.save()
        return Response({'status': 'AI tagging complete', 'ai_priority': patient.ai_priority})

class AuctionItemViewSet(viewsets.ModelViewSet):
    queryset = AuctionItem.objects.all()
    serializer_class = AuctionItemSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['post'], url_path='ai-tag')
    def ai_tag(self, request, pk=None):
        # Stub: AI tagging logic for auction item
        item = self.get_object()
        item.ai_category = 'General Support'  # Example stub
        item.save()
        return Response({'status': 'AI tagging complete', 'ai_category': item.ai_category})

    @action(detail=True, methods=['post'], url_path='blockchain-log')
    def blockchain_log(self, request, pk=None):
        # Stub: Log auction result to blockchain
        item = self.get_object()
        # Here you would interact with Web3.py and your smart contract
        # Example: txn_hash = web3.eth.send_transaction(...)
        txn_hash = '0x1234567890abcdef'  # Example stub
        # Optionally create a Transaction record
        # Transaction.objects.create(...)
        return Response({'status': 'Blockchain log complete', 'txn_hash': txn_hash})

class BidViewSet(viewsets.ModelViewSet):
    queryset = Bid.objects.all()
    serializer_class = BidSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(bidder=self.request.user)

class DonationViewSet(viewsets.ModelViewSet):
    queryset = Donation.objects.all()
    serializer_class = DonationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Donation.objects.all()
        return Donation.objects.filter(donor=user)

    def perform_create(self, serializer):
        serializer.save(donor=self.request.user)

    @action(detail=True, methods=['post'], url_path='blockchain-log')
    def blockchain_log(self, request, pk=None):
        # Stub: Log donation to blockchain
        donation = self.get_object()
        txn_hash = '0xabcdef1234567890'  # Example stub
        # Optionally create a Transaction record
        # Transaction.objects.create(...)
        return Response({'status': 'Blockchain log complete', 'txn_hash': txn_hash})

class DonorTierViewSet(viewsets.ModelViewSet):
    queryset = DonorTier.objects.all()
    serializer_class = DonorTierSerializer
    permission_classes = [IsAdminUser]

class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(donor=self.request.user)

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Transaction.objects.all()
        return Transaction.objects.filter(donor=user)

class RecommendationViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'], url_path='donor')
    def donor_recommendations(self, request):
        # Stub: Return AI-based recommendations for donor
        # Example: personalized auction or donation suggestions
        recommendations = [
            {'type': 'auction', 'item_id': 1, 'suggestion': 'Bid on "Signed Jersey"'},
            {'type': 'donation', 'suggestion': 'Consider donating to Patient X'},
        ]
        return Response({'recommendations': recommendations})
