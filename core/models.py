from django.db import models
from django.contrib.auth.models import User

from datetime import date, timedelta


class Task(models.Model):
    name = models.CharField(max_length=255, unique=True, null=False, blank=False)
    users = models.ManyToManyField(User, through='Assignation', related_name='tasks')

    def __str__(self):
        return self.name


class Assignation(models.Model):
    user = models.ForeignKey(User, related_name='assignations')
    task = models.ForeignKey(Task, related_name='assignations')
    week = models.PositiveSmallIntegerField(max_length=55, verbose_name='Week number')
    year = models.PositiveIntegerField(verbose_name='Year')
    wkld_planned = models.PositiveSmallIntegerField(max_length=5, verbose_name='Planned number of days')
    wkld_current = models.PositiveSmallIntegerField(max_length=5, verbose_name='Current number of days')

    @property
    def isocalendar(self):
        return (self.year, self.week, 1)

    @property
    def month(self):
        """
        Returns the month of the assignation based on it's week and year.
        :return: Month of year
        :rtype: int
        """
        return (date(self.year, 1, 1) + timedelta(weeks=self.week-1)).month

    def __str__(self):
        return '%s on %s (%i-%i)' % (self.user, self.task, self.year, self.week)

    class Meta:
        unique_together = (('user', 'task', 'year', 'week'),)