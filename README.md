# micro-saas-todo

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

## Database Migrations

After modifying the Prisma schema, run the following to create and apply the necessary migration for the blog feature:

```bash
bun prisma migrate dev --name add_blog_feature
```

This project was created using `bun init` in bun v1.0.22. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

## Blog Feature

This project includes a simple blog feature with the following endpoints:

- `GET /posts`: List all blog posts.
- `GET /posts/:postId`: Retrieve a single blog post.
- `POST /posts`: Create a new blog post (requires `x-user-id` header).

Example requests for the blog feature are available in the `api.http` file.
