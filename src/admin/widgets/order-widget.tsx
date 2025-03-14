import { defineWidgetConfig } from "@medusajs/admin-sdk";
import DrawerComponent from "../components/drawer";
import OrderForm from "../components/create-order";
import { useState } from "react";

const CreatetWidget = () => {
  const [isFormSubmitted,setisFormSubmitted]=useState(false);
  return (
    <div className="flex items-center justify-end">
      <DrawerComponent title="Create Order" content={<OrderForm />} />
    </div>
  );
};

export const config = defineWidgetConfig({
  zone: "order.list.before",
});

export default CreatetWidget;
