import { api } from "./api";

export interface Party {
  value: string;
  label: string;
}

export interface DispatchLocation {
  id: number;
  name: string;
  code: string;
  city: string;
  state: string;
}

export interface PartyAddress {
  id: number;
  address_id: string | null;
  full_address: string | null;
  gst_number: string | null;
}

export interface AddressResponse {
  bill_to: PartyAddress[];
  ship_to: PartyAddress[];
  is_fallback: boolean;
}

// Services
export const orderService = {
  getParties: async (): Promise<Party[]> => {
    return await api.get('/orders/parties/');
  },

  getAddresses: async (cardCode: string): Promise<AddressResponse> => {
    return await api.get(`/orders/addresses/?card_code=${cardCode}`);
  },


  createOrder: async (payload: CreateOrderPayload) => {
    return await api.post('/orders/create/', payload);
  },

};

export const dispatchService = {
  getDispatch: async (): Promise<DispatchLocation[]> => {
    return await api.get('/orders/dispatches/');
  },
};

export interface ProductFilters {
  categories: { label: string; value: string }[];
  brands: { label: string; value: string }[];
  varieties: { label: string; value: string }[];
  types: { label: string; value: string }[];  // ADD THIS
}

export interface Product {
  id: number;
  item_code: string;
  item_name: string;
  category: string | null;
  brand: string | null;
  variety: string | null;
  sal_factor2: number | null;
  tax_rate: number | null;
  sal_pack_unit: string | null;
}

export interface CreateOrderPayload {
  card_code: string;
  card_name: string;
  bill_to_id: number;
  bill_to_address: string;
  ship_to_id: number;
  ship_to_address: string;
  dispatch_from_id: number;
  dispatch_from_name: string;
  company: string;
  po_number: string;
  items: {
    item_code: string;
    item_name: string;
    category: string;
    brand: string;
    variety: string;
    item_type: string;
    qty: number;
    pcs: number;
    boxes: number;
    ltrs: number;
    market_price: number;
    total: number;
    tax_rate: number;
  }[];
}

export interface OrderItemList{
  id:number;
  order_number :string;
  card_code :string;
  card_name:string;
  total_amount :string;
  status:string;
  items_count :number;
  created_by :number;
  created_at:string;
}

export const productService = {

  getFilters: async (category?: string, brand?: string, variety?: string): Promise<ProductFilters> => {
    let url = '/orders/product-filters/?';
    if (category) url += `category=${encodeURIComponent(category)}&`;
    if (brand) url += `brand=${encodeURIComponent(brand)}&`;
    if (variety) url += `variety=${encodeURIComponent(variety)}&`;
    return await api.get(url);
  },

  getProducts: async (category?: string, brand?: string, variety?: string, type?: string): Promise<Product[]> => {
    let url = '/orders/products/?';
    if (category) url += `category=${encodeURIComponent(category)}&`;
    if (brand) url += `brand=${encodeURIComponent(brand)}&`;
    if (variety) url += `variety=${encodeURIComponent(variety)}&`;
    if (type) url += `type=${encodeURIComponent(type)}&`;
    return await api.get(url);
  },

  getOrders:async(userId:number,statusFilter?:string):Promise<OrderItemList[]>=>{

    let url = '/orders/list/?';
    if (userId)
      url+=`user_id=${userId}&`;
    if (statusFilter)
      url+=`status=${statusFilter}&`;
    return await api.get(url);

  }
  
};
