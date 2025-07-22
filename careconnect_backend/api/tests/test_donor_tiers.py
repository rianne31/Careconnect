from rest_framework.test import APITestCase, APIClient
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status

class DonorTierTests(APITestCase):
    def setUp(self):
        self.admin_user = User.objects.create_superuser(username='adminuser', password='adminpass')
        self.token = str(RefreshToken.for_user(self.admin_user).access_token)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)

    def test_admin_can_create_donor_tier(self):
        data = {
            "name": "Gold",
            "minimum_donation": "1000.00"
        }
        response = self.client.post('/api/donor-tiers/', data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], "Gold")