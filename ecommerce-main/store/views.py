from django.shortcuts import render, get_object_or_404

from .models import Order, OrderItem, Product

# Create your views here.
def index(request):
    return render(request, "store/index.html")

def products_index(request):
    products = Product.objects.order_by("-name")
    context = {"products": products}
    return render(request, "store/product_index.html", context)

def products_view(request, product_name):
    product = get_object_or_404(Product, name=product_name)
    context = {"product": product}
    return render(request, "store/product.html", context)

def profile(request):
    orders = Order.objects.order_by("-name")
    context = {"orders": orders}
    return render(request, "store/profile.html", context)