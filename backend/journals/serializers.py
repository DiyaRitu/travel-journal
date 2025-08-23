from rest_framework import serializers
from .models import Journal

class JournalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Journal
        fields = ['id', 'user', 'title', 'description', 'start_date', 'end_date', 'privacy', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']
