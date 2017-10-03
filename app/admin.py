# coding=utf-8

from django.contrib import admin

from app.models import UploadedFile

__author__ = 'shade'


@admin.register(UploadedFile)
class UploadedFileAdmin(admin.ModelAdmin):

    pass
