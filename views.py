from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import PatientProfile, Donor, LoyaltyTier, AuctionItem, Bid, Donation
from .serializers import PatientProfileSerializer, DonorSerializer, LoyaltyTierSerializer, AuctionItemSerializer, BidSerializer, DonationSerializer
from rest_framework.decorators import action
from rest_framework.response import Response

# Create your views here.

class PatientProfileViewSet(viewsets.ModelViewSet):
    queryset = PatientProfile.objects.all()
    serializer_class = PatientProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=['post'])
    def ai_tag(self, request, pk=None):
        # Stub for AI tagging endpoint
        return Response({'status': 'AI tagging not implemented'})

class DonorViewSet(viewsets.ModelViewSet):
    queryset = Donor.objects.all()
    serializer_class = DonorSerializer
    permission_classes = [permissions.IsAuthenticated]

class LoyaltyTierViewSet(viewsets.ModelViewSet):
    queryset = LoyaltyTier.objects.all()
    serializer_class = LoyaltyTierSerializer
    permission_classes = [permissions.IsAuthenticated]

class AuctionItemViewSet(viewsets.ModelViewSet):
    queryset = AuctionItem.objects.all()
    serializer_class = AuctionItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=True, methods=['post'])
    def blockchain_log(self, request, pk=None):
        # Stub for blockchain logging endpoint
        return Response({'status': 'Blockchain logging not implemented'})

class BidViewSet(viewsets.ModelViewSet):
    queryset = Bid.objects.all()
    serializer_class = BidSerializer
    permission_classes = [permissions.IsAuthenticated]

class DonationViewSet(viewsets.ModelViewSet):
    queryset = Donation.objects.all()
    serializer_class = DonationSerializer
    permission_classes = [permissions.IsAuthenticated]
