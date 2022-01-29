# Generated by Django 3.1.2 on 2022-01-29 16:19

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('ServerApp', '0003_device_date_found'),
    ]

    operations = [
        migrations.AddField(
            model_name='device',
            name='last_seen',
            field=models.DateTimeField(default=django.utils.timezone.now),
        ),
    ]