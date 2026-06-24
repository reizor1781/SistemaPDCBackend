import { NextFunction, Request, Response } from 'express';
import { AppError } from '../types/errors.js';
import { env } from '../config/env.js';

/**
 * Middleware global de manejo de errores.
 *
 * Debe registrarse como el ÚLTIMO middleware en app.ts.
 *
 * - Si el error es una instancia de AppError (isOperational = true):
 *   devuelve el statusCode y message al cliente.
 * - Para cualquier otro error (bug inesperado, fallo de BD, etc.):
 *   registra el stack en consola y devuelve 500 genérico.
 *   En producción NO expone el mensaje interno al cliente.
 */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void {
  // ─── Error operacional esperado ───────────────────────────────────────────
  if (err instanceof AppError && err.isOperational) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  // ─── Error inesperado (bug, excepción no controlada) ─────────────────────
  const error = err instanceof Error ? err : new Error(String(err));

  // Siempre log del stack para debugging
  console.error('[ErrorHandler] Unexpected error:', error.stack ?? error.message);

  const clientMessage =
    env.nodeEnv === 'production'
      ? 'Internal server error'
      : error.message;

  res.status(500).json({ error: clientMessage });
}
