import { NextFunction, Request, Response } from 'express';

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ success: false, error: `Route not found: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  const status = err instanceof ApiError ? err.status : 500;
  const message = err instanceof Error ? err.message : 'Internal Server Error';
  if (status === 500) {
    console.error('[ERROR]', err);
  }
  res.status(status).json({ success: false, error: message });
}

// Wraps async route handlers so rejected promises reach errorHandler
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
