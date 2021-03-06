# Generated by Django 3.1.2 on 2022-02-23 18:09

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('ServerApp', '0006_auto_20220223_1306'),
    ]

    operations = [
        migrations.AddField(
            model_name='packet',
            name='icmp_packet_type',
            field=models.CharField(blank=True, default=None, max_length=20, null=True),
        ),
        migrations.AlterField(
            model_name='device',
            name='date_found',
            field=models.DateTimeField(default=datetime.datetime(2022, 2, 23, 18, 9, 59, 406839, tzinfo=utc)),
        ),
        migrations.AlterField(
            model_name='device',
            name='last_seen',
            field=models.DateTimeField(default=datetime.datetime(2022, 2, 23, 18, 9, 59, 406839, tzinfo=utc)),
        ),
        migrations.AlterField(
            model_name='packet',
            name='date_found',
            field=models.DateTimeField(default=datetime.datetime(2022, 2, 23, 18, 9, 59, 408838, tzinfo=utc)),
        ),
    ]
