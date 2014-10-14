from django.db import models
from django.contrib.auth.models import User



class Task(models.Model):
    name = models.CharField(max_length=255, unique=True, null=False, blank=False)
    users = models.ManyToManyField(User, through=Assignation)


class Assignation(models.Model):
    user = models.ForeignKey(User)
    task = models.ForeignKey(Task)
    wkld_planned = models.PositiveSmallIntegerField()