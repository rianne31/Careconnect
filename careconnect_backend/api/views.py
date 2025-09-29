from django.shortcuts import render
from rest_framework import viewsets, permissions
from django.contrib.auth.models import User
from .models import UserProfile, PatientProfile, AuctionItem, Bid, Donation, DonorTier, Transaction, PaymentTransaction, MessageThread, Message, InventoryItem, InventoryMovement, Delivery
from .serializers import (
    UserProfileSerializer, PatientProfileSerializer, AuctionItemSerializer, BidSerializer,
    DonationSerializer, DonorTierSerializer, TransactionSerializer, PaymentTransactionSerializer,
    MessageThreadSerializer, MessageSerializer, InventoryItemSerializer, InventoryMovementSerializer, DeliverySerializer
)
from rest_framework.permissions import IsAuthenticated, IsAdminUser, SAFE_METHODS
from rest_framework.decorators import action
from rest_framework.response import Response
from .permissions import IsAdminOrReadOnly, IsAdminOrOwner, IsAdminOrPatientOwner
from .ai_service import AIService

# Create your views here.

class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAdminUser]

class PatientProfileViewSet(viewsets.ModelViewSet):
    queryset = PatientProfile.objects.all()
    serializer_class = PatientProfileSerializer
    permission_classes = [IsAuthenticated, IsAdminOrPatientOwner]

    def get_queryset(self):
        queryset = super().get_queryset()
        ai_priority = self.request.query_params.get('ai_priority')
        min_urgency = self.request.query_params.get('min_urgency')
        max_urgency = self.request.query_params.get('max_urgency')
        tag = self.request.query_params.get('tag')
        age_group = self.request.query_params.get('age_group')

        if ai_priority:
            queryset = queryset.filter(ai_priority__iexact=ai_priority)
        if min_urgency:
            try:
                queryset = queryset.filter(ai_urgency_score__gte=int(min_urgency))
            except ValueError:
                pass
        if max_urgency:
            try:
                queryset = queryset.filter(ai_urgency_score__lte=int(max_urgency))
            except ValueError:
                pass
        if tag:
            # JSONField contains lookup
            queryset = queryset.filter(ai_needs_tags__contains=[tag])
        if age_group:
            # simple derived filter via ranges
            if age_group == 'infant':
                queryset = queryset.filter(age__lte=2)
            elif age_group == 'child':
                queryset = queryset.filter(age__gte=3, age__lte=12)
            elif age_group == 'adolescent':
                queryset = queryset.filter(age__gte=13, age__lte=17)

        ordering = self.request.query_params.get('ordering')
        if ordering == 'urgency_desc':
            queryset = queryset.order_by('-ai_urgency_score')
        elif ordering == 'urgency_asc':
            queryset = queryset.order_by('ai_urgency_score')
        return queryset

    @action(detail=True, methods=['post'], url_path='ai-tag')
    def ai_tag(self, request, pk=None):
        """
        AI tagging logic for patient needs - now integrated with AIService
        """
        try:
            patient = self.get_object()
            # Use AIService for comprehensive analysis
            analysis_result = AIService.analyze_patient_needs(patient)
            # Update patient with AI results
            patient.ai_priority = analysis_result['ai_priority']
            patient.ai_needs_tags = analysis_result['needs_tags']
            patient.ai_urgency_score = analysis_result['urgency_score']
            patient.ai_analysis_confidence = analysis_result['analysis_confidence']
            patient.save()
            return Response({
                'status': 'AI tagging complete',
                'ai_priority': patient.ai_priority,
                'needs_tags': patient.ai_needs_tags,
                'urgency_score': patient.ai_urgency_score,
                'analysis_confidence': patient.ai_analysis_confidence
            })
        except Exception as e:
            return Response({
                'status': 'error',
                'message': f'AI tagging failed: {str(e)}'
            }, status=400)

    @action(detail=True, methods=['get'], url_path='ai-recommendations')
    def ai_recommendations(self, request, pk=None):
        """
        Get AI-generated recommendations for a patient
        """
        try:
            patient = self.get_object()
            recommendations = AIService.generate_recommendations(patient=patient, limit=5)
            return Response({
                'status': 'success',
                'patient_id': patient.id,
                'recommendations': recommendations
            })
        except Exception as e:
            return Response({
                'status': 'error',
                'message': f'Failed to get recommendations: {str(e)}'
            }, status=400)

class AuctionItemViewSet(viewsets.ModelViewSet):
    queryset = AuctionItem.objects.all()
    serializer_class = AuctionItemSerializer
    permission_classes = [IsAuthenticated, IsAdminOrOwner]

    @action(detail=True, methods=['post'], url_path='ai-tag')
    def ai_tag(self, request, pk=None):
        """
        AI tagging logic for auction item - now integrated with AIService
        """
        try:
            item = self.get_object()
            # Use AIService for comprehensive categorization
            categorization_result = AIService.categorize_auction_item(item)
            # Update auction item with AI results
            item.ai_category = categorization_result['ai_category']
            item.ai_tags = categorization_result['tags']
            item.ai_relevance_score = categorization_result['relevance_score']
            item.ai_categorization_confidence = categorization_result['categorization_confidence']
            item.save()
            return Response({
                'status': 'AI categorization complete',
                'ai_category': item.ai_category,
                'tags': item.ai_tags,
                'relevance_score': item.ai_relevance_score,
                'categorization_confidence': item.ai_categorization_confidence
            })
        except Exception as e:
            return Response({
                'status': 'error',
                'message': f'AI categorization failed: {str(e)}'
            }, status=400)

    @action(detail=True, methods=['get'], url_path='ai-suggestions')
    def ai_suggestions(self, request, pk=None):
        """
        Get AI suggestions for improving auction item matching
        """
        try:
            item = self.get_object()
            categorization_result = AIService.categorize_auction_item(item)
            return Response({
                'status': 'success',
                'auction_id': item.id,
                'suggestions': categorization_result.get('matching_suggestions', [])
            })
        except Exception as e:
            return Response({
                'status': 'error',
                'message': f'Failed to get suggestions: {str(e)}'
            }, status=400)

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
    permission_classes = [IsAuthenticated, IsAdminOrOwner]

    def perform_create(self, serializer):
        serializer.save(bidder=self.request.user)

class DonationViewSet(viewsets.ModelViewSet):
    queryset = Donation.objects.all()
    serializer_class = DonationSerializer
    permission_classes = [IsAuthenticated, IsAdminOrOwner]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Donation.objects.all()
        return Donation.objects.filter(donor=user)

    def perform_create(self, serializer):
        donation = serializer.save(donor=self.request.user)
        try:
            # Auto-log to blockchain and create Transaction
            from .blockchain import log_transaction_to_blockchain
            amount = donation.amount or 0
            txn_hash = log_transaction_to_blockchain(self.request.user, amount, donation=donation)
            donation.blockchain_txn_id = txn_hash
            donation.save(update_fields=['blockchain_txn_id'])
            Transaction.objects.create(
                donor=self.request.user,
                txn_hash=txn_hash,
                amount=amount or 0,
                donation=donation
            )
        except Exception:
            # Avoid failing the request if blockchain logging fails
            pass

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
    permission_classes = [IsAuthenticated, IsAdminOrOwner]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Transaction.objects.all()
        return Transaction.objects.filter(donor=user)

    def perform_create(self, serializer):
        serializer.save(donor=self.request.user)

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

# --- Payments ---
class PaymentTransactionViewSet(viewsets.ModelViewSet):
    queryset = PaymentTransaction.objects.all()
    serializer_class = PaymentTransactionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return PaymentTransaction.objects.all()
        return PaymentTransaction.objects.filter(donor=user)

    def perform_create(self, serializer):
        serializer.save(donor=self.request.user, status='pending')

    @action(detail=True, methods=['post'], url_path='callback')
    def provider_callback(self, request, pk=None):
        payment = self.get_object()
        payload = request.data
        payment.callback_payload = payload
        # Simulate provider update
        payment.status = payload.get('status', payment.status)
        payment.external_id = payload.get('external_id', payment.external_id)
        payment.save(update_fields=['callback_payload', 'status', 'external_id'])
        return Response({'status': 'updated'})

# --- Messaging ---
class MessageThreadViewSet(viewsets.ModelViewSet):
    queryset = MessageThread.objects.all()
    serializer_class = MessageThreadSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return MessageThread.objects.all()
        return MessageThread.objects.filter(donor=user) | MessageThread.objects.filter(staff=user)

    def perform_create(self, serializer):
        staff_id = self.request.data.get('staff_id')
        try:
            staff_user = User.objects.get(id=staff_id) if staff_id else None
        except User.DoesNotExist:
            staff_user = None
        serializer.save(donor=self.request.user, staff=staff_user)

    @action(detail=True, methods=['post'], url_path='close')
    def close(self, request, pk=None):
        thread = self.get_object()
        thread.is_closed = True
        thread.save(update_fields=['is_closed'])
        return Response({'status': 'closed'})

class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Message.objects.filter(thread__donor=user) | Message.objects.filter(thread__staff=user)

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)

    @action(detail=True, methods=['post'], url_path='read')
    def mark_read(self, request, pk=None):
        msg = self.get_object()
        msg.is_read = True
        msg.save(update_fields=['is_read'])
        return Response({'status': 'read'})

# --- Inventory & Delivery ---
class InventoryItemViewSet(viewsets.ModelViewSet):
    queryset = InventoryItem.objects.all()
    serializer_class = InventoryItemSerializer
    permission_classes = [IsAuthenticated, IsAdminOrOwner]

class InventoryMovementViewSet(viewsets.ModelViewSet):
    queryset = InventoryMovement.objects.all()
    serializer_class = InventoryMovementSerializer
    permission_classes = [IsAuthenticated, IsAdminOrOwner]

class DeliveryViewSet(viewsets.ModelViewSet):
    queryset = Delivery.objects.all()
    serializer_class = DeliverySerializer
    permission_classes = [IsAuthenticated, IsAdminOrOwner]
