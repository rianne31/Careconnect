from rest_framework.test import APITestCase, APIClient
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from careconnect_backend.api.models import AuctionItem

class AuctionItemTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='auctionuser', password='testpass')
        self.token = str(RefreshToken.for_user(self.user).access_token)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)

    def test_create_auction_item(self):
        data = {
            "title": "Painting",
            "description": "Beautiful landscape",
            "starting_bid": 50.00
        }
        response = self.client.post('/api/auctions/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('title', response.data)
        self.assertEqual(response.data['title'], data['title'])
