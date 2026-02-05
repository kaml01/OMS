<<<<<<< HEAD
from django.shortcuts import render

# Create your views here.
=======
import re
from django.shortcuts import render
from .serializers import PartiesSerializer, DispatchLocationSerializer, PartyAddressSerializer,ProductSerializer,CreateOrderSerializer
from .models import Parties, DispatchLocation, UserPartyAssignment, PartyAddress,ProductDetails,Order,OrderItem
from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime

def extract_type_from_name(item_name):
    """Extract size/type like '1 LTR', '500 ML', '5 KG' from item name"""
    if not item_name:
        return None
    
    # More flexible pattern - handles various formats
    # Matches: 1 LTR, 1LTR, 1 Ltr, 1L, 500 ML, 500ML, 5 KG, 5KG, 200 GM, 200GM, etc.
    pattern = r'(\d+(?:\.\d+)?\s*(?:LTR|LITRE|LITER|L|ML|KG|KGS|GM|GMS|GRAM|G|PCS|PC|POUCH|TIN|JAR|BTL|BTL|CAN|BOTTLE|PACK|PKT|BOX)S?)\b'
    
    match = re.search(pattern, item_name.upper())
    
    if match:
        # Normalize the result (e.g., "1LTR" -> "1 LTR")
        result = match.group(1).strip()
        # Add space between number and unit if missing
        result = re.sub(r'(\d)([A-Z])', r'\1 \2', result)
        return result
    return None

class PartyView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        user_id = request.user.id if request.user.is_authenticated else 2

        assigned_card_codes = UserPartyAssignment.objects.filter(
            user_id=user_id,
            is_active=True
        ).values_list('card_code', flat=True)

        parties = Parties.objects.filter(
            card_code__in=assigned_card_codes
        ).order_by('card_name')

        data = [
            {
                'value': p.card_code,
                'label': f"{p.card_name} ({p.card_code})"
            }
            for p in parties
        ]

        return Response(data)
    
class DispatchLocationListView(ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = DispatchLocationSerializer
    queryset = DispatchLocation.objects.all().order_by('name')

class PartyAddressesView(APIView):

    permission_classes = [AllowAny]

    def get(self, request):
        card_code = request.query_params.get('card_code')

        if not card_code:
            return Response({'error': 'card_code is required'}, status=400)

        bill_addresses = PartyAddress.objects.filter(
            card_code=card_code,
            address_type='B'
        ).order_by('address_id')  # FIXED

        ship_addresses = PartyAddress.objects.filter(
            card_code=card_code,
            address_type='S'
        ).order_by('address_id')  # FIXED

        if not bill_addresses.exists() and not ship_addresses.exists():
            try:
                party = Parties.objects.get(card_code=card_code)
                fallback_address = {
                    'id': 0,
                    'address_id': party.card_name,
                    'full_address': party.address,
                    'gst_number': None
                }
                return Response({
                    'bill_to': [fallback_address],
                    'ship_to': [fallback_address],
                    'is_fallback': True
                })
            except Parties.DoesNotExist:
                return Response({
                    'bill_to': [],
                    'ship_to': [],
                    'is_fallback': False
                })

        bill_data = PartyAddressSerializer(bill_addresses, many=True).data
        ship_data = PartyAddressSerializer(ship_addresses, many=True).data

        if not bill_data:
            try:
                party = Parties.objects.get(card_code=card_code)
                bill_data = [{
                    'id': 0,
                    'address_id': party.card_name,
                    'full_address': party.address,
                    'gst_number': None
                }]
            except Parties.DoesNotExist:
                pass

        if not ship_data:
            try:
                party = Parties.objects.get(card_code=card_code)
                ship_data = [{
                    'id': 0,
                    'address_id': party.card_name,
                    'full_address': party.address,
                    'gst_number': None
                }]
            except Parties.DoesNotExist:
                pass

        return Response({
            'bill_to': bill_data,
            'ship_to': ship_data,
            'is_fallback': False
        })

    permission_classes = [AllowAny]

    def get(self, request):
        card_code = request.query_params.get('card_code')

        if not card_code:
            return Response({'error': 'card_code is required'}, status=400)

        bill_addresses = PartyAddress.objects.filter(
            card_code=card_code,
            address_type='B'
        ).order_by('address_id')

        ship_addresses = PartyAddress.objects.filter(
            card_code=card_code,
            address_type='S'
        ).order_by('address_id')

        if not bill_addresses.exists() and not ship_addresses.exists():
            try:
                party = Parties.objects.get(card_code=card_code)
                fallback_address = {
                    'id': 0,
                    'card_name': party.card_name,
                    'address': party.address,
                    'gst_number': None
                }
                return Response({
                    'bill_to': [fallback_address],
                    'ship_to': [fallback_address],
                    'is_fallback': True
                })
            except Parties.DoesNotExist:
                return Response({
                    'bill_to': [],
                    'ship_to': [],
                    'is_fallback': False
                })

        bill_data = PartyAddressSerializer(bill_addresses, many=True).data
        ship_data = PartyAddressSerializer(ship_addresses, many=True).data

        if not bill_data:
            try:
                party = Parties.objects.get(card_code=card_code)
                bill_data = [{
                    'id': 0,
                    'card_name': party.card_name,
                    'address': party.address,
                    'gst_number': None
                }]
            except Parties.DoesNotExist:
                pass

        if not ship_data:
            try:
                party = Parties.objects.get(card_code=card_code)
                ship_data = [{
                    'id': 0,
                    'card_name': party.card_name,
                    'address': party.address,
                    'gst_number': None
                }]
            except Parties.DoesNotExist:
                pass

        return Response({
            'bill_to': bill_data,
            'ship_to': ship_data,
            'is_fallback': False
        })

class ProductFiltersView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        category = request.query_params.get('category')
        brand = request.query_params.get('brand')
        variety = request.query_params.get('variety')

        # Always get all categories
        categories = ProductDetails.objects.exclude(
            category__isnull=True
        ).exclude(
            category=''
        ).values_list('category', flat=True).distinct().order_by('category')

        # Get brands - only if category is provided
        brands = []
        if category:
            brands = ProductDetails.objects.filter(
                category=category
            ).exclude(
                brand__isnull=True
            ).exclude(
                brand=''
            ).values_list('brand', flat=True).distinct().order_by('brand')

        # Get varieties - only if category AND brand are provided
        varieties = []
        if category and brand:
            varieties = ProductDetails.objects.filter(
                category=category,
                brand=brand
            ).exclude(
                variety__isnull=True
            ).exclude(
                variety=''
            ).values_list('variety', flat=True).distinct().order_by('variety')
        
        # Get types - ONLY if category, brand, AND variety are provided
        types = []
        if category and brand and variety:
            types_query = ProductDetails.objects.filter(
                category=category,
                brand=brand,
                variety=variety
            )
            
            item_names = types_query.values_list('item_name', flat=True)
            types_set = set()
            has_others = False
            
            for name in item_names:
                item_type = extract_type_from_name(name)
                if item_type:
                    types_set.add(item_type)
                else:
                    has_others = True
            
            types = sorted(list(types_set))
            
            if has_others:
                types.append('Others')

        return Response({
            'categories': [{'label': c, 'value': c} for c in categories],
            'brands': [{'label': b, 'value': b} for b in brands],
            'varieties': [{'label': v, 'value': v} for v in varieties],
            'types': [{'label': t, 'value': t} for t in types]
        })

class ProductListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        category = request.query_params.get('category')
        brand = request.query_params.get('brand')
        variety = request.query_params.get('variety')
        item_type = request.query_params.get('type')

        products = ProductDetails.objects.all()

        if category:
            products = products.filter(category=category)
        if brand:
            products = products.filter(brand=brand)
        if variety:
            products = products.filter(variety=variety)
        if item_type:
            products = products.filter(item_name__icontains=item_type)

        serializer = ProductSerializer(products.order_by('item_name'), many=True)
        return Response(serializer.data)

class CreateOrderView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = CreateOrderSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data
        items = data.pop('items', [])
        
        if not items:
            return Response({'error': 'At least one item is required'}, status=status.HTTP_400_BAD_REQUEST)
            
        # Generate order number: ORD-YYYYMMDD-XXXX
        today = datetime.now().strftime('%Y%m%d')
        last_order = Order.objects.filter(
            order_number__startswith=f'ORD-{today}'
        ).order_by('-order_number').first()

        if last_order:
            last_num = int(last_order.order_number.split('-')[-1])
            new_num = last_num + 1
        else:
            new_num = 1

        order_number = f'ORD-{today}-{new_num:04d}'

        # Calculate total
        total_amount = sum(float(item.get('total', 0)) for item in items)

        # Create order
        order = Order.objects.create(
            order_number=order_number,
            card_code=data.get('card_code', ''),
            card_name=data.get('card_name', ''),
            bill_to_id=data.get('bill_to_id'),
            bill_to_address=data.get('bill_to_address', ''),
            ship_to_id=data.get('ship_to_id'),
            ship_to_address=data.get('ship_to_address', ''),
            dispatch_from_id=data.get('dispatch_from_id'),
            dispatch_from_name=data.get('dispatch_from_name', ''),
            company=data.get('company', ''),
            po_number=data.get('po_number', ''),
            total_amount=total_amount,
            status='submitted',
            created_by=request.user.id if request.user.is_authenticated else 2,
        )
        
        # Create order items
        for item in items:
            OrderItem.objects.create(
                order=order,
                item_code=item.get('item_code', ''),
                item_name=item.get('item_name', ''),
                category=item.get('category', ''),
                brand=item.get('brand', ''),
                variety=item.get('variety', ''),
                item_type=item.get('item_type', ''),
                qty=item.get('qty', 0),
                pcs=item.get('pcs', 0),
                boxes=item.get('boxes', 0),
                ltrs=item.get('ltrs', 0),
                market_price=item.get('market_price', 0),
                total=item.get('total', 0),
                tax_rate=item.get('tax_rate', 0),
            )
        
        # Return created order
        # result = CreateOrderSerializer(order).data
        return Response({
    'id': order.id,
    'order_number': order.order_number,
    'total_amount': str(order.total_amount),
    'status': order.status,
    'message': 'Order created successfully'
}, status=status.HTTP_201_CREATED)
>>>>>>> 3ea987458ba0e0e91d2eb924d913520825684790
