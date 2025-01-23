from django.urls import path

from . import views

app_name = "st0re"
# We construct a list of all the views and what URL we want them to appear on
urlpatterns = [
    path("", views.index, name="index"),
    path("products/", views.products_index, name="products"),
    path("products/<str:product_name>/", views.products_view, name="products_view"), # We may also have placeholders for view paramaters
    path("profile/", views.profile, name="profile"),
]