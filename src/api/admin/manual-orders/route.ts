import {
    MedusaRequest,
    MedusaResponse,
  } from "@medusajs/framework/http"
import { createOrderWorkflow } from "@medusajs/medusa/core-flows"
  
  export const POST = async (
    req: MedusaRequest<any>,
    res: MedusaResponse
  ) => {
    const { result } = await createOrderWorkflow(req.scope)
      .run({
        input: req.validatedBody,
      })
  
    res.json({ brand: result })
  }