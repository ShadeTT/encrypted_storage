# -*- coding: utf-8 -*-
# Generated by Django 1.11.5 on 2017-10-03 17:38
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0004_uploadedfile_name'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='uploadedfile',
            name='f',
        ),
        migrations.AddField(
            model_name='uploadedfile',
            name='file_content',
            field=models.BinaryField(default=None, verbose_name='Файл'),
            preserve_default=False,
        ),
    ]
