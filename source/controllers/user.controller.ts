import type { Request, Response } from "express"
import { prisma } from "../lib/prisma"
import { createStripeCustomer } from "../lib/stripe"
import { z } from "zod"
import { HTTPError } from "../lib/errors"
import jwt from "jsonwebtoken"
import { config } from "../config"

export const listUsersController = async (request: Request, response: Response) => {
  const users = await prisma.user.findMany()
  response.json(users)
}

export const findOneUserController = async (request: Request, response: Response) => {
  const paramsSchema = z.object({ userId: z.string().uuid() })
  const { userId } = paramsSchema.parse(request.params)

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) {
    throw new HTTPError(404, "User not found")
  }

  response.json(user)
}

export const createUserController = async (request: Request, response: Response) => {
  const bodySchema = z.object({ name: z.string().min(1), email: z.string().email() })
  const { name, email } = bodySchema.parse(request.body)

  const existingUser = await prisma.user.findUnique({ where: { email }, select: { id: true } })
  if (existingUser) {
    throw new HTTPError(400, "Email already in use")
  }

  const stripeCustomer = await createStripeCustomer({ name, email })
  const user = await prisma.user.create({ data: { name, email, stripeCustomerId: stripeCustomer.id } })

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  )
  response.status(201).json({ user, token })
}