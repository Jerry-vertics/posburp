// BasePosLayout.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaHistory, FaRegCalendarAlt } from 'react-icons/fa';
import { MdBookOnline } from "react-icons/md";
import { IoMdToday } from "react-icons/io";
import newUser from '../layouts/newUser';

const BasePosLayout = ({ activeTab, children }) => {
  const { fullName } = newUser();

    const faceimage ="face1.jpg"

  const tabs = [
    {
      path: "/pos",
      icon: <FaShoppingCart className="mr-1" />,
      label: "New Order",
      key: "neworder"
    },
    {
      path: "/runningorder",
      icon: <FaHistory className="mr-2" />,
      label: "Running Order",
      key: "runningorder"
    },
    // {
    //   path: "/onlineorder",
    //   icon: <MdBookOnline className="mr-1" />,
    //   label: "Online Order",
    //   key: "onlineorder"
    // },
    {
      path: "/deliverysession",
      icon: <FaRegCalendarAlt className="mr-2" />,
      label: "Mess Management",
      key: "deliverysession"
    },
    // {
    //   path: "/settlementreport",
    //   icon: <IoMdToday className="mr-2" />,
    //   label: "Settlement Report",
    //   key: "settlementreport"
    // }
  ];

  return (
    <div className="container-fluid">
      <div className="division">
        <div className="row">
          <div className="col-md-2">
            <div className="w-100 d-inline-block text-center pt-3">
              <Link to="/dashboard">
                <img src="assets/images/pos/burps.png" className="img-fluid posimgs" alt="Burps" />
              </Link>
            </div>
          </div>
          <div className="col-md-10 main-content">
            <div className="menumain">
              <ul className="nav nav-tabs nav-justified" role="tablist">
                {tabs.map((tab) => (
                  <li className="nav-item" key={tab.key}>
                    <Link
                      className={`nav-link ${activeTab === tab.key ? 'active' : ''}`}
                      to={tab.path}
                      role="tab"
                    >
                      {tab.icon} {tab.label}
                    </Link>
                  </li>
                ))}
                   <li className="nav-item d-flex align-items-center">
                  <Link className="nav-link d-flex align-items-center" to="#" role="tab">
                    {fullName && (
                      <>
                        <img
                          src={`/assets/images/faces/${faceimage}`}
                          alt={`${fullName}'s profile`}
                          className="rounded-circle mr-2"
                          style={{
                            width: '32px',
                            height: '32px',
                            objectFit: 'cover'
                          }}
                        />
                        <span className="ml-2 h6 mb-0">
                          {fullName}
                        </span>
                      </>
                    )}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="tab-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default BasePosLayout;