import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

import { config } from '../config'
import { HTTPError } from './errors'

interface JwtPayload {
  userId: string
  email: string
}

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new HTTPError(401, 'Missing or invalid Authorization header')
  }

  const token = authHeader.split(' ')[1]
  try {
    const payload = jwt.verify(token, config.jwt.secret) as JwtPayload
    req.user = payload
    next()
  } catch {
    throw new HTTPError(401, 'Invalid or expired token')
  }
}