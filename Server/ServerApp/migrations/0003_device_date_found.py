# Generated by Django 3.1.2 on 2022-01-27 20:17

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('ServerApp', '0002_auto_20220127_1454'),
    ]

    operations = [
        migrations.AddField(
            model_name='device',
            name='date_found',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]
