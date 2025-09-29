from rest_framework.test import APITestCase, APIClient
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from careconnect_backend.api.models import UserProfile

class UserProfileTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='john', password='pass123')
        self.token = str(RefreshToken.for_user(self.user).access_token)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)

        UserProfile.objects.create(user=self.user, role='donor')

    def test_get_user_profiles(self):
        response = self.client.get('/api/user-profiles/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
