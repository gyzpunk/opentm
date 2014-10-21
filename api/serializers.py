# -*- coding: UTF-8 -*-

__author__ = 'Florent Captier <florent.captier@socgen.com>'


from django.contrib.auth.models import User
from rest_framework import serializers
from core.models import Task, Assignation


class AssignationSerializer(serializers.ModelSerializer):
    task_id = serializers.RelatedField(source='task_id')
    task_name = serializers.RelatedField(source='task')
    user_id = serializers.RelatedField(source='user_id')
    #user_url = serializers.HyperlinkedRelatedField(view_name='user-detail', source='user', read_only=True)
    #task_url = serializers.HyperlinkedRelatedField(view_name='task-detail', source='task', read_only=True)
    month = serializers.Field(source='month')

    class Meta:
        model = Assignation
        fields = ['id', 'task_id', 'task_name', 'user_id', 'week', 'month', 'year', 'wkld_planned', 'wkld_current']

class UserSerializer(serializers.ModelSerializer):
    tasks = serializers.RelatedField(many=True)
    assignations = AssignationSerializer(many=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name']


class TaskSerializer(serializers.ModelSerializer):
    users = UserSerializer(many=True)

    class Meta:
        model = Task
        fields = ['id', 'name']