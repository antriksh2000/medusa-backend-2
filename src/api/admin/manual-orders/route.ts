import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { createOrderWorkflow } from "@medusajs/medusa/core-flows";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { result } = await createOrderWorkflow(req.scope).run({
    input: {
      region_id: (req as any).body.region_id,
      items: (req as any).body.items,
      email: (req as any).body.email,
      status: "pending",
      shipping_address: (req as any).body.shipping_address,
      additional_data: {
        sync_oms: true,
      },
    },
  });

  res.send(result);
}
