import type { Request, Response } from "express"
import { z } from "zod"
import { prisma } from "../lib/prisma"
import { HTTPError } from "../lib/errors"
import { config } from "../config"

export const createTodoController = async (request: Request, response: Response) => {
  const bodySchema = z.object({ title: z.string().min(1) })
  const { title } = bodySchema.parse(request.body)

  const user = request.user
  if (!user) {
    throw new HTTPError(401, "Not authorized")
  }

  const userRecord = await prisma.user.findUnique({
    where: { id: user.userId },
    select: {
      id: true,
      _count: { select: { todos: true } },
      stripeSubscriptionStatus: true,
    },
  })
  if (!userRecord) {
    throw new HTTPError(401, "Not authorized")
  }

  const hasQuotaAvailable = userRecord._count.todos < config.maxFreeTodos
  const hasActiveSubscription = userRecord.stripeSubscriptionStatus === "active"
  if (!hasQuotaAvailable && !hasActiveSubscription) {
    throw new HTTPError(403, "No quota available. Please upgrade your plan.")
  }

  const todo = await prisma.todo.create({ data: { title, ownerId: userRecord.id } })
  response.status(201).json(todo)
}