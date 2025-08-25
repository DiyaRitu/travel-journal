from django.db import models
from django.contrib.auth.models import User

class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

class Journal(models.Model):
    PRIVACY_CHOICES = [
        ("public", "Public"),
        ("private", "Private"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="journals")
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    start_date = models.DateField()
    end_date = models.DateField()
    privacy = models.CharField(max_length=10, choices=PRIVACY_CHOICES, default="private")
    image = models.ImageField(upload_to="journal_images/", blank=True, null=True)
    route = models.JSONField(blank=True, null=True)
    tags = models.ManyToManyField(Tag, related_name="journals", blank=True)
    likes = models.ManyToManyField(User, related_name="liked_journals", blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.title} ({self.user.username})"
    
    def total_likes(self):
        return self.likes.count()
