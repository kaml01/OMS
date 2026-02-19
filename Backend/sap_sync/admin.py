from django.contrib import admin
from .models import Product, Party, PartyAddress, SyncLog, SyncSchedule


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['item_code', 'item_name', 'category', 'brand', 'is_deleted', 'synced_at']
    list_filter = ['category', 'brand', 'is_deleted']
    search_fields = ['item_code', 'item_name', 'brand']
    readonly_fields = ['synced_at', 'created_at']


@admin.register(Party)
class PartyAdmin(admin.ModelAdmin):
    list_display = ['card_code', 'card_name', 'state', 'main_group', 'card_type', 'synced_at']
    list_filter = ['card_type', 'state', 'main_group']
    search_fields = ['card_code', 'card_name']
    readonly_fields = ['synced_at']


@admin.register(PartyAddress)
class PartyAddressAdmin(admin.ModelAdmin):
    list_display = ['card_code', 'address_id', 'address_type', 'gst_number', 'synced_at']
    list_filter = ['address_type']
    search_fields = ['card_code', 'gst_number', 'full_address']
    readonly_fields = ['synced_at']


@admin.register(SyncLog)
class SyncLogAdmin(admin.ModelAdmin):
    list_display = ['sync_type', 'status', 'records_processed', 'records_created', 'records_updated', 'triggered_by', 'started_at', 'completed_at']
    list_filter = ['sync_type', 'status', 'triggered_by']
    readonly_fields = ['sync_type', 'status', 'records_processed', 'records_created', 'records_updated', 'error_message', 'started_at', 'completed_at', 'triggered_by']
    ordering = ['-started_at']


@admin.register(SyncSchedule)
class SyncScheduleAdmin(admin.ModelAdmin):
    list_display = ['name', 'sync_type', 'frequency', 'is_active', 'last_run', 'next_run']
    list_filter = ['sync_type', 'frequency', 'is_active']
    list_editable = ['is_active']
    readonly_fields = ['last_run', 'next_run', 'created_at', 'updated_at']
