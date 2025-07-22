from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, PatientProfile, AuctionItem, Bid, Donation, DonorTier, Transaction

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'role']

class PatientProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = PatientProfile
        fields = '__all__'

class AuctionItemSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    class Meta:
        model = AuctionItem
        fields = '__all__'

class BidSerializer(serializers.ModelSerializer):
    bidder = UserSerializer(read_only=True)
    auction_item = AuctionItemSerializer(read_only=True)
    class Meta:
        model = Bid
        fields = '__all__'

class DonationSerializer(serializers.ModelSerializer):
    donor = UserSerializer(read_only=True)
    class Meta:
        model = Donation
        fields = '__all__'

class DonorTierSerializer(serializers.ModelSerializer):
    donor = UserSerializer(read_only=True)
    class Meta:
        model = DonorTier
        fields = '__all__'

class TransactionSerializer(serializers.ModelSerializer):
    donor = UserSerializer(read_only=True)
    auction_item = AuctionItemSerializer(read_only=True)
    donation = DonationSerializer(read_only=True)
    class Meta:
        model = Transaction
        fields = '__all__' 