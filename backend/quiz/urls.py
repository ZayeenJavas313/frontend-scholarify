from django.urls import path
from . import views

app_name = 'quiz'

urlpatterns = [
    path('subtests/', views.subtests_list, name='subtests-list'),
    path('subtests/<str:code>/questions/', views.subtest_questions, name='subtest-questions'),
    path('auth/login/', views.login_view, name='api-login'),
    path('import-soal-excel/', views.import_soal_excel, name='import-soal-excel'),
    path('submit-jawaban/', views.submit_jawaban, name='submit-jawaban'),
    path('riwayat-nilai/<str:username>/', views.riwayat_nilai, name='riwayat-nilai'),
    # Admin endpoints
    path('admin/dashboard/', views.admin_dashboard, name='admin-dashboard'),
    path('admin/soal/', views.admin_list_soal, name='admin-list-soal'),
    path('admin/users/', views.admin_list_users, name='admin-list-users'),
    path('admin/hasil/', views.admin_list_hasil, name='admin-list-hasil'),
]



