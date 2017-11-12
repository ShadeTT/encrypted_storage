# coding=utf-8
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.http.response import HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404
from django.urls.base import reverse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.generic.base import TemplateView, View
from django.views.generic.detail import BaseDetailView
from django.views.generic.list import ListView

from app.models import UploadedFile, Folder
from common.views import AjaxableCreateMixin, JSONResponseMixin

__author__ = 'shade'


class IndexView(TemplateView):
    template_name = 'index.html'

    @method_decorator(ensure_csrf_cookie)
    @method_decorator(login_required(login_url='/admin/'))
    def dispatch(self, request, *args, **kwargs):
        return super(IndexView, self).dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):

        context = super(IndexView, self).get_context_data(**kwargs)

        if kwargs.get('parent_id'):
            folder = get_object_or_404(Folder, id=kwargs.get('parent_id'))
            context['ancestors'] = folder.get_ancestors(include_self=True)

            context['folder'] = folder

        context['folders'] = Folder.objects.all()

        return context


@login_required
def content_list(request, parent_id=None):

    folders = Folder.objects.filter(parent_id=parent_id).select_related('user')
    files = UploadedFile.objects.filter(folder_id=parent_id).select_related('user')

    data = {
        'folders': [
            {
                'name': f.name,
                'id': f.id,
                'user': f.user.username,
                'created': f.created,
                'url': reverse('app:index', kwargs={'parent_id': f.id})
            } for f in folders
            ],
        'files': [
            {
                'name': f.name,
                'id': f.id,
                'user': f.user.username,
                'created': f.created,
                'url': reverse('app:download', kwargs={'pk': f.id})
            } for f in files
            ]
    }

    return JsonResponse(data)


@login_required
def create_folder(request, parent_id=None):

    Folder.objects.create(name=request.POST.get('name'), parent_id=parent_id, user=request.user)

    return JsonResponse({'created': 'ok'})


class UploadView(AjaxableCreateMixin):

    model = UploadedFile

    fields = ('name', 'description', 'user', 'file_content', 'folder')

    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(UploadView, self).dispatch(request, *args, **kwargs)

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

    @method_decorator(login_required)
    def dispatch(self, request, *args, **kwargs):
        return super(DownloadView, self).dispatch(request, *args, **kwargs)

    def render_to_response(self, context, **response_kwargs):
        return self.render_to_json_response(context, **response_kwargs)

    def get_data(self, context):
        return {'file_content': context['uploadedfile'].file_content, 'name': context['uploadedfile'].name}


