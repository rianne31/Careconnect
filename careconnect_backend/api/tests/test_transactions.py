from rest_framework.test import APITestCase, APIClient
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from careconnect_backend.api.models import Donation, Transaction

class TransactionTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='donor', password='donorpass')
        self.token = str(RefreshToken.for_user(self.user).access_token)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)

        self.donation = Donation.objects.create(
            donor=self.user,
            type='monetary',
            amount=100.00
        )

    def test_create_transaction(self):
        response = self.client.post('/api/transactions/', {
            'donor': self.user.id,
            'txn_hash': '0xabc123',
            'amount': 100.00,
            'donation': self.donation.id
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_get_transactions(self):
        Transaction.objects.create(
            donor=self.user,
            txn_hash='0xdef456',
            amount=50.00,
            donation=self.donation
        )
        response = self.client.get('/api/transactions/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
