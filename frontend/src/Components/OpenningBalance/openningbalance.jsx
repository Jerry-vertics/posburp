import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../layouts/Header';
import Sidebar from '../layouts/Sidebar';
import Footer from '../layouts/Footer';
import axios from 'axios';
import apiConfig from '../layouts/base_url';
import Swal from 'sweetalert2';

const OpenningBalance = () => {
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState({});
  const [addedby, setuserid] = useState('');
  const [shiftstoken, setShiftstoken] = useState('');

  useEffect(() => {
    const storeid = localStorage.getItem('_id');
    const storetoken = localStorage.getItem('shifttoken');
    setuserid(storeid);
    setShiftstoken(storetoken)
  }, []);


  const navigate = useNavigate();



  const handleSubmit = (event) => {
    event.preventDefault();


    // if (Object.keys(validationErrors).length === 0) {
    const formData = new FormData();
    formData.append('amount', amount);
    formData.append('addedby', addedby);
    formData.append('shiftstoken', shiftstoken);

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };


    axios
      .post(`${apiConfig.baseURL}/api/openningbalance/create`, formData, config)
      .then((res) => {
        console.log(res);
        Swal.fire({
          icon: 'success',
          title: 'Opening Balance Created!',
          text: 'Your Opening Balance has been created successfully.',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
          },
        }).then(() => {
          navigate('/pos');
        });
      })
      .catch((err) => console.log(err));
    // } else {
    //   // Set validation errors
    //   setErrors(validationErrors);
    // }
  };

  const validateForm = (data) => {
    let errors = {};

    if (!data.amount) {
      errors.amount = 'Opening Balance is required';
    }

    return errors;
  };

  return (
    <div className="container-scroller">
      <Header />
      <div className="container-fluid page-body-wrapper">
        <Sidebar />
        <div className="main-panel">
          <div className="content-wrapper">
            <div className="page-header">
              <h3 className="page-title"> Add Opening Balance Account </h3>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a href="#">Food</a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    Add Opening Balance
                  </li>
                </ol>
              </nav>
            </div>
            <div className="row">
              <div className="col-md-12 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    <form className="forms-sample" onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="form-group row">
                          <label
                            htmlFor="exampleInputUsername2"
                            className="col-sm-3 col-form-label"
                          >
                            Amount
                          </label>
                          <div className="col-sm-9">
                            <input
                              type="text"
                              className="form-control"
                              name="amount"
                              id="exampleInputUsername2"
                              value={amount}
                              onChange={(e) => {
                                setAmount(e.target.value);
                                setErrors({}); // Clear errors when the user starts typing
                              }}
                              placeholder="Opening Balance Amount"
                            />
                            {errors.amount && (
                              <span className="error">{errors.amount}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="btn btn-gradient-primary me-2"
                      >
                        Submit
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default OpenningBalance;
