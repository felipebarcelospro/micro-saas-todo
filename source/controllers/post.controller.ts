import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const listPostsController = async (_request: Request, response: Response) => {
  const posts = await prisma.post.findMany({
    include: {
      author: true,
    },
  });
  response.send(posts);
};

export const findOnePostController = async (request: Request, response: Response) => {
  const { postId } = request.params;

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: { author: true },
  });

  if (!post) {
    return response.status(404).send({ error: 'Not found' });
  }

  response.send(post);
};

export const createPostController = async (request: Request, response: Response) => {
  const userId = request.headers['x-user-id'];

  if (!userId) {
    return response.status(403).send({ error: 'Not authorized' });
  }

  const { title, content } = request.body;

  if (!title || !content) {
    return response.status(400).send({ error: 'Title or content is invalid' });
  }

  const post = await prisma.post.create({
    data: {
      title,
      content,
      authorId: userId as string,
    },
  });

  response.status(201).send(post);
};