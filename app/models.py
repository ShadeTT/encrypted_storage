# coding=utf-8
import datetime

from django.contrib.auth.models import User
from django.db import models
from mptt.fields import TreeForeignKey
from mptt.models import MPTTModel

from common.utils import chunked_path

__author__ = 'shade'


class Folder(MPTTModel):

    class Meta:
        unique_together = (
            ('name', 'parent',)
        )

    name = models.TextField('Имя')
    parent = TreeForeignKey('self', null=True, blank=True, related_name='children', db_index=True)
    user = models.ForeignKey(User)

    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class UploadedFile(models.Model):

    folder = models.ForeignKey(Folder, null=True, blank=True)

    file_content = models.TextField('Файл')
    name = models.TextField(default='Без названия')
    description = models.TextField(null=True, blank=True)
    user = models.ForeignKey(User)

    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)