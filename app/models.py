# coding=utf-8
import datetime

from django.contrib.auth.models import User
from django.db import models

from common.utils import chunked_path

__author__ = 'shade'


class UploadedFile(models.Model):

    file_content = models.TextField('Файл')
    name = models.CharField(max_length=300, default='Без названия')
    description = models.CharField(max_length=300, null=True, blank=True)
    user = models.ForeignKey(User)

    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

