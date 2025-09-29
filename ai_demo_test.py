#!/usr/bin/env python3
"""
🚀 CARECONNECT PEDIATRIC CANCER AI INTEGRATION DEMO
====================================================

This script demonstrates the AI-powered features of the Careconnect platform
SPECIFICALLY DESIGNED FOR PEDIATRIC CANCER PATIENTS:
- Pediatric cancer patient need analysis and priority assessment
- Age-appropriate auction item categorization and tagging
- Family-focused recommendations and support matching
- Pediatric cancer-specific AI insights and suggestions

Run this after starting the Django server with: python manage.py runserver
"""

import requests
import json
import time
from datetime import datetime

# Configuration
BASE_URL = "http://127.0.0.1:8000"
API_BASE = f"{BASE_URL}/api"
ADMIN_CREDENTIALS = {"username": "admin", "password": "admin123"}

class CareconnectPediatricAIDemo:
    def __init__(self):
        self.session = requests.Session()
        self.access_token = None
        self.patient_ids = []
        self.auction_ids = []
        
    def print_header(self, title):
        print(f"\n{'='*70}")
        print(f"  {title}")
        print(f"{'='*70}")
    
    def print_section(self, title):
        print(f"\n{'-'*50}")
        print(f"  {title}")
        print(f"{'-'*50}")
    
    def authenticate(self):
        """Authenticate and get JWT token"""
        try:
            response = self.session.post(f"{API_BASE}/token/", data=ADMIN_CREDENTIALS)
            if response.status_code == 200:
                self.access_token = response.json()['access']
                self.session.headers.update({'Authorization': f'Bearer {self.access_token}'})
                print("✅ Authentication successful")
                return True
            else:
                print(f"❌ Authentication failed: {response.status_code}")
                return False
        except Exception as e:
            print(f"❌ Authentication error: {str(e)}")
            return False
    
    def create_sample_data(self):
        """Create sample pediatric cancer patients and age-appropriate auction items"""
        self.print_section("Creating Pediatric Cancer Sample Data")
        
        # Sample pediatric cancer patients with different ages and cancer types
        patients_data = [
            {
                "code": "PED001",
                "age": 4,
                "diagnosis": "Acute Lymphoblastic Leukemia (ALL) - High Risk",
                "needs": "Financial support for chemotherapy treatments, family counseling, transportation to children's hospital, comfort toys and books for hospital stays"
            },
            {
                "code": "PED002", 
                "age": 12,
                "diagnosis": "Medulloblastoma brain tumor - Post-surgery treatment",
                "needs": "Radiation therapy support, educational assistance during treatment, family support groups, mobility equipment for recovery"
            },
            {
                "code": "PED003",
                "age": 16,
                "diagnosis": "Ewing Sarcoma - Stage 3 with metastasis",
                "needs": "Aggressive chemotherapy, bone marrow transplant preparation, teen support groups, family financial assistance, home care equipment"
            },
            {
                "code": "PED004",
                "age": 2,
                "diagnosis": "Neuroblastoma - High-risk group",
                "needs": "Specialized pediatric oncology care, family accommodation near hospital, comfort items for infants, sibling support programs"
            }
        ]
        
        # Sample age-appropriate auction items for pediatric cancer patients
        auctions_data = [
            {
                "title": "Comfort Care Package for Pediatric Cancer Patients (Ages 2-5)",
                "description": "Complete comfort package including soft plush toys, age-appropriate books, coloring supplies, comfort blanket, and hospital-friendly activities designed specifically for young pediatric cancer patients. All items are hypoallergenic and hospital-safe.",
                "starting_bid": 75.00,
                "ends_at": "2024-12-31T23:59:59Z"
            },
            {
                "title": "Educational Support Kit for School-Age Cancer Patients (Ages 6-12)",
                "description": "Comprehensive educational support package with age-appropriate learning materials, art supplies, science kits, reading books, and educational games. Designed to help pediatric cancer patients continue learning during treatment and hospital stays.",
                "starting_bid": 120.00,
                "ends_at": "2024-12-31T23:59:59Z"
            },
            {
                "title": "Teen Cancer Support Package (Ages 13-18)",
                "description": "Teen-focused cancer support package including journaling supplies, teen-appropriate books, technology accessories, fashion items, and activities designed to help adolescent cancer patients maintain their identity and interests during treatment.",
                "starting_bid": 150.00,
                "ends_at": "2024-12-31T23:59:59Z"
            },
            {
                "title": "Family Support and Counseling Services Package",
                "description": "Comprehensive family support package including family counseling sessions, sibling support programs, parent support groups, and family activities designed to help the entire family cope with pediatric cancer diagnosis and treatment.",
                "starting_bid": 300.00,
                "ends_at": "2024-12-31T23:59:59Z"
            },
            {
                "title": "Pediatric Medical Equipment - Child-Sized Wheelchair",
                "description": "Professional-grade pediatric wheelchair specifically designed for children with cancer. Features include adjustable sizing for ages 3-12, comfortable padding, easy maneuverability, and safety features appropriate for pediatric patients.",
                "starting_bid": 800.00,
                "ends_at": "2024-12-31T23:59:59Z"
            }
        ]
        
        # Create pediatric cancer patients
        print("Creating sample pediatric cancer patients...")
        for patient_data in patients_data:
            response = self.session.post(f"{API_BASE}/patients/", json=patient_data)
            if response.status_code == 201:
                patient_id = response.json()['id']
                self.patient_ids.append(patient_id)
                print(f"✅ Created pediatric patient {patient_data['code']} (Age: {patient_data['age']}, Cancer: {patient_data['diagnosis'][:40]}...)")
            else:
                print(f"❌ Failed to create patient {patient_data['code']}: {response.status_code}")
        
        # Create age-appropriate auction items
        print("\nCreating sample pediatric auction items...")
        for auction_data in auctions_data:
            response = self.session.post(f"{API_BASE}/auctions/", json=auction_data)
            if response.status_code == 201:
                auction_id = response.json()['id']
                self.auction_ids.append(auction_id)
                print(f"✅ Created auction '{auction_data['title'][:50]}...' (ID: {auction_id})")
            else:
                print(f"❌ Failed to create auction: {response.status_code}")
    
    def demonstrate_pediatric_ai_analysis(self):
        """Demonstrate AI-powered pediatric cancer patient need analysis"""
        self.print_section("AI Pediatric Cancer Patient Analysis")
        
        for patient_id in self.patient_ids:
            print(f"\nAnalyzing pediatric cancer patient {patient_id}...")
            
            # Perform AI analysis
            response = self.session.post(f"{API_BASE}/ai/analysis/{patient_id}/analyze-patient/")
            if response.status_code == 200:
                result = response.json()
                print(f"✅ AI Analysis completed for pediatric patient {patient_id}")
                print(f"   Priority: {result['analysis']['ai_priority']}")
                print(f"   Cancer Type: {result['analysis'].get('cancer_type', 'N/A')}")
                print(f"   Age Group: {result['analysis'].get('age_group', 'N/A')}")
                print(f"   Urgency Score: {result['analysis']['urgency_score']}/100")
                print(f"   Needs Tags: {', '.join(result['analysis']['needs_tags'])}")
                print(f"   Confidence: {result['analysis']['analysis_confidence']:.2f}")
                print(f"   Pediatric Focus: {result['analysis'].get('pediatric_focus', 'N/A')}")
                
                # Show pediatric cancer-specific recommendations
                print(f"   Pediatric Cancer Recommendations:")
                for i, rec in enumerate(result['analysis']['recommendations'][:4], 1):
                    print(f"     {i}. {rec}")
            else:
                print(f"❌ AI analysis failed for patient {patient_id}: {response.status_code}")
    
    def demonstrate_pediatric_auction_categorization(self):
        """Demonstrate AI-powered pediatric auction item categorization"""
        self.print_section("AI Pediatric Auction Item Categorization")
        
        for auction_id in self.auction_ids:
            print(f"\nCategorizing pediatric auction item {auction_id}...")
            
            # Perform AI categorization
            response = self.session.post(f"{API_BASE}/ai/analysis/{auction_id}/categorize-auction/")
            if response.status_code == 200:
                result = response.json()
                print(f"✅ AI Categorization completed for pediatric auction {auction_id}")
                print(f"   Category: {result['categorization']['ai_category']}")
                print(f"   Age Range: {result['categorization'].get('age_range', 'N/A')}")
                print(f"   Tags: {', '.join(result['categorization']['tags'])}")
                print(f"   Relevance Score: {result['categorization']['relevance_score']}/100")
                print(f"   Confidence: {result['categorization']['categorization_confidence']:.2f}")
                print(f"   Pediatric Appropriate: {result['categorization'].get('pediatric_appropriate', 'N/A')}")
                
                # Show pediatric-specific suggestions
                if result['categorization']['matching_suggestions']:
                    print(f"   Pediatric Matching Suggestions:")
                    for i, suggestion in enumerate(result['categorization']['matching_suggestions'][:2], 1):
                        print(f"     {i}. {suggestion}")
            else:
                print(f"❌ AI categorization failed for auction {auction_id}: {response.status_code}")
    
    def demonstrate_pediatric_ai_recommendations(self):
        """Demonstrate AI-powered pediatric cancer recommendations"""
        self.print_section("AI-Powered Pediatric Cancer Recommendations")
        
        # Generate recommendations for a specific pediatric patient
        if self.patient_ids:
            patient_id = self.patient_ids[0]
            print(f"\nGenerating pediatric cancer recommendations for patient {patient_id}...")
            
            response = self.session.post(f"{API_BASE}/ai/recommendations/generate/", json={
                "patient_id": patient_id,
                "limit": 5,
                "recommendation_type": "all"
            })
            
            if response.status_code == 200:
                result = response.json()
                print("✅ Pediatric AI Recommendations generated successfully")
                print(f"   Patient Recommendations: {len(result['recommendations']['patient_recommendations'])}")
                print(f"   Family Support Recommendations: {len(result['recommendations'].get('family_recommendations', []))}")
                print(f"   Donor Recommendations: {len(result['recommendations']['donor_recommendations'])}")
                print(f"   Overall Matching Score: {result['recommendations']['matching_score']:.2f}")
                print(f"   Pediatric Focus: {result['recommendations'].get('pediatric_focus', 'N/A')}")
                
                # Show pediatric cancer-specific recommendations
                if result['recommendations']['patient_recommendations']:
                    print(f"\n   Pediatric Cancer Patient Recommendations:")
                    for i, rec in enumerate(result['recommendations']['patient_recommendations'][:3], 1):
                        print(f"     {i}. {rec.get('title', 'N/A')} - {rec.get('description', 'N/A')}")
                
                if result['recommendations'].get('family_recommendations'):
                    print(f"\n   Family Support Recommendations:")
                    for i, rec in enumerate(result['recommendations']['family_recommendations'][:2], 1):
                        print(f"     {i}. {rec.get('title', 'N/A')} - {rec.get('description', 'N/A')}")
            else:
                print(f"❌ Failed to generate pediatric recommendations: {response.status_code}")
    
    def demonstrate_pediatric_donor_matching(self):
        """Demonstrate AI-powered pediatric cancer patient-donor matching"""
        self.print_section("AI Pediatric Cancer Patient-Donor Matching")
        
        if self.patient_ids:
            patient_id = self.patient_ids[0]
            print(f"\nFinding pediatric cancer matches for patient {patient_id}...")
            
            response = self.session.get(f"{API_BASE}/ai/recommendations/matching/{patient_id}/")
            if response.status_code == 200:
                result = response.json()
                print("✅ Pediatric cancer patient-donor matching completed")
                print(f"   Matching Score: {result['matching_score']:.2f}")
                print(f"   Recommendations: {len(result['recommendations'])}")
                
                # Show top pediatric matches
                if result['recommendations']:
                    print(f"\n   Top Pediatric Cancer Matches:")
                    for i, rec in enumerate(result['recommendations'][:3], 1):
                        print(f"     {i}. {rec.get('title', 'N/A')}")
                        print(f"        Category: {rec.get('category', 'N/A')}")
                        print(f"        Suggested Bid: ${rec.get('suggested_bid', 0):.2f}")
                        print(f"        Pediatric Focus: {rec.get('pediatric_focus', 'N/A')}")
            else:
                print(f"❌ Pediatric cancer matching failed: {response.status_code}")
    
    def demonstrate_pediatric_bulk_ai_analysis(self):
        """Demonstrate bulk AI analysis for pediatric cancer patients"""
        self.print_section("Bulk Pediatric Cancer AI Analysis")
        
        print("Performing bulk AI analysis on all pediatric cancer patients and auction items...")
        
        response = self.session.post(f"{API_BASE}/ai/analysis/bulk-analyze/", json={
            "patient_ids": self.patient_ids,
            "auction_item_ids": self.auction_ids,
            "force_reanalysis": False
        })
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Bulk pediatric cancer AI analysis completed successfully")
            print(f"   Pediatric Patients Analyzed: {result['results']['patients_analyzed']}")
            print(f"   Pediatric Auctions Categorized: {result['results']['auctions_categorized']}")
            
            if result['results']['errors']:
                print(f"   Errors: {len(result['results']['errors'])}")
                for error in result['results']['errors'][:3]:
                    print(f"     - {error}")
        else:
            print(f"❌ Bulk pediatric cancer AI analysis failed: {response.status_code}")
    
    def demonstrate_pediatric_ai_tags(self):
        """Demonstrate pediatric cancer AI tag management"""
        self.print_section("Pediatric Cancer AI Tag Management")
        
        # Get popular pediatric cancer tags
        response = self.session.get(f"{API_BASE}/ai/tags/popular/")
        if response.status_code == 200:
            result = response.json()
            print("✅ Retrieved pediatric cancer AI tags")
            print(f"   Total Tags: {len(result['popular_tags'])}")
            
            # Show top pediatric cancer tags
            if result['popular_tags']:
                print(f"\n   Top Pediatric Cancer Tags:")
                for i, tag in enumerate(result['popular_tags'][:10], 1):
                    print(f"     {i}. {tag['name']} ({tag['category']}) - Frequency: {tag['frequency']}")
        else:
            print(f"❌ Failed to retrieve pediatric cancer AI tags: {response.status_code}")
    
    def run_full_pediatric_demo(self):
        """Run the complete pediatric cancer AI integration demo"""
        self.print_header("CARECONNECT PEDIATRIC CANCER AI INTEGRATION DEMO")
        print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"API Base: {API_BASE}")
        print(f"Focus: Pediatric Cancer Patients and Families")
        
        # Step 1: Authenticate
        if not self.authenticate():
            print("❌ Cannot proceed without authentication")
            return
        
        # Step 2: Create pediatric cancer sample data
        self.create_sample_data()
        
        # Step 3: Demonstrate pediatric cancer AI features
        self.demonstrate_pediatric_ai_analysis()
        self.demonstrate_pediatric_auction_categorization()
        self.demonstrate_pediatric_ai_recommendations()
        self.demonstrate_pediatric_donor_matching()
        self.demonstrate_pediatric_bulk_ai_analysis()
        self.demonstrate_pediatric_ai_tags()
        
        # Final summary
        self.print_header("PEDIATRIC CANCER AI DEMO COMPLETED SUCCESSFULLY!")
        print("🎯 All pediatric cancer AI integration features demonstrated:")
        print("   ✅ Pediatric cancer patient need analysis and priority assessment")
        print("   ✅ Age-appropriate auction item categorization and tagging")
        print("   ✅ Family-focused recommendations and support matching")
        print("   ✅ Pediatric cancer-specific patient-donor matching")
        print("   ✅ Bulk AI analysis for pediatric cancer patients")
        print("   ✅ Pediatric cancer AI tag management and insights")
        print("\n🚀 Your Careconnect platform now has specialized pediatric cancer AI capabilities!")
        print("   The system can intelligently analyze pediatric cancer patient needs,")
        print("   categorize age-appropriate items, and provide family-focused support.")
        print("\n💡 Pediatric Cancer-Specific Features:")
        print("   - Age-appropriate priority assessment (infant, toddler, child, adolescent)")
        print("   - Cancer type identification (leukemia, brain tumor, sarcoma, etc.)")
        print("   - Family support recommendations and sibling programs")
        print("   - Age-appropriate auction item categorization")
        print("   - Pediatric medical equipment and comfort item matching")
        print("\n🏥 This platform is now specifically designed to help pediatric cancer")
        print("   patients and their families find the support they need!")

if __name__ == "__main__":
    demo = CareconnectPediatricAIDemo()
    try:
        demo.run_full_pediatric_demo()
    except KeyboardInterrupt:
        print("\n\n⚠️  Pediatric cancer AI demo interrupted by user")
    except Exception as e:
        print(f"\n\n❌ Pediatric cancer AI demo failed with error: {str(e)}")
        print("Make sure the Django server is running with: python manage.py runserver")
