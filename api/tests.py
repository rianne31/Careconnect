from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status
from .models import PatientProfile, AuctionItem

# Create your tests here.

class BackendBasicTests(TestCase):
    def setUp(self):
        self.admin = User.objects.create_user(username='admin', password='adminpass', is_staff=True)
        self.donor = User.objects.create_user(username='donor', password='donorpass')
        self.client = APIClient()

    def test_admin_can_create_patient_profile(self):
        self.client.login(username='admin', password='adminpass')
        response = self.client.post('/api/patients/', {
            'code': 'P001',
            'age': 10,
            'diagnosis': 'Leukemia',
            'needs': 'Chemotherapy',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_ai_tag_patient_profile(self):
        self.client.force_authenticate(user=self.admin)
        patient = PatientProfile.objects.create(code='P002', age=8, diagnosis='Lymphoma', needs='Radiation')
        response = self.client.post(f'/api/patients/{patient.id}/ai-tag/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('ai_priority', response.data)

    def test_blockchain_log_auction_item(self):
        self.client.force_authenticate(user=self.admin)
        item = AuctionItem.objects.create(
            title='Toy Car', description='A nice toy', starting_bid=100, status='open', owner=self.admin, ends_at='2099-12-31T23:59:59Z'
        )
        response = self.client.post(f'/api/auctions/{item.id}/blockchain-log/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('txn_hash', response.data)
