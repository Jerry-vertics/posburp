import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from 'react-toastify';
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { IoFastFoodSharp } from "react-icons/io5";
import 'react-toastify/dist/ReactToastify.css';
import apiConfig from '../../layouts/base_url';
import Swal from 'sweetalert2';
import { useReactToPrint } from 'react-to-print';

const PosOrderEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [foodCategory, setFoodcategory] = useState([]);
  const distinctCategories = [...new Set(foodCategory.map(item => item.foodcategory.foodcategoryname))];
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [vatAmount, setTotalVat] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [menu, setMenu] = useState([]);
  const [placeorder, setPlaceOrder] = useState({});
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [printData, setPrintData] = useState(null);
  const [originalOrderData, setOriginalOrderData] = useState(null);

  const printRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Updated_Order_${printData?.orderNumber || 'Order'}`,
    onAfterPrint: () => {
      setShowPrintModal(false);
      navigate('/pos');
    }
  });

  // Fetch original order data
  useEffect(() => {
    axios.get(`${apiConfig.baseURL}/api/pos/getEdit/${id}`)
      .then((response) => {
        const data = response.data[0];
        console.info({ reponsedata: data });

        // Save the original order data
        setOriginalOrderData(data);

        if (data && data.cart && Array.isArray(data.cart)) {
          setCart(data.cart);

          // Calculate initial totals from original cart
          let initialTotal = 0;
          let initialVat = 0;

          data.cart.forEach(item => {
            initialTotal += parseFloat(item.salesprice) * parseInt(item.quantity);
          });

          initialVat = (initialTotal * 5) / 100;

          setTotalAmount(initialTotal);
          setTotalVat(initialVat);
          setGrandTotal(initialTotal + initialVat);
        } else {
          console.log("Cart data is not available or is in an unexpected format.");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  // Fetch food categories
  useEffect(() => {
    axios.get(`${apiConfig.baseURL}/api/pos/posfood`)
      .then((response) => {
        setFoodcategory(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  // Calculate totals when cart changes
  useEffect(() => {
    let newTotalAmount = 0;
    let newVatAmount = 0;

    cart.forEach(icart => {
      newTotalAmount += parseInt(icart.quantity) * parseInt(icart.salesprice);
    });

    newVatAmount = (newTotalAmount * 5) / 100;

    setTotalAmount(newTotalAmount);
    setTotalVat(newVatAmount);
    setGrandTotal(newTotalAmount + newVatAmount);
  }, [cart]);

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Add product to cart
  const addProductToCart = (menu) => {
    let findProductInCart = cart.find(i => i.foodmenuId === menu._id);
    let newCart = [];

    if (findProductInCart) {
      cart.forEach(cartItem => {
        if (cartItem.foodmenuId === menu._id) {
          newCart.push({
            ...cartItem,
            quantity: parseInt(cartItem.quantity) + 1,
          });
        } else {
          newCart.push(cartItem);
        }
      });
      setCart(newCart);
    } else {
      let addingProduct = {
        ...menu,
        foodmenuId: menu._id,
        'quantity': 1,
        'totalAmount': menu.salesprice,
      }
      setCart([...cart, addingProduct]);
    }

    toast(`Added ${menu.foodmenuname} to the cart`, {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
    });
  }

  // Remove product from cart
  const removeProduct = (menu) => {
    const newCart = cart.filter(cartItem => cartItem.foodmenuId !== menu.foodmenuId);
    setCart(newCart);
  }

  // Increment quantity
  const handleIncrement = (prod) => {
    const addQuantity = cart.map(item => {
      if (item.foodmenuId === prod.foodmenuId) {
        return {
          ...item,
          quantity: parseInt(item.quantity) + 1
        };
      }
      return item;
    });
    setCart(addQuantity);
  }

  // Decrement quantity
  const handleDecrement = (prod) => {
    const addQuantity = cart.map(item => {
      if (item.foodmenuId === prod.foodmenuId) {
        return {
          ...item,
          quantity: parseInt(item.quantity) > 1 ? parseInt(item.quantity) - 1 : 1
        };
      }
      return item;
    });
    setCart(addQuantity);
  }

  // Calculate differences between original and updated cart
  const calculateCartDifferences = () => {
    if (!originalOrderData?.cart || !cart) return [];

    const originalCart = originalOrderData.cart;
    const differences = [];

    // Create maps for comparison
    const originalMap = new Map();
    originalCart.forEach(item => {
      originalMap.set(item.foodmenuId || item._id, {
        quantity: parseInt(item.quantity),
        salesprice: parseFloat(item.salesprice),
        foodmenuname: item.foodmenuname
      });
    });

    const currentMap = new Map();
    cart.forEach(item => {
      currentMap.set(item.foodmenuId, {
        quantity: parseInt(item.quantity),
        salesprice: parseFloat(item.salesprice),
        foodmenuname: item.foodmenuname
      });
    });

    // Check for changed or new items
    cart.forEach(currentItem => {
      const originalItem = originalMap.get(currentItem.foodmenuId);

      if (!originalItem) {
        // New item added
        differences.push({
          foodmenuname: currentItem.foodmenuname,
          quantity: parseInt(currentItem.quantity),
          salesprice: parseFloat(currentItem.salesprice),
          changeType: 'added',
          amount: parseInt(currentItem.quantity) * parseFloat(currentItem.salesprice)
        });
      } else if (originalItem.quantity !== parseInt(currentItem.quantity)) {
        // Quantity changed
        const quantityDiff = parseInt(currentItem.quantity) - originalItem.quantity;
        differences.push({
          foodmenuname: currentItem.foodmenuname,
          quantity: quantityDiff,
          salesprice: parseFloat(currentItem.salesprice),
          changeType: quantityDiff > 0 ? 'increased' : 'decreased',
          amount: Math.abs(quantityDiff) * parseFloat(currentItem.salesprice)
        });
      }
    });

    // Check for removed items
    originalCart.forEach(originalItem => {
      const itemId = originalItem.foodmenuId || originalItem._id;
      const currentItem = currentMap.get(itemId);
      if (!currentItem) {
        differences.push({
          foodmenuname: originalItem.foodmenuname,
          quantity: -parseInt(originalItem.quantity),
          salesprice: parseFloat(originalItem.salesprice),
          changeType: 'removed',
          amount: parseInt(originalItem.quantity) * parseFloat(originalItem.salesprice)
        });
      }
    });

    return differences;
  }

  // Handle update order
  const handleUpdateOrder = async () => {
    if (cart.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Empty Cart',
        text: 'Please add items to cart before updating order.'
      });
      return;
    }

    try {
      // Prepare form data
      const formData = new FormData();

      // Add cart items
      cart.forEach((item, index) => {
        formData.append(`cart[${index}].foodmenuId`, item.foodmenuId);
        formData.append(`cart[${index}].foodmenuname`, item.foodmenuname);
        formData.append(`cart[${index}].salesprice`, item.salesprice);
        formData.append(`cart[${index}].quantity`, item.quantity);
      });

      // Add totals
      formData.append('vatAmount', vatAmount.toFixed(2));
      formData.append('total', totalAmount.toFixed(2));
      formData.append('grandTotal', grandTotal.toFixed(2));

      // API call
      const response = await axios.put(
        `${apiConfig.baseURL}/api/pos/updatepos/${id}`,
        formData,
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );

      // Calculate differences for print
      const differences = calculateCartDifferences();

      // Calculate update totals
      let updateSubtotal = 0;
      differences.forEach(item => {
        updateSubtotal += item.amount;
      });

      const updateVat = (updateSubtotal * 5) / 100;
      const updateGrandTotal = updateSubtotal + updateVat;

      // Prepare print data
      const printData = {
        orderNumber: response.data.updatePos?.ordernumber || originalOrderData?.ordernumber || 'N/A',
        date: response.data.updatePos?.updatedAt || new Date(),
        changes: differences,
        updateSubtotal: updateSubtotal,
        updateVat: updateVat,
        updateGrandTotal: updateGrandTotal,
        finalSubtotal: totalAmount,
        finalVat: vatAmount,
        finalGrandTotal: grandTotal,
        updateType: 'ORDER UPDATE'
      };

      setPrintData(printData);

      // Show success message with changes summary
      const changesHtml = differences.length > 0
        ? `
          <div class="text-left">
            <p><strong>Summary of Changes:</strong></p>
            <ul class="text-left pl-3">
              ${differences.map(item =>
                `<li>${item.foodmenuname}:
                  ${item.changeType === 'added' ? 'Added' :
                    item.changeType === 'removed' ? 'Removed' :
                    item.changeType === 'increased' ? `Increased by ${item.quantity}` :
                    `Decreased by ${Math.abs(item.quantity)}`}
                </li>`
              ).join('')}
            </ul>
            <p class="mt-2">Would you like to print the update receipt?</p>
          </div>
        `
        : '<p>No changes detected. Would you like to print the receipt?</p>';

      const result = await Swal.fire({
        title: 'Order Updated!',
        html: changesHtml,
        icon: 'success',
        showCancelButton: true,
        confirmButtonText: 'Yes, Print Receipt',
        cancelButtonText: 'No, Return to POS',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        reverseButtons: true
      });

      if (result.isConfirmed) {
        setShowPrintModal(true);
      } else {
        navigate('/pos');
      }

    } catch (error) {
      console.error('Update error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'Failed to update order. Please try again.'
      });
    }
  };

  // Handle cancel
  const handleCancel = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'All changes will be lost.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, Cancel',
      cancelButtonText: 'No, Keep Editing'
    }).then((result) => {
      if (result.isConfirmed) {
        navigate('/pos');
      }
    });
  };

  return (
    <div className="row">
      <ToastContainer />

      {/* Left Panel - Cart Summary */}
      <div className="col-sm-4 col-lg-auto">
        <div className="wraper shdw">
          <div className="table-responsive vh-70" style={{ height: "300px", overflowY: "scroll" }}>
            <table className="table">
              <thead>
                <tr className="thead-light">
                  <th>No.</th>
                  <th>Name</th>
                  <th>U.Price</th>
                  <th>Qty</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cart.length > 0 ? cart.map((cartProduct, key) => (
                  <tr key={key}>
                    <td>{key + 1}</td>
                    <td>{cartProduct.foodmenuname}</td>
                    <td>${cartProduct.salesprice}</td>
                    <td>
                      <button className='btn btn-danger btn-sm cartminus' onClick={() => handleDecrement(cartProduct)}>-</button>
                      <input type="text" style={{ width: '20px' }} value={cartProduct.quantity} readOnly />
                      <button className='btn btn-success btn-sm cartplus' onClick={() => handleIncrement(cartProduct)}>+</button>
                    </td>
                    <td>
                      <button className='btn btn-danger btn-sm' onClick={() => removeProduct(cartProduct)}>x</button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="text-center">No Item in Cart</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Totals Section */}
          <div className="table-responsive">
            <table className="table">
              <tr>
                <td>Subtotal</td>
                <th className="text-right">${totalAmount.toFixed(2)}</th>
              </tr>
              <tr>
                <td>VAT (5%)</td>
                <th className="text-right">${vatAmount.toFixed(2)}</th>
              </tr>
              <tr>
                <th>Grand Total</th>
                <th className="text-right">${grandTotal.toFixed(2)}</th>
              </tr>
            </table>
          </div>

          {/* Action Buttons */}
          <div className="row">
            <div className="col-lg-6">
              <button type="button" className="btn btn-danger w-100 mb-2 p-2" onClick={handleCancel}>
                Cancel
              </button>
            </div>
            <div className="col-lg-6 pl-0">
              <button type="button" onClick={handleUpdateOrder} className="btn btn-success w-100 mb-2 p-2">
                Update Order
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Food Menu */}
      <div className="col-sm-7 col-lg-7">
        <div className="tbl-h">
          <ul className="nav nav-tabs nav-justified" role="tablist">
            <li className="nav-item">
              <a className="nav-link pos active" data-toggle="tab" href="#foodmenu" role="tab">
                <IoFastFoodSharp className="mr-2" />Food Menu
              </a>
            </li>
          </ul>
        </div>

        <div className="tab-content mt-3">
          <div className="tab-pane active" id="foodmenu" role="tabpanel">
            <div className="tbl-h">
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Search foodmenu..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="form-control"
                />
              </div>

              <ul className="nav nav-pills flex-columns shdw-lft" id="myTab" role="tablist">
                {distinctCategories.map((category, index) => (
                  <li className="nav-item" key={index}>
                    <a
                      className={`nav-link ${index === activeTab ? 'active' : ''}`}
                      onClick={() => setActiveTab(index)}
                    >
                      {category}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Food Items Grid */}
            <div className="tab-content p-3" id="myTabContents">
              {isLoading ? (
                <div className="text-center">Loading...</div>
              ) : (
                <div className="row">
                  {foodCategory.length > 0 &&
                    foodCategory
                      .filter(item =>
                        item.foodcategory.foodcategoryname === distinctCategories[activeTab] &&
                        item.foodmenuname.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map((menu, index) => (
                        <div className="col-sm-3 col-sm-3" key={index}>
                          <div className="menu-box" onClick={() => addProductToCart(menu)}>
                            <div className="menu-div">
                              <h6 className="mt-2">{menu.foodmenuname}</h6>
                              <p>Price: ${menu.salesprice}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Print Modal */}
      {showPrintModal && printData && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg" role="document">
              <div className="modal-content">
                <div className="modal-header bg-success text-white">
                  <h5 className="modal-title">
                    <i className="fas fa-print mr-2"></i>
                    Print Preview - Order Update
                  </h5>
                  <button
                    type="button"
                    className="close text-white"
                    onClick={() => {
                      setShowPrintModal(false);
                      navigate('/pos');
                    }}
                  >
                    <span>&times;</span>
                  </button>
                </div>

                <div className="modal-body p-0">
                  <div ref={printRef} className="p-4">
                    <div style={{
                      fontFamily: "'Courier New', monospace",
                      maxWidth: '300px',
                      margin: '0 auto'
                    }}>
                      {/* Header */}
                      <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                        <h3 style={{ margin: '0 0 5px 0', fontWeight: 'bold', fontSize: '18px' }}>
                          ORDER UPDATE RECEIPT
                        </h3>
                        <h4 style={{ margin: '0 0 3px 0', fontSize: '16px' }}>Restaurant Name</h4>
                        <p style={{ margin: '0', fontSize: '12px' }}>Restaurant Address</p>
                        <p style={{ margin: '0', fontSize: '12px' }}>Phone: (123) 456-7890</p>
                        <hr style={{ borderColor: '#000', margin: '10px 0' }} />
                      </div>

                      {/* Order Information */}
                      <div style={{ marginBottom: '15px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                          <span><strong>Order #:</strong></span>
                          <span>{printData.orderNumber}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                          <span><strong>Date:</strong></span>
                          <span>{new Date(printData.date).toLocaleDateString()}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                          <span><strong>Time:</strong></span>
                          <span>{new Date(printData.date).toLocaleTimeString()}</span>
                        </div>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: '12px',
                          color: '#e74c3c',
                          fontWeight: 'bold'
                        }}>
                          <span>Type:</span>
                          <span>ORDER UPDATE</span>
                        </div>
                        <hr style={{ borderColor: '#000', margin: '10px 0' }} />
                      </div>

                      {/* Updated Items List - Only Changes */}
                      {printData.changes.length > 0 ? (
                        <div style={{ marginBottom: '15px' }}>
                          <div style={{
                            display: 'grid',
                            gridTemplateColumns: '2fr 1fr 1fr 1fr',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            marginBottom: '5px',
                            borderBottom: '2px solid #000',
                            paddingBottom: '5px'
                          }}>
                            <div>ITEM</div>
                            <div style={{ textAlign: 'center' }}>CHANGE</div>
                            <div style={{ textAlign: 'center' }}>PRICE</div>
                            <div style={{ textAlign: 'right' }}>AMOUNT</div>
                          </div>

                          {printData.changes.map((item, index) => (
                            <div
                              key={index}
                              style={{
                                display: 'grid',
                                gridTemplateColumns: '2fr 1fr 1fr 1fr',
                                fontSize: '12px',
                                marginBottom: '3px',
                                paddingBottom: '3px',
                                borderBottom: '1px dotted #ccc'
                              }}
                            >
                              <div>
                                {item.foodmenuname}
                                <div style={{ fontSize: '10px', color: '#666' }}>
                                  {item.changeType === 'added' ? '[NEW]' :
                                   item.changeType === 'removed' ? '[REMOVED]' :
                                   item.changeType === 'increased' ? '[INCREASED]' : '[DECREASED]'}
                                </div>
                              </div>
                              <div style={{ textAlign: 'center' }}>
                                {item.changeType === 'removed' ? '-' : ''}
                                {Math.abs(item.quantity)}
                              </div>
                              <div style={{ textAlign: 'center' }}>${item.salesprice.toFixed(2)}</div>
                              <div style={{ textAlign: 'right' }}>${item.amount.toFixed(2)}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={{ textAlign: 'center', padding: '15px', fontSize: '12px', color: '#666' }}>
                          No quantity changes detected
                        </div>
                      )}

                      <hr style={{ borderColor: '#000', margin: '10px 0' }} />

                      {/* Update Summary */}
                      {printData.changes.length > 0 && (
                        <div style={{
                          backgroundColor: '#f8f9fa',
                          padding: '10px',
                          borderRadius: '5px',
                          marginBottom: '15px',
                          fontSize: '13px'
                        }}>
                          <div style={{
                            fontWeight: 'bold',
                            marginBottom: '5px',
                            color: '#27ae60',
                            textAlign: 'center'
                          }}>
                            UPDATE SUMMARY
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                            <span>Update Subtotal:</span>
                            <span>${printData.updateSubtotal.toFixed(2)}</span>
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                            <span>Update VAT (5%):</span>
                            <span>${printData.updateVat.toFixed(2)}</span>
                          </div>

                          <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontWeight: 'bold',
                            marginTop: '5px',
                            paddingTop: '5px',
                            borderTop: '1px solid #ddd'
                          }}>
                            <span>Update Total:</span>
                            <span>${printData.updateGrandTotal.toFixed(2)}</span>
                          </div>
                        </div>
                      )}

                      {/* Final Totals */}
                      <div style={{ fontSize: '13px' }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: '5px',
                          fontWeight: 'bold'
                        }}>
                          <span>Final Subtotal:</span>
                          <span>${printData.finalSubtotal.toFixed(2)}</span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                          <span>Final VAT:</span>
                          <span>${printData.finalVat.toFixed(2)}</span>
                        </div>

                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontWeight: 'bold',
                          fontSize: '14px',
                          marginTop: '10px',
                          paddingTop: '5px',
                          borderTop: '2px solid #000'
                        }}>
                          <span>FINAL GRAND TOTAL:</span>
                          <span>${printData.finalGrandTotal.toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Footer */}
                      <div style={{
                        textAlign: 'center',
                        marginTop: '20px',
                        fontSize: '11px',
                        borderTop: '1px dashed #000',
                        paddingTop: '10px'
                      }}>
                        <div style={{ fontWeight: 'bold', marginBottom: '5px', color: '#27ae60' }}>
                          *** ORDER UPDATED SUCCESSFULLY ***
                        </div>
                        <div style={{ marginBottom: '5px' }}>
                          Thank you for your business!
                        </div>
                        <div>
                          <small>Printed on: {new Date().toLocaleString()}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => {
                      setShowPrintModal(false);
                      navigate('/pos');
                    }}
                  >
                    <i className="fas fa-times mr-1"></i> Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={handlePrint}
                  >
                    <i className="fas fa-print mr-1"></i> Print Receipt
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Backdrop */}
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
};

export default PosOrderEdit;