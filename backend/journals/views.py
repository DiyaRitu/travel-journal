from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Journal, Tag
from .serializers import JournalSerializer, TagSerializer


class JournalViewSet(viewsets.ModelViewSet):
    serializer_class = JournalSerializer
    permission_classes = [permissions.IsAuthenticated]

    # Only show journals of the logged-in user
    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Journal.objects.filter(user=self.request.user)
        return Journal.objects.none()

    # Assign logged-in user as journal owner
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    # 👍 Like a journal
    @action(
        detail=True,              # <--- make sure this is True
        methods=["post"],
        url_path="like",          # <--- ensures URL is journals/{id}/like/
        permission_classes=[permissions.IsAuthenticated],
    )
    def like(self, request, pk=None):
        journal = self.get_object()
        journal.likes.add(request.user)
        return Response({"message": "Liked successfully", "total_likes": journal.total_likes()})

    # 👎 Unlike a journal
    @action(
        detail=True,
        methods=["post"],
        url_path="unlike",        # <--- ensures URL is journals/{id}/unlike/
        permission_classes=[permissions.IsAuthenticated],
    )
    def unlike(self, request, pk=None):
        journal = self.get_object()
        journal.likes.remove(request.user)
        return Response({"message": "Unliked successfully", "total_likes": journal.total_likes()})


class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
