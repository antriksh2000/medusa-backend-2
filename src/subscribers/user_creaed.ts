import { SubscriberArgs, type SubscriberConfig } from "@medusajs/framework";
import { Modules } from "@medusajs/framework/utils";

/**
 * Handles the promotion check for newly created customers.
 */
export default async function customerCreatedCheckPromotion({
  event,
  container,
}: SubscriberArgs<{ id: string }>): Promise<void> {
  try {
    const cust_id = event.data.id;

    const query = container.resolve("query");

    // Fetch customer data by ID
    const {
      data: [custData],
    } = await query.graph({
      entity: "customer",
      fields: ["*"],
      filters: {
        id: [cust_id],
      },
    });

    if (!custData) {
      console.error(`Customer with ID ${cust_id} not found.`);
      return;
    }

    // console.log("Customer Data:", custData);

    // Check if the customer has an email and if it matches the expected domain
    if (custData.email?.endsWith("@beneki.net")) {
      const customerModuleService = container.resolve(Modules.CUSTOMER);

      // Fetch customer group data
      const {
        data: [customerGroupData],
      } = await query.graph({
        entity: "customer_group",
        fields: ["*"],
        filters: {
          name: ["beneki group"],
        },
      });

      if (!customerGroupData) {
        console.error(`Customer group "beneki group" not found.`);
        return;
      }

      // console.log("Customer Group Data:", customerGroupData);

      // Add the customer to the identified group
      const customerGroupCustomerId =
        await customerModuleService.addCustomerToGroup({
          customer_id: cust_id,
          customer_group_id: customerGroupData.id,
        });

      console.log(
        `Customer with ID ${cust_id} added to group with ID ${customerGroupCustomerId}`
      );
    } else {
      console.log(
        `Customer with ID ${cust_id} does not have a valid email domain.`
      );
    }
  } catch (error) {
    console.error("Error processing customer promotion check:", error);
  }
}

export const config: SubscriberConfig = {
  event: `customer.created`,
};
