import React from 'react'
import { useState ,useEffect} from 'react'
import Header from '../layouts/Header';
import Sidebar from '../layouts/Sidebar';
import Footer from '../layouts/Footer';
import axios from "axios";
import { redirect, useNavigate,Link,useParams } from "react-router-dom";
import apiConfig from '../layouts/base_url';
import DataTable from "react-data-table-component";
import Swal from 'sweetalert2';
const ViewUser =() =>{



  const [data , setData] =useState([]);
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();
  const {id} =useParams()
  useEffect( ()=>{

      axios.get(`${apiConfig.baseURL}/api/user/getusers`)
      .then((res) => {
        setData(res.data);

        // Initialize DataTables after data is loaded
        $(document).ready(function () {
          $('#example_table').DataTable();
        });
      })
      .catch((err) => console.log(err));
  }, []);


  const handleDeactivate = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.put(`${apiConfig.baseURL}/api/user/deactivate/${id}`)
          .then((res) => {
            Swal.fire({
              icon: 'success',
              title: 'DeActivate!',
              text: 'User  has been Deactivated.',
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
              }
            });
            // Refresh data after successful delete
            axios.get(`${apiConfig.baseURL}/api/user/getusers`)
              .then((response) => {
                setData(response.data);
              })
              .catch((error) => console.error(error));
          })
          .catch((err) => console.log(err));
      }
    });
  };


  const handleActivate = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.put(`${apiConfig.baseURL}/api/user/activate/${id}`)
          .then((res) => {
            Swal.fire({
              icon: 'success',
              title: 'Activate!',
              text: 'User  has been Activated.',
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.onmouseenter = Swal.stopTimer;
                toast.onmouseleave = Swal.resumeTimer;
              }
            });
            // Refresh data after successful delete
            axios.get(`${apiConfig.baseURL}/api/user/getusers`)
              .then((response) => {
                setData(response.data);
              })
              .catch((error) => console.error(error));
          })
          .catch((err) => console.log(err));
      }
    });
  };

  const columns = [
    {
      name: 'S.No',
      cell: (row, index) => index + 1,
      sortable: false,
    },
    {
      name: 'Name',
      selector: 'fullname',
      sortable: true,
      cell: row => <div>{row.firstname} {row.lastname}</div>
    },
    {
      name: 'Email',
      selector: 'email',
      sortable: true,
    },
    {
      name: 'Mobile',
      selector: 'mobile',
      sortable: true,
    },
    {
      name: 'UserRole',
      selector: 'userrole',
      sortable: true,
    },
    {
      name: 'Action',
      cell: row => (
        <div>
          <Link to={`/edituser/${row._id}`} className="btn btn-primary"></Link>
          {row.status === "Active" ? (
            <button onClick={(e) => handleDeactivate(row._id)} className="btn btn-danger ml-2"></button>
          ) : (
            <button onClick={(e) => handleActivate(row._id)} className="btn btn-success ml-2"></button>
          )}
        </div>
      ),
    },
  ];

  const customStyles = {
    headRow: {
      style: {
        backgroundColor: '#f2f2f2',
      },
    },
  };

  const filteredData = data.filter(item =>
    item.firstname.toLowerCase().includes(searchText.toLowerCase()) ||
    item.lastname.toLowerCase().includes(searchText.toLowerCase()) ||
    item.email.toLowerCase().includes(searchText.toLowerCase()) ||
    item.mobile.toLowerCase().includes(searchText.toLowerCase())
  );


    return (
        <div className="container-scroller">
        <Header />
        <div className="container-fluid page-body-wrapper">
            <Sidebar />
            <div className="main-panel">
            <div className="content-wrapper">
                  <div className="col-lg-12 grid-margin stretch-card">
                <div className="card">
                  <div className="card-body">
                    <h4 className="card-title">Users</h4>
                    <div className="d-flex justify-content-end">
                    <Link to="/adduser" className="btn btn-success">Add +</Link>

                </div>

                {/* <table className="table table-hover"  id="example_table" style={{ width: "100%" }}>
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                        <th>Mobile</th>
                        <th>Action</th>

                        </tr>
                      </thead>
                      <tbody>
                      {
                        data.map((d,i) =>(

                            <tr key={i}>
                                <td>{d.firstname} {d.lastname}</td>
                                <td>
                                    {d.email}
                                </td>

                                <td>
                                {d.mobile}
                                </td>

                                <td>
                                <Link to={`/edituser/${d._id}`} className="btn btn-primary">Edit</Link>

                                {d.status === "Active" ? (
                               <button onClick={(e) => handleDeactivate(d._id)} className="btn btn-danger ml-3">Deactivate</button>
                                  ) : (
                                   <button onClick={(e) => handleActivate(d._id)} className="btn btn-success ml-3">Activate</button>
                                 )}

                                </td>

                            </tr>

                        ))
                    }
                      </tbody>
                    </table> */}
                   <DataTable
      columns={columns}
      data={filteredData}
      pagination
      paginationPerPage={10}
      paginationRowsPerPageOptions={[10, 25, 50, 100]}
      paginationTotalRows={data.length}
      onChangePage={page => console.log(page)}
      onChangeRowsPerPage={(currentRowsPerPage, currentPage) => console.log(currentRowsPerPage, currentPage)}
      subHeader
      subHeaderComponent={
        <input
          type="text"
          placeholder="Search..."
          onChange={(e) => setSearchText(e.target.value)}
          value={searchText}
        />
      }
    />
                  </div>
                </div>
              </div>
                    </div>
                    <Footer />
            </div>
        </div>
    </div>
    )
}

export default ViewUser;