import React from "react";
import { useState,useEffect,useRef } from "react";
import axios from "axios";
import { redirect, useNavigate,Link } from "react-router-dom";
import Swal from 'sweetalert2';

import apiConfig from '../layouts/base_url';
import PosMergemodal from "../Pos/runningorder/posMergemodal";
import PosSplitModal from "../Pos/runningorder/posSplitmodal";
import RunningOrderKot from "./runningorder/posKotmodal";
import RunningPaymentModal from "./runningorder/posPaymentmodal";
const PosRunningOrder = ()=>{


    const [posRunningorder, setPosRunningorder] = useState([]);
    const [data, setData] = useState(null);
    const [kotdata,setkotData] =useState(null);

    const [showModal, setShowModal] = useState(false);
    const [showkotModal,setShowKotModal] =useState(false);


 const [searchTerm, setSearchTerm] = useState('');
   const [refresh, setRefresh] = useState(false);
   const [checkedOrders, setCheckedOrders] = useState([]);
   const [mergdata, setMergedata] = useState(null);
   const [mergeModal, setMergeModal] = useState(false);
   const [splitdata,setSplitData] =useState(null);
   const [showSplitModal,setShowSplitModal] =useState(false);

   const [editdata,setEditData] =useState(null);



      const componentRef = useRef();

      const kotModalRef = useRef();

      const handlePrint = () => {
        if (kotModalRef.current) {
          // Use ReactToPrint to handle the print action for the KOT modal
          kotModalRef.current.handlePrint();
        }
      }
    useEffect(() => {
      fetch(`${apiConfig.baseURL}/api/pos/getrunningorder`)
        .then((response) => response.json())
        .then((data) => setPosRunningorder(data))
        .catch((error) => console.error(error));
    }, [refresh]);

    const filteredOrders = posRunningorder.filter((order) => {
      const searchTermLower = searchTerm.toLowerCase();
      const orderNumberIncludes = order.ordernumber.toLowerCase().includes(searchTermLower);
      const tableNameIncludes = order.table && order.table.tablename.toLowerCase().includes(searchTermLower);
      const waiterNameIncludes = order.waiter.firstname.toLowerCase().includes(searchTermLower);

      return orderNumberIncludes || (tableNameIncludes && waiterNameIncludes);
    });
    const handleComplete =(id) =>{
        console.log(id);
        axios.get(`${apiConfig.baseURL}/api/pos/getcomplete/${id}`)
        .then((response) => {
            setData(response.data);
            console.log(response.data);
            setShowModal(true);
          })
          .then(() => {

            setPosRunningorder((prevOrders) => prevOrders.filter(order => order._id !== id));
          })
          .catch((error) => {
            console.error('Error fetching data:', error);
          });

    }

    const closeModal = () => {
        setShowModal(false);

      };







const handlekot =(id) =>
{

  const url = `${apiConfig.baseURL}/api/pos/getKot/${id}`;
  axios.get(url)
  .then((response) => {
    setkotData(response.data);
    console.log(response.data);
    setShowKotModal(true);
  })

  .catch((error) => {
    console.error('Error fetching data:', error);
  });

}

const handleEdit =(id) =>
{
  const url = `${apiConfig.baseURL}/api/pos/getEdit/${id}`;
  axios.get(url)
  .then((response) => {
    setEditData(response.data);
    console.log(response.data);
   // setShowKotModal(true);
  })

  .catch((error) => {
    console.error('Error fetching data:', error);
  });
}


  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlesplit =(id)=>
  {
    const url = `${apiConfig.baseURL}/api/pos/getsplit/${id}`;
    axios.get(url)
    .then((response) => {
      setSplitData(response.data);
      console.log(response.data);
      setShowSplitModal(true);
    })

    .catch((error) => {
      console.error('Error fetching data:', error);
    });

  }



  const handleMergeRequest = async () => {

    try {
      const response = await axios.post(`${apiConfig.baseURL}/api/pos/getmerge/`, {
         ids:checkedOrders
      });
      setMergedata(response.data);
      setMergeModal(true);

    } catch (error) {

      console.error('Error:', error);
    }
  }

  const handleCheckboxChange = (orderId) => {
    setCheckedOrders((prevCheckedOrders) => {
      if (prevCheckedOrders.includes(orderId)) {
        return prevCheckedOrders.filter((id) => id !== orderId);
      } else {
        return [...prevCheckedOrders, orderId];
      }
    });
  };



    return(
        <>
        <div className="container">


        <div className="row">

       <div className="col-md-10">
        <div className="form-group">
        <input
          type="text"
          placeholder="Search by OrderID"
          value={searchTerm}
          onChange={handleSearch}
          className="form-control"
        />
        </div>
       </div>
       <div className="col-md-2">
       <a className="btn btn-outline-primary" onClick={handleMergeRequest}>Merge</a>
       </div>


       {
filteredOrders.map((order) => (
    <div key={order._id} className="col-md-3">
      <div className="menu-boxs">
        <div className="menu-div">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input text-right"
              id={`checkbox-${order._id}`}
              onChange={() => handleCheckboxChange(order._id)}
              checked={checkedOrders.includes(order._id)}
            />
          </div>

          <h6 className="text-center"><span>{order.ordernumber}</span></h6>
          <h6 className="text-center">Table: {order.table ? order.table.tablename : 'No Table'}</h6>
          <h6 className="text-center">WaiterName: {order.waiter.firstname}{order.waiter.lastname}</h6>
          <h6 className="text-start">Running order</h6> {/* Changed from text-center to text-start */}

          <div className="row mt-3"> {/* Added mt-3 for top margin */}
            <div className="d-flex justify-content-start gap-2 mx-auto"> {/* Changed to d-flex with gap */}
              <a className="btn btn-outline-primary btn-sm" onClick={(e) => handleComplete(order._id)}>Payment</a>
              <a className="btn btn-outline-primary btn-sm" onClick={(e) => handlekot(order._id)}>KOT</a>
              <Link to={`/posedit/${order._id}`} className="btn btn-outline-primary btn-sm">Edit</Link>
              <a className="btn btn-outline-primary btn-sm" onClick={(e) => handlesplit(order._id)}>Split</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  ))
}


        </div>
 {/* Modal */}
    <RunningPaymentModal data={data} showModal={showModal} setShowModal={setShowModal} />

    {/* Setkot Table */}
    <RunningOrderKot kotdata={kotdata} showkotModal={showkotModal} setShowKotModal={setShowKotModal} />

    {/* Split Modal */}
      <PosSplitModal splitdata={splitdata} setSplitData={setSplitData} showSplitModal={showSplitModal} setShowSplitModal={setShowSplitModal}   />

      {/* Merge Modal */}

      <PosMergemodal mergdata={mergdata}  mergeModal={mergeModal} setMergeModal={setMergeModal} />

    </div>
        </>
    );
}

export default PosRunningOrder;