import { SubscriberArgs, type SubscriberConfig } from "@medusajs/framework";
import { Modules } from "@medusajs/framework/utils";

export default async function customerCreatedCheckPromotion({
  event,
  container,
}) {
  const cust_id = event.data.id;

  const query = container.resolve("query");

  const {
    data: [custdata],
  } = await query.graph({
    entity: "customer",
    fields: ["*"],
    filters: {
      id: [cust_id],
    },
  });

  console.log(custdata);

  if (custdata.email && custdata.email.endsWith("@beneki.net")) {
    const customerModuleService = container.resolve(Modules.CUSTOMER);
    const customerGroupCustomerId =
      await customerModuleService.addCustomerToGroup({
        customer_id: cust_id,
        customer_group_id: "cusgroup_01JNKMGW4QE3H38VS1CS75QC5A",
      });
  } else {
    console.log("not a string ");
  }
}

export const config: SubscriberConfig = {
  event: `customer.created`,
};
