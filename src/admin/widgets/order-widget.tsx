import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { Button } from "@medusajs/ui";
import { DetailWidgetProps, AdminProduct } from "@medusajs/framework/types";
import DrawerComponent from "../components/drawer";
import SignUpForm from "../components/sign-up";

const CreatetWidget = ({ data }: DetailWidgetProps<AdminProduct>) => {
  console.log(data);
  return (
    <div className="flex items-center justify-end py-4">
      <DrawerComponent title="Create Order" content={<SignUpForm />} />
    </div>
  );
};

export const config = defineWidgetConfig({
  zone: "order.list.before",
});

export default CreatetWidget;
