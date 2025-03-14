import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { Button, Container, Input } from "@medusajs/ui";
import { DetailWidgetProps, AdminCustomer } from "@medusajs/framework/types";
import { useState } from "react";

const CustomerWidget = ({ data }: DetailWidgetProps<AdminCustomer>) => {
  const [vatNo, setVatNo] = useState(data?.metadata?.vat_no ?? "");

  const updateVAT = async () => {
    if (!data?.id) {
      console.error("User ID is missing");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_API_URL}admin/customers/${data.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            metadata: {
              vat_no: vatNo,
            }, // Updated value from input field
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("VAT updated successfully:", result);
    } catch (error) {
      console.error("Error updating VAT:", error);
    }
  };

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center gap-10 justify-between px-6 py-4">
        <div className="flex flex-row items-center gap-2">
          <h2>Add VAT Number</h2>
          <Input
            type="text"
            placeholder="VAT"
            className="border border-gray-300 rounded-lg p-2"
            value={vatNo as string}
            onChange={(e) => setVatNo(e.target.value)}
          />
        </div>
        <div>
          <Button variant="secondary" onClick={updateVAT}>
            Submit
          </Button>
        </div>
      </div>
    </Container>
  );
};

export const config = defineWidgetConfig({
  zone: "customer.details.before",
});

export default CustomerWidget;
