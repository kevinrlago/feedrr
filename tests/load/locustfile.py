# tests/load/locustfile.py
from locust import HttpUser, task, between, events
from typing import Dict, Any
import json
import random

class FeedrrUser(HttpUser):
    wait_time = between(1, 3)
    token: str = ""
    headers: Dict[str, str] = {}

    def on_start(self):
        # Login and get token
        response = self.client.post("/auth/token", {
            "username": f"testuser{random.randint(1,1000)}",
            "password": "testpass123"
        })
        self.token = response.json()["access_token"]
        self.headers = {"Authorization": f"Bearer {self.token}"}

    @task(20)
    def get_feeds(self):
        """High frequency feed listing"""
        self.client.get("/feeds", headers=self.headers)

    @task(15)
    def get_categories(self):
        """Medium frequency category access"""
        self.client.get("/categories", headers=self.headers)

    @task(10)
    def get_feed_entries(self):
        """Medium frequency feed entries access"""
        self.client.get(f"/feeds/{random.randint(1,100)}/entries", headers=self.headers)

    @task(5)
    def create_feed(self):
        """Low frequency feed creation"""
        self.client.post("/feeds", headers=self.headers, json={
            "name": f"Test Feed {random.randint(1,1000)}",
            "url": f"http://example{random.randint(1,1000)}.com/feed",
            "category_id": random.randint(1,10)
        })

    @task(3)
    def update_feed(self):
        """Low frequency feed update"""
        self.client.put(f"/feeds/{random.randint(1,100)}", headers=self.headers, json={
            "name": f"Updated Feed {random.randint(1,1000)}"
        })

    @task(2)
    def filter_management(self):
        """Rare filter operations"""
        feed_id = random.randint(1,100)
        self.client.post(f"/feeds/{feed_id}/whitelist", headers=self.headers, json={
            "words": [f"word{random.randint(1,100)}"]
        })

    @task(1)
    def send_to_platform(self):
        """Very rare platform dispatch"""
        self.client.post("/dispatch", headers=self.headers, json={
            "entry_id": random.randint(1,100),
            "platform": random.choice(["telegram", "discord", "whatsapp"])
        })

class AdminUser(HttpUser):
    wait_time = between(2, 5)
    token: str = ""
    headers: Dict[str, str] = {}

    def on_start(self):
        # Admin login
        response = self.client.post("/auth/token", {
            "username": "admin",
            "password": "adminpass123"
        })
        self.token = response.json()["access_token"]
        self.headers = {"Authorization": f"Bearer {self.token}"}

    @task(10)
    def manage_users(self):
        """User management operations"""
        self.client.get("/users", headers=self.headers)

    @task(5)
    def approve_feeds(self):
        """Feed request approval"""
        self.client.get("/feeds/requests", headers=self.headers)
        self.client.post(f"/feeds/requests/{random.randint(1,100)}/approve", headers=self.headers)

@events.test_start.add_listener
def on_test_start(environment, **kwargs):
    print("Load test starting...")

@events.test_stop.add_listener
def on_test_stop(environment, **kwargs):
    print("Load test completed")
    
if __name__ == "__main__":
    import os
    os.system("locust -f locustfile.py --host=http://localhost:8000")