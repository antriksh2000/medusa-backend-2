// src/api/custom-redirect/route.ts
import { Request, Response } from "express";

export async function GET(req: Request, res: Response) {
  const redirectUrl = "www.google.com";
  return res.redirect(305, redirectUrl);
}
