from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Company, MainGroup, State, UserRole


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'is_active']
    list_filter = ['is_active']
    search_fields = ['name']


@admin.register(MainGroup)
class MainGroupAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'is_active']
    list_filter = ['is_active']
    search_fields = ['name']


@admin.register(State)
class StateAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'code', 'is_active']
    list_filter = ['is_active']
    search_fields = ['name', 'code']


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['id', 'username', 'name', 'email', 'role', 'is_active']
    list_filter = ['is_active', 'role']
    search_fields = ['username', 'name', 'email', 'phone']
    ordering = ['-id']

    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal Info', {'fields': ('name', 'email', 'phone')}),
        ('Organization', {'fields': ('role',)}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password1', 'password2', 'name', 'email', 'role'),
        }),
    )

@admin.register(UserRole)
class RoleAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'display_name', 'is_active']
    search_fields = ['display_name']
