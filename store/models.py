from django.db import models
from django.contrib.auth.models import User

# Model is a Django class to repsresmt a table in the database
# Django have different fields to represent each colloumn in the table, each feild has their own type and properties

class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField()
    image = models.ImageField(upload_to='product_images/')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class Order(models.Model):
    name = models.CharField(max_length=255)
    # A ManyToMany feild is used because and order may have many products, and products may be assined to many orders.
    # `through='OrderItem'` means the object that is linking the Product to the Order is and OrderItem, OrderItem is like
    # the reason why the link exists.
    products = models.ManyToManyField(Product, through='OrderItem')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Order {self.name}"

    def total_price(self):
        # We use sum and a for loop to iterate through all the items in the order and sum up the total price
        return sum(item.product.price * item.quantity for item in self.orderitem_set.all())

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"