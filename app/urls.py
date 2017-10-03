# coding=utf-8

from .views import *
from django.conf.urls import url

__author__ = 'shade'


urlpatterns = [
    url(r'^$', IndexView.as_view(), name='index'),
    url(r'^download/(?P<id>[\d]+)', DownloadView.as_view(), name='download'),
    url(r'^upload/', UploadView.as_view(), name='upload'),

]