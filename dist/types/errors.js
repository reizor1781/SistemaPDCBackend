/**
 * AppError — error operacional con código HTTP y mensaje controlado.
 *
 * Uso en servicios:
 *   throw new AppError('Recurso no encontrado', 404);
 *
 * El middleware errorHandler distingue AppError (errores esperados)
 * de errores inesperados (500 genérico) usando la propiedad `isOperational`.
 */
export class AppError extends Error {
    /** Código de estado HTTP que se enviará al cliente. */
    statusCode;
    /**
     * `true` → error controlado (validación, not found, etc.)
     * `false` → error inesperado (bug, fallo de BD, etc.)
     */
    isOperational;
    constructor(message, statusCode, isOperational = true) {
        super(message);
        this.name = 'AppError';
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        // Mantiene el stack trace correcto en V8
        Error.captureStackTrace(this, this.constructor);
    }
}
