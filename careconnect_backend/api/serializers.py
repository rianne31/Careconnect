from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, PatientProfile, AuctionItem, Bid, Donation, DonorTier, Transaction, AIRecommendation, AITag, PaymentTransaction, MessageThread, Message, InventoryItem, InventoryMovement, Delivery
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

class AITagSerializer(serializers.ModelSerializer):
    class Meta:
        model = AITag
        fields = '__all__'

class AIRecommendationSerializer(serializers.ModelSerializer):
    patient = PatientProfileSerializer(read_only=True)
    auction_item = AuctionItemSerializer(read_only=True)
    
    class Meta:
        model = AIRecommendation
        fields = '__all__'

class PatientAIAnalysisSerializer(serializers.Serializer):
    """Serializer for AI analysis results of patient profiles"""
    ai_priority = serializers.CharField()
    needs_tags = serializers.ListField(child=serializers.CharField())
    urgency_score = serializers.IntegerField()
    recommendations = serializers.ListField(child=serializers.CharField())
    analysis_confidence = serializers.FloatField()

class AuctionItemAICategorizationSerializer(serializers.Serializer):
    """Serializer for AI categorization results of auction items"""
    ai_category = serializers.CharField()
    tags = serializers.ListField(child=serializers.CharField())
    relevance_score = serializers.IntegerField()
    matching_suggestions = serializers.ListField(child=serializers.CharField())
    categorization_confidence = serializers.FloatField()

class AIRecommendationRequestSerializer(serializers.Serializer):
    """Serializer for AI recommendation requests"""
    patient_id = serializers.IntegerField(required=False)
    auction_item_ids = serializers.ListField(
        child=serializers.IntegerField(), 
        required=False
    )
    limit = serializers.IntegerField(default=5, min_value=1, max_value=20)
    recommendation_type = serializers.ChoiceField(
        choices=['patient', 'donor', 'matching', 'all'],
        default='all'
    )

class AIBulkAnalysisSerializer(serializers.Serializer):
    """Serializer for bulk AI analysis requests"""
    patient_ids = serializers.ListField(
        child=serializers.IntegerField(),
        required=False
    )
    auction_item_ids = serializers.ListField(
        child=serializers.IntegerField(),
        required=False
    )
    force_reanalysis = serializers.BooleanField(default=False)

# --- Payments ---
class PaymentTransactionSerializer(serializers.ModelSerializer):
    donor = UserSerializer(read_only=True)
    class Meta:
        model = PaymentTransaction
        fields = '__all__'
        read_only_fields = ['status', 'external_id', 'callback_payload']

# --- Messaging ---
class MessageThreadSerializer(serializers.ModelSerializer):
    donor = UserSerializer(read_only=True)
    staff = UserSerializer(read_only=True)
    class Meta:
        model = MessageThread
        fields = '__all__'

class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    class Meta:
        model = Message
        fields = '__all__'

# --- Inventory & Delivery ---
class InventoryItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryItem
        fields = '__all__'

class InventoryMovementSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryMovement
        fields = '__all__'

class DeliverySerializer(serializers.ModelSerializer):
    class Meta:
        model = Delivery
        fields = '__all__'