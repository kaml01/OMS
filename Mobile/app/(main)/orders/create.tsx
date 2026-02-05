import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Text, Surface, TextInput } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/src/context/AuthContext";
import { COLORS, SPACING, RADIUS, GRADIENTS } from "@/src/constants/theme";
import Dropdown from "@/src/components/common/DropdownProps";
import { orderService, dispatchService, PartyAddress, productService, Product, CreateOrderPayload } from "@/src/services/order.service";
import { useRouter } from 'expo-router';

interface OrderItem {
  id: number;
  category: number | null;
  item: number | null;
  itemName: string;
  qty: string;
  price: string;
  amount: string;
}

interface OrderItemType {
  id: number;
  itemCode: string;
  itemName: string;
  category: string;
  brand: string;
  variety: string;
  type: string;
  qty: number;
  pcs: number;
  boxes: number;
  ltrs: number;
  marketPrice: number;
  total: number;
  taxRate: number;
}

export default function CreateOrderScreen() {

  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const router = useRouter();
  // Get current date
  const today = new Date().toLocaleDateString("en-GB");

  // Form data
  const [partyName, setPartyName] = useState<string | null>(null);
  const [dispatchFrom, setDispatchFrom] = useState<number | null>(null);
  const [company, setCompany] = useState<number | null>(null);
  const [poNumber, setPoNumber] = useState("");
  const [comment, setComment] = useState("");

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedVariety, setSelectedVariety] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [qty, setQty] = useState<string>('');
  const [orderItems, setOrderItems] = useState<{
    id: number;
    itemCode: string;
    itemName: string;
    category: string;
    brand: string;
    variety: string;
    type: string;
    qty: number;
    pcs: number;
    boxes: number;
    ltrs: number;
    marketPrice: number;
    total: number;
    taxRate: number;
  }[]>([]);
  const [price, setPrice] = useState<string>('');
  const [types, setTypes] = useState<{ label: string, value: string }[]>([]);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const [billToAddresses, setBillToAddresses] = useState<{ label: string, value: number }[]>([]);
  const [shipToAddresses, setShipToAddresses] = useState<{ label: string, value: number }[]>([]);
  const [selectedBillTo, setSelectedBillTo] = useState<number | null>(null);
  const [selectedShipTo, setSelectedShipTo] = useState<number | null>(null);
  const [itemTotal, setItemTotal] = useState<string>('');
  // Order items
  const [items, setItems] = useState<OrderItem[]>([]);

  // Dropdown options
  const [parties, setParties] = useState<{ label: string; value: string }[]>(
    [],
  );

  const [dispatches, setDispatches] = useState<
    { label: string; value: number }[]
  >([]);

  const [companies, setCompanies] = useState<
    { label: string; value: number }[]
  >([]);

  const [categories, setCategories] = useState<
    { label: string; value: string }[]
  >([]);

  const [itemsList, setItemsList] = useState<
    { label: string; value: number }[]
  >([]);

  const [brands, setBrands] = useState<{ label: string, value: string }[]>([]);
  const [varieties, setVarieties] = useState<{ label: string, value: string }[]>([]);
  const [products, setProducts] = useState<{ label: string, value: number }[]>([]);
  const [productsList, setProductsList] = useState<Product[]>([]);  // ADD THIS - full product data
  const [pcs, setPcs] = useState<string>('');
  const [salPackUnit, setSalPackUnit] = useState<string>('');
  const [boxes, setBoxes] = useState<string>('');
  const [ltrs, setLtrs] = useState<string>('');
  const [tax, settax] = useState<string>('');
  const [grandTotal, setGrandTotal] = useState<string>('');
  const [marketPrice, setMarketPrice] = useState<string>('');

  const getMainGroups = () => {
    if (!user?.main_group) return "N/A";
    if (Array.isArray(user.main_group)) {
      return user.main_group.map((g: any) => g.name).join(", ") || "N/A";
    }
    return user.main_group.name || "N/A";
  };

  const getStates = () => {
    if (!user?.state) return "N/A";
    if (Array.isArray(user.state)) {
      return user.state.map((s: any) => s.code || s.name).join(", ") || "N/A";
    }
    return user.state.code || user.state.name || "N/A";
  };

  useEffect(() => {
    fetchMasterData();
  }, []);

  const handlePartyChange = async (cardCode: string) => {

    setPartyName(cardCode);

    const addressData = await orderService.getAddresses(cardCode);

    setBillToAddresses(addressData.bill_to.map((addr: PartyAddress) => ({
      label: (addr.address_id || '') + (addr.full_address ? ` - ${addr.full_address.substring(0, 30)}...` : ''),
      value: addr.id
    })));

    setShipToAddresses(addressData.ship_to.map((addr: PartyAddress) => ({
      label: (addr.address_id || '') + (addr.full_address ? ` - ${addr.full_address.substring(0, 30)}...` : ''),
      value: addr.id
    })));
  }

  const handleCategoryChange = async (category: string) => {

    if (category === selectedCategory) return;

    setSelectedCategory(category);
    setSelectedBrand(null);
    setSelectedVariety(null);
    setSelectedType(null);
    setSelectedProduct(null);
    setBrands([]);
    setVarieties([]);
    setTypes([]);
    setProducts([]);

    try {
      const filters = await productService.getFilters(category);
      setBrands(filters.brands);
    } catch (error) {
      console.error('Error loading brands:', error);
    }
  };

  const handleBrandChange = async (brand: string) => {

    setSelectedBrand(brand);
    setSelectedVariety(null);
    setSelectedProduct(null);
    setVarieties([]);
    setProducts([]);

    try {
      const filters = await productService.getFilters(selectedCategory!, brand);
      setVarieties(filters.varieties);
    } catch (error) {
      console.error('Error loading varieties:', error);
    }
  };

  const handleVarietyChange = async (variety: string) => {
    console.log('=== Variety Changed ===');
    console.log('Category:', selectedCategory);
    console.log('Brand:', selectedBrand);
    console.log('Variety:', variety);

    setSelectedVariety(variety);
    setSelectedType(null);
    setSelectedProduct(null);
    setTypes([]);
    setProducts([]);

    try {
      const filters = await productService.getFilters(selectedCategory!, selectedBrand!, variety);

      console.log('Filters response:', filters);
      console.log('Types:', filters.types);

      setTypes(filters.types);
    } catch (error) {
      console.error('Error loading types:', error);
    }
  };

  const handleProductChange = (productId: number) => {
    setSelectedProduct(productId);

    const product = productsList.find(p => p.id === productId);
    if (product) {
      setPcs(product.sal_factor2?.toString() || '0');
      setSalPackUnit(product.sal_pack_unit?.toString() || '0');
      settax(product.tax_rate ? product.tax_rate.toString() : '0');
    }

  };

  const handleBoxesChange = (value: string) => {
    const qty = parseFloat(value) * parseFloat(pcs);
    setBoxes(qty.toString());

    // Calculate Ltrs
    const packUnit = parseFloat(salPackUnit) || 0;
    const calculatedLtrs = parseFloat(value) * packUnit;
    setLtrs(calculatedLtrs.toFixed(2));
  };

  const handleQtyChange = (value: string) => {
    // const qtyNum = parseFloat(value) || 0;
    // const pcsNum = parseFloat(pcs) || 0;
    // const packUnit = parseFloat(salPackUnit) || 0;
    // const priceNum = parseFloat(marketPrice) || 0;
    // setQty(value)
    // // Boxes = qty * pcs
    // const calculatedBoxes = qtyNum * pcsNum;
    // setBoxes(calculatedBoxes.toString());

    // // Ltrs = qty * salPackUnit
    // const calculatedLtrs = qtyNum * packUnit;
    // setLtrs(calculatedLtrs.toFixed(2));

    // const total = qtyNum * priceNum;
    // setGrandTotal(total.toFixed(2));

    setQty(value);

    const qtyNum = parseFloat(value) || 0;
    const pcsNum = parseFloat(pcs) || 0;
    const packUnit = parseFloat(salPackUnit) || 0;
    const priceNum = parseFloat(marketPrice) || 0;

    setBoxes((qtyNum * pcsNum).toString());
    setLtrs((qtyNum * packUnit).toFixed(2));
    setItemTotal((qtyNum * priceNum).toFixed(2));

  };

  const calculateGrandTotal = () => {
    return orderItems.reduce((sum, item) => sum + item.total, 0).toFixed(2);
  };

  const handleMarketPriceChange = (value: string) => {
    // setMarketPrice(value);

    // const qtyNum = parseFloat(qty) || 0;
    // const priceNum = parseFloat(value) || 0;

    // // Grand Total = qty * marketPrice
    // const total = qtyNum * priceNum;
    // setGrandTotal(total.toFixed(2));

    setMarketPrice(value);

    const qtyNum = parseFloat(qty) || 0;
    const priceNum = parseFloat(value) || 0;

    setItemTotal((qtyNum * priceNum).toFixed(2));

  };

  const handleTypeChange = async (type: string) => {

    setSelectedType(type);
    setSelectedProduct(null);
    setProducts([]);

    try {
      const productList = await productService.getProducts(
        selectedCategory!,
        selectedBrand!,
        selectedVariety!,
        type
      );

      console.log('Products from API:', productList);
      setProductsList(productList);
      const mapped = productList.map((p: Product) => ({
        label: p.item_name,
        value: p.id,
      }));

      console.log('Mapped for dropdown:', mapped);

      setProducts(mapped);

      console.log('Products state set');
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const fetchMasterData = async () => {
    try {
      setDataLoading(true);

      const parties = await orderService.getParties();
      setParties(
        (parties || []).map((p) => ({
          label: p.label,
          value: p.value,
        })),
      );

      const dispatchesData = await dispatchService.getDispatch();

      setDispatches(
        (dispatchesData || []).map((d) => ({
          label: d.name,
          value: d.id,
        }))
      );

      const company = await
        setCompanies([
          { label: "Jivo Wellness", value: 1 },
          { label: "Jivo MART", value: 2 },
        ]);

      const filters = await productService.getFilters();

      setCategories(filters.categories);

      // setItemsList([
      //   { label: "Jivo Canola 1L", value: 1 },
      //   { label: "Jivo Canola 5L", value: 2 },
      //   { label: "Jivo Olive 500ml", value: 3 },
      //   { label: "Jivo Olive 1L", value: 4 },
      // ]);
    } catch (error) {
      Alert.alert("Error", "Failed to load data");
    } finally {
      setDataLoading(false);
    }
  };

  const addItem = () => {
    const newId =
      items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1;
    setItems([
      ...items,
      {
        id: newId,
        category: null,
        item: null,
        itemName: "",
        qty: "",
        price: "",
        amount: "0.00",
      },
    ]);
  };
  
  const updateItem = (id: number, field: string, value: any) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };

          // Get item name if item selected
          if (field === "item" && value) {
            const selectedItem = itemsList.find((i) => i.value === value);
            updated.itemName = selectedItem?.label || "";
          }

          // Calculate amount
          const qty = parseFloat(updated.qty) || 0;
          const price = parseFloat(updated.price) || 0;
          updated.amount = (qty * price).toFixed(2);

          return updated;
        }
        return item;
      }),
    );
  };

  const removeItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const calculateTotal = () => {
    const grand_total = parseFloat(marketPrice) * parseFloat(qty);

    console.log('qty ' + qty);

    return grand_total.toFixed(2);
  };
  
  const addItemToOrder = () => {

    if (!selectedCategory || !selectedProduct || !qty || !marketPrice) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    const selectedProductData = productsList.find(p => p.id === selectedProduct);

    const newItem: OrderItemType = {
      id: Date.now(),
      itemCode: String(selectedProductData?.item_code ?? ''),
      itemName: String(selectedProductData?.item_name ?? ''),
      category: String(selectedCategory ?? ''),
      brand: String(selectedBrand ?? ''),
      variety: String(selectedVariety ?? ''),
      type: String(selectedType ?? ''),
      qty: parseFloat(qty) || 0,
      pcs: parseFloat(pcs) || 0,
      boxes: parseFloat(boxes) || 0,
      ltrs: parseFloat(ltrs) || 0,
      marketPrice: parseFloat(marketPrice) || 0,
      total: parseFloat(itemTotal) || 0,
      taxRate: parseFloat(tax) || 0,
    };

    // ADD to existing items - don't replace
    setOrderItems(prev => [...prev, newItem]);

    // Reset ONLY input fields, NOT the order items
    setSelectedCategory(null);
    setSelectedBrand(null);
    setSelectedVariety(null);
    setSelectedType(null);
    setSelectedProduct(null);
    setQty('');
    setPcs('');
    setSalPackUnit('');
    setBoxes('');
    setLtrs('');
    setMarketPrice('');
    setItemTotal('');
    settax('');
    setBrands([]);
    setVarieties([]);
    setTypes([]);
    setProducts([]);
    setProductsList([]);

  };

  const handleSubmit = async () => {

    if (!partyName || orderItems.length === 0) {
      Alert.alert('Error', 'Select a party and add at least one item');
      return;
    }

    try {
      
      const payload: CreateOrderPayload = {
        card_code: partyName,
        card_name: parties.find(p => p.value === partyName)?.label ?? '',
        bill_to_id: selectedBillTo ?? 0,
        bill_to_address: billToAddresses.find(a => a.value === selectedBillTo)?.label ?? '',
        ship_to_id: selectedShipTo ?? 0,
        ship_to_address: shipToAddresses.find(a => a.value === selectedShipTo)?.label ?? '',
        dispatch_from_id: dispatchFrom ?? 0,
        dispatch_from_name: dispatches.find(d => d.value === dispatchFrom)?.label ?? '',
        company: String(company ?? ''),
        po_number: String(poNumber ?? ''),
        items: orderItems.map(item => ({
          item_code: String(item.itemCode ?? ''),
          item_name: String(item.itemName ?? ''),
          category: String(item.category ?? ''),
          brand: String(item.brand ?? ''),
          variety: String(item.variety ?? ''),
          item_type: String(item.type ?? ''),
          qty: Number(item.qty) || 0,
          pcs: Number(item.pcs) || 0,
          boxes: Number(item.boxes) || 0,
          ltrs: Number(item.ltrs) || 0,
          market_price: Number(item.marketPrice) || 0,
          total: Number(item.total) || 0,
          tax_rate: Number(item.taxRate) || 0,
        })),

      };
      console.log("logdata"+JSON.stringify(payload));
      const response = await orderService.createOrder(payload);

      Alert.alert(
        'Success',
        `Order ${response.order_number} created successfully!`,
        [{ text: 'OK', onPress: () => router.back() }]
      );

    } catch (error) {
      console.error('Error creating order:', error);
      Alert.alert('Error', 'Failed to create order');
    }

  };

  const handleClear = () => {
    setPartyName(null);
    setDispatchFrom(null);
    setCompany(null);
    setPoNumber("");
    setComment("");
    setItems([]);
    setSelectedCategory("");
    setSelectedBrand("");
    setSelectedVariety("");
    setSelectedType("");
  };

  if (dataLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Info Bar */}
      <View style={styles.infoBar}>
        <Text style={styles.infoText}>
          MainGroup: {getMainGroups()} | States: {getStates()}
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">

        {/* Order Details Card */}
        <Surface style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="document-text" size={20} color={COLORS.primary} />
            <Text style={styles.cardTitle}>Order Details</Text>
            <Text style={styles.dateText}>{today}</Text>
          </View>

          <View style={styles.field}>
            <Dropdown
              label="Party Name *"
              data={parties}
              onChange={(value) => {
                setPartyName(value);
                if (value) {
                  handlePartyChange(value);
                }
              }}
              value={partyName}
              placeholder="Select party..."
              searchable={true}
              icon="storefront-outline" />
          </View>

          <View style={styles.row}>
            <View style={styles.halfField}>
              <Dropdown
                label="Dispatch From"
                data={dispatches}
                value={dispatchFrom}
                onChange={setDispatchFrom}
                placeholder="Select..."
                icon="business-outline"
              />
            </View>
            <View style={styles.halfField}>
              <Dropdown
                label="Company *"
                data={companies}
                value={company}
                onChange={setCompany}
                placeholder="Select..."
                icon="briefcase-outline"
              />
            </View>
          </View>

          <View style={styles.field}>
            <Dropdown
              label="Bill To Address"
              data={billToAddresses}
              value={selectedBillTo}
              onChange={setSelectedBillTo}
              placeholder="Select Bill To..."
            // icon="document-text-outline"
            />
          </View>

          <View style={styles.field}>
            <Dropdown
              label="Ship To Address"
              data={shipToAddresses}
              value={selectedShipTo}
              onChange={setSelectedShipTo}
              placeholder="Select Ship To..."
            // icon="location-outline"
            />
          </View>

          <View style={styles.field}>
            <TextInput
              label="PO Number"
              value={poNumber}
              onChangeText={setPoNumber}
              mode="outlined"
              style={styles.input}
              outlineColor={COLORS.border}
              activeOutlineColor={COLORS.primary}
              left={<TextInput.Icon icon="document" />}
            />
          </View>
        </Surface>

        {/* Items Section */}
        <Surface style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="cube" size={20} color={COLORS.primary} />
            <Text style={styles.cardTitle}>Items</Text>
            <TouchableOpacity style={styles.addBtn} onPress={addItem}>
              <Ionicons name="add" size={18} color={COLORS.textLight} />
              <Text style={styles.addBtnText}>Add Item</Text>
            </TouchableOpacity>
          </View>

          {items.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="cube-outline" size={48} color={COLORS.border} />
              <Text style={styles.emptyText}>No items added</Text>
              <Text style={styles.emptySubtext}>
                Tap "Add Item" to add products
              </Text>
            </View>
          ) : (
            items.map((item, index) => (
              <View key={item.id} style={styles.itemCard}>

                <View style={styles.itemHeader}>
                  <Text style={styles.itemNumber}>Item {index + 1}</Text>
                  <TouchableOpacity onPress={() => removeItem(item.id)}>
                    <Ionicons
                      name="trash-outline"
                      size={20}
                      color={COLORS.error}
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.field}>
                  <Dropdown
                    label="Category"
                    data={categories}
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    placeholder="Select Category..."
                    icon="grid-outline"
                  />
                </View>

                <View style={styles.row}>
                  <View style={styles.halfField}>

                    <Dropdown
                      label="Brand"
                      data={brands}
                      value={selectedBrand}
                      onChange={handleBrandChange}
                      placeholder="Select Brand..."
                      icon="pricetag-outline"
                      disabled={!selectedCategory}
                    />
                  </View>
                  <View style={styles.halfField}>
                    <Dropdown
                      label="Variety"
                      data={varieties}
                      value={selectedVariety}
                      onChange={handleVarietyChange}
                      placeholder="Select Variety..."
                      icon="layers-outline"
                      disabled={!selectedBrand}
                    />
                  </View>

                </View>

                <View style={styles.field}>
                  <Dropdown
                    label="Type"
                    data={types}
                    value={selectedType}
                    onChange={handleTypeChange}
                    placeholder="Select Category..."
                    icon="grid-outline"
                  />
                </View>

                {/* Item */}
                <View style={styles.field}>
                  <Dropdown
                    label="Item"
                    data={products}
                    value={selectedProduct}
                    onChange={handleProductChange}  // Changed from setSelectedProduct
                    placeholder="Select Item..."
                    icon="cube-outline"
                    disabled={!selectedType}
                    searchable={true}
                  />
                </View>

                <View style={styles.row}>
                  <View style={styles.thirdField}>
                    <TextInput
                      label="PCS"
                      value={pcs}
                      onChangeText={(val) => updateItem(item.id, "pcs", val)}
                      mode="outlined"
                      keyboardType="numeric"
                      style={styles.input}
                      outlineColor={COLORS.border}
                      activeOutlineColor={COLORS.primary}
                    />
                  </View>
                  <View style={styles.thirdField}>
                    <TextInput
                      label="Ltrs"
                      value={ltrs}
                      onChangeText={(val) => updateItem(item.id, "ltrs", val)}
                      mode="outlined"
                      keyboardType="numeric"
                      style={styles.input}
                      outlineColor={COLORS.border}
                      activeOutlineColor={COLORS.primary}
                    />
                  </View>
                  <View style={styles.thirdField}>
                    <TextInput
                      label="Boxes"
                      value={boxes}
                      // onChangeText={handleBoxesChange}
                      mode="outlined"
                      keyboardType="numeric"
                      style={styles.input}
                      outlineColor={COLORS.border}
                      activeOutlineColor={COLORS.primary}
                    />
                  </View>
                </View>

                <View style={styles.row}>
                  <View style={styles.thirdField}>
                    <TextInput
                      label="QTY"
                      value={qty}
                      onChangeText={handleQtyChange}
                      mode="outlined"
                      keyboardType="numeric"
                      style={styles.input}
                      outlineColor={COLORS.border}
                      activeOutlineColor={COLORS.primary}/>
                  </View>
                  <View style={styles.thirdField}>
                    <TextInput
                      label="TAX"
                      value={tax}
                      // onChangeText={handleBoxesChange}
                      mode="outlined"
                      keyboardType="numeric"
                      style={styles.input}
                      outlineColor={COLORS.border}
                      activeOutlineColor={COLORS.primary} />
                  </View>
                  

                </View>
                <View style={styles.row}>
                  <View style={styles.thirdField}>
                    <TextInput
                      label="Base Price"
                      value={marketPrice}
                      onChangeText={handleMarketPriceChange}
                      mode="outlined"
                      keyboardType="numeric"
                      style={styles.input}
                      outlineColor={COLORS.border}
                      activeOutlineColor={COLORS.primary} />
                  </View>
                   <View style={styles.thirdField}>
                    <TextInput
                      label="Market Price"
                      value={marketPrice}
                      onChangeText={handleMarketPriceChange}
                      mode="outlined"
                      keyboardType="numeric"
                      style={styles.input}
                      outlineColor={COLORS.border}
                      activeOutlineColor={COLORS.primary} />
                  </View>
                </View>
                <TouchableOpacity style={styles.addButton} onPress={addItemToOrder}>
                  <Ionicons name="add-circle-outline" size={20} color="#fff" />
                  <Text style={styles.addButtonText}>Add Item</Text>
                </TouchableOpacity>
              </View>
            ))
          )}

        </Surface>

        {orderItems.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Order Items ({orderItems.length})</Text>

            {orderItems.map((item, index) => (
              <View key={item.id} style={styles.itemCard}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemName}>{index + 1}. {item.itemName}</Text>
                  <TouchableOpacity onPress={() => removeItem(item.id)}>
                    <Ionicons name="trash-outline" size={20} color="#e53e3e" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.itemCategory}>{item.category} | {item.brand} | {item.variety}</Text>
                <View style={styles.itemDetails}>
                  <Text style={styles.itemDetail}>Qty: {item.qty}</Text>
                  <Text style={styles.itemDetail}>PCS: {item.pcs}</Text>
                  <Text style={styles.itemDetail}>Boxes: {item.boxes}</Text>
                  <Text style={styles.itemDetail}>Ltrs: {item.ltrs}</Text>
                </View>
                <View style={styles.itemPriceRow}>
                  <Text style={styles.itemDetail}>Price: ₹{item.marketPrice}</Text>
                  <Text style={styles.itemAmount}>₹{item.total.toFixed(2)}</Text>
                </View>
              </View>
            ))}

            {/* Grand Total */}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Grand Total:</Text>
              <Text style={styles.totalValue}>₹{calculateGrandTotal()}</Text>
            </View>
          </View>

        )}
        {/* Total Card */}
        {items.length > 0 && (
          <Surface style={styles.totalCard}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Items</Text>
              <Text style={styles.totalValue}>{items.length}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Grand Total</Text>
              <Text style={styles.grandTotal}>₹{calculateTotal()}</Text>
            </View>
          </Surface>
        )}

        {/* Comment */}
        <Surface style={styles.card}>
          <TextInput
            label="Comment (optional)"
            value={comment}
            onChangeText={setComment}
            mode="outlined"
            multiline
            numberOfLines={3}
            style={[styles.input, styles.commentInput]}
            outlineColor={COLORS.border}
            activeOutlineColor={COLORS.primary}
          />
        </Surface>

        <View style={{ height: 120 }} />

      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.cancelBtn} onPress={handleClear}>
          <Text style={styles.cancelBtnText}>Clear</Text>
        </TouchableOpacity>
            
        {/* <TouchableOpacity style={styles.draftBtn}>
          <Ionicons name="save-outline" size={18} color={COLORS.warning} />
          <Text style={styles.draftBtnText}>Draft</Text>
        </TouchableOpacity> */}

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={loading}
          style={styles.submitBtnWrapper}>
          <LinearGradient
            colors={GRADIENTS.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.submitBtn}
          >
            {loading ? (
              <ActivityIndicator size="small" color={COLORS.textLight} />
            ) : (
              <>
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={COLORS.textLight}
                />
                <Text style={styles.submitBtnText}>Create Order</Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

      </View>
    </KeyboardAvoidingView>
  );
  
}

const styles = StyleSheet.create({
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.sm,
    alignSelf: 'flex-start',
    marginTop: SPACING.sm,
    gap: 4,
  },
  addButtonText: {
    color: COLORS.textLight,
    fontSize: 12,
    fontWeight: '600',
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: SPACING.md,
    color: COLORS.textSecondary,
  },
  infoBar: {
    backgroundColor: COLORS.primaryLight,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary,
  },
  infoText: {
    fontSize: 12,
    color: COLORS.primaryDark,
    fontWeight: "500",
  },
  scrollView: {
    flex: 1,
    padding: SPACING.md,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.md,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  cardTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginLeft: SPACING.sm,
  },
  dateText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  field: {
    marginBottom: SPACING.sm,
  },
  row: {
    flexDirection: "row",
    gap: SPACING.sm,
  },
  halfField: {
    flex: 1,
  },
  thirdField: {
    flex: 1,
  },
  input: {
    backgroundColor: COLORS.surface,
  },
  commentInput: {
    minHeight: 80,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.md,
    gap: 4,
  },
  addBtnText: {
    color: COLORS.textLight,
    fontSize: 12,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: SPACING.xl,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
  },
  emptySubtext: {
    fontSize: 13,
    color: COLORS.border,
    marginTop: SPACING.xs,
  },
  itemCard: {
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  itemNumber: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
  },
  amountBox: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    alignItems: "center",
    height: 56,
    justifyContent: "center",
  },
  amountLabel: {
    fontSize: 10,
    color: COLORS.textSecondary,
  },
  amountValue: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.primary,
  },
  totalCard: {
    backgroundColor: COLORS.primaryDark,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.xs,
  },
  totalLabel: {
    fontSize: 14,
    color: COLORS.textLight,
    opacity: 0.8,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textLight,
  },
  grandTotal: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.textLight,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    flexDirection: "row",
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
    gap: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  cancelBtn: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: "center",
  },
  cancelBtnText: {
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  draftBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.warning,
    gap: 4,
  },
  draftBtnText: {
    color: COLORS.warning,
    fontWeight: "600",
  },
  submitBtnWrapper: {
    flex: 1,
  },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
    gap: SPACING.xs,
  },
  submitBtnText: {
    color: COLORS.textLight,
    fontWeight: "600",
    fontSize: 15,
  },
  itemName: {
    fontWeight: '600',
    fontSize: 14,
    flex: 1,
  },
  itemCategory: {
    fontSize: 12,
    color: '#718096',
    marginTop: 2,
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  itemDetail: {
    fontSize: 12,
    color: '#4a5568',
  },
  itemPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  itemAmount: {
    fontWeight: '700',
    fontSize: 14,
    color: '#2d3748',
  },
});
