import express, { type Request, type Response, type NextFunction } from 'express'
import { ZodError } from 'zod'

import { createUserController, findOneUserController, listUsersController } from './controllers/user.controller'
import { createTodoController } from './controllers/todo.controller'
import { createCheckoutController } from './controllers/checkout.controller'
import { stripeWebhookController } from './controllers/stripe.controller'
import { asyncHandler } from './lib/asyncHandler'
import { authenticate } from './lib/auth'
import { HTTPError } from './lib/errors'

const app = express()
const port = 3000

app.post(
  '/stripe',
  express.raw({ type: 'application/json' }),
  asyncHandler(stripeWebhookController)
)

app.use(express.json())

app.get('/users', asyncHandler(listUsersController))
app.post('/users', asyncHandler(createUserController))
app.get('/users/:userId', asyncHandler(findOneUserController))
app.post('/todos', authenticate, asyncHandler(createTodoController))
app.post('/checkout', authenticate, asyncHandler(createCheckoutController))

// Global error handler
app.use(
  (error: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (error instanceof ZodError) {
      const errors = error.errors.map(err => ({
        status: '400',
        title: err.message,
        source: { path: err.path.join('.') },
      }))
      return res.status(400).json({ errors })
    }
    if (error instanceof HTTPError) {
      return res.status(error.status).json({
        errors: [{ status: error.status.toString(), title: error.message }],
      })
    }
    console.error(error)
    return res.status(500).json({
      errors: [{ status: '500', title: 'Internal Server Error' }],
    })
  }
)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
