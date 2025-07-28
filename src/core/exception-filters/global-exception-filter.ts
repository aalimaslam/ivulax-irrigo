import {
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
  ExceptionFilter,
} from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('GlobalExceptionFilter');

  catch(error: Error, host: ArgumentsHost) {
    this.logger.error(
      `Global Exception Handler: ${error.message}, error.stack`,
    );

    const response = host.switchToHttp().getResponse();

    if (error instanceof HttpException) {
      response.status(error.getStatus()).json({
        message: error.getResponse()['message'],
        statusCode: error.getStatus(),
      });
    } else {
      response.status(500).json({
        message: 'Internal Server Error',
        statusCode: 500,
      });
    }
  }
}
