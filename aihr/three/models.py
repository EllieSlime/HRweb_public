from django.db import models

# Create your models here.
class AdminUser(models.Model):
    username = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=100)  # для прототипа в чистом виде

    def __str__(self):
        return self.username