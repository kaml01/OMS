from django.contrib import admin
from django.urls import path,include
from .views import PartyView,DispatchLocationListView,PartyAddressesView,ProductFiltersView,ProductListView,CreateOrderView,OrderListView,OrderFilterView,AdminDashboardKPIView,AdminDashboardChartsView,ManagerDashboardKPIView,ManagerDashboardChartsView

urlpatterns=[

    path('parties/',PartyView.as_view(),name='parties'),
    path('dispatches/',DispatchLocationListView.as_view(),name='dispatches'),
    path('addresses/', PartyAddressesView.as_view(), name='party-addresses'),
    path('product-filters/', ProductFiltersView.as_view(), name='product-filters'),
    path('products/', ProductListView.as_view(), name='products'),
    path('create/', CreateOrderView.as_view(), name='create-order'),
    path('list/', OrderListView.as_view(), name='order_list'),
    path('detail/', OrderFilterView.as_view(), name='order_detail'),
    path('dashboard/admin/', AdminDashboardKPIView.as_view(), name='dashboard'),
    path('dashboard/admin/charts/', AdminDashboardChartsView.as_view(), name='dashboard-charts'),
    path('dashboard/manager/', ManagerDashboardKPIView.as_view(), name='manager-dashboard'),
    path('dashboard/manager/charts/', ManagerDashboardChartsView.as_view(), name='manager-dashboard-charts'),
]