from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.

class Company(models.Model):
    name = models.CharField(max_length= 100,unique = True)
    is_active = models.BooleanField(default = True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta: 
        verbose_name_plural = "Companies"
    
    def __str__(self):
        return self.name

class MainGroup(models.Model):
    name = models.CharField(max_length= 35 ,unique = True)
    is_active = models.BooleanField(default = True)
    created_at = models.DateTimeField(auto_now_add = True)
    
    class Meta:
        verbose_name = "Main Group"
        verbose_name_plural = "Main Groups"

    def __str__(self):
        return self.name

class State(models.Model):
    name = models.CharField(max_length= 20,unique = True)
    code = models.CharField(max_length = 10,unique = True)
    is_active = models.BooleanField(default=True) 

    class Meta:
        verbose_name = "State"
        verbose_name_plural = "States"

    def __str__(self):
        return self.name    

class User(AbstractUser):
    first_name = None
    last_name = None

    name = models.CharField(max_length = 150)
    email = models.EmailField(max_length = 15,blank = True,null = True)
    phone = models.CharField(max_length = 15, blank = True, null= True)
    role = models.CharField(max_length = 15, blank = True,null = True)
    
    # company = models.ForeignKey(
    #     Company, 
    #     on_delete = models.SET_NULL,
    #     null = True,
    #     blank = True,
    #     related_name = 'users'
    # )

    # main_group = models.ForeignKey(
    #     MainGroup,
    #     on_delete= models.SET_NULL,
    #     null = True,
    #     blank = True,
    #     related_name = 'users'
    # )

    # state = models.ForeignKey(
    #     State,
    #     on_delete = models.SET_NULL,
    #     null = True,
    #     blank = True,
    #     related_name = 'users'
    # )

    # created_at = models.DateTimeField(auto_now_add=True)
    # updated_at = models.DateTimeField(auto_now=True)

    # def __str__(self):
    #     return f"{self.name} ({self.username})"

    company = models.ManyToManyField(Company, blank=True, related_name='users')
    main_group = models.ManyToManyField(MainGroup, blank=True, related_name='users')
    state = models.ManyToManyField(State, blank=True, related_name='users')
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.username

    
    