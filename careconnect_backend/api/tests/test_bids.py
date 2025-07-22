from rest_framework.test import APITestCase, APIClient
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from careconnect_backend.api.models import AuctionItem

class BidTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='bidder', password='testpass')
        self.admin = User.objects.create_user(username='adminuser', password='adminpass')
        self.token = str(RefreshToken.for_user(self.user).access_token)
        self.client = APIClient()
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)

        self.auction = AuctionItem.objects.create(
            title='Test Auction',
            description='Item for testing bids',
            starting_bid=50.00,
            owner=self.admin,
            ends_at=timezone.now() + timedelta(days=1)
        )

    def test_place_bid(self):
        payload = {
            "auction_item": self.auction.id,
            "amount": 60.00
        }
        response = self.client.post("/api/bids/", payload, format="json")
        
        # Debugging information
        print("Bid POST response status:", response.status_code)
        print("Response data:", response.data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)