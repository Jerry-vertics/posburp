import React from "react";
import { useState,useEffect } from "react";
import { Link,useNavigate } from "react-router-dom";
import apiConfig from '../layouts/base_url';
import axios from "axios";
import Swal from 'sweetalert2';
const Header =() =>{

  const navigate  = useNavigate();
  const logOut = () => {
    window.localStorage.clear();
    navigate('/')

  };

  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [shiftstokens, setShiftsTokens] = useState('');
  const [uesrId,setUserId] =useState('');
  const [isPasswordmodel, setPasswordModel] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
  useEffect(() => {

const storedFirstname = localStorage.getItem('firstname');
const storeid = localStorage.getItem("_id");
const storedLastname = localStorage.getItem('lastname');
const storedtoken = localStorage.getItem('shifttoken');
const userRole  =localStorage.getItem('userrole');

//console.log(userRole);

setFirstname(storedFirstname);
setLastname(storedLastname);
setShiftsTokens(storedtoken);
setUserId(storeid)
  }, []);


  const handlePassword =() =>{


    setPasswordModel(true);

  }

  const id = localStorage.getItem("_id");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await axios.post(`${apiConfig.baseURL}/api/user/changepassword`, {
            userId: id,
            currentPassword,
            newPassword,
        });

        // Display success message
        Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: response.data.message, // Password updated successfully
        });

        setPasswordModel(false);
    } catch (error) {
        // Display error message
        Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: error.response.data.message, // Error message from the server
        });
    }
};


  const fullName = `${firstname} ${lastname}`;
  const imageName = "burps.png";
  const faceimage ="face1.jpg"



    return (
      <>
        <nav className="navbar default-layout-navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
        <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-center">
          <Link className="navbar-brand brand-logo" to="/dashboard"><img src={`/assets/images/pos/${imageName}`} className="img-fluid" alt="Burps Logo" /></Link>
          <Link className="navbar-brand brand-logo-mini" to="/dashboard"><img src="assets/images/logo-mini.svg" alt="logo" /></Link>
        </div>
        <div className="navbar-menu-wrapper d-flex align-items-stretch">
          <button className="navbar-toggler navbar-toggler align-self-center" type="button" data-toggle="minimize">
            <span className="mdi mdi-menu"></span>
          </button>
          <div className="search-field d-none d-md-block">
            <form className="d-flex align-items-center h-100" action="#">
              <div className="input-group">
                <div className="input-group-prepend bg-transparent">
                  <i className="input-group-text border-0 mdi mdi-magnify"></i>
                </div>
                <input type="text" className="form-control bg-transparent border-0" placeholder="Search projects" />
              </div>
            </form>
          </div>
          <ul className="navbar-nav navbar-nav-right">
            <li className="nav-item nav-profile dropdown">
              <a className="nav-link dropdown-toggle" id="profileDropdown" href="#" data-bs-toggle="dropdown" aria-expanded="false">
                <div className="nav-profile-img">
                <img src={`/assets/images/faces/${faceimage}`}  alt="inage" />

                  <span className="availability-status online"></span>
                </div>
                <div className="nav-profile-text">
                  <p className="mb-1 text-black">{fullName}</p>
                </div>
              </a>
              <div className="dropdown-menu navbar-dropdown" aria-labelledby="profileDropdown">
                <a className="dropdown-item"   onClick={(e) => handlePassword(id)}>
                  <i className="mdi mdi-cached me-2 text-success"></i> Change Password </a>
                <div className="dropdown-divider"></div>
                <a className="dropdown-item" onClick={logOut}>
                  <i className="mdi mdi-logout me-2 text-primary"></i> Signout </a>
              </div>
            </li>



            <li className="nav-item nav-logout d-none d-lg-block">
              <a className="nav-link"  onClick={logOut}>
                <i className="mdi mdi-power"></i>
              </a>
            </li>

            <li className="nav-item nav-logout d-none d-lg-block">
              <a className="nav-link"  >

              </a>
            </li>

          </ul>
          <button className="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button" data-toggle="offcanvas">
            <span className="mdi mdi-menu"></span>
          </button>
        </div>
      </nav>


      <div>



<div className={`modal ${isPasswordmodel ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: isPasswordmodel ? 'block' : 'none' }}>
         <div className="modal-dialog" role="document">
           <div className="modal-content">
             <div className="modal-header">
               <h5 className="modal-title">Change Password </h5>
               <button type="button" className="close" onClick={() => setPasswordModel(false)}>
                 <span aria-hidden="true">&times;</span>
               </button>
             </div>
             <div className="modal-body">

          <form onSubmit={handleSubmit}>
  <div className="form-group row">
    {/* Change 'for' to 'htmlFor' */}
    <label htmlFor="currentPassword" className="col-sm-3 col-form-label">
      Current Password
    </label>
    <div className="col-sm-9">
      <input
        type="password"
        className="form-control"
        id="currentPassword"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        placeholder="Enter Old Password"
      />
    </div>
  </div>

  <div className="form-group row">
    {/* Change 'for' to 'htmlFor' */}
    <label htmlFor="newPassword" className="col-sm-3 col-form-label">
      New Password
    </label>
    <div className="col-sm-9">
      <input
        type="password"
        className="form-control"
        id="newPassword"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="Enter New Password"
      />
    </div>
  </div>

  <button type="submit" className="btn btn-outline-primary">
    Change Password
  </button>
</form>


             </div>

           </div>
         </div>
       </div>
       <div className={`modal-backdrop ${isPasswordmodel ? 'show' : ''}`} style={{ display: isPasswordmodel ? 'block' : 'none' }}></div>


     </div>

      </>
    );
}

export default Header;