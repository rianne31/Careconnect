from rest_framework.test import APITestCase, APIClient
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from careconnect_backend.api.models import PatientProfile

class PatientProfileTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='admin', password='adminpass')
        self.token = str(RefreshToken.for_user(self.user).access_token)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)

    def test_get_patient_profiles(self):
        PatientProfile.objects.create(
            code='P001',
            age=30,
            diagnosis='Condition A',
            needs='Needs description'
        )
        response = self.client.get('/api/patients/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
