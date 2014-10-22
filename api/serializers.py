# -*- coding: UTF-8 -*-

__author__ = 'Florent Captier <florent.captier@socgen.com>'


from django.contrib.auth.models import User
from rest_framework import serializers
from core.models import Task, Assignation




class UserSerializer(serializers.ModelSerializer):
    #tasks = serializers.RelatedField(many=True)
    #assignations = serializers.HyperlinkedRelatedField(view_name='assignation-detail', many=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name']


class TaskSerializer(serializers.ModelSerializer):
    #users = UserSerializer(many=True)

    class Meta:
        model = Task
        fields = ['id', 'name']


class AssignationSerializer(serializers.ModelSerializer):
    task = TaskSerializer(read_only=True)
    user = UserSerializer(read_only=True)
    task_id = serializers.PrimaryKeyRelatedField(write_only=True, source='task')
    user_id = serializers.PrimaryKeyRelatedField(write_only=True, source='user')
    #month = serializers.Field(source='month')

    class Meta:
        model = Assignation
        fields = ['id', 'task', 'task_id', 'user', 'user_id', 'week', 'year', 'wkld_planned', 'wkld_current']