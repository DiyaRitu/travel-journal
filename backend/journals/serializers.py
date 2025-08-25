from rest_framework import serializers
from .models import Journal, Tag, Comment


# Serializer for Tag model
class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ["id", "name"]


# Serializer for Journal model
class JournalSerializer(serializers.ModelSerializer):
    # Show username instead of user id
    user = serializers.ReadOnlyField(source="user.username")

    # Show full tag details when reading
    tags = TagSerializer(many=True, read_only=True)

    # Accept tag ids when creating/updating
    tag_ids = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Tag.objects.all(), write_only=True, source="tags"
    )

    # Show total likes count
    total_likes = serializers.SerializerMethodField()

    # Show list of user IDs who liked this journal
    likes = serializers.PrimaryKeyRelatedField(
        many=True, read_only=True
    )

    class Meta:
        model = Journal
        fields = [
            "id", "user", "title", "description",
            "start_date", "end_date", "privacy",
            "image", "route",          # ✅ keep image + route
            "tags", "tag_ids",         # show tags + allow adding via tag_ids
            "likes", "total_likes",    # likes system
            "created_at", "updated_at"
        ]
        read_only_fields = ["likes", "total_likes"]

    def get_total_likes(self, obj):
        return obj.total_likes()

    def create(self, validated_data):
        # Handle tag_ids (mapped to tags via source="tags")
        tags = validated_data.pop("tags", [])
        journal = Journal.objects.create(**validated_data)
        if tags:
            journal.tags.set(tags)
        return journal

    def update(self, instance, validated_data):
        tags = validated_data.pop("tags", None)
        instance = super().update(instance, validated_data)
        if tags is not None:
            instance.tags.set(tags)
        return instance

class CommentSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source="user.username")
    journal = serializers.PrimaryKeyRelatedField(queryset=Journal.objects.all(), required=False)

    class Meta:
        model = Comment
        fields = ["id", "journal", "user", "text", "created_at", "updated_at"]
        read_only_fields = ["user", "created_at", "updated_at"]