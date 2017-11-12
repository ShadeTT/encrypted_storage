# coding=utf-8

from django.contrib import admin
from django.contrib.admin.forms import AdminAuthenticationForm
from django.contrib.admin.sites import AdminSite
from django.contrib.auth import REDIRECT_FIELD_NAME
from django.views.decorators.cache import never_cache

from app.models import UploadedFile

__author__ = 'shade'


@admin.register(UploadedFile)
class UploadedFileAdmin(admin.ModelAdmin):

    pass


class CustomAdminSite(AdminSite):
    @never_cache
    def login(self, request, extra_context=None):
        """
        Displays the login form for the given HttpRequest.
        """
        from django.contrib.auth.views import login
        context = {
            'title': _('Log in'),
            'app_path': request.get_full_path(),
            REDIRECT_FIELD_NAME: '/',
        }
        context.update(extra_context or {})

        defaults = {
            'extra_context': context,
            'current_app': self.name,
            'authentication_form': self.login_form or AdminAuthenticationForm,
            'template_name': self.login_template or 'admin/login.html',
        }
        return login(request, **defaults)

# site = CustomAdminSite()
