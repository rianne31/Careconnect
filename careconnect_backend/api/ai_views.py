from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.utils import timezone
from django.core.cache import cache

from .models import (
    PatientProfile, AuctionItem, AIRecommendation, AITag,
    UserProfile, Donation
)
from .serializers import (
    PatientAIAnalysisSerializer, AuctionItemAICategorizationSerializer,
    AIRecommendationSerializer, AIRecommendationRequestSerializer,
    AIBulkAnalysisSerializer, AITagSerializer
)
from .ai_service import AIService
from .permissions import IsAdminOrReadOnly

class AIAnalysisViewSet(viewsets.ViewSet):
    """
    AI Analysis endpoints for patient needs and auction categorization
    """
    permission_classes = [permissions.IsAuthenticated, IsAdminOrReadOnly]
    
    @action(detail=True, methods=['post'], url_path='analyze-patient')
    def analyze_patient(self, request, pk=None):
        """
        Analyze patient needs using AI and update profile
        """
        try:
            patient = get_object_or_404(PatientProfile, pk=pk)
            
            # Perform AI analysis
            analysis_result = AIService.analyze_patient_needs(patient)
            
            # Update patient profile with AI results
            patient.ai_priority = analysis_result['ai_priority']
            patient.ai_needs_tags = analysis_result['needs_tags']
            patient.ai_urgency_score = analysis_result['urgency_score']
            patient.ai_analysis_confidence = analysis_result['analysis_confidence']
            patient.ai_last_analyzed = timezone.now()
            patient.save()
            
            # Create AI recommendations
            self._create_patient_recommendations(patient, analysis_result['recommendations'])
            
            # Update or create AI tags
            self._update_ai_tags(analysis_result['needs_tags'], 'patient_needs')
            
            serializer = PatientAIAnalysisSerializer(analysis_result)
            return Response({
                'status': 'success',
                'message': 'Patient analysis completed successfully',
                'analysis': serializer.data,
                'patient_id': patient.id
            })
            
        except Exception as e:
            return Response({
                'status': 'error',
                'message': f'Analysis failed: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=True, methods=['post'], url_path='categorize-auction')
    def categorize_auction(self, request, pk=None):
        """
        Categorize auction item using AI
        """
        try:
            auction_item = get_object_or_404(AuctionItem, pk=pk)
            
            # Perform AI categorization
            categorization_result = AIService.categorize_auction_item(auction_item)
            
            # Update auction item with AI results
            auction_item.ai_category = categorization_result['ai_category']
            auction_item.ai_tags = categorization_result['tags']
            auction_item.ai_relevance_score = categorization_result['relevance_score']
            auction_item.ai_categorization_confidence = categorization_result['categorization_confidence']
            auction_item.ai_last_categorized = timezone.now()
            auction_item.save()
            
            # Update or create AI tags
            self._update_ai_tags(categorization_result['tags'], 'auction_item')
            
            serializer = AuctionItemAICategorizationSerializer(categorization_result)
            return Response({
                'status': 'success',
                'message': 'Auction categorization completed successfully',
                'categorization': serializer.data,
                'auction_id': auction_item.id
            })
            
        except Exception as e:
            return Response({
                'status': 'error',
                'message': f'Categorization failed: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['post'], url_path='bulk-analyze')
    def bulk_analyze(self, request):
        """
        Perform bulk AI analysis on multiple patients and auction items
        """
        serializer = AIBulkAnalysisSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            results = {
                'patients_analyzed': 0,
                'auctions_categorized': 0,
                'errors': []
            }
            
            # Analyze patients
            if serializer.validated_data.get('patient_ids'):
                for patient_id in serializer.validated_data['patient_ids']:
                    try:
                        patient = PatientProfile.objects.get(pk=patient_id)
                        if (serializer.validated_data.get('force_reanalysis') or 
                            not patient.ai_last_analyzed or 
                            (timezone.now() - patient.ai_last_analyzed).days > 7):
                            
                            analysis_result = AIService.analyze_patient_needs(patient)
                            patient.ai_priority = analysis_result['ai_priority']
                            patient.ai_needs_tags = analysis_result['needs_tags']
                            patient.ai_urgency_score = analysis_result['urgency_score']
                            patient.ai_analysis_confidence = analysis_result['analysis_confidence']
                            patient.ai_last_analyzed = timezone.now()
                            patient.save()
                            
                            results['patients_analyzed'] += 1
                    except Exception as e:
                        results['errors'].append(f'Patient {patient_id}: {str(e)}')
            
            # Categorize auction items
            if serializer.validated_data.get('auction_item_ids'):
                for auction_id in serializer.validated_data['auction_item_ids']:
                    try:
                        auction_item = AuctionItem.objects.get(pk=auction_id)
                        if (serializer.validated_data.get('force_reanalysis') or 
                            not auction_item.ai_last_categorized or 
                            (timezone.now() - auction_item.ai_last_categorized).days > 7):
                            
                            categorization_result = AIService.categorize_auction_item(auction_item)
                            auction_item.ai_category = categorization_result['ai_category']
                            auction_item.ai_tags = categorization_result['tags']
                            auction_item.ai_relevance_score = categorization_result['relevance_score']
                            auction_item.ai_categorization_confidence = categorization_result['categorization_confidence']
                            auction_item.ai_last_categorized = timezone.now()
                            auction_item.save()
                            
                            results['auctions_categorized'] += 1
                    except Exception as e:
                        results['errors'].append(f'Auction {auction_id}: {str(e)}')
            
            return Response({
                'status': 'success',
                'message': 'Bulk analysis completed',
                'results': results
            })
            
        except Exception as e:
            return Response({
                'status': 'error',
                'message': f'Bulk analysis failed: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def _create_patient_recommendations(self, patient, recommendations):
        """Create AI recommendation records for a patient"""
        for rec in recommendations:
            AIRecommendation.objects.create(
                recommendation_type='patient',
                patient=patient,
                title=f"AI Recommendation for {patient.code}",
                description=rec,
                relevance_score=0.85,
                ai_confidence=0.85
            )
    
    def _update_ai_tags(self, tags, category):
        """Update or create AI tags with frequency tracking"""
        for tag_name in tags:
            tag, created = AITag.objects.get_or_create(
                name=tag_name.lower(),
                category=category,
                defaults={
                    'ai_confidence': 0.85,
                    'frequency': 1
                }
            )
            if not created:
                tag.frequency += 1
                tag.last_used = timezone.now()
                tag.save()

class AIRecommendationViewSet(viewsets.ReadOnlyModelViewSet):
    """
    AI Recommendation endpoints for patients and donors
    """
    queryset = AIRecommendation.objects.filter(is_active=True)
    serializer_class = AIRecommendationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=False, methods=['post'], url_path='generate')
    def generate_recommendations(self, request):
        """
        Generate AI-powered recommendations
        """
        serializer = AIRecommendationRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            patient = None
            auction_items = []
            
            # Get patient if specified
            if serializer.validated_data.get('patient_id'):
                patient = get_object_or_404(PatientProfile, pk=serializer.validated_data['patient_id'])
            
            # Get auction items if specified
            if serializer.validated_data.get('auction_item_ids'):
                auction_items = list(AuctionItem.objects.filter(
                    pk__in=serializer.validated_data['auction_item_ids']
                ))
            
            # Generate recommendations
            recommendations = AIService.generate_recommendations(
                patient=patient,
                auction_items=auction_items,
                limit=serializer.validated_data['limit']
            )
            
            # Store recommendations in database
            self._store_recommendations(recommendations, patient, auction_items)
            
            return Response({
                'status': 'success',
                'recommendations': recommendations
            })
            
        except Exception as e:
            return Response({
                'status': 'error',
                'message': f'Recommendation generation failed: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['get'], url_path='patient/(?P<patient_id>[^/.]+)')
    def get_patient_recommendations(self, request, patient_id=None):
        """
        Get AI recommendations for a specific patient
        """
        try:
            patient = get_object_or_404(PatientProfile, pk=patient_id)
            
            # Get existing recommendations
            existing_recs = AIRecommendation.objects.filter(
                patient=patient,
                recommendation_type='patient',
                is_active=True
            ).order_by('-relevance_score', '-created_at')
            
            # Generate new recommendations if needed
            if not existing_recs.exists():
                analysis_result = AIService.analyze_patient_needs(patient)
                recommendations = AIService.generate_recommendations(
                    patient=patient,
                    limit=5
                )
                
                # Store new recommendations
                self._store_recommendations(recommendations, patient)
                existing_recs = AIRecommendation.objects.filter(
                    patient=patient,
                    recommendation_type='patient',
                    is_active=True
                ).order_by('-relevance_score', '-created_at')
            
            serializer = AIRecommendationSerializer(existing_recs, many=True)
            return Response({
                'status': 'success',
                'patient_id': patient.id,
                'recommendations': serializer.data
            })
            
        except Exception as e:
            return Response({
                'status': 'error',
                'message': f'Failed to get patient recommendations: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    @action(detail=False, methods=['get'], url_path='matching/(?P<patient_id>[^/.]+)')
    def get_patient_donor_matching(self, request, patient_id=None):
        """
        Get AI-powered patient-donor matching recommendations
        """
        try:
            patient = get_object_or_404(PatientProfile, pk=patient_id)
            
            # Get relevant auction items
            auction_items = AuctionItem.objects.filter(
                status='open',
                ai_category__isnull=False
            ).order_by('-ai_relevance_score')[:10]
            
            # Generate matching recommendations
            recommendations = AIService.generate_recommendations(
                patient=patient,
                auction_items=list(auction_items),
                limit=5
            )
            
            # Store matching recommendations
            self._store_matching_recommendations(recommendations, patient, auction_items)
            
            return Response({
                'status': 'success',
                'patient_id': patient.id,
                'matching_score': recommendations['matching_score'],
                'recommendations': recommendations['donor_recommendations']
            })
            
        except Exception as e:
            return Response({
                'status': 'error',
                'message': f'Failed to get matching recommendations: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def _store_recommendations(self, recommendations, patient=None, auction_items=None):
        """Store AI recommendations in database"""
        try:
            # Store patient recommendations
            if patient and recommendations.get('patient_recommendations'):
                for rec in recommendations['patient_recommendations']:
                    AIRecommendation.objects.create(
                        recommendation_type='patient',
                        patient=patient,
                        title=rec.get('title', 'AI Recommendation'),
                        description=rec.get('description', ''),
                        relevance_score=rec.get('relevance_score', 0.8) / 100,  # Convert to 0-1 scale
                        ai_confidence=0.85
                    )
            
            # Store donor recommendations
            if auction_items and recommendations.get('donor_recommendations'):
                for rec in recommendations['donor_recommendations']:
                    auction_item = next(
                        (item for item in auction_items if item.id == rec.get('auction_id')), 
                        None
                    )
                    if auction_item:
                        AIRecommendation.objects.create(
                            recommendation_type='donor',
                            auction_item=auction_item,
                            title=f"Donor Recommendation: {rec.get('title', '')}",
                            description=f"Suggested bid: ${rec.get('suggested_bid', 0):.2f}",
                            relevance_score=rec.get('relevance_score', 0.8) / 100,
                            ai_confidence=0.85
                        )
        except Exception as e:
            logger.error(f"Error storing AI recommendations: {str(e)}")
    
    def _store_matching_recommendations(self, recommendations, patient, auction_items):
        """Store patient-donor matching recommendations"""
        try:
            if recommendations.get('donor_recommendations'):
                for rec in recommendations['donor_recommendations']:
                    auction_item = next(
                        (item for item in auction_items if item.id == rec.get('auction_id')), 
                        None
                    )
                    if auction_item:
                        AIRecommendation.objects.create(
                            recommendation_type='matching',
                            patient=patient,
                            auction_item=auction_item,
                            title=f"Patient-Donor Match: {rec.get('title', '')}",
                            description=f"High relevance match for patient {patient.code}",
                            relevance_score=recommendations.get('matching_score', 0.5),
                            ai_confidence=0.85
                        )
        except Exception as e:
            logger.error(f"Error storing matching recommendations: {str(e)}")

class AITagViewSet(viewsets.ReadOnlyModelViewSet):
    """
    AI Tag management endpoints
    """
    queryset = AITag.objects.all()
    serializer_class = AITagSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    @action(detail=False, methods=['get'], url_path='category/(?P<category>[^/.]+)')
    def get_tags_by_category(self, request, category=None):
        """
        Get AI tags by category
        """
        tags = AITag.objects.filter(category=category).order_by('-frequency', '-ai_confidence')
        serializer = AITagSerializer(tags, many=True)
        return Response({
            'status': 'success',
            'category': category,
            'tags': serializer.data
        })
    
    @action(detail=False, methods=['get'], url_path='popular')
    def get_popular_tags(self, request):
        """
        Get most popular AI tags
        """
        tags = AITag.objects.all().order_by('-frequency', '-ai_confidence')[:20]
        serializer = AITagSerializer(tags, many=True)
        return Response({
            'status': 'success',
            'popular_tags': serializer.data
        })
