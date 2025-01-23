# Django has a built-in frontend to manage the database. Using `admin.site.register` will allow the chosen model to appear im
# Django's frontent.

from django.contrib import admin

from .models import Order, OrderItem, Product

admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(Product)