

import django.db.models.deletion
from django.conf import settings

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='state',
            name='code',
            field=models.CharField(max_length=10, unique=True),
        ),
        migrations.RemoveField(
            model_name='user',
            name='company',
        ),
        migrations.AlterField(
            model_name='user',
            name='is_active',
            field=models.BooleanField(default=True),
        ),
        migrations.RemoveField(
            model_name='user',
            name='main_group',
        ),
        migrations.RemoveField(
            model_name='user',
            name='state',
        ),
        migrations.AddField(
            model_name='user',
            name='company',
            field=models.ManyToManyField(blank=True, related_name='users', to='users.company'),
        ),
        migrations.AddField(
            model_name='user',
            name='main_group',
            field=models.ManyToManyField(blank=True, related_name='users', to='users.maingroup'),
        ),
        migrations.AddField(
            model_name='user',
            name='state',
            field=models.ManyToManyField(blank=True, related_name='users', to='users.state'),
        ),

        migrations.CreateModel(
            name='UserPartyAssignment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('card_code', models.CharField(db_index=True, max_length=50)),
                ('assigned_at', models.DateTimeField(auto_now_add=True)),
                ('is_active', models.BooleanField(default=True)),
                ('assigned_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='assignments_made', to=settings.AUTH_USER_MODEL)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='party_assignments', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'user_party_assignments',
                'ordering': ['-assigned_at'],
                'unique_together': {('user', 'card_code')},
            },
        ),

  ]
