from rest_framework import serializers
from .models import Product, Party, PartyAddress, SyncLog, SyncSchedule


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            'id', 'item_code', 'item_name', 'category', 'sal_factor2',
            'tax_rate', 'is_deleted', 'variety', 'sal_pack_unit', 'brand',
            'synced_at', 'created_at'
        ]


class PartyAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = PartyAddress
        fields = [
            'id', 'card_code', 'address_id', 'address_type',
            'gst_number', 'full_address', 'synced_at'
        ]


class PartySerializer(serializers.ModelSerializer):
    addresses = PartyAddressSerializer(many=True, read_only=True)
    
    class Meta:
        model = Party
        fields = [
            'id', 'card_code', 'card_name', 'address', 'state',
            'main_group', 'chain', 'country', 'card_type',
            'synced_at', 'addresses'
        ]


class PartyListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for listing parties without addresses"""
    # addresses = PartyAddressSerializer(many=True, read_only=True)
    class Meta:
        model = Party
        fields = [
            'id', 'card_code', 'card_name', 'state',
            'main_group', 'card_type', 'synced_at'
        ]


class SyncLogSerializer(serializers.ModelSerializer):
    duration = serializers.SerializerMethodField()
    
    class Meta:
        model = SyncLog
        fields = [
            'id', 'sync_type', 'status', 'records_processed',
            'records_created', 'records_updated', 'error_message',
            'started_at', 'completed_at', 'triggered_by', 'duration'
        ]
    
    def get_duration(self, obj):
        if obj.completed_at and obj.started_at:
            delta = obj.completed_at - obj.started_at
            return delta.total_seconds()
        return None


class SyncScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = SyncSchedule
        fields = [
            'id', 'name', 'sync_type', 'frequency', 'custom_interval_minutes',
            'hour', 'is_active', 'last_run', 'next_run', 'created_at', 'updated_at'
        ]


class SyncResultSerializer(serializers.Serializer):
    """Serializer for sync operation results"""
    success = serializers.BooleanField()
    processed = serializers.IntegerField()
    created = serializers.IntegerField()
    updated = serializers.IntegerField()
    errors = serializers.ListField(child=serializers.CharField(), required=False)
    message = serializers.CharField(required=False)
