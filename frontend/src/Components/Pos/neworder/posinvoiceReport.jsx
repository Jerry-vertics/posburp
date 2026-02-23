import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import DataTable from "react-data-table-component";
import apiConfig from '../../layouts/base_url';

const PosInvoiceReport = ({ isModalInvoiceReport, setModalInvoiceReport }) => {
    const [posTodaydelivery, setPosTodayDelivery] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleCloseInvoice = () => {
        setModalInvoiceReport(false);
    };

    // Fetch initial data
    useEffect(() => {
        fetchPosInvoiceReport();
    }, []);

    const fetchPosInvoiceReport = async (start = '', end = '') => {
        setIsLoading(true);
        try {
            let url = `${apiConfig.baseURL}/api/pos/invoicereport`;
            if (start && end) {
                url += `?startDate=${start}&endDate=${end}`;
            }

            const response = await fetch(url);
            const data = await response.json();
            setPosTodayDelivery(data);
        } catch (error) {
            console.error("Error fetching invoice report:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = () => {
        if (!startDate || !endDate) {
            return;
        }

        const formattedStartDate = startDate.toISOString().split('T')[0];
        const formattedEndDate = endDate.toISOString().split('T')[0];
        fetchPosInvoiceReport(formattedStartDate, formattedEndDate);
    };

    const handleReset = () => {
        setStartDate(null);
        setEndDate(null);
        fetchPosInvoiceReport();
    };

    // Helper function to safely convert to number
    const toNumber = (value) => {
        const num = parseFloat(value);
        return isNaN(num) ? 0 : num;
    };

    // Add serial numbers to data
    const filteredData = posTodaydelivery.map((order, index) => ({
        ...order,
        siNo: index + 1,
    }));

    // Calculate totals safely
    const totalGrandTotal = filteredData.reduce((sum, item) => {
        return sum + toNumber(item.grandTotal);
    }, 0);

    const columns = [
        {
            name: "SI No",
            selector: row => row.siNo,
            sortable: true,
            width: "70px"
        },
        {
            name: "Select Option",
            selector: row => row.options || 'N/A',
            sortable: true,
            width: "120px"
        },
        {
            name: "Waiter Name",
            selector: row => {
                const firstName = row.waiter?.firstname || '';
                const lastName = row.waiter?.lastname || '';
                return `${firstName} ${lastName}`.trim() || 'N/A';
            },
            sortable: true,
            width: "150px"
        },
        {
            name: "Date",
            selector: row => row.date ? new Date(row.date).toLocaleDateString() : 'N/A',
            sortable: true,
            width: "100px"
        },
        {
            name: "Time",
            selector: row => row.date ? new Date(row.date).toLocaleTimeString() : 'N/A',
            sortable: true,
            width: "100px"
        },
        {
            name: "Subtotal",
            selector: row => {
                const subtotal = toNumber(row.total);
                const vat = 5;
                const vatamounts = (subtotal * vat) / 100;
                return (subtotal - vatamounts).toFixed(2);
            },
            sortable: true,
            width: "100px",
            right: true
        },
        {
            name: "Vat Amount",
            selector: row => {
                const subtotal = toNumber(row.total);
                const vat = 5;
                const vatamounts = (subtotal * vat) / 100;
                return vatamounts.toFixed(2);
            },
            sortable: true,
            width: "100px",
            right: true
        },
        {
            name: "Grand Total",
            selector: row => toNumber(row.grandTotal).toFixed(2),
            sortable: true,
            width: "120px",
            right: true
        },
        {
            name: "Added By",
            selector: row => {
                const firstName = row.user?.firstname || '';
                const lastName = row.user?.lastname || '';
                return `${firstName} ${lastName}`.trim() || 'N/A';
            },
            sortable: true,
            width: "150px"
        },
    ];

    // Custom styles for DataTable
    const customStyles = {
        table: {
            style: {
                overflowX: 'auto'
            }
        },
        headRow: {
            style: {
                backgroundColor: '#f8f9fa',
                fontWeight: 'bold'
            }
        }
    };

    return (
        <>
            {/* Modal */}
            <div
                className={`modal fade ${isModalInvoiceReport ? 'show d-block' : ''}`}
                tabIndex="-1"
                role="dialog"
                style={{ backgroundColor: isModalInvoiceReport ? 'rgba(0,0,0,0.5)' : 'transparent' }}
            >
                <div className="modal-dialog modal-xl" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">POS Invoice Report</h5>
                            <button
                                type="button"
                                className="btn-close"
                                onClick={handleCloseInvoice}
                                aria-label="Close"
                            ></button>
                        </div>

                        <div className="modal-body">
                            <div className="container-fluid">
                                {/* Filter Section */}
                                <div className="row mb-4">
                                    <div className="col-md-3">
                                        <label className="form-label">Start Date</label>
                                        <DatePicker
                                            selected={startDate}
                                            onChange={(date) => setStartDate(date)}
                                            placeholderText="Select Start Date"
                                            className="form-control"
                                            dateFormat="yyyy-MM-dd"
                                            maxDate={endDate || new Date()}
                                        />
                                    </div>

                                    <div className="col-md-3">
                                        <label className="form-label">End Date</label>
                                        <DatePicker
                                            selected={endDate}
                                            onChange={(date) => setEndDate(date)}
                                            placeholderText="Select End Date"
                                            className="form-control"
                                            dateFormat="yyyy-MM-dd"
                                            minDate={startDate}
                                            maxDate={new Date()}
                                        />
                                    </div>

                                    <div className="col-md-2 d-flex align-items-end">
                                        <button
                                            className="btn btn-primary me-2"
                                            onClick={handleSearch}
                                            disabled={!startDate || !endDate || isLoading}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                                                    Searching...
                                                </>
                                            ) : 'Search'}
                                        </button>

                                        <button
                                            className="btn btn-secondary"
                                            onClick={handleReset}
                                            disabled={isLoading}
                                        >
                                            Reset
                                        </button>
                                    </div>
                                </div>

                                {/* Date Range Display */}
                                {startDate && endDate && (
                                    <div className="row mb-3">
                                        <div className="col-12">
                                            <div className="alert alert-info py-2">
                                                <strong>Selected Range:</strong> {startDate.toLocaleDateString()} to {endDate.toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Loading Indicator */}
                                {isLoading && (
                                    <div className="text-center my-4">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </div>
                                )}

                                {/* Data Table */}
                                {!isLoading && (
                                    <div className="row">
                                        <div className="col-12">
                                            <DataTable
                                                columns={columns}
                                                data={filteredData}
                                                pagination
                                                paginationPerPage={10}
                                                paginationRowsPerPageOptions={[10, 20, 50]}
                                                highlightOnHover
                                                striped
                                                responsive
                                                customStyles={customStyles}
                                                noDataComponent={
                                                    <div className="text-center my-4">
                                                        <p className="text-muted">No invoice data available</p>
                                                    </div>
                                                }
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Summary Section - Only show if there's data */}
                                {!isLoading && filteredData.length > 0 && (
                                    <div className="row mt-4">
                                        <div className="col-12">
                                            <div className="card bg-light">
                                                <div className="card-body">
                                                    <h6 className="card-title">Summary</h6>
                                                    <div className="row">
                                                        <div className="col-md-3">
                                                            <strong>Total Invoices:</strong> {filteredData.length}
                                                        </div>
                                                        <div className="col-md-3">
                                                            <strong>Total Grand Total:</strong> ₱{totalGrandTotal.toFixed(2)}
                                                        </div>
                                                        <div className="col-md-3">
                                                            <strong>Average per Invoice:</strong> ₱{(totalGrandTotal / filteredData.length).toFixed(2)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={handleCloseInvoice}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Backdrop */}
            {isModalInvoiceReport && (
                <div className="modal-backdrop fade show"></div>
            )}
        </>
    );
};

export default PosInvoiceReport;