from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import SAFE_METHODS, BasePermission
from .models import Journal, Tag, Comment
from .serializers import JournalSerializer, TagSerializer, CommentSerializer


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

    @action(
        detail=True,
        methods=["get", "post"],
        url_path="comments",
        permission_classes=[permissions.IsAuthenticatedOrReadOnly],
    )
    def comments(self, request, pk=None):
        journal = self.get_object()  # ensures 404 if wrong id

        if request.method.lower() == "get":
            qs = journal.comments.select_related("user").order_by("-created_at")
            page = self.paginate_queryset(qs)
            ser = CommentSerializer(page or qs, many=True)
            return self.get_paginated_response(ser.data) if page is not None else Response(ser.data)

        # POST (create)
        if not request.user.is_authenticated:
            return Response({"detail": "Authentication credentials were not provided."}, status=401)

        ser = CommentSerializer(data=request.data)
        if ser.is_valid():
            ser.save(user=request.user, journal=journal)
            return Response(ser.data, status=201)
        return Response(ser.errors, status=400)

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

class IsOwnerOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return getattr(obj, "user_id", None) == getattr(request.user, "id", None)

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.select_related("user", "journal").order_by("-created_at")
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        journal_id = self.kwargs.get("journal_pk")  
        if journal_id:
            journal = Journal.objects.get(pk=journal_id, user__isnull=False)
            serializer.save(user=self.request.user, journal=journal)
        else:
            serializer.save(user=self.request.user)