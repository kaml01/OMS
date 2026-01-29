from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.generics import ListAPIView, RetrieveAPIView
from django.db.models import Q

from .models import Product, Party, PartyAddress, SyncLog, SyncSchedule
from .serializers import (
    ProductSerializer, PartySerializer, PartyListSerializer,
    PartyAddressSerializer, SyncLogSerializer, SyncScheduleSerializer,
    SyncResultSerializer
)
from .services import SyncService


# ============ Sync Operations ============

class SyncAllView(APIView):
    """Trigger manual sync of all data (Products, Parties, Addresses)"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            sync_service = SyncService(triggered_by='manual')
            result = sync_service.sync_all()
            
            return Response({
                'success': True,
                'message': 'Sync completed successfully',
                'data': result
            })
        except Exception as e:
            return Response({
                'success': False,
                'message': f'Sync failed: {str(e)}',
                'data': None
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SyncProductsView(APIView):
    """Trigger manual sync of products only"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            sync_service = SyncService(triggered_by='manual')
            result = sync_service.sync_products()
            
            return Response({
                'success': result['success'],
                'message': 'Products sync completed' if result['success'] else 'Products sync failed',
                'data': result
            })
        except Exception as e:
            return Response({
                'success': False,
                'message': f'Products sync failed: {str(e)}',
                'data': None
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SyncPartiesView(APIView):
    """Trigger manual sync of parties only"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            sync_service = SyncService(triggered_by='manual')
            result = sync_service.sync_parties()
            
            return Response({
                'success': result['success'],
                'message': 'Parties sync completed' if result['success'] else 'Parties sync failed',
                'data': result
            })
        except Exception as e:
            return Response({
                'success': False,
                'message': f'Parties sync failed: {str(e)}',
                'data': None
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SyncPartyAddressesView(APIView):
    """Trigger manual sync of party addresses only"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        try:
            sync_service = SyncService(triggered_by='manual')
            result = sync_service.sync_party_addresses()
            
            return Response({
                'success': result['success'],
                'message': 'Party addresses sync completed' if result['success'] else 'Party addresses sync failed',
                'data': result
            })
        except Exception as e:
            return Response({
                'success': False,
                'message': f'Party addresses sync failed: {str(e)}',
                'data': None
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ============ Products ============

class ProductListView(ListAPIView):
    """List all products with optional search/filter"""
    permission_classes = [IsAuthenticated]
    serializer_class = ProductSerializer
    
    def get_queryset(self):
        queryset = Product.objects.all()
        
        # Search by item_code or item_name
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(item_code__icontains=search) | Q(item_name__icontains=search)
            )
        
        # Filter by category
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category=category)
        
        # Filter by brand
        brand = self.request.query_params.get('brand', None)
        if brand:
            queryset = queryset.filter(brand__icontains=brand)
        
        # Exclude deleted
        exclude_deleted = self.request.query_params.get('exclude_deleted', 'true')
        if exclude_deleted.lower() == 'true':
            queryset = queryset.exclude(is_deleted='Y')
        
        return queryset


class ProductDetailView(RetrieveAPIView):
    """Get single product by ID or item_code"""
    permission_classes = [IsAuthenticated]
    serializer_class = ProductSerializer
    queryset = Product.objects.all()
    lookup_field = 'pk'


class ProductByCodeView(RetrieveAPIView):
    """Get product by item_code"""
    permission_classes = [IsAuthenticated]
    serializer_class = ProductSerializer
    queryset = Product.objects.all()
    lookup_field = 'item_code'


# ============ Parties ============

class PartyListView(ListAPIView):
    """List all parties with optional search/filter"""
    permission_classes = [IsAuthenticated]
    serializer_class = PartyListSerializer
    
    def get_queryset(self):
        queryset = Party.objects.all()
        
        # Search by card_code or card_name
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(
                Q(card_code__icontains=search) | Q(card_name__icontains=search)
            )
        
        # Filter by state
        state = self.request.query_params.get('state', None)
        if state:
            queryset = queryset.filter(state__icontains=state)
        
        # Filter by main_group
        main_group = self.request.query_params.get('main_group', None)
        if main_group:
            queryset = queryset.filter(main_group__icontains=main_group)
        
        # Filter by card_type
        card_type = self.request.query_params.get('card_type', None)
        if card_type:
            queryset = queryset.filter(card_type=card_type)
        
        return queryset


class PartyDetailView(RetrieveAPIView):
    """Get single party with addresses"""
    permission_classes = [IsAuthenticated]
    serializer_class = PartySerializer
    queryset = Party.objects.prefetch_related('addresses')
    lookup_field = 'pk'


class PartyByCodeView(RetrieveAPIView):
    """Get party by card_code with addresses"""
    permission_classes = [IsAuthenticated]
    serializer_class = PartySerializer
    queryset = Party.objects.prefetch_related('addresses')
    lookup_field = 'card_code'


# ============ Party Addresses ============

class PartyAddressListView(ListAPIView):
    """List all party addresses with optional filter"""
    permission_classes = [IsAuthenticated]
    serializer_class = PartyAddressSerializer
    
    def get_queryset(self):
        queryset = PartyAddress.objects.all()
        
        # Filter by card_code
        card_code = self.request.query_params.get('card_code', None)
        if card_code:
            queryset = queryset.filter(card_code=card_code)
        
        # Filter by address_type
        address_type = self.request.query_params.get('address_type', None)
        if address_type:
            queryset = queryset.filter(address_type=address_type)
        
        # Search by GST number
        gst = self.request.query_params.get('gst', None)
        if gst:
            queryset = queryset.filter(gst_number__icontains=gst)
        
        return queryset


# ============ Sync Logs ============

class SyncLogListView(ListAPIView):
    """List all sync logs"""
    permission_classes = [IsAuthenticated]
    serializer_class = SyncLogSerializer
    
    def get_queryset(self):
        queryset = SyncLog.objects.all()
        
        # Filter by sync_type
        sync_type = self.request.query_params.get('sync_type', None)
        if sync_type:
            queryset = queryset.filter(sync_type=sync_type)
        
        # Filter by status
        sync_status = self.request.query_params.get('status', None)
        if sync_status:
            queryset = queryset.filter(status=sync_status)
        
        # Limit results
        limit = self.request.query_params.get('limit', 50)
        try:
            limit = int(limit)
        except ValueError:
            limit = 50
        
        return queryset[:limit]


# ============ Schedule Management ============

class SyncScheduleListView(APIView):
    """List and create sync schedules"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        schedules = SyncSchedule.objects.all()
        serializer = SyncScheduleSerializer(schedules, many=True)
        return Response({
            'success': True,
            'data': serializer.data
        })
    
    def post(self, request):
        serializer = SyncScheduleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'message': 'Schedule created successfully',
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'success': False,
            'message': 'Failed to create schedule',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)


class SyncScheduleDetailView(APIView):
    """Get, update, or delete a sync schedule"""
    permission_classes = [IsAuthenticated]
    
    def get_object(self, pk):
        try:
            return SyncSchedule.objects.get(pk=pk)
        except SyncSchedule.DoesNotExist:
            return None
    
    def get(self, request, pk):
        schedule = self.get_object(pk)
        if not schedule:
            return Response({
                'success': False,
                'message': 'Schedule not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        serializer = SyncScheduleSerializer(schedule)
        return Response({
            'success': True,
            'data': serializer.data
        })
    
    def put(self, request, pk):
        schedule = self.get_object(pk)
        if not schedule:
            return Response({
                'success': False,
                'message': 'Schedule not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        serializer = SyncScheduleSerializer(schedule, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'success': True,
                'message': 'Schedule updated successfully',
                'data': serializer.data
            })
        
        return Response({
            'success': False,
            'message': 'Failed to update schedule',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        schedule = self.get_object(pk)
        if not schedule:
            return Response({
                'success': False,
                'message': 'Schedule not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        schedule.delete()
        return Response({
            'success': True,
            'message': 'Schedule deleted successfully'
        })


class ToggleScheduleView(APIView):
    """Activate or deactivate a schedule"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request, pk):
        try:
            schedule = SyncSchedule.objects.get(pk=pk)
        except SyncSchedule.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Schedule not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        schedule.is_active = not schedule.is_active
        schedule.save()
        
        status_text = 'activated' if schedule.is_active else 'deactivated'
        
        return Response({
            'success': True,
            'message': f'Schedule {status_text} successfully',
            'data': SyncScheduleSerializer(schedule).data
        })


# ============ Sync Status ============

class SyncStatusView(APIView):
    """Get current sync status and statistics"""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        # Get counts
        products_count = Product.objects.count()
        parties_count = Party.objects.count()
        addresses_count = PartyAddress.objects.count()
        
        # Get last sync info
        last_sync = SyncLog.objects.filter(status='SUCCESS').first()
        
        # Get active schedules
        active_schedules = SyncSchedule.objects.filter(is_active=True).count()
        
        return Response({
            'success': True,
            'data': {
                'counts': {
                    'products': products_count,
                    'parties': parties_count,
                    'addresses': addresses_count
                },
                'last_sync': SyncLogSerializer(last_sync).data if last_sync else None,
                'active_schedules': active_schedules
            }
        })
