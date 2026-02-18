import logging
from django.utils import timezone

from ..models import Product, Party, PartyAddress, SyncLog
from .connection import SAPConnection

logger = logging.getLogger(__name__)


class SyncService:
    def __init__(self, triggered_by='manual'):
        self.triggered_by = triggered_by
        self.connection = SAPConnection()
    
    def sync_all(self):
        log = SyncLog.objects.create(
            sync_type='ALL',
            status='STARTED',
            triggered_by=self.triggered_by
        )
        
        total_processed = 0
        total_created = 0
        total_updated = 0
        errors = []
        
        try:
            result = self.sync_products()
            total_processed += result['processed']
            total_created += result['created']
            total_updated += result['updated']
            if result.get('error'):
                errors.append(f"Products: {result['error']}")
            
            result = self.sync_parties()
            total_processed += result['processed']
            total_created += result['created']
            total_updated += result['updated']
            if result.get('error'):
                errors.append(f"Parties: {result['error']}")
            
            result = self.sync_party_addresses()
            total_processed += result['processed']
            total_created += result['created']
            total_updated += result['updated']
            if result.get('error'):
                errors.append(f"Party Addresses: {result['error']}")
            
            log.status = 'SUCCESS' if not errors else 'FAILED'
            log.records_processed = total_processed
            log.records_created = total_created
            log.records_updated = total_updated
            log.error_message = '\n'.join(errors) if errors else None
            log.completed_at = timezone.now()
            log.save()
            
            return {
                'success': not errors,
                'processed': total_processed,
                'created': total_created,
                'updated': total_updated,
                'errors': errors
            }
            
        except Exception as e:
            log.status = 'FAILED'
            log.error_message = str(e)
            log.completed_at = timezone.now()
            log.save()
            raise
    
    def sync_products(self):
        log = SyncLog.objects.create(
            sync_type='PRODUCT',
            status='STARTED',
            triggered_by=self.triggered_by
        )
        
        created_count = 0
        updated_count = 0
        processed_count = 0
        
        try:
            with self.connection as conn:
                query = SAPConnection.get_products_query()
                results = conn.execute_query(query)
                
                for row in results:
                    processed_count += 1
                    item_code = row.get('ItemCode')
                    category = row.get('Category')  # OIL, BEVERAGES, or MART
                    
                    if not item_code:
                        continue
                    
                    # Data to update (excluding lookup fields)
                    product_data = {
                        'item_name': row.get('ItemName'),
                        'sal_factor2': row.get('SalFactor2'),
                        'tax_rate': row.get('U_Rev_tax_Rate'),
                        'is_deleted': row.get('Deleted', 'N'),
                        'variety': row.get('U_Variety'),
                        'sal_pack_unit': row.get('SalPackUn'),
                        'brand': row.get('U_Brand'),
                    }
                    
                    # Lookup by BOTH item_code AND category
                    product, created = Product.objects.update_or_create(
                        item_code=item_code,
                        category=category,
                        defaults=product_data
                    )
                    
                    if created:
                        created_count += 1
                    else:
                        updated_count += 1
            
            log.status = 'SUCCESS'
            log.records_processed = processed_count
            log.records_created = created_count
            log.records_updated = updated_count
            log.completed_at = timezone.now()
            log.save()
            
            return {
                'success': True,
                'processed': processed_count,
                'created': created_count,
                'updated': updated_count
            }
            
        except Exception as e:
            log.status = 'FAILED'
            log.error_message = str(e)
            log.completed_at = timezone.now()
            log.save()
            
            return {
                'success': False,
                'processed': processed_count,
                'created': created_count,
                'updated': updated_count,
                'error': str(e)
            }
    
    def sync_parties(self):
        log = SyncLog.objects.create(
            sync_type='PARTY',
            status='STARTED',
            triggered_by=self.triggered_by
        )
        
        created_count = 0
        updated_count = 0
        processed_count = 0
        
        try:
            with self.connection as conn:
                query = SAPConnection.get_parties_query()
                results = conn.execute_query(query)
                
                for row in results:
                    processed_count += 1
                    card_code = row.get('CardCode')
                    
                    if not card_code:
                        continue
                    
                    party_data = {
                        'card_name': row.get('CardName'),
                        'address': row.get('Address'),
                        'state': row.get('State1'),
                        'main_group': row.get('U_Main_Group'),
                        'chain': row.get('U_Chain'),
                        'country': row.get('Country'),
                        'card_type': row.get('CardType', 'C'),
                    }
                    
                    party, created = Party.objects.update_or_create(
                        card_code=card_code,
                        defaults=party_data
                    )
                    
                    if created:
                        created_count += 1
                    else:
                        updated_count += 1
            
            log.status = 'SUCCESS'
            log.records_processed = processed_count
            log.records_created = created_count
            log.records_updated = updated_count
            log.completed_at = timezone.now()
            log.save()
            
            return {
                'success': True,
                'processed': processed_count,
                'created': created_count,
                'updated': updated_count
            }
            
        except Exception as e:
            log.status = 'FAILED'
            log.error_message = str(e)
            log.completed_at = timezone.now()
            log.save()
            
            return {
                'success': False,
                'processed': processed_count,
                'created': created_count,
                'updated': updated_count,
                'error': str(e)
            }
    
    def sync_party_addresses(self):
        log = SyncLog.objects.create(
            sync_type='PARTY_ADDRESS',
            status='STARTED',
            triggered_by=self.triggered_by
        )
        
        created_count = 0
        updated_count = 0
        processed_count = 0
        
        try:
            with self.connection as conn:
                query = SAPConnection.get_party_addresses_query()
                results = conn.execute_query(query)
                
                for row in results:
                    processed_count += 1
                    card_code = row.get('CardCode')
                    address_id = row.get('Address')
                    
                    if not card_code:
                        continue
                    
                    party = Party.objects.filter(card_code=card_code).first()
                    
                    address_data = {
                        'party': party,
                        'address_type': row.get('AdresType'),
                        'gst_number': row.get('GSTRegnNo'),
                        'full_address': row.get('MainAddress', '').strip(),
                    }
                    
                    party_address, created = PartyAddress.objects.update_or_create(
                        card_code=card_code,
                        address_id=address_id,
                        defaults=address_data
                    )
                    
                    if created:
                        created_count += 1
                    else:
                        updated_count += 1
            
            log.status = 'SUCCESS'
            log.records_processed = processed_count
            log.records_created = created_count
            log.records_updated = updated_count
            log.completed_at = timezone.now()
            log.save()
            
            return {
                'success': True,
                'processed': processed_count,
                'created': created_count,
                'updated': updated_count
            }
            
        except Exception as e:
            log.status = 'FAILED'
            log.error_message = str(e)
            log.completed_at = timezone.now()
            log.save()
            
            return {
                'success': False,
                'processed': processed_count,
                'created': created_count,
                'updated': updated_count,
                'error': str(e)
            }