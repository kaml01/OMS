import React, { useState, useEffect } from "react";

export default function Add_Sales() {
  const [parties, setParties] = useState([]);
  const [dispatch, setDispatch] = useState([]);
  const [billAddress, setBillAddress] = useState([]);
  const [shipAddress, setShipAddress] = useState([]);
  const [category, setCategory] = useState([]);
  const [brand, setBrand] = useState([]);
  const [variety, setVariety] = useState([]);
  const [item, setItem] = useState([]);
  const [type, setType] = useState([]);
  const [pcs, setPcs] = useState([]);
  const [products, setProducts] = useState([]);
  const [ltrs, setLtrs] = useState([]);
  const [sal_pack_unit, setSalPackUnit] = useState();
  const [tax, setTax] = useState([]);
  const [basic_price, setBasicprice] = useState();


  const [formData, setFormData] = useState({
    parties: "",
    dispatch: "",
    Date: "",
    billAddress: "",
    shipAddres: "",
    Deliverydate: "",
  });

    const [tableData, setTableData] = useState({
  category: "",
  brand: "",
  variety: "",
  type: "",
  item: "",
  pcs: "",
  qty: "",
  ltrs: "",
  // boxes: "",
  basicPrice: "",
  marketPrice: "",
  tax: "",
  amount: ""
});

// Use Effects
  useEffect(() => {
    fetchPartyName();
    fetchDispatchFrom();
    fetchProducts();
    
     
  },[]);

  // Category → Brand
  useEffect(() => {
  if (!tableData.category) return;
  const brands = [
    ...new Set(
      products
        .filter((p) => p.category === tableData.category)
        .map((p) => p.brand)
    )
  ];

  setBrand(brands);
}, [tableData.category, products]);

// Variety
useEffect(() => {
  if (!tableData.brand) return;

  const varieties = [...new Set(
    products
      .filter(p =>
        p.category === tableData.category &&
            p.brand === tableData.brand
      )
      .map(p => p.variety)
  )];

  setVariety(varieties);
}, [tableData.category, products, tableData.brand]);


//Item
useEffect(() => {
  if (!tableData.variety) return;

  const items = [...new Set(
    products
      .filter(p =>
        p.category === tableData.category &&
            p.brand === tableData.brand &&
            p.variety === tableData.variety
      )
      .map(p => p.item_name)
  )];

  setItem(items);
}, [tableData.category, products, tableData.variety, tableData.brand]);

// Type
useEffect(() => {
  if (!tableData.variety) return;

  const type = [...new Set(
    products
      .filter(p =>
        p.category === tableData.category
      )
      .map(p => p.item_type)
  )];
  console.log("Type:", type);

  setType(type);
}, [tableData.category, products, tableData.variety]);

// Pcs
useEffect(() => {
  if (!tableData.item ) return;

  const pcs = [...new Set(
    products
      .filter(p =>
        p.category === tableData.category &&
        p.brand === tableData.brand &&
        p.variety === tableData.variety &&
        p.item_name === tableData.item 
      )
      .map(p =>  parseInt(p.sal_factor2))
  )];

  setPcs(pcs);
  console.log("Pcs:", pcs);

  if (pcs.length > 0) {
    setTableData((prev) => ({
      ...prev,
      pcs: pcs[0],
    }));
  }
}, [tableData.category, products, tableData.variety, tableData.item, tableData.brand]);

// Litres Calculation
useEffect(() => {
  if (!tableData.item ) return;

  const packUnitList = [...new Set(
    products
      .filter(p =>
        p.category === tableData.category &&
        p.brand === tableData.brand &&
        p.variety === tableData.variety &&
        p.item_name === tableData.item 
      )
      .map(p =>  parseInt(p.sal_pack_unit))
  )];

  setSalPackUnit(packUnitList[0]);

  const qty = parseInt(tableData.qty);
  
  if (packUnitList.length > 0) {
    setTableData((prev) => ({
      ...prev,
      ltrs: packUnitList[0] * qty,
    }));
    setLtrs(packUnitList[0] * qty);
  }
    console.log("Sal Pack Unit:", sal_pack_unit, "Qty:", qty, "Ltrs:", sal_pack_unit * qty);

}, [tableData.category, products, tableData.variety, tableData.item, tableData.brand, tableData.qty]);

// Type 
useEffect(() => {
  if (!tableData.category) return;

  const typesSet = new Set();

  products
    .filter(
      (p) =>
        p.category === tableData.category &&
        p.brand === tableData.brand &&
        p.variety === tableData.variety
    )
    .forEach((p) => {
      const match = p.item_name?.match(
        /(\d+\.?\d*)\s*(LTR|ML|KG|GM|GMS|L)/i
      );

      if (match) {
        typesSet.add(`${match[1]} ${match[2].toUpperCase()}`);
      } else {
        typesSet.add("Others");
      }
    });

  const sortedTypes = [...typesSet].sort((a, b) => {
    if (a === "Others") return 1;
    if (b === "Others") return -1;
    return parseFloat(a) - parseFloat(b);
  });

  setType(sortedTypes);

  console.log("Sorted Types:", sortedTypes);
}, [tableData.category, tableData.brand, tableData.variety, products]);


//tax
useEffect(() => {
 if (!tableData.pcs) return;

  const taxList = [...new Set(
    products
      .filter(p =>
        p.category === tableData.category &&
        p.brand === tableData.brand &&
        p.variety === tableData.variety &&
        p.item_name === tableData.item 
      )
      .map(p =>  Number(p.tax_rate))
  )];

  setTax(taxList[0]);
  console.log("Tax:", taxList[0]);
  if (taxList.length > 0) {
    setTableData((prev) => ({
      ...prev,
      tax: taxList[0],
    }));
  }
}, [tableData.category, products, tableData.variety, tableData.item, tableData.brand, tableData.qty]);






// Fetch Functions
  const fetchPartyName = async () => {
    try {
      let response = await fetch("http://127.0.0.1:8000/api/orders/parties/");
      let data = await response.json();

      console.log("Parties Data:", JSON.stringify(data));
      setParties(data);
    } catch (error) {
      console.log("Error fetching parties name:", error);
    }
  };

  const fetchDispatchFrom = async () => {
    try {
      let response2 = await fetch("http://127.0.0.1:8000/api/orders/dispatch/");
      let data2 = await response2.json();

      console.log("Dispatch Data:", JSON.stringify(data2));
      setDispatch(data2.data);
    } catch (error) {
      console.log("Error fetching dispatch data:", error);
    }
  };

  const fetchPartyAddresses = async (value) => {
  try {
    let response = await fetch(
      `http://127.0.0.1:8000/api/sap/party-address/${value}/`

    );

    let result = await response.json();

    console.log("Addresses:", result);

    setBillAddress(result.bill_to);
    setShipAddress(result.ship_to);

  } catch (error) {
    console.log("Error fetching addresses:", error);
  }
};

const fetchPartyCategories = async (value) => {
  try {
    let response = await fetch(
      `http://127.0.0.1:8000/api/orders/party-products/${value}/`

    );

    let result = await response.json();

    const categories = [
  ...new Set(result.map((p) => p.category))
];
console.log("Categories:", categories);
setCategory(categories);
  } catch (error) {
    console.log("Error fetching categories:", error);
  }
};

const fetchProducts = async () => {
  let response = await fetch(
    "http://127.0.0.1:8000/api/orders/products/"
  );

  let result = await response.json();

  setProducts(result); 
};

const fetchBasicRate = async (value, itemcode) => {
  try {
    let response = await fetch(
      `http://127.0.0.1:8000/api/orders/party-products/${value}/`
    );

    let result = await response.json();

    console.log("Party Products:", result);

    const matchedProduct = result.find(
      (p) => p.item_code === itemcode
    );

    if (matchedProduct) {
      console.log("Matched Basic Price:", matchedProduct.basic_rate);

      setTableData((prev) => ({
        ...prev,
        basicPrice: matchedProduct.basic_rate,
      }));
    } else {
      console.log("No basic rate found for item:", itemcode);
    }
  } catch (error) {
    console.log("Error fetching basic rate:", error);
  }
};

const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    

    if (name === "parties") {
    fetchPartyAddresses(value);
    fetchPartyCategories(value);
    // fetchBasicRate(value);
   
  }};

const handleTableChange = (e) => {
  const { name, value } = e.target;

  setTableData((prev) => ({
    ...prev,
    [name]: value,
  }));

  if (name === "category") {
    setBrand([]);
    setVariety([]);
    setItem([]);

    setTableData((prev) => ({
      ...prev,
      brand: "",
      variety: "",
      item: ""
    }));
  }

  if (name === "brand") {
    setVariety([]);
    setItem([]);

    setTableData((prev) => ({
      ...prev,
      variety: "",
      item: ""
    }));
  }

  if (name === "variety") {
    setItem([]);

    setTableData((prev) => ({
      ...prev,
      item: ""
    }));
  }

  if (name === "item") {
  const selectedProduct = products.find(
    (p) => p.item_name === value
  );

  if (selectedProduct) {
    fetchBasicRate(
      formData.parties,             
      selectedProduct.item_code      
    );
  }
}
};

const handleDeleteRow = (index) => {
  console.log("Row Deleted");
};


  return (
    <div className="sales-container">
      <form className="sales-form">
        {/* Party Name */}
        <div className="form-group">
          <label>Party Name</label>
          <select
            value={formData.parties}
            name="parties"
            onChange={handleChange}
            required
          >
            <option>--select--</option>
            {parties.length > 0
              ? parties.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))
              : null}
          </select>
        </div>

        {/* Dispatch */}
        <div className="form-group">
          <label>Dispatch From</label>
          <select
            value={formData.dispatch}
            name="dispatch"
            onChange={handleChange}
            required
          >
            <option>--select--</option>
            {dispatch.length > 0
              ? dispatch.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.dispatch_from}
                  </option>
                ))
              : null}
          </select>
        </div>

        {/* Date */}
        <div className="form-group">
          <label>Date</label>
          <input type="date" name="date" value={new Date().toISOString().split("T")[0]} readOnly />
        </div>

        {/* Bill To */}
        <div className="form-group">
          <label>Bill To Address</label>
          <select value={formData.billAddress}
            name="billAddress"
            onChange={handleChange}
            required>
            <option>--select--</option>
             {billAddress.length > 0
              ? billAddress.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.full_address}
                  </option>
                ))
              : null}
          </select>
        </div>

        {/* Ship To */}
        <div className="form-group">
          <label>Ship To Address</label>
        <select value={formData.shipAddress}
            name="shipAddress"
            onChange={handleChange}
            required>
            <option>--select--</option>
             {shipAddress.length > 0
              ? shipAddress.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.full_address}
                  </option>
                ))
              : null}
          </select>
        </div>

        {/* Delivery Date */}
        <div className="form-group">
          <label>Delivery Date</label>
          <input type="date" name="ddate" />
        </div>

        <hr />

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Brand</th>
                <th>Variety</th>
                <th>Type</th>
                <th>Item</th>
                <th>Pcs</th>
                <th>Qty of boxes</th>
                <th>Ltrs</th>
                {/* <th>Boxes</th> */}
                <th>Basic Price</th>
                <th>Market Price</th>
                <th>Tax %</th>
                <th>Amount</th>
                <th>X</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                {/* Category */}
                <td><select value={tableData.category}
            name="category"
            onChange={handleTableChange}
            required>
            <option>--select--</option>
             {category.length > 0
              ? category.map((c, index) => (
                  <option key={index} value={c}>
                    {c}
                  </option>
                ))
              : null}
          </select></td>

                <td><select value={tableData.brand}
            name="brand"
            onChange={handleTableChange}
            required>
            <option>--select--</option>
             {brand.length > 0
              ? brand.map((b, index) => (
                  <option key={index} value={b}>
                    {b}
                  </option>
                ))
              : null}
          </select></td>

                <td><select value={tableData.variety}
            name="variety"
            onChange={handleTableChange}
            required>
            <option>--select--</option>
             {variety.length > 0
              ? variety.map((v, index) => (
                  <option key={index} value={v}>
                    {v}
                  </option>
                ))
              : null}
          </select></td>

                <td><select value={tableData.type}
            name="type"
            onChange={handleTableChange}
            required>
            <option>--select--</option>
             {type.length > 0
              ? type.map((i, index) => (
                  <option key={index} value={i}>
                    {i}
                  </option>
                ))
              : null}
          </select></td>

                <td><select value={tableData.item}
            name="item"
            onChange={handleTableChange}
            required>
            <option>--select--</option>
             {item.length > 0
              ? item.map((i, index) => (
                  <option key={index} value={i}>
                    {i}
                  </option>
                ))
              : null}
          </select></td>

                <td>  <input type="number" value={tableData.pcs} readOnly /></td>

                <td><input type="number" name="qty" value={tableData.qty} onChange={handleTableChange}/></td>

                <td><input type="number" name="ltrs" value={tableData.ltrs} onChange={handleTableChange} readOnly /></td>

                {/* <td><input type="number" name="boxes" value={tableData.boxes} onChange={handleTableChange} readOnly /></td>  */}

                <td><input type="number" name="basic_price" value={tableData.basicPrice} onChange={handleTableChange} readOnly /></td>

                <td><input type="number" name="market_price" value={tableData.market_price} onChange={handleTableChange} /></td>

                <td><input type="number" name="tax" value={tableData.tax} onChange={handleTableChange} readOnly /></td>

                <td><input type="number" name="ammount" value={tableData.amount} onChange={handleTableChange} readOnly /></td>

                <td><button style={{background:"red", color:"white", border:"none", borderRadius:"4px", padding:"4px 8px"}} onClick={() => handleDeleteRow(1)}>X</button> </td>
              </tr>
            </tbody>
          </table>
        </div>
      </form>
        <button type="submit" className="addbtn">Add</button><br/><br/>

      <form className="sales-form">
        <div className="form-group">
          <label>PO Number</label>
          <input type="number" name="po_number"/>
        </div>

        <div className="form-group">
          <label>Company</label>
          <input type="number" name="company"/>
        </div>

        {/* <div className="form-group">
          <label>Total</label>
          <input type="text" name="total" />
        </div> */}

        <div className="form-group">
          <label>Choose PO</label>
          <input type="file"/>
        </div>
{/* 
        <div className="form-group">
          <label>Tax</label>
          <input type="text" name="tax"/>
        </div> */}

        <div className="form-group">
          <label>Grand Total</label>
          <input type="text" name="gtotal" />
        </div>

        <textarea cols={5} rows={2} placeholder="Comment"/>

        </form><br/>
        
            <button type="submit" className="addbtn">Save</button>
            <button type="submit" className="cancelbtn">Clear</button>
            {/* <button type="submit" className="draftbtn">Draft</button> */}
            
      <style>{`
        .sales-container {
          padding: 20px;
          max-width: 1100px;
          margin: auto;
        }

        .sales-form {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        label {
          font-weight: 600;
          margin-bottom: 5px;
        }

        select, input {
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 8px;
          width: 100%;
        }

        hr {
          grid-column: span 3;
          margin: 20px 0;
        }

        /* Table Wrapper */
        .table-wrapper {
          grid-column: span 3;
          overflow-x: auto;
          border: 1px solid #ddd;
          border-radius: 10px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          min-width: 900px;
          font-size: 13px
        }

        th {
          background: #334155;
          color: white;
          padding: 10px;
          font-size: 14px;
          text-align: left;
        }

        td {
          padding: 8px;
          border: 1px solid #eee;
           min-width: 50px;
        }

        td input, td select {
          width: 100%;
          padding: 6px;
        }

//         td:nth-child(6) input {
//   min-width: 50px;
// }

        /* ✅ Mobile Responsive */
        @media (max-width: 768px) {
          .sales-form {
            grid-template-columns: 1fr;
          }

          hr {
            grid-column: span 1;
          }

          .table-wrapper {
            grid-column: span 1;
          }

       
        }
             .addbtn{
          border:2px solid green;
          color: white;
          background: green;
          margin-right: 4px;
          
          }

             .cancelbtn{
          border:2px solid red;
          color: white;
          background: red;
          margin-right: 4px;
          }

             .draftbtn{
          border:2px solid #E0BC00;
          color: white;
          background: #E0BC00;

          }
      `}</style>
    </div>
  );
} 