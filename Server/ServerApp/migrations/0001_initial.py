# Generated by Django 3.1.2 on 2022-02-11 17:25

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Device',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ip', models.CharField(max_length=20)),
                ('mac', models.CharField(max_length=20, null=True)),
                ('alias', models.CharField(max_length=20, null=True)),
                ('date_found', models.DateTimeField(default=datetime.datetime(2022, 2, 11, 17, 25, 54, 775724, tzinfo=utc))),
                ('last_seen', models.DateTimeField(default=datetime.datetime(2022, 2, 11, 17, 25, 54, 775724, tzinfo=utc))),
                ('mac_vendor', models.CharField(max_length=100, null=True)),
                ('open_ports', models.CharField(max_length=500, null=True)),
            ],
        ),
    ]
