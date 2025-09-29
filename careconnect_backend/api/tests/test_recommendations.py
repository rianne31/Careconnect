from rest_framework.test import APITestCase, APIClient
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status

class RecommendationTests(APITestCase):
    def setUp(self):
        self.donor = User.objects.create_user(username='donoruser', password='donorpass')
        self.token = str(RefreshToken.for_user(self.donor).access_token)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)

    def test_donor_recommendations_endpoint(self):
        response = self.client.get('/api/recommendations/donor/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('recommendations', response.data)
        self.assertIsInstance(response.data['recommendations'], list)
