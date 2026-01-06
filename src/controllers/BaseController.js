class BaseController {
  /**
   * Success response helper
   */
  successResponse(res, data, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  }

  /**
   * Error response helper
   */
  errorResponse(res, message = 'An error occurred', statusCode = 500, errors = null) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors: errors || null
    });
  }

  /**
   * Validation error response helper
   */
  validationErrorResponse(res, errors) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  /**
   * Not found response helper
   */
  notFoundResponse(res, message = 'Resource not found') {
    return res.status(404).json({
      success: false,
      message
    });
  }

  /**
   * Unauthorized response helper
   */
  unauthorizedResponse(res, message = 'Unauthorized') {
    return res.status(401).json({
      success: false,
      message
    });
  }

  /**
   * Forbidden response helper
   */
  forbiddenResponse(res, message = 'Forbidden') {
    return res.status(403).json({
      success: false,
      message
    });
  }

  /**
   * Handle async operations with try-catch
   */
  async handleAsync(asyncFn) {
    try {
      const result = await asyncFn();
      return [null, result];
    } catch (error) {
      return [error, null];
    }
  }
}

module.exports = BaseController;