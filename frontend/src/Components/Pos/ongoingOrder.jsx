// OngoingOrder.jsx (Running Order)
import React from "react";
import BasePosLayout from "../layouts/BasePosLayout";
import PosRunningOrder from "./posRunningorder";

const OngoingOrder = () => {
  return (
    <BasePosLayout activeTab="runningorder">
      <div className="tab-pane active" id="runningorder" role="tabpanel">
        <PosRunningOrder />
      </div>
    </BasePosLayout>
  );
};

export default OngoingOrder;