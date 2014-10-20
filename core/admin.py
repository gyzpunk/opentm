from django.contrib import admin
from core.models import Assignation, Task


class AssignationAdminInline(admin.TabularInline):
    model = Assignation
    extra = 1


class TaskAdmin(admin.ModelAdmin):
    model = Task
    inlines = (AssignationAdminInline,)


class AssignationAdmin(admin.ModelAdmin):
    model = Assignation
    list_display = ('pk', 'task', 'user', 'year', 'month', 'week')

admin.site.register(Task, TaskAdmin)
admin.site.register(Assignation, AssignationAdmin)