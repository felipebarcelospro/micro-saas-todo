import type { Request, Response } from "express"
import { createCheckoutSession } from "../lib/stripe"
import { HTTPError } from "../lib/errors"

export const createCheckoutController = async (request: Request, response: Response) => {
  const user = request.user
  if (!user) {
    throw new HTTPError(401, "Not authorized")
  }

  const checkout = await createCheckoutSession(user.userId, user.email)
  response.json(checkout)
}