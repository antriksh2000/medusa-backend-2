import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { getOrdersListWorkflow } from "@medusajs/medusa/core-flows";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  console.log(req.queryConfig.fields);
  const { result } = await getOrdersListWorkflow(req.scope).run({
    input: {
      fields: req.queryConfig.fields,
    },
  });
  console.log(`@@@@@@@@@@@@@@@@`);
  res.send(result);
}
