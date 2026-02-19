from rest_framework import serializers
from .models import Parties,DispatchLocation,PartyAddress,ProductDetails,OrderItem,Branches,Dispatch


class  DispatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dispatch
        fields = ['id','dispatch_from', 'code', 'is_active']

class PartiesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Parties
        fields = ['card_code','card_name']

class DispatchLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = DispatchLocation
        fields = ['name', 'code']

class PartyAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = PartyAddress
        fields = ['id','full_address', 'gst_number','address_type','address_name']
        
class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductDetails
        fields = ['id', 'item_code', 'item_name', 'category', 'brand', 'variety', 'sal_factor2', 'tax_rate', 'sal_pack_unit']

class CreateOrderSerializer(serializers.Serializer):
    card_code = serializers.CharField(max_length=100)
    card_name = serializers.CharField(max_length=255, required=False, allow_blank=True)
    bill_to_id = serializers.IntegerField(required=False, default=0)
    bill_to_address = serializers.CharField(required=False, allow_blank=True, default='')
    ship_to_id = serializers.IntegerField(required=False, default=0)
    ship_to_address = serializers.CharField(required=False, allow_blank=True, default='')
    dispatch_from_id = serializers.IntegerField(required=False, default=0)
    dispatch_from_name = serializers.CharField(required=False, allow_blank=True, default='')
    company = serializers.CharField(required=False, allow_blank=True, default='')
    po_number = serializers.CharField(required=False, allow_blank=True, default='')
    items = serializers.ListField(child=serializers.DictField())
    basic_price = serializers.DecimalField(max_digits=10, decimal_places=2, default=0)


class BranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Branches
        fields = ['bpl_id', 'bpl_name', 'category']

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = "__all__"
    
