// Pos.jsx (New Order)
import React from "react";
import BasePosLayout from "../layouts/BasePosLayout";
import PosNewOrder from "./posNeworder";

const Pos = () => {
  return (
    <BasePosLayout activeTab="neworder">
      <div className="tab-pane active" id="neworder" role="tabpanel">
        <PosNewOrder />
      </div>
    </BasePosLayout>
  );
};

export default Pos;