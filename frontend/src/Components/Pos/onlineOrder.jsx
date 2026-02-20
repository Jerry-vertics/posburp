// OngoingOrder.jsx (Running Order)
import React from "react";
import BasePosLayout from "../layouts/BasePosLayout";
import posOnlineorder from '../Pos/posOnlneorder';

const OnlineOrder = () => {
  return (
    <BasePosLayout activeTab="onlineorder">
      <div className="tab-pane active" id="onlineorder" role="tabpanel">
        <posOnlineorder />
      </div>
    </BasePosLayout>
  );
};

export default OnlineOrder;