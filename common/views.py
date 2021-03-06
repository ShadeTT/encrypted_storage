# coding=utf-8
import json

from django.http.response import JsonResponse
from django.views.generic.edit import CreateView
from django.http import JsonResponse

__author__ = 'shade'


class AjaxableCreateMixin(CreateView):

    def form_invalid(self, form):
        return JsonResponse(form.errors, status=400)

    def form_valid(self, form):
        super(AjaxableCreateMixin, self).form_valid(form)
        return JsonResponse({'created': True})

    def get_success_url(self):
        return self.request.path


class JSONResponseMixin:
    def render_to_json_response(self, context, **response_kwargs):
        return JsonResponse(
            self.get_data(context),
            **response_kwargs
        )

    def get_data(self, context):
        return context
