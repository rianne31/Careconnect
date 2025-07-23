from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, PatientProfile, AuctionItem, Bid, Donation, DonorTier, Transaction
from .blockchain import log_transaction_to_blockchain


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
        read_only_fields = ['txn_hash']

    def create(self, validated_data):
        print(">> Inside create method <<")
        request = self.context.get('request')
        donor = request.user if request and request.user.is_authenticated else None
        validated_data['donor'] = donor

        amount = validated_data.get('amount')
        auction_item = validated_data.get('auction_item', None)
        donation = validated_data.get('donation', None)

        txn_hash = log_transaction_to_blockchain(donor, amount, auction_item, donation)
        transaction = Transaction.objects.create(**validated_data, txn_hash=txn_hash)
        return transaction