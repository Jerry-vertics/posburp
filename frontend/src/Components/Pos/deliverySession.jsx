// DeliverySession.jsx (Mess Management)
import React from "react";
import BasePosLayout from "../layouts/BasePosLayout";
import { PosMessmanage } from "./mess/PosMessmanage";

const DeliverySession = () => {
  return (
    <BasePosLayout activeTab="deliverysession">
      <div className="tab-pane active" id="deliverysession" role="tabpanel">
        <PosMessmanage />
      </div>
    </BasePosLayout>
  );
};

export default DeliverySession;