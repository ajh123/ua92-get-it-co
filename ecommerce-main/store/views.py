from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User

from .models import Order, OrderItem, Product

# Create your views here.
def index(request):
    user: User = request.user
    context = {
        "user": user
    }
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
    product = get_object_or_404(Product, name=product_name)
    context = {
        "product": product,
        "user": user
    }
    return render(request, "store/product.html", context)

@login_required
def profile(request):
    user: User = request.user
    orders = Order.objects.order_by("-name").filter(user=user)
    context = {
        "orders": orders,
        "user": user
    }
    return render(request, "store/profile.html", context)