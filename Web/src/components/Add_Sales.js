import React, { useState, useEffect } from "react";

export default function Add_Sales() {
  const [parties, setParties] = useState([]);
  const [dispatch, setDispatch] = useState([]);
  const [billAddress, setBillAddress] = useState([]);
  const [shipAddress, setShipAddress] = useState([]);
  const [category, setCategory] = useState([]);
  const [products, setProducts] = useState([]);

  const [formData, setFormData] = useState({
    parties: "",
    dispatch: "",
    Date: "",
    billAddress: "",
    shipAddress: "",
    Deliverydate: "",
  });

  const [rows, setRows] = useState([
    {
      category: "",
      brand: "",
      variety: "",
      type: "",
      item: "",
      pcs: "",
      qty: "",
      ltrs: "",
      basicPrice: "",
      marketPrice: "",
      tax: "",
      amount: "",
    },
  ]);

  // Use Effects
  useEffect(() => {
    fetchPartyName();
    fetchDispatchFrom();
    fetchProducts();
  }, []);

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
        `http://127.0.0.1:8000/api/sap/party-address/${value}/`,
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
        `http://127.0.0.1:8000/api/orders/party-products/${value}/`,
      );

      let result = await response.json();

      const categories = [...new Set(result.map((p) => p.category))];
      console.log("Categories:", categories);
      setCategory(categories);
    } catch (error) {
      console.log("Error fetching categories:", error);
    }
  };

  const fetchProducts = async () => {
    let response = await fetch("http://127.0.0.1:8000/api/orders/products/");

    let result = await response.json();

    setProducts(result);
  };

  const fetchBasicRate = async (party, itemcode, index) => {
    let response = await fetch(
      `http://127.0.0.1:8000/api/orders/party-products/${party}/`,
    );

    let result = await response.json();

    const matchedProduct = result.find((p) => p.item_code === itemcode);

    if (matchedProduct) {
      setRows((prev) => {
        let updated = [...prev];

        if (!updated[index]) return prev;

        updated[index] = {
          ...updated[index],
          basicPrice: matchedProduct.basic_rate,
        };

        return updated;
      });
    }
  };

  // -------------------------------
  // ----------Handle fxns----------
  // --------------------------------

  const handleClearForm = () => {
  setFormData({
    parties: "",
    dispatch: "",
    Date: "",
    billAddress: "",
    shipAddress: "",
    Deliverydate: "",
  });

  // setBillAddress([]);
  // setShipAddress([]);

  // setCategory([]);

  setRows([
    {
      category: "",
      brand: "",
      variety: "",
      type: "",
      item: "",
      pcs: "",
      qty: "",
      ltrs: "",
      basicPrice: "",
      marketPrice: "",
      tax: "",
      amount: "",
    },
  ]);
};


  const handleAddRow = () => {
    setRows((prev) => [
      ...prev,
      {
        category: "",
        brand: "",
        variety: "",
        type: "",
        item: "",
        pcs: "",
        qty: "",
        ltrs: "",
        basicPrice: "",
        marketPrice: "",
        tax: "",
        amount: "",
      },
    ]);
  };

  const handleRowChange = (index, e) => {
    const { name, value } = e.target;

    let updatedRows = [...rows];
    updatedRows[index][name] = value;

    // Reset dependent dropdowns
    if (name === "category") {
      updatedRows[index].brand = "";
      updatedRows[index].variety = "";
      updatedRows[index].item = "";
    }

    if (name === "brand") {
      updatedRows[index].variety = "";
      updatedRows[index].item = "";
    }

    if (name === "variety") {
      updatedRows[index].item = "";
    }

    // Auto-fill product details when item selected
    if (name === "item") {
      const selectedProduct = products.find(
        (p) =>
          p.category === updatedRows[index].category &&
          p.brand === updatedRows[index].brand &&
          p.variety === updatedRows[index].variety &&
          p.item_name === value,
      );

      if (selectedProduct) {
        const match = selectedProduct.item_name.match(
          /(\d+\.?\d*)\s*(LTR|ML|KG|GM|GMS|L)/i,
        );

        updatedRows[index].type = match
          ? `${match[1]} ${match[2].toUpperCase()}`
          : "Others";

        updatedRows[index].pcs = selectedProduct.sal_factor2;
        updatedRows[index].tax = selectedProduct.tax_rate;

        fetchBasicRate(formData.parties, selectedProduct.item_code, index);
      }
    }

    // Qty → Ltrs calculation
    if (name === "qty") {
      const selectedProduct = products.find(
        (p) => p.item_name === updatedRows[index].item,
      );

      if (selectedProduct) {
        updatedRows[index].ltrs =
          Number(selectedProduct.sal_pack_unit) * Number(value);
      }
    }

    setRows(updatedRows);
  };

  const handleDeleteRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);
    setRows(updatedRows);
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
    }
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
          <input
            type="date"
            name="date"
            value={new Date().toISOString().split("T")[0]}
            readOnly
          />
        </div>

        {/* Bill To */}
        <div className="form-group">
          <label>Bill To Address</label>
          <select
            value={formData.billAddress}
            name="billAddress"
            onChange={handleChange}
            required
          >
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
          <select
            value={formData.shipAddress}
            name="shipAddress"
            onChange={handleChange}
            required
          >
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
              {rows.map((row, index) => (
                <tr key={index}>
                  {/* Category */}
                  <td>
                    <select
                      value={row.category}
                      name="category"
                      onChange={(e) => handleRowChange(index, e)}
                    >
                      <option>--select--</option>
                      {category.map((c, i) => (
                        <option key={i} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Brand */}
                  <td>
                    <select
                      value={row.brand}
                      name="brand"
                      onChange={(e) => handleRowChange(index, e)}
                    >
                      <option value="">--select--</option>

                      {[
                        ...new Set(
                          products
                            .filter((p) => p.category === row.category)
                            .map((p) => p.brand),
                        ),
                      ].map((b, i) => (
                        <option key={i} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Variety */}
                  <td>
                    <select
                      value={row.variety}
                      name="variety"
                      onChange={(e) => handleRowChange(index, e)}
                    >
                      <option value="">--select--</option>

                      {[
                        ...new Set(
                          products
                            .filter(
                              (p) =>
                                p.category === row.category &&
                                p.brand === row.brand,
                            )
                            .map((p) => p.variety),
                        ),
                      ].map((v, i) => (
                        <option key={i} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Type */}
                  <td>
  <select
    value={row.type}
    name="type"
    onChange={(e) => handleRowChange(index, e)}
  >
    <option value="">--select--</option>

    {[
      ...new Set(
        products
          .filter(
            (p) =>
              p.category === row.category &&
              p.brand === row.brand &&
              p.variety === row.variety
          )
          .map((p) => {
            const match = p.item_name.match(
              /(\d+\.?\d*)\s*(LTR|ML|KG|GM|GMS|L)/i
            );

            return match
              ? `${match[1]} ${match[2].toUpperCase()}`
              : "Others";
          })
      ),
    ]
      // ✅ Sort types properly
      .sort((a, b) => {
        if (a === "Others") return 1; // Others always last
        if (b === "Others") return -1;

        const numA = parseFloat(a);
        const numB = parseFloat(b);

        return numA - numB;
      })
      .map((t, i) => (
        <option key={i} value={t}>
          {t}
        </option>
      ))}
  </select>
</td>


                  {/* Item */}
                  <td>
                    <select
                      value={row.item}
                      name="item"
                      onChange={(e) => handleRowChange(index, e)}
                    >
                      <option value="">--select--</option>

                      {products
                        .filter(
                          (p) =>
                            p.category === row.category &&
                            p.brand === row.brand &&
                            p.variety === row.variety,
                        )
                        .map((p, i) => (
                          <option key={i} value={p.item_name}>
                            {p.item_name}
                          </option>
                        ))}
                    </select>
                  </td>

                  {/* PCS */}
                  <td>
                    <input type="number" value={row.pcs} readOnly />
                  </td>

                  {/* Qty */}
                  <td>
                    <input
                      type="number"
                      name="qty"
                      value={row.qty}
                      onChange={(e) => handleRowChange(index, e)}
                    />
                  </td>

                  {/* Ltrs */}
                  <td>
                    <input type="number" value={row.ltrs} readOnly />
                  </td>

                  {/* Basic Price */}
                  <td>
                    <input type="number" value={row.basicPrice} readOnly />
                  </td>

                  {/* Market Price */}
                  <td>
                    <input
                      type="number"
                      name="marketPrice"
                      value={row.marketPrice}
                      onChange={(e) => handleRowChange(index, e)}
                    />
                  </td>

                  {/* Tax */}
                  <td>
                    <input type="number" value={row.tax} readOnly />
                  </td>

                  {/* Amount */}
                  <td>
                    <input type="number" value={row.amount} readOnly />
                  </td>

                  {/* Delete */}
                  <td>
                    <button
                      type="button"
                      style={{
                        background: "red",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        padding: "4px 8px",
                      }}
                      onClick={() => handleDeleteRow(index)}
                    >
                      X
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </form><br/>
      <button type="button" className="addbtn" onClick={handleAddRow}>
        Add Row
      </button>
      <hr/>
      <form className="sales-form">
        <div className="form-group">
          <label>PO Number</label>
          <input type="number" name="po_number" />
        </div>

        <div className="form-group">
          <label>Company</label>
          <input type="number" name="company" />
        </div>

        <div className="form-group">
          <label>Choose PO</label>
          <input type="file" />
        </div>

        <div className="form-group">
          <label>Grand Total</label>
          <input type="text" name="gtotal" />
        </div>

        <textarea cols={5} rows={2} placeholder="Comment" />
      </form>
      <br />

      <button type="submit" className="addbtn">
        Save
      </button>
    <button
  type="button"
  className="cancelbtn"
  onClick={handleClearForm}
>
  Clear
</button>

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
          min-width: 1000px;
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
