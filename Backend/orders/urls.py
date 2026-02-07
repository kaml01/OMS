from django.contrib import admin
from django.urls import path,include
from .views import PartyView,DispatchLocationListView,PartyAddressesView,ProductFiltersView,ProductListView,CreateOrderView,OrderListView,RejectOrderView,ApproveOrderView

urlpatterns=[

    path('parties/',PartyView.as_view(),name='parties'),
    path('dispatches/',DispatchLocationListView.as_view(),name='dispatches'),
    path('addresses/', PartyAddressesView.as_view(), name='party-addresses'),
    path('product-filters/', ProductFiltersView.as_view(), name='product-filters'),
    path('products/', ProductListView.as_view(), name='products'),
    path('create/', CreateOrderView.as_view(), name='create-order'),
    path('list/', OrderListView.as_view(), name='order_list'),
    path('<int:order_id>/approve/', ApproveOrderView.as_view(), name='approve_list'),
    path('<int:order_id>/reject/', RejectOrderView.as_view(), name='reject_list'),
]