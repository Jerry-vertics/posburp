import React from "react";
import { useRef } from "react";
import ReactToPrint from "react-to-print";

const RunningOrderKot = ({ kotdata, showkotModal, setShowKotModal }) => {
  const componentRef = useRef();

  // Handle modal backdrop click to close modal
  const handleBackdropClick = (e) => {
    if (e.target.className === 'modal-backdrop show') {
      setShowKotModal(false);
    }
  };

  return (
    <div>
      <div
        className={`modal ${showkotModal ? 'show' : ''}`}
        tabIndex="-1"
        role="dialog"
        style={{ display: showkotModal ? 'block' : 'none' }}
      >
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">KOT</h5>
              <button
                type="button"
                className="close"
                onClick={() => setShowKotModal(false)}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {/* This is what will be printed */}
              <div ref={componentRef} style={{ padding: "20px" }}>
                {kotdata ? (
                  kotdata.map((order) => {
                    const subtotal = order.cart.reduce(
                      (total, cartItem) =>
                        total + cartItem.quantity * cartItem.salesprice,
                      0
                    );
                    const vatPercentValue = 5;
                    const vatAmount = (subtotal * vatPercentValue) / 100;
                    const subTotals = subtotal - vatAmount;
                    const grandTotal = subTotals + vatAmount;
                    const orderDate = new Date(order.date);
                    const formattedDate = `${orderDate
                      .getDate()
                      .toString()
                      .padStart(2, "0")}-${(orderDate.getMonth() + 1)
                      .toString()
                      .padStart(2, "0")}-${orderDate.getFullYear()}`;
                    const formattedTime = `${orderDate
                      .getHours()
                      .toString()
                      .padStart(2, "0")}:${orderDate
                      .getMinutes()
                      .toString()
                      .padStart(2, "0")}:${orderDate
                      .getSeconds()
                      .toString()
                      .padStart(2, "0")}`;

                    return (
                      <div
                        key={order.id}
                        className="order-container"
                        style={{
                          borderBottom: "2px solid #000",
                          marginBottom: "20px",
                          paddingBottom: "20px",
                        }}
                      >
                        <div className="kot-header" style={{ textAlign: "center", marginBottom: "20px" }}>
                          <h4 style={{ fontWeight: "bold" }}>KITCHEN ORDER TICKET</h4>
                        </div>

                        <div className="order-details" style={{ marginBottom: "15px" }}>
                          <p><strong>Order Number:</strong> {order.ordernumber}</p>
                          <p><strong>Options:</strong> {order.options}</p>
                          <p><strong>Customer Name:</strong> {order.customerDetails?.customername || "N/A"}</p>
                          <p><strong>Table:</strong> {order.tableDetails?.tablename || "N/A"}</p>
                          <p><strong>Waiter:</strong> {order.waiterDetails?.firstname || "N/A"} {order.waiterDetails?.lastname || ""}</p>
                          <p><strong>Date & Time:</strong> {formattedDate} {formattedTime}</p>
                        </div>

                        <table
                          className="table table-bordered"
                          style={{ width: "100%", marginBottom: "20px" }}
                        >
                          <thead>
                            <tr>
                              <th style={{ padding: "8px" }}>Si No</th>
                              <th style={{ padding: "8px" }}>Food Name</th>
                              <th style={{ padding: "8px" }}>Quantity</th>
                              <th style={{ padding: "8px" }}>Unit Price</th>
                              <th style={{ padding: "8px" }}>Price</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.cart.map((cartItem, index) => (
                              <tr key={String(cartItem.foodmenuId)}>
                                <td style={{ padding: "8px" }}>{index + 1}</td>
                                <td style={{ padding: "8px" }}>
                                  {cartItem.menuItemDetails?.foodmenuname || "N/A"}
                                </td>
                                <td style={{ padding: "8px" }}>{cartItem.quantity}</td>
                                <td style={{ padding: "8px" }}>{cartItem.salesprice}</td>
                                <td style={{ padding: "8px" }}>
                                  {cartItem.quantity * cartItem.salesprice}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>

                        <div
                          className="order-totals"
                          style={{ textAlign: "right", marginTop: "20px" }}
                        >
                          <p>
                            <strong>Subtotal:</strong> {subTotals.toFixed(2)}
                          </p>
                          <p>
                            <strong>
                              VAT Amount ({vatPercentValue}%):
                            </strong>{" "}
                            {vatAmount.toFixed(2)}
                          </p>
                          <p>
                            <strong>Grand Total:</strong> {grandTotal.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p>No data</p>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <ReactToPrint
                trigger={() => (
                  <button className="btn btn-primary">
                    Print KOT
                  </button>
                )}
                content={() => componentRef.current}
                onBeforeGetContent={() => {
                  // Optional: Add loading state or modifications before print
                  return Promise.resolve();
                }}
                onAfterPrint={() => {
                  // Optional: Handle post-print actions
                }}
                pageStyle={`
                  @media print {
                    body {
                      margin: 0;
                      padding: 20px;
                    }
                    .order-container {
                      page-break-inside: avoid;
                    }
                    table {
                      width: 100%;
                      border-collapse: collapse;
                    }
                    th, td {
                      border: 1px solid #000;
                      padding: 8px;
                    }
                  }
                `}
                documentTitle="KOT"
              />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowKotModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal backdrop - fixed the click handler */}
      {showkotModal && (
        <div
          className="modal-backdrop show"
          onClick={handleBackdropClick}
          style={{ display: showkotModal ? 'block' : 'none' }}
        ></div>
      )}
    </div>
  );
};

export default RunningOrderKot;