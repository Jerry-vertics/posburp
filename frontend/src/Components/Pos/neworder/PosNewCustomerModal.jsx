import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import apiConfig from "../../layouts/base_url";
import {
 FaSave,FaUserAlt
} from "react-icons/fa";
const PosNewCustomerModal = ({ isModalOpen, setModalOpen, onCustomerAdded }) => {
  const [values, setValues] = useState({
    customername: "",
    customeremail: "",
    customermobile: "",
    customeraddress: ""
  });

  const [errors, setErrors] = useState({});

  const validateForm = (data) => {
    const errors = {};
    if (!data.customername.trim()) {
      errors.customername = "Customer name is required";
    }
    if (!data.customeremail.trim()) {
      errors.customeremail = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(data.customeremail)) {
      errors.customeremail = "Email is invalid";
    }
    if (!data.customermobile.trim()) {
      errors.customermobile = "Mobile number is required";
    }
    return errors;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validateForm(values);
    if (Object.keys(validationErrors).length === 0) {
      axios.post(`${apiConfig.baseURL}/api/customer/createCustomer`, values)
        .then(res => {
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Customer added successfully',
            timer: 1500
          });
          setValues({
            customername: "",
            customeremail: "",
            customermobile: "",
            customeraddress: ""
          });
          setErrors({});
          setModalOpen(false);
          // Call the callback to refresh customer list
          if (onCustomerAdded) {
            onCustomerAdded();
          }
        })
        .catch(err => {
          console.log(err);
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Failed to add customer'
          });
        });
    } else {
      setErrors(validationErrors);
    }
  };

  const handleClose = () => {
    setModalOpen(false);
    setValues({
      customername: "",
      customeremail: "",
      customermobile: "",
      customeraddress: ""
    });
    setErrors({});
  };

  if (!isModalOpen) return null;

  return (
    <>
      <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title">

                Add New Customer
              </h5>
              <button
                type="button"
                className="close text-white"
                onClick={handleClose}
              >
                <span>&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <form className="forms-sample" onSubmit={handleSubmit}>
                <div className="row">
                  <div className="form-group row">
                    <label htmlFor="customername" className="col-sm-3 col-form-label">
                      Customer Name <span className="text-danger">*</span>
                    </label>
                    <div className="col-sm-9">
                      <input
                        type="text"
                        className="form-control"
                        name="customername"
                        value={values.customername}
                        onChange={e => setValues({ ...values, customername: e.target.value })}
                        placeholder="Enter customer name"
                      />
                      {errors.customername && (
                        <span className="error text-danger small">{errors.customername}</span>
                      )}
                    </div>
                  </div>

                  <div className="form-group row">
                    <label htmlFor="customeremail" className="col-sm-3 col-form-label">
                      Customer Email <span className="text-danger">*</span>
                    </label>
                    <div className="col-sm-9">
                      <input
                        type="email"
                        className="form-control"
                        name="customeremail"
                        value={values.customeremail}
                        onChange={e => setValues({ ...values, customeremail: e.target.value })}
                        placeholder="Enter customer email"
                      />
                      {errors.customeremail && (
                        <span className="error text-danger small">{errors.customeremail}</span>
                      )}
                    </div>
                  </div>

                  <div className="form-group row">
                    <label htmlFor="customermobile" className="col-sm-3 col-form-label">
                      Customer Mobile <span className="text-danger">*</span>
                    </label>
                    <div className="col-sm-9">
                      <input
                        type="text"
                        className="form-control"
                        name="customermobile"
                        value={values.customermobile}
                        onChange={e => setValues({ ...values, customermobile: e.target.value })}
                        placeholder="Enter customer mobile"
                      />
                      {errors.customermobile && (
                        <span className="error text-danger small">{errors.customermobile}</span>
                      )}
                    </div>
                  </div>

                  <div className="form-group row">
                    <label htmlFor="customeraddress" className="col-sm-3 col-form-label">
                      Customer Address
                    </label>
                    <div className="col-sm-9">
                      <textarea
                        className='form-control'
                        name='customeraddress'
                        value={values.customeraddress}
                        onChange={e => setValues({ ...values, customeraddress: e.target.value })}
                        rows="3"
                        placeholder="Enter customer address"
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="modal-footer px-0 pb-0">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                   <FaSave /> Save Customer
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export default PosNewCustomerModal;