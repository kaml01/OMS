from django.db import migrations


def convert_status_int_to_str(apps, schema_editor):
    """Convert integer status values to string equivalents."""
    schema_editor.execute("""
        ALTER TABLE orders ALTER COLUMN status TYPE varchar(20) USING
        CASE status
            WHEN 1 THEN 'submitted'
            WHEN 2 THEN 'pending_approval'
            WHEN 3 THEN 'approved'
            WHEN 4 THEN 'rejected'
            WHEN 5 THEN 'sap_created'
            ELSE 'submitted'
        END;
    """)


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0003_rename_base_price_orderitem_basic_price'),
    ]

    operations = [
        migrations.RunSQL(
            sql="""
                ALTER TABLE orders ALTER COLUMN status TYPE varchar(20) USING
                CASE status
                    WHEN 1 THEN 'submitted'
                    WHEN 2 THEN 'pending_approval'
                    WHEN 3 THEN 'approved'
                    WHEN 4 THEN 'rejected'
                    WHEN 5 THEN 'sap_created'
                    ELSE 'submitted'
                END;
            """,
            reverse_sql="""
                ALTER TABLE orders ALTER COLUMN status TYPE integer USING
                CASE status
                    WHEN 'submitted' THEN 1
                    WHEN 'pending_approval' THEN 2
                    WHEN 'approved' THEN 3
                    WHEN 'rejected' THEN 4
                    WHEN 'sap_created' THEN 5
                    ELSE 1
                END;
            """,
        ),
    ]
