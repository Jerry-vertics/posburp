import React from "react";
import { useState,useEffect } from "react";
import axios from "axios";
import { redirect, useNavigate,Link } from "react-router-dom";
import apiConfig from "../layouts/base_url";
const PosTable =() =>{
  const [table, setTable] = useState([]);

  const [showTable, setShowTable] = useState(false);
  const handleCloseTable =() =>{
    setShowTable(false);
  }

  const containerStyle = {
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '50%',
  };

  useEffect(() => {

      axios.get(`${apiConfig.baseURL}/api/pos/posTable`)
      .then((response) => {
          setTable(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);


    return (
        <>


      {/* Table */}
      <div
        className={`modal ${showTable ? 'show' : ''}`}
        style={{ display: showTable ? 'block' : 'none' }}
        tabIndex="-1"
        role="dialog"
      >
        <div className="modal-dialog modal-xl modal-dialog-scrollable" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Tables</h5>
              <button
                type="button"
                className="close"
                data-dismiss="modal"
                aria-label="Close"
                onClick={handleCloseTable}
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
            <div className="row">

            {
                  table.map((tables) =>(

                <div className="col-md-3">
                     <div className="card">
                   <img style={containerStyle} src="assets/images/table.png" className="center" alt="logo" />
                   <h6 className="text-center">
                   Tablename:{tables.tablename}
                   </h6>
                   <h6 className="text-center">
                   Seatcapacity:{tables.seatcapacity}
                   </h6>
                </div>
                </div>
                  ))
            }






             </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-dismiss="modal"
                onClick={handleCloseTable}
              >
                Close
              </button>
              <button type="submit" className="btn btn-gradient-primary me-2">Submit</button>
            </div>

          </div>
        </div>
      </div>
      <div
        className={`modal-backdrop fade ${showTable ? 'show' : ''}`}
        style={{ display: showTable ? 'block' : 'none' }}
      ></div>
      </>
    );
}

export default PosTable;