import pymssql
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


class SAPConnection:
    def __init__(self):
        self.host = getattr(settings, 'SAP_DB_HOST', '103.89.45.75')
        self.database = getattr(settings, 'SAP_DB_NAME', 'Jivo_All_Branches_Live')
        self.username = getattr(settings, 'SAP_DB_USER', 'ab')
        self.password = getattr(settings, 'SAP_DB_PASSWORD', 'Jivo@!@#$')
        self.connection = None
        self.cursor = None
    
    def connect(self):
        try:
            self.connection = pymssql.connect(
                server=self.host,
                user=self.username,
                password=self.password,
                database=self.database,
                timeout=60,
                login_timeout=30
            )
            self.cursor = self.connection.cursor(as_dict=True)
            return True
        except Exception as e:
            raise ConnectionError(f"SAP connection failed: {str(e)}")
    
    def disconnect(self):
        if self.cursor:
            self.cursor.close()
        if self.connection:
            self.connection.close()
    
    def execute_query(self, query):
        if not self.connection:
            self.connect()
        self.cursor.execute(query)
        return self.cursor.fetchall()
    
    def __enter__(self):
        self.connect()
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        self.disconnect()
    
    @staticmethod
    def get_products_query():
        return """
            SELECT ItemCode, ItemName, Category, SalFactor2, U_Rev_tax_Rate, Deleted, U_Variety, SalPackUn, U_Brand
            FROM OPENQUERY(HANADB112, 'SELECT "ItemCode", "ItemName", ''OIL'' AS "Category", "SalFactor2", "U_Rev_tax_Rate", "Deleted", "U_Variety", "SalPackUn", "U_Brand" 
            FROM "JIVO_OIL_HANADB"."OITM" 
            WHERE "ItemCode" LIKE ''FG%'' OR "ItemCode" LIKE ''SCH%'' OR "ItemCode" LIKE ''RM%'' OR "ItemCode" LIKE ''PM%'' ')
            UNION ALL 
            SELECT ItemCode, ItemName, Category, SalFactor2, U_Rev_tax_Rate, Deleted, U_Variety, SalPackUn, U_Brand
            FROM OPENQUERY(HANADB112, 'SELECT "ItemCode", "ItemName", ''BEVERAGES'' AS "Category", "SalFactor2", "U_Rev_tax_Rate", "Deleted", "U_Variety", "SalPackUn", "U_Brand" 
            FROM "JIVO_BEVERAGES_HANADB"."OITM" 
            WHERE "ItemCode" LIKE ''FG%'' OR "ItemCode" LIKE ''SCH%'' OR "ItemCode" LIKE ''RM%'' OR "ItemCode" LIKE ''PM%'' ')
            UNION ALL
            SELECT ItemCode, ItemName, Category, SalFactor2, U_Rev_tax_Rate, Deleted, U_Variety, SalPackUn, U_Brand
            FROM OPENQUERY(HANADB112, 'SELECT "ItemCode", "ItemName", ''MART'' AS "Category", "SalFactor2", "U_Rev_tax_Rate", "Deleted", "U_Variety", "SalPackUn", "U_Brand" 
            FROM "JIVO_MART_HANADB"."OITM" 
            WHERE "ItemCode" LIKE ''FG%'' OR "ItemCode" LIKE ''SCH%'' OR "ItemCode" LIKE ''RM%'' OR "ItemCode" LIKE ''PM%'' ')
        """
    
    @staticmethod
    def get_parties_query():
        return """
            SELECT CardCode, CardName, Address, State1, U_Main_Group, U_Chain, Country, CardType 
            FROM OPENQUERY(HANADB112, 'SELECT "CardCode", "CardName", "Address", "State1", "U_Main_Group", "U_Chain", "Country", "CardType" 
            FROM "JIVO_OIL_HANADB"."OCRD" 
            WHERE "CardType"=''C'' ')
        """
    
    @staticmethod
    def get_party_addresses_query():
        return """
            SELECT CardCode, Address, AdresType, GSTRegnNo,
            CONCAT(ISNULL(Address2,''), ' ', ISNULL(Address3,''), ' ', ISNULL(Street,''), ' ', ISNULL(Block,''), ' ', ISNULL(City,''), ' ',
            ISNULL(State,''), ' ', ISNULL(Country,''), ' ', ISNULL(ZipCode,'')) AS MainAddress 
            FROM OPENQUERY(HANADB112, 'SELECT "CardCode", "Address", "AdresType", "GSTRegnNo", "Address2", "Address3", "Street", "Block", "City", "State", "Country", "ZipCode" 
            FROM "JIVO_OIL_HANADB"."CRD1"')
        """