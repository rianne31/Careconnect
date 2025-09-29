from rest_framework.test import APITestCase, APIClient
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from careconnect_backend.api.models import Donation

class DonationTests(APITestCase):
    def setUp(self):
        self.donor = User.objects.create_user(username='donoruser', password='donorpass')
        self.token = str(RefreshToken.for_user(self.donor).access_token)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)

    def test_create_monetary_donation(self):
        response = self.client.post('/api/donations/', {
            "type": "monetary",
            "amount": 50.00
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["amount"], "50.00")
        self.assertEqual(response.data["type"], "monetary")
        self.assertEqual(response.data["donor"]["id"], self.donor.id)