import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { Button } from "@medusajs/ui";
import { DetailWidgetProps, AdminProduct } from "@medusajs/framework/types";

const CreatetWidget = ({ data }: DetailWidgetProps<AdminProduct>) => {
  console.log(data);
  return (
    <div className="flex items-center justify-end py-4">
      <Button variant="secondary">Create Order</Button>
    </div>
  );
};

export const config = defineWidgetConfig({
  zone: "order.list.before",
});

export default CreatetWidget;
