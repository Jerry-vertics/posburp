import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import apiConfig from '../layouts/base_url';

const PosDeliverySession = ({ isModalDeliveryReport, setModalDeliveryReport }) => {
    const [posTodaydelivery, setPosTodayDelivery] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isModalDeliveryReport) {
            fetchDeliveryData();
        }
    }, [isModalDeliveryReport]);

    const fetchDeliveryData = () => {
        setLoading(true);
        fetch(`${apiConfig.baseURL}/api/pos/gettodaydelivery`)
            .then((response) => response.json())
            .then((data) => {
                setPosTodayDelivery(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setLoading(false);
            });
    };

    const totalGrandTotal = Array.isArray(posTodaydelivery)
        ? posTodaydelivery.reduce((total, order) => {
            const orderGrandTotal = parseFloat(order.grandTotal) || 0;
            return total + orderGrandTotal;
        }, 0)
        : 0;

    const handlePrint = (order) => {
        // Add your print logic here
        console.log('Print order:', order);
    };

    const handleKOT = (order) => {
        // Add your kitchen order ticket logic here
        console.log('KOT for order:', order);
    };

    const handleClose = () => {
        setModalDeliveryReport(false);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        const formattedDate = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
        const formattedTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
        return `${formattedDate} ${formattedTime}`;
    };

    return (
        <div>
            <div
                className={`modal ${isModalDeliveryReport ? 'show' : ''}`}
                tabIndex="-1"
                role="dialog"
                style={{ display: isModalDeliveryReport ? 'block' : 'none' }}
            >
                <div className="modal-dialog modal-lg" role="document" style={{ maxWidth: '1200px' }}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                <i className="mdi mdi-truck-delivery mr-2"></i>
                                Delivery Session Report
                            </h5>
                            <button
                                type="button"
                                className="close"
                                onClick={handleClose}
                            >
                                <span>&times;</span>
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="container-fluid">
                                <div className="row">
                                    <div className="col-12">
                                        {loading ? (
                                            <div className="text-center p-4">
                                                <div className="spinner-border text-primary" role="status">
                                                    <span className="sr-only">Loading...</span>
                                                </div>
                                                <p className="mt-2">Loading delivery data...</p>
                                            </div>
                                        ) : (
                                            <div className="table-responsive">
                                                <table className="table table-bordered table-hover">
                                                    <thead className="thead-light">
                                                        <tr>
                                                            <th>SI No</th>
                                                            <th>Bill Number</th>
                                                            <th>Order Number</th>
                                                            <th>Order Type</th>
                                                            <th>Waiter</th>
                                                            <th>Subtotal</th>
                                                            <th>VAT Amount</th>
                                                            <th>Date & Time</th>
                                                            <th>Added By</th>
                                                            <th>Delivered By</th>
                                                            <th>Grand Total</th>
                                                            <th>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {Array.isArray(posTodaydelivery) && posTodaydelivery.length > 0 ? (
                                                            posTodaydelivery.map((order, key) => {
                                                                const subtotal = parseFloat(order.total) || 0;
                                                                const vat = 5;
                                                                const vatamounts = (subtotal * vat) / 100;
                                                                const subtotalAfterVat = subtotal - vatamounts;

                                                                return (
                                                                    <tr key={order._id || key}>
                                                                        <td>{key + 1}</td>
                                                                        <td>{order.billnumber || 'N/A'}</td>
                                                                        <td>{order.ordernumber || 'N/A'}</td>
                                                                        <td>
                                                                            <span className="badge badge-info">
                                                                                {order.options || 'N/A'}
                                                                            </span>
                                                                        </td>
                                                                        <td>
                                                                            {order.waiter
                                                                                ? `${order.waiter.firstname || ''} ${order.waiter.lastname || ''}`.trim() || 'N/A'
                                                                                : 'N/A'
                                                                            }
                                                                        </td>
                                                                        <td>{subtotalAfterVat.toFixed(2)}</td>
                                                                        <td>{vatamounts.toFixed(2)}</td>
                                                                        <td>{formatDate(order.updatedAt)}</td>
                                                                        <td>
                                                                            {order.user
                                                                                ? `${order.user.firstname || ''} ${order.user.lastname || ''}`.trim() || 'N/A'
                                                                                : 'N/A'
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {order.deliveryperson
                                                                                ? `${order.deliveryperson.firstname || ''} ${order.deliveryperson.lastname || ''}`.trim() || 'N/A'
                                                                                : 'N/A'
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            <strong>
                                                                                {order.grandTotal ? parseFloat(order.grandTotal).toFixed(2) : '0.00'}
                                                                            </strong>
                                                                        </td>
                                                                        <td>
                                                                            <button
                                                                                className="btn btn-sm btn-primary mr-1"
                                                                                onClick={() => handlePrint(order)}
                                                                                title="Print Receipt"
                                                                            >
                                                                                <i className="mdi mdi-cloud-print-outline"></i>
                                                                            </button>
                                                                            <button
                                                                                className="btn btn-sm btn-danger"
                                                                                onClick={() => handleKOT(order)}
                                                                                title="Kitchen Order Ticket"
                                                                            >
                                                                                <i className="mdi mdi-food-variant"></i>
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })
                                                        ) : (
                                                            <tr>
                                                                <td colSpan="12" className="text-center p-4">
                                                                    <i className="mdi mdi-information-outline mdi-24px"></i>
                                                                    <p className="mt-2">No delivery orders found for today</p>
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                    <tfoot className="table-info">
                                                        <tr>
                                                            <td colSpan="10" className="text-right">
                                                                <strong>Total Grand Total:</strong>
                                                            </td>
                                                            <td colSpan="2">
                                                                <strong>{totalGrandTotal.toFixed(2)}</strong>
                                                            </td>
                                                        </tr>
                                                    </tfoot>
                                                </table>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={handleClose}
                            >
                                <i className="mdi mdi-close mr-1"></i>
                                Close
                            </button>

                        </div>
                    </div>
                </div>
            </div>

            <div
                className={`modal-backdrop ${isModalDeliveryReport ? 'show' : ''}`}
                style={{ display: isModalDeliveryReport ? 'block' : 'none' }}
            ></div>
        </div>
    );
};

export default PosDeliverySession;