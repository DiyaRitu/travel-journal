from rest_framework import serializers
from .models import Journal

class JournalSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source="user.username")

    class Meta:
        model = Journal
        fields = [
            "id", "user", "title", "description",
            "start_date", "end_date", "privacy",
            "image", "route",
            "created_at", "updated_at"
        ]
