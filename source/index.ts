import express from 'express';

import { createUserController, findOneUserController, listUsersController } from './controllers/user.controller';
import { createTodoController } from './controllers/todo.controller';
import { createCheckoutController } from './controllers/checkout.controller';
import { stripeWebhookController } from './controllers/stripe.controller';
import { createPostController, findOnePostController, listPostsController } from './controllers/post.controller';

const app = express();
const port = 3000;

app.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhookController)

app.use(express.json())

app.get('/users', listUsersController)
app.post('/users', createUserController)
app.get('/users/:userId', findOneUserController)
app.post('/todos', createTodoController)
app.post('/checkout', createCheckoutController)
app.get('/posts', listPostsController)
app.get('/posts/:postId', findOnePostController)
app.post('/posts', createPostController)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
