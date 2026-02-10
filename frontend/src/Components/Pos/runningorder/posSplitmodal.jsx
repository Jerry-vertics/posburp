import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import Swal from "sweetalert2";
import apiConfig from '../../layouts/base_url';

const PosSplitModal = ({ splitdata, setSplitData, showSplitModal, setShowSplitModal }) => {
  const [cookies] = useCookies();
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedSplitValue, setSelectedSplitValue] = useState('');
  const [textInputs, setTextInputs] = useState([]);
  const [foodtextInputs, setFoodTextInputs] = useState({});
  const [cardTotals, setCardTotals] = useState({});
  const [addedby, setuserid] = useState("");
  const [shiftstoken, setShiftstoken] = useState('');
  const [shiftAccess, setShiftAccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Initialize user data from localStorage
  useEffect(() => {
    const storeid = localStorage.getItem("_id");
    const storetoken = localStorage.getItem('shifttoken');
    setuserid(storeid);
    setShiftstoken(storetoken);
  }, []);

  // Fetch shift access data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = localStorage.getItem('_id');
        if (!id) {
          console.error('Store ID not found in localStorage');
          return;
        }
        setIsLoading(true);
        const response = await axios.get(`${apiConfig.baseURL}/api/pos/getShiftAccess`, {
          params: { id: id },
        });
        setShiftAccess(response.data.shiftacess);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Return null if no splitdata
  if (!splitdata || !Array.isArray(splitdata)) {
    return null;
  }

  // Calculate total items across all orders
  const totalGrandTotals = splitdata.reduce((total, order) => {
    const orderTotal = order.cart.reduce((orderTotal, cartItem) => {
      const itemQuantity = parseFloat(cartItem.quantity) || 0;
      return orderTotal + itemQuantity;
    }, 0);
    return total + orderTotal;
  }, 0);

  // Generate split options (2 to total items)
  const optionValues = totalGrandTotals > 1
    ? Array.from({ length: totalGrandTotals - 1 }, (_, index) => index + 2)
    : [];

  // Get all order IDs as a string
  const splitDataId = splitdata.map(data => data._id);
  const idsAsString = splitDataId.join(", ");

  // Handle split selection change
  const handleSplitChange = (event) => {
    const value = parseInt(event.target.value, 10) || 0;
    setSelectedSplitValue(value);

    // Create array of card indices (1 to value)
    const newInputs = Array.from({ length: value }, (_, index) => index + 1);
    setTextInputs(newInputs);

    // Reset all inputs and totals
    setFoodTextInputs({});
    setCardTotals({});
    setSelectedCard(null);
  };

  // Handle card selection
  const handleCardClick = (index) => {
    setSelectedCard(index);
  };

  // Helper function to safely parse prices
  const parsePrice = (price) => {
    if (typeof price === 'number') return price;
    if (typeof price === 'string') {
      const parsed = parseFloat(price);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  // Calculate totals for a specific card
  const calculateCardTotals = (cartItems) => {
    if (!cartItems || cartItems.length === 0) {
      return { subtotal: 0, vat: 0, total: 0 };
    }

    // Calculate subtotal
    const subtotal = cartItems.reduce((sum, item) => {
      const price = parsePrice(item.salesprice);
      const quantity = parseInt(item.quantity) || 0;
      return sum + (quantity * price);
    }, 0);

    // Calculate VAT (5%)
    const vatRate = 5;
    const vat = (subtotal * vatRate) / 100;

    // Calculate total
    const total = subtotal - vat;

    return {
      subtotal: total,
      vat: vat,
      total: subtotal
    };
  };

  // Format number with 2 decimal places
  const formatNumber = (num) => {
    const number = parseFloat(num) || 0;
    return number.toFixed(2);
  };

  // Handle adding items to selected split card
  const handleQuantityDecrease = (orderIndex, cartItemIndex) => {
    if (selectedCard === null || selectedSplitValue === '') {
      Swal.fire({
        icon: 'warning',
        title: 'Please select a split card first',
        text: 'Click on one of the split cards to select it before adding items.',
      });
      return;
    }

    const updatedSplitData = [...splitdata];
    const order = updatedSplitData[orderIndex];

    // Check if order and cart exist
    if (!order || !order.cart || !order.cart[cartItemIndex]) {
      console.error('Invalid cart item index');
      return;
    }

    const cartItem = order.cart[cartItemIndex];

    // Check if item is available
    const currentQuantity = parseInt(cartItem.quantity) || 0;
    if (currentQuantity <= 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Item out of stock',
        text: 'This item has no more quantity available.',
      });
      return;
    }

    // Decrease quantity in original data
    cartItem.quantity = currentQuantity - 1;

    // Create copy of food inputs
    const updatedFoodTextInputs = { ...foodtextInputs };

    // Initialize array for this card if it doesn't exist
    if (!updatedFoodTextInputs[selectedCard]) {
      updatedFoodTextInputs[selectedCard] = [];
    }

    // Get item details safely
    const menuItemDetails = cartItem.menuItemDetails || {};
    const foodmenuId = cartItem.foodmenuId || cartItemIndex;
    const foodmenuname = menuItemDetails.foodmenuname || 'Unknown Item';
    const salesprice = parsePrice(menuItemDetails.salesprice || 0);

    // Find if item already exists in this card
    const existingItemIndex = updatedFoodTextInputs[selectedCard].findIndex(
      (item) => item.foodmenuId === foodmenuId
    );

    if (existingItemIndex >= 0) {
      // Update existing item
      const existingItem = updatedFoodTextInputs[selectedCard][existingItemIndex];
      existingItem.quantity = (parseInt(existingItem.quantity) || 0) + 1;
      existingItem.totalPrice = existingItem.quantity * salesprice;
    } else {
      // Add new item
      updatedFoodTextInputs[selectedCard].push({
        foodmenuId: foodmenuId,
        foodmenuname: foodmenuname,
        quantity: 1,
        salesprice: salesprice,
        totalPrice: salesprice,
      });
    }

    // Calculate new totals for this card
    const newTotals = calculateCardTotals(updatedFoodTextInputs[selectedCard]);

    // Update states
    setCardTotals(prev => ({
      ...prev,
      [selectedCard]: newTotals
    }));

    setFoodTextInputs(updatedFoodTextInputs);
    setSplitData(updatedSplitData);
  };

  // Reset all inputs
  const resetFoodInputs = () => {
    setFoodTextInputs({});
    setCardTotals({});
    setTextInputs([]);
    setSelectedCard(null);
    setSelectedSplitValue('');
  };

  // Close modal
  const handleModalClose = () => {
    resetFoodInputs();
    setShowSplitModal(false);
  };

  // Handle form submission for a specific split
  const handleSubmit = async (event, index) => {
    event.preventDefault();

    if (!foodtextInputs[index] || foodtextInputs[index].length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Cart is empty',
        text: 'Please add items to this split before submitting.',
      });
      return;
    }

    try {
      const cart = foodtextInputs[index];
      const formattedCart = cart.map(item => ({
        foodmenuId: item.foodmenuId,
        foodmenuname: item.foodmenuname,
        salesprice: parsePrice(item.salesprice),
        quantity: parseInt(item.quantity) || 0
      }));

      const posData = {
        cart: formattedCart,
        addedby: addedby,
        shiftstoken: shiftstoken,
        opentoken: shiftAccess
      };

      const config = { headers: { 'Content-Type': 'application/json' } };

      const response = await axios.put(
        `${apiConfig.baseURL}/api/pos/updatesplits/${idsAsString}`,
        posData,
        config
      );

      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: `Split order #${index} has been submitted successfully.`,
        });

        // Remove submitted items from the card
        const updatedFoodInputs = { ...foodtextInputs };
        delete updatedFoodInputs[index];
        setFoodTextInputs(updatedFoodInputs);

        // Remove totals for this card
        const updatedCardTotals = { ...cardTotals };
        delete updatedCardTotals[index];
        setCardTotals(updatedCardTotals);
      }
    } catch (error) {
      console.error('Error updating order:', error);
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: 'There was an error submitting the order. Please try again.',
      });
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className={`modal ${showSplitModal ? 'show' : ''}`} style={{ display: showSplitModal ? 'block' : 'none' }}>
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-body text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading split data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Main Modal */}
      <div className={`modal ${showSplitModal ? 'show' : ''}`}
           tabIndex="-1"
           role="dialog"
           style={{ display: showSplitModal ? 'block' : 'none' }}>
        <div className="modal-dialog modal-lg" role="document" style={{ maxWidth: '1200px' }}>
          <div className="modal-content">
            {/* Modal Header */}
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">Split Order</h5>
              <button type="button" className="close text-white" onClick={handleModalClose}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="modal-body">
              <div className="row">
                {/* Left Column - Original Orders */}
                <div className="col-md-4">
                  <div className="sticky-top" style={{ top: '20px' }}>
                    <h6 className="mb-3">Available Items</h6>
                    <div className="border rounded p-2" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                      {splitdata.map((order, orderIndex) => (
                        <div key={order._id || orderIndex} className="mb-3">
                          <small className="text-muted d-block mb-2">Order #{orderIndex + 1}</small>
                          <table className="table table-sm table-bordered">
                            <thead className="thead-light">
                              <tr>
                                <th>#</th>
                                <th>Item</th>
                                <th>Qty</th>
                              </tr>
                            </thead>
                            <tbody>
                              {order.cart && order.cart.map((cartItem, cartItemIndex) => {
                                const menuItemDetails = cartItem.menuItemDetails || {};
                                const foodmenuname = menuItemDetails.foodmenuname || 'Unknown Item';
                                const quantity = parseInt(cartItem.quantity) || 0;

                                return (
                                  <tr key={cartItem.foodmenuId || cartItemIndex}>
                                    <td>{cartItemIndex + 1}</td>
                                    <td>{foodmenuname}</td>
                                    <td
                                      className={`font-weight-bold ${quantity > 0 ? 'text-primary' : 'text-muted'}`}
                                      style={{
                                        cursor: quantity > 0 ? 'pointer' : 'default',
                                        textDecoration: quantity > 0 ? 'underline' : 'none'
                                      }}
                                      onClick={() => quantity > 0 && handleQuantityDecrease(orderIndex, cartItemIndex)}
                                      title={quantity > 0 ? "Click to add to selected split" : "Out of stock"}
                                    >
                                      {quantity}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column - Split Cards */}
                <div className="col-md-8">
                  <div className="mb-4">
                    <label htmlFor="splitSelect" className="form-label">
                      <strong>Select Number of Splits</strong>
                    </label>
                    <select
                      id="splitSelect"
                      className="form-control form-control-lg"
                      onChange={handleSplitChange}
                      value={selectedSplitValue}
                    >
                      <option value="">Choose number of splits...</option>
                      {optionValues.map((value) => (
                        <option key={value} value={value}>
                          Split into {value} orders
                        </option>
                      ))}
                    </select>
                    <small className="form-text text-muted">
                      Total items available: {totalGrandTotals}
                    </small>
                  </div>

                  {/* Split Cards Grid */}
                  {selectedSplitValue && (
                    <div className="row">
                      {textInputs.map((index) => {
                        const isSelected = selectedCard === index;
                        const cardItems = foodtextInputs[index] || [];
                        const totals = cardTotals[index] || { subtotal: 0, vat: 0, total: 0 };

                        return (
                          <div className="col-md-6 mb-3" key={index}>
                            <div
                              className={`card h-100 ${isSelected ? 'border-primary border-2' : 'border'}`}
                              style={{ cursor: 'pointer' }}
                              onClick={() => handleCardClick(index)}
                            >
                              <div className={`card-header ${isSelected ? 'bg-primary text-white' : 'bg-light'}`}>
                                <div className="d-flex justify-content-between align-items-center">
                                  <h6 className="mb-0">Split Order #{index}</h6>
                                  <span className={`badge ${isSelected ? 'bg-light text-primary' : 'bg-secondary'}`}>
                                    {cardItems.length} items
                                  </span>
                                </div>
                                <small>
                                  {isSelected ? '✓ Active - Click items on left to add' : 'Click to activate'}
                                </small>
                              </div>

                              <div className="card-body">
                                <form onSubmit={(event) => handleSubmit(event, index)}>
                                  {/* Items Table */}
                                  <div className="table-responsive">
                                    <table className="table table-sm">
                                      <thead>
                                        <tr>
                                          <th>#</th>
                                          <th>Item</th>
                                          <th>Qty</th>
                                          <th className="text-right">Price</th>
                                          <th className="text-right">Total</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {cardItems.length > 0 ? (
                                          cardItems.map((item, foodIndex) => {
                                            const price = parsePrice(item.salesprice);
                                            const quantity = parseInt(item.quantity) || 0;
                                            const totalPrice = price * quantity;

                                            return (
                                              <tr key={foodIndex}>
                                                <td>{foodIndex + 1}</td>
                                                <td className="text-truncate" style={{ maxWidth: '100px' }} title={item.foodmenuname}>
                                                  {item.foodmenuname}
                                                </td>
                                                <td>{quantity}</td>
                                                <td className="text-right">{formatNumber(price)}</td>
                                                <td className="text-right">{formatNumber(totalPrice)}</td>
                                              </tr>
                                            );
                                          })
                                        ) : (
                                          <tr>
                                            <td colSpan="5" className="text-center text-muted py-3">
                                              No items added yet
                                            </td>
                                          </tr>
                                        )}
                                      </tbody>
                                    </table>
                                  </div>

                                  {/* Totals */}
                                  <div className="border-top pt-2">
                                    <div className="d-flex justify-content-between mb-1">
                                      <span>Subtotal:</span>
                                      <span>{formatNumber(totals.subtotal)}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-1">
                                      <span>VAT (5%):</span>
                                      <span>{formatNumber(totals.vat)}</span>
                                    </div>
                                    <div className="d-flex justify-content-between font-weight-bold border-top pt-1">
                                      <span>Total:</span>
                                      <span>{formatNumber(totals.total)}</span>
                                    </div>
                                  </div>

                                  {/* Submit Button */}
                                  <div className="mt-3">
                                    <button
                                      type="submit"
                                      className="btn btn-success w-100"
                                      disabled={cardItems.length === 0}
                                    >
                                      Submit Split #{index}
                                    </button>
                                  </div>
                                </form>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleModalClose}>
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  // Check if any split has items
                  const hasItems = Object.values(foodtextInputs).some(items => items && items.length > 0);
                  if (!hasItems) {
                    Swal.fire({
                      icon: 'info',
                      title: 'No items split',
                      text: 'Please split some items before closing.',
                    });
                  } else {
                    handleModalClose();
                  }
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Backdrop */}
      <div className={`modal-backdrop ${showSplitModal ? 'show' : 'fade'}`}
           style={{ display: showSplitModal ? 'block' : 'none' }}></div>
    </div>
  );
}

export default PosSplitModal;