import json
import logging
from typing import Dict, List, Tuple, Optional
from django.conf import settings
from .models import PatientProfile, AuctionItem, Donation
import re

logger = logging.getLogger(__name__)

class AIService:
    """
    AI Service for Careconnect platform - SPECIALIZED FOR PEDIATRIC CANCER PATIENTS
    Handles pediatric cancer patient need analysis, age-appropriate categorization, and family-focused recommendations
    """
    
    # Pediatric cancer-specific keywords for priority assessment
    CRITICAL_PEDIATRIC_CANCER_KEYWORDS = [
        'leukemia', 'lymphoma', 'brain tumor', 'neuroblastoma', 'wilms tumor',
        'osteosarcoma', 'ewing sarcoma', 'rhabdomyosarcoma', 'retinoblastoma',
        'stage 4', 'metastasis', 'relapse', 'refractory', 'terminal',
        'bone marrow transplant', 'stem cell transplant', 'clinical trial'
    ]
    
    HIGH_PRIORITY_PEDIATRIC_KEYWORDS = [
        'chemotherapy', 'radiation', 'surgery', 'immunotherapy', 'targeted therapy',
        'pediatric oncology', 'child cancer', 'young patient', 'infant cancer',
        'toddler cancer', 'adolescent cancer', 'teen cancer'
    ]
    
    # Pediatric-specific support categories
    PEDIATRIC_SUPPORT_CATEGORIES = {
        'medical_treatment': ['chemotherapy', 'radiation', 'surgery', 'medication', 'therapy'],
        'family_support': ['emotional support', 'counseling', 'family therapy', 'sibling support'],
        'logistical_support': ['transportation', 'accommodation', 'childcare', 'meal assistance'],
        'financial_support': ['medical bills', 'treatment costs', 'travel expenses', 'lost wages'],
        'educational_support': ['tutoring', 'school assistance', 'learning materials', 'special needs'],
        'comfort_items': ['toys', 'books', 'games', 'comfort items', 'entertainment'],
        'medical_equipment': ['wheelchair', 'crutches', 'monitoring devices', 'home care equipment']
    }
    
    # Age-appropriate auction item categories
    PEDIATRIC_AUCTION_CATEGORIES = {
        'infant_toddler': ['baby toys', 'comfort items', 'feeding supplies', 'diapers', 'clothing'],
        'preschool': ['educational toys', 'art supplies', 'books', 'games', 'comfort items'],
        'school_age': ['school supplies', 'books', 'games', 'hobbies', 'sports equipment'],
        'adolescent': ['teen activities', 'technology', 'fashion', 'sports', 'hobbies'],
        'family_support': ['counseling services', 'family activities', 'respite care', 'support groups'],
        'medical_equipment': ['pediatric medical devices', 'monitoring equipment', 'mobility aids'],
        'treatment_support': ['wigs', 'scarves', 'comfort items', 'nutritional supplements']
    }
    
    @staticmethod
    def analyze_patient_needs(patient: PatientProfile) -> Dict[str, any]:
        """
        Analyze pediatric cancer patient needs and assign AI priority and tags
        """
        try:
            # Combine diagnosis and needs for analysis
            text_content = f"{patient.diagnosis} {patient.needs}".lower()
            
            # Determine priority level (pediatric cancer-focused)
            priority = AIService._determine_pediatric_priority(text_content, patient.age)
            
            # Extract pediatric-specific needs and tags
            needs_tags = AIService._extract_pediatric_needs_tags(text_content, patient.age)
            
            # Calculate urgency score (0-100) based on pediatric cancer factors
            urgency_score = AIService._calculate_pediatric_urgency_score(text_content, patient.age)
            
            # Generate pediatric cancer-specific recommendations
            recommendations = AIService._generate_pediatric_recommendations(patient, needs_tags)
            
            return {
                'ai_priority': priority,
                'needs_tags': needs_tags,
                'urgency_score': urgency_score,
                'recommendations': recommendations,
                'analysis_confidence': 0.90,  # Higher confidence for specialized analysis
                'pediatric_focus': True,
                'cancer_type': AIService._identify_cancer_type(text_content),
                'age_group': AIService._determine_age_group(patient.age)
            }
            
        except Exception as e:
            logger.error(f"Error analyzing pediatric patient needs: {str(e)}")
            return {
                'ai_priority': 'General Support',
                'needs_tags': ['pediatric', 'general'],
                'urgency_score': 50,
                'recommendations': ['Contact pediatric oncology team for assessment'],
                'analysis_confidence': 0.0,
                'pediatric_focus': True,
                'cancer_type': 'Unknown',
                'age_group': AIService._determine_age_group(patient.age)
            }
    
    @staticmethod
    def categorize_auction_item(item: AuctionItem) -> Dict[str, any]:
        """
        Categorize auction item using pediatric cancer-focused AI analysis
        """
        try:
            # Combine title and description for analysis
            text_content = f"{item.title} {item.description}".lower()
            
            # Determine pediatric-appropriate category
            category = AIService._determine_pediatric_auction_category(text_content)
            
            # Extract pediatric-relevant tags
            tags = AIService._extract_pediatric_auction_tags(text_content)
            
            # Calculate relevance score for pediatric cancer patients
            relevance_score = AIService._calculate_pediatric_relevance_score(text_content)
            
            # Generate pediatric-specific matching suggestions
            matching_suggestions = AIService._generate_pediatric_matching_suggestions(item, category, tags)
            
            return {
                'ai_category': category,
                'tags': tags,
                'relevance_score': relevance_score,
                'matching_suggestions': matching_suggestions,
                'categorization_confidence': 0.92,
                'pediatric_appropriate': True,
                'age_range': AIService._determine_item_age_range(text_content)
            }
            
        except Exception as e:
            logger.error(f"Error categorizing pediatric auction item: {str(e)}")
            return {
                'ai_category': 'General Pediatric Support',
                'tags': ['pediatric', 'general'],
                'relevance_score': 50,
                'matching_suggestions': [],
                'categorization_confidence': 0.0,
                'pediatric_appropriate': True,
                'age_range': 'All ages'
            }
    
    @staticmethod
    def generate_recommendations(
        patient: PatientProfile = None,
        auction_items: List[AuctionItem] = None,
        limit: int = 5
    ) -> Dict[str, any]:
        """
        Generate intelligent recommendations for pediatric cancer patients and their families
        """
        try:
            recommendations = {
                'patient_recommendations': [],
                'family_recommendations': [],
                'donor_recommendations': [],
                'matching_score': 0.0,
                'pediatric_focus': True
            }
            
            if patient:
                recommendations['patient_recommendations'] = AIService._get_pediatric_patient_recommendations(patient, limit)
                recommendations['family_recommendations'] = AIService._get_family_support_recommendations(patient, limit)
            
            if auction_items:
                recommendations['donor_recommendations'] = AIService._get_pediatric_donor_recommendations(auction_items, limit)
            
            # Calculate overall matching score for pediatric patients
            if patient and auction_items:
                recommendations['matching_score'] = AIService._calculate_pediatric_matching_score(patient, auction_items)
            
            return recommendations
            
        except Exception as e:
            logger.error(f"Error generating pediatric recommendations: {str(e)}")
            return {
                'patient_recommendations': [],
                'family_recommendations': [],
                'donor_recommendations': [],
                'matching_score': 0.0,
                'pediatric_focus': True
            }
    
    @staticmethod
    def _determine_pediatric_priority(text_content: str, age: int) -> str:
        """Determine pediatric cancer patient priority based on specialized keywords"""
        if any(keyword in text_content for keyword in AIService.CRITICAL_PEDIATRIC_CANCER_KEYWORDS):
            return 'Critical Pediatric'  # 18 characters - fits within 20 char limit
        elif any(keyword in text_content for keyword in AIService.HIGH_PRIORITY_PEDIATRIC_KEYWORDS):
            return 'High Priority'  # 14 characters
        elif age < 18:
            return 'Pediatric Support'  # 18 characters
        else:
            return 'General Support'  # 16 characters
    
    @staticmethod
    def _extract_pediatric_needs_tags(text_content: str, age: int) -> List[str]:
        """Extract relevant tags for pediatric cancer patients"""
        tags = ['pediatric']  # Always include pediatric tag
        
        # Cancer type tags
        cancer_types = ['leukemia', 'lymphoma', 'brain tumor', 'neuroblastoma', 'sarcoma']
        for cancer_type in cancer_types:
            if cancer_type in text_content:
                tags.append(cancer_type)
        
        # Treatment type tags
        treatment_types = ['chemotherapy', 'radiation', 'surgery', 'transplant', 'immunotherapy']
        for treatment in treatment_types:
            if treatment in text_content:
                tags.append(treatment)
        
        # Support type tags
        support_types = ['family', 'emotional', 'financial', 'logistical', 'educational', 'medical']
        for support_type in support_types:
            if support_type in text_content:
                tags.append(support_type)
        
        # Age-appropriate tags
        age_group = AIService._determine_age_group(age)
        tags.append(age_group)
        
        return list(set(tags))
    
    @staticmethod
    def _calculate_pediatric_urgency_score(text_content: str, age: int) -> int:
        """Calculate urgency score for pediatric cancer patients (0-100)"""
        score = 60  # Higher base score for pediatric patients
        
        # Adjust based on critical pediatric cancer keywords
        if any(keyword in text_content for keyword in AIService.CRITICAL_PEDIATRIC_CANCER_KEYWORDS):
            score += 25
        elif any(keyword in text_content for keyword in AIService.HIGH_PRIORITY_PEDIATRIC_KEYWORDS):
            score += 15
        
        # Age-based urgency (younger patients get higher urgency)
        if age < 5:
            score += 15  # Infants and toddlers
        elif age < 12:
            score += 10  # Young children
        elif age < 18:
            score += 5   # Adolescents
        
        # Emergency indicators
        emergency_indicators = ['emergency', 'urgent', 'immediate', 'critical', 'severe', 'relapse']
        if any(indicator in text_content for indicator in emergency_indicators):
            score += 20
        
        return min(100, max(0, score))
    
    @staticmethod
    def _generate_pediatric_recommendations(patient: PatientProfile, needs_tags: List[str]) -> List[str]:
        """Generate pediatric cancer-specific recommendations"""
        recommendations = []
        
        # Always include pediatric oncology recommendations
        recommendations.append('Contact pediatric oncology team at children\'s hospital')
        recommendations.append('Connect with pediatric cancer support organizations')
        
        # Cancer type-specific recommendations
        if 'leukemia' in needs_tags:
            recommendations.append('Join leukemia support groups for children and families')
            recommendations.append('Contact Leukemia & Lymphoma Society for pediatric resources')
        
        if 'brain tumor' in needs_tags:
            recommendations.append('Connect with brain tumor foundation for children')
            recommendations.append('Seek specialized pediatric neuro-oncology care')
        
        # Treatment-specific recommendations
        if 'chemotherapy' in needs_tags:
            recommendations.append('Prepare for pediatric chemotherapy side effects')
            recommendations.append('Connect with other families going through chemo')
        
        if 'transplant' in needs_tags:
            recommendations.append('Contact bone marrow transplant support organizations')
            recommendations.append('Prepare for extended hospital stay')
        
        # Family support recommendations
        if 'family' in needs_tags:
            recommendations.append('Seek family counseling and support groups')
            recommendations.append('Connect with other pediatric cancer families')
        
        if 'sibling' in needs_tags:
            recommendations.append('Include siblings in support and activities')
            recommendations.append('Seek sibling support programs')
        
        # Financial and logistical support
        if 'financial' in needs_tags:
            recommendations.append('Apply for pediatric cancer financial assistance programs')
            recommendations.append('Contact Ronald McDonald House for accommodation')
        
        if 'transportation' in needs_tags:
            recommendations.append('Contact local pediatric cancer transportation services')
            recommendations.append('Apply for medical transportation assistance')
        
        return recommendations[:8]  # Limit to top 8 recommendations
    
    @staticmethod
    def _determine_pediatric_auction_category(text_content: str) -> str:
        """Determine pediatric-appropriate auction item category"""
        for category, keywords in AIService.PEDIATRIC_AUCTION_CATEGORIES.items():
            if any(keyword in text_content for keyword in keywords):
                return category.replace('_', ' ').title()
        
        return 'General Pediatric Support'
    
    @staticmethod
    def _extract_pediatric_auction_tags(text_content: str) -> List[str]:
        """Extract pediatric-relevant tags from auction item"""
        tags = ['pediatric']
        
        # Extract category-based tags
        for category, keywords in AIService.PEDIATRIC_AUCTION_CATEGORIES.items():
            if any(keyword in text_content for keyword in keywords):
                tags.append(category.replace('_', ' '))
        
        # Extract specific item tags
        item_types = ['toy', 'book', 'game', 'equipment', 'service', 'support', 'care']
        for item_type in item_types:
            if item_type in text_content:
                tags.append(item_type)
        
        return list(set(tags))
    
    @staticmethod
    def _calculate_pediatric_relevance_score(text_content: str) -> int:
        """Calculate relevance score for pediatric auction items"""
        score = 60  # Higher base score for pediatric items
        
        # Increase score for detailed descriptions
        word_count = len(text_content.split())
        if word_count > 50:
            score += 15
        elif word_count > 20:
            score += 10
        
        # Increase score for pediatric terminology
        pediatric_terms = ['pediatric', 'child', 'children', 'kid', 'young', 'family', 'toy', 'game']
        if any(term in text_content for term in pediatric_terms):
            score += 20
        
        # Increase score for cancer-related terms
        cancer_terms = ['cancer', 'oncology', 'treatment', 'support', 'comfort', 'care']
        if any(term in text_content for term in cancer_terms):
            score += 15
        
        return min(100, max(0, score))
    
    @staticmethod
    def _generate_pediatric_matching_suggestions(item: AuctionItem, category: str, tags: List[str]) -> List[str]:
        """Generate suggestions for improving pediatric auction item matching"""
        suggestions = []
        
        if category == 'General Pediatric Support':
            suggestions.append('Add more specific pediatric cancer details to improve categorization')
            suggestions.append('Include age-appropriate information and safety details')
        
        if len(tags) < 4:
            suggestions.append('Add more descriptive tags for better pediatric matching')
            suggestions.append('Include both general and cancer-specific pediatric terms')
        
        if len(item.description) < 100:
            suggestions.append('Provide more detailed description for better family matching')
            suggestions.append('Include how the item helps pediatric cancer patients and families')
        
        # Pediatric-specific suggestions
        if 'toy' in tags or 'game' in tags:
            suggestions.append('Specify age range and safety certifications')
            suggestions.append('Include how the item provides comfort during treatment')
        
        if 'medical' in tags or 'equipment' in tags:
            suggestions.append('Specify pediatric size and safety requirements')
            suggestions.append('Include medical professional recommendations')
        
        return suggestions
    
    @staticmethod
    def _get_pediatric_patient_recommendations(patient: PatientProfile, limit: int) -> List[Dict]:
        """Get pediatric cancer-specific recommendations for a patient"""
        recommendations = []
        
        # Cancer type-specific organizations
        if 'leukemia' in patient.diagnosis.lower():
            recommendations.append({
                'type': 'organization',
                'title': 'Leukemia & Lymphoma Society - Pediatric Division',
                'description': 'Provides comprehensive support for pediatric leukemia patients and families',
                'relevance_score': 98
            })
        
        if 'brain tumor' in patient.diagnosis.lower():
            recommendations.append({
                'type': 'organization',
                'title': 'Pediatric Brain Tumor Foundation',
                'description': 'Specialized support for children with brain tumors and their families',
                'relevance_score': 97
            })
        
        # General pediatric cancer support
        recommendations.append({
            'type': 'organization',
            'title': 'Ronald McDonald House Charities',
            'description': 'Provides accommodation and support for families during pediatric cancer treatment',
            'relevance_score': 95
        })
        
        recommendations.append({
            'type': 'organization',
            'title': 'Make-A-Wish Foundation',
            'description': 'Grants wishes to children with critical illnesses including cancer',
            'relevance_score': 90
        })
        
        return recommendations[:limit]
    
    @staticmethod
    def _get_family_support_recommendations(patient: PatientProfile, limit: int) -> List[Dict]:
        """Get family support recommendations for pediatric cancer patients"""
        recommendations = []
        
        recommendations.append({
            'type': 'service',
            'title': 'Family Counseling Services',
            'description': 'Professional counseling for families dealing with pediatric cancer',
            'relevance_score': 95
        })
        
        recommendations.append({
            'type': 'support_group',
            'title': 'Pediatric Cancer Family Support Groups',
            'description': 'Connect with other families going through similar experiences',
            'relevance_score': 92
        })
        
        recommendations.append({
            'type': 'service',
            'title': 'Sibling Support Programs',
            'description': 'Specialized support for brothers and sisters of cancer patients',
            'relevance_score': 88
        })
        
        return recommendations[:limit]
    
    @staticmethod
    def _get_pediatric_donor_recommendations(auction_items: List[AuctionItem], limit: int) -> List[Dict]:
        """Get recommendations for donors based on pediatric auction items"""
        recommendations = []
        
        for item in auction_items[:limit]:
            recommendations.append({
                'auction_id': item.id,
                'title': item.title,
                'category': item.ai_category or 'General Pediatric Support',
                'relevance_score': 90,
                'suggested_bid': float(item.starting_bid) * 1.15,  # 15% above starting bid for pediatric items
                'pediatric_focus': True
            })
        
        return recommendations
    
    @staticmethod
    def _calculate_pediatric_matching_score(patient: PatientProfile, auction_items: List[AuctionItem]) -> float:
        """Calculate matching score between pediatric cancer patients and auction items"""
        if not auction_items:
            return 0.0
        
        total_score = 0.0
        for item in auction_items:
            score = 0.0
            
            # Pediatric focus matching
            if hasattr(item, 'ai_category') and item.ai_category:
                if 'pediatric' in item.ai_category.lower():
                    score += 0.3
                if 'cancer' in item.ai_category.lower() or 'support' in item.ai_category.lower():
                    score += 0.2
            
            # Age appropriateness matching
            patient_age_group = AIService._determine_age_group(patient.age)
            if hasattr(item, 'ai_tags') and item.ai_tags:
                if patient_age_group.lower() in [tag.lower() for tag in item.ai_tags]:
                    score += 0.2
            
            # Needs matching
            if any(need in item.description.lower() for need in patient.needs.lower().split()):
                score += 0.3
            
            total_score += score
        
        return min(1.0, total_score / len(auction_items))
    
    @staticmethod
    def _identify_cancer_type(text_content: str) -> str:
        """Identify the specific type of pediatric cancer"""
        cancer_types = {
            'leukemia': ['leukemia', 'aml', 'all', 'cml', 'cll'],
            'lymphoma': ['lymphoma', 'hodgkin', 'non-hodgkin'],
            'brain_tumor': ['brain tumor', 'glioma', 'medulloblastoma', 'astrocytoma'],
            'neuroblastoma': ['neuroblastoma'],
            'wilms_tumor': ['wilms tumor', 'nephroblastoma'],
            'osteosarcoma': ['osteosarcoma', 'bone cancer'],
            'ewing_sarcoma': ['ewing sarcoma'],
            'rhabdomyosarcoma': ['rhabdomyosarcoma'],
            'retinoblastoma': ['retinoblastoma', 'eye cancer']
        }
        
        for cancer_type, keywords in cancer_types.items():
            if any(keyword in text_content for keyword in keywords):
                return cancer_type.replace('_', ' ').title()
        
        return 'Unknown Cancer Type'
    
    @staticmethod
    def _determine_age_group(age: int) -> str:
        """Determine pediatric age group"""
        if age < 2:
            return 'infant'
        elif age < 5:
            return 'toddler'
        elif age < 12:
            return 'child'
        elif age < 18:
            return 'adolescent'
        else:
            return 'adult'
    
    @staticmethod
    def _determine_item_age_range(text_content: str) -> str:
        """Determine appropriate age range for auction items"""
        text_lower = text_content.lower()
        
        if any(word in text_lower for word in ['baby', 'infant', 'toddler']):
            return '0-5 years'
        elif any(word in text_lower for word in ['preschool', 'kindergarten', 'elementary']):
            return '3-12 years'
        elif any(word in text_lower for word in ['teen', 'adolescent', 'high school']):
            return '13-18 years'
        elif any(word in text_lower for word in ['family', 'all ages']):
            return 'All ages'
        else:
            return 'Not specified'
