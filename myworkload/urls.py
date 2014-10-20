from django.conf.urls import patterns, include, url
from django.views.generic import TemplateView
from django.contrib import admin
import api.urls

admin.autodiscover()

urlpatterns = patterns('',
    url(r'^$', TemplateView.as_view(template_name='front/index.html')),
    url(r'^api/', include(api.urls)),
    url(r'^admin/', include(admin.site.urls)),
)
