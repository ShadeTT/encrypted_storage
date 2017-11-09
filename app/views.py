# coding=utf-8
from django.contrib.auth.models import User
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.generic.base import TemplateView
from django.views.generic.detail import DetailView
from django.views.generic.edit import CreateView
from django.views.generic.list import ListView

from app.models import UploadedFile
from common.views import AjaxableCreateMixin, JSONResponseMixin
from django.views.generic.detail import BaseDetailView

__author__ = 'shade'


class IndexView(ListView):

    model = UploadedFile
    template_name = 'index.html'

    @method_decorator(ensure_csrf_cookie)
    def dispatch(self, request, *args, **kwargs):
        return super(IndexView, self).dispatch(request, *args, **kwargs)


class UploadView(AjaxableCreateMixin):

    model = UploadedFile

    fields = ('name', 'description', 'user', 'file_content',)

    def get_form_kwargs(self):

        kwargs = super(AjaxableCreateMixin, self).get_form_kwargs()
        data = self.request.POST.copy()
        data.update({'user': User.objects.last().id})
        data.update({'file_content': data.pop('file_content')[0]})
        kwargs['data'] = data

        return kwargs


class DownloadView(JSONResponseMixin, BaseDetailView):

    pk_url_kwarg = 'pk'
    model = UploadedFile

    def render_to_response(self, context, **response_kwargs):
        return self.render_to_json_response(context, **response_kwargs)

    def get_data(self, context):

        return {'file_content': context['uploadedfile'].file_content, 'name': context['uploadedfile'].name}


