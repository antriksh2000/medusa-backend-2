import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { Container } from "@medusajs/ui";
import { DetailWidgetProps, AdminCustomer } from "@medusajs/framework/types";
import { useState } from "react";

const CustomerWidget = ({ data }: DetailWidgetProps<AdminCustomer>) => {
  console.log(data);

  const [vatNo, setVatNo] = useState(data?.metadata?.vat_no ?? "");

  const updateVAT = async () => {
    if (!data?.id) {
      console.error("User ID is missing");
      return;
    }

    try {
      const response = await fetch(`http://localhost:9000/admin/customers/${data.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          metadata: {
            vat_no:vatNo
          }, // Updated value from input field
        }),
      });

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
      <div className="flex items-center justify-evenly px-6 py-4">
        <h2>VAT Number</h2>
        <input
          type="text"
          placeholder="VAT"
          className="border border-gray-300 rounded-lg p-2"
          value={vatNo as string}
          onChange={(e) => setVatNo(e.target.value)} // Updates state when user types
        />
        <button className="bg-blue-200 p-3 rounded-lg" onClick={updateVAT}>
          Submit
        </button>
      </div>
    </Container>
  );
};

export const config = defineWidgetConfig({
  zone: "customer.details.after",
});

export default CustomerWidget;
