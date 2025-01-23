from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User

from .models import Order, OrderItem, Product

def index(request):
    # Django represents each URL as a function on the backend.
    # Django expects the function to take in the request amd return a result
    user: User = request.user # We fetch the current user from the request
    context = { # We create a context dictionary so we can pass data to the HTML file
        "user": user
    }
    # `remder` is a Django function that sends a HTML file to the client, it can be given
    # context so Django's own tags know the backend data.
    return render(request, "store/index.html", context)

def products_index(request):
    user: User = request.user
    products = Product.objects.order_by("-name")
    context = {
        "products": products,
        "user": user
    }
    return render(request, "store/product_index.html", context)

def products_view(request, product_name):
    user: User = request.user
    # The product page requires data about a Product from, if there is no product we should return a 404
    product = get_object_or_404(Product, name=product_name)
    context = {
        "product": product,
        "user": user
    }
    return render(request, "store/product.html", context)


@login_required # This is a Dajngo decorator which when the user accesss this view Django will force them to login
def profile(request):
    # THe profile page requires access to all orders and products
    user: User = request.user
    products = Product.objects.order_by("-name")
    # We make sure to only get orders assigned to the current user
    orders = Order.objects.order_by("-name").filter(user=user)
    context = {
        "products": products,
        "orders": orders,
        "user": user
    }
    return render(request, "store/profile.html", context)