import type {
    MedusaRequest,
    MedusaResponse,
  } from "@medusajs/framework/http"
  import { createOrderWorkflow } from "@medusajs/medusa/core-flows"
  
  export async function POST(
    req: MedusaRequest,
    res: MedusaResponse
  ) {
    const { result } = await createOrderWorkflow(req.scope)
      .run({
        input: {
          region_id: "reg_123",
          items: [{
            variant_id: "variant_123",
            quantity: 1,
            title: "Shirt",
            unit_price: 10
          }],
          sales_channel_id: "sc_123",
          status: "pending",
          shipping_address: {
            first_name: "John",
            last_name: "Doe",
            address_1: "123 Main St",
            city: "Los Angeles",
            country_code: "us",
            postal_code: "90001"
          },
          additional_data: {
            sync_oms: true
          }
        }
      })
  
    res.send(result)
  }