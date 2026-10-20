import type { ErrorRequestHandler, RequestHandler } from 'express';
import { env } from '../config/env';

export const notFound: RequestHandler = (req, res) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Không tìm thấy ${req.method} ${req.originalUrl}`,
    },
  });
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  if (res.headersSent) {
    next(err);
    return;
  }

  const status =
    Number.isInteger(err?.status) && err.status >= 400 && err.status < 600 ? err.status : 500;

  if (status === 500) {
    console.error(err);
  }

  res.status(status).json({
    error: {
      code: status === 500 ? 'INTERNAL_ERROR' : 'BAD_REQUEST',
      message:
        status === 500 && env.NODE_ENV === 'production'
          ? 'Lỗi máy chủ'
          : String(err?.message ?? err),
    },
  });
};
