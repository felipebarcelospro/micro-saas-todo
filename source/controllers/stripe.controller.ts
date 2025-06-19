import type { Request, Response } from "express"
import Stripe from "stripe"
import {
  handleProcessWebhookCheckout,
  handleProcessWebhookUpdatedSubscription,
  stripe,
} from "../lib/stripe"
import { config } from "../config"
import { HTTPError } from "../lib/errors"

export const stripeWebhookController = async (
  request: Request,
  response: Response
) => {
  if (!config.stripe.webhookSecret) {
    throw new HTTPError(400, "STRIPE_WEBHOOK_SECRET_KEY is not set")
  }

  const signature = request.headers["stripe-signature"] as string
  const rawBody = request.body as Buffer
  const event = await stripe.webhooks.constructEventAsync(
    rawBody,
    signature,
    config.stripe.webhookSecret,
    undefined,
    Stripe.createSubtleCryptoProvider()
  )

  switch (event.type) {
    case "checkout.session.completed":
      await handleProcessWebhookCheckout(event.data)
      break
    case "customer.subscription.created":
    case "customer.subscription.updated":
      await handleProcessWebhookUpdatedSubscription(event.data)
      break
    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  response.json({ received: true })
}