
from django.contrib import admin
from django.urls import path,include
from .views import OrderStatusList,BranchView,PartyView,DispatchLocationListView,PartyAddressesView,ProductFiltersView,ProductListView,PartyProductsView,CreateOrderView,OrderListView,RejectOrderView,ApproveOrderView,DispatchListView,OrderItemListView

urlpatterns=[

     path('dispatch/', DispatchListView.as_view(), name='dispatch'),
    path('parties/',PartyView.as_view(),name='parties'),
    path('dispatches/',DispatchLocationListView.as_view(),name='dispatches'),
    path('addresses/', PartyAddressesView.as_view(), name='party-addresses'),
    path('product-filters/', ProductFiltersView.as_view(), name='product-filters'),
    path('products/', ProductListView.as_view(), name='products'),
    path('create/', CreateOrderView.as_view(), name='create-order'),
    path('list/', OrderListView.as_view(), name='order_list'),
    path('<int:order_id>/approve/', ApproveOrderView.as_view(), name='approve_list'),
    path('<int:order_id>/reject/', RejectOrderView.as_view(), name='reject_list'),
    path('party-products/<str:card_code>/', PartyProductsView.as_view(), name='party-products'),
    path('status/',OrderStatusList.as_view(),name='status'),
    path('branch/',BranchView.as_view(),name='branch'),
    path("items/", OrderItemListView.as_view(), name="order_items"),

        
]