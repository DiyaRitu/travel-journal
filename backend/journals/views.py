from rest_framework import generics, permissions
from .models import Journal
from .serializers import JournalSerializer

# List & Create Journals (user-specific)
class JournalListCreateView(generics.ListCreateAPIView):
    serializer_class = JournalSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Journal.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

# Retrieve, Update, Delete a single journal
class JournalDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = JournalSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Journal.objects.filter(user=self.request.user)

# Public Journals (anyone can view)
class PublicJournalListView(generics.ListAPIView):
    serializer_class = JournalSerializer
    permission_classes = [permissions.AllowAny]
    queryset = Journal.objects.filter(privacy='public')
