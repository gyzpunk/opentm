# -*- coding: UTF-8 -*-

__author__ = 'Florent Captier <florent.captier@socgen.com>'


from rest_framework.urls import url, patterns
from rest_framework.routers import DefaultRouter
from api.views import TaskViewSet, UserViewSet, AssignationViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'tasks', TaskViewSet)
router.register(r'assignations', AssignationViewSet)

urlpatterns = router.urls