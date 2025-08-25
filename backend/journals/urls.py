from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import JournalViewSet, TagViewSet

# Use router for journals + tags
router = DefaultRouter()
router.register(r"journals", JournalViewSet, basename="journal")
router.register(r"tags", TagViewSet, basename="tag")

urlpatterns = [
    path("", include(router.urls)),
]
