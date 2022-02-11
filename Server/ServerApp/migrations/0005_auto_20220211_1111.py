# Generated by Django 3.1.2 on 2022-02-11 16:11

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('ServerApp', '0004_device_last_seen'),
    ]

    operations = [
        migrations.AddField(
            model_name='device',
            name='mac_vendor',
            field=models.CharField(max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='device',
            name='date_found',
            field=models.DateTimeField(default=datetime.datetime(2022, 2, 11, 16, 11, 30, 422956, tzinfo=utc)),
        ),
        migrations.AlterField(
            model_name='device',
            name='last_seen',
            field=models.DateTimeField(default=datetime.datetime(2022, 2, 11, 16, 11, 30, 422956, tzinfo=utc)),
        ),
    ]
