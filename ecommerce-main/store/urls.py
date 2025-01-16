from django.urls import path

from . import views

app_name = "polls"
urlpatterns = [
    path("", views.index, name="index"),
    path("products/", views.products_index, name="products"),
    path("products/<str:product_name>/", views.products_view, name="products_view"),
    path("profile/", views.profile, name="profile"),
]