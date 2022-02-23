# Generated by Django 3.1.2 on 2022-02-23 19:16

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('ServerApp', '0009_auto_20220223_1330'),
    ]

    operations = [
        migrations.RenameField(
            model_name='packet',
            old_name='upd_destination_port',
            new_name='udp_destination_port',
        ),
        migrations.RenameField(
            model_name='packet',
            old_name='upd_source_port',
            new_name='udp_source_port',
        ),
        migrations.AlterField(
            model_name='device',
            name='date_found',
            field=models.DateTimeField(default=datetime.datetime(2022, 2, 23, 19, 15, 57, 128850, tzinfo=utc)),
        ),
        migrations.AlterField(
            model_name='device',
            name='last_seen',
            field=models.DateTimeField(default=datetime.datetime(2022, 2, 23, 19, 15, 57, 128850, tzinfo=utc)),
        ),
        migrations.AlterField(
            model_name='packet',
            name='date_found',
            field=models.DateTimeField(default=datetime.datetime(2022, 2, 23, 19, 15, 57, 129850, tzinfo=utc)),
        ),
    ]
