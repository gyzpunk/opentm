from rest_framework import viewsets
from django.contrib.auth.models import User
from core.models import Task, Assignation
from api.serializers import TaskSerializer, UserSerializer, AssignationSerializer


class AssignationViewSet(viewsets.ModelViewSet):
    queryset = Assignation.objects.all()
    serializer_class = AssignationSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer