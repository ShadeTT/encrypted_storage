# coding=utf-8

from .views import *
from django.conf.urls import url

__author__ = 'shade'


urlpatterns = [
    url(r'^(?:(?P<parent_id>[\d]+)/)?$', IndexView.as_view(), name='index'),
    url(r'^download/(?P<pk>[\d]+)', DownloadView.as_view(), name='download'),
    url(r'^upload/', UploadView.as_view(), name='upload'),
    url(r'^content_list/(?:(?P<parent_id>[\d]+)/)?', content_list, name='content_list'),
    url(r'^create_folder/(?:(?P<parent_id>[\d]+)/)?', create_folder, name='create_folder'),
]