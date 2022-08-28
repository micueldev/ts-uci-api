import { Request, Response, NextFunction } from 'express';

import errorHandler from '@/Http/Middlewares/errorHandler';
import ViolatedFieldsException, {
  ViolatedFieldProps,
} from '@/Http/Exception/ViolatedFieldsException';
import BadRequestException from '@/Domain/Exception/BadRequestException';
import BadCredentialsException from '@/Domain/Exception/BadCredentialsException';

describe('Error handler middleware', () => {
  const mockRequest: Partial<Request> = {};
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    nextFunction = jest.fn();
  });

  test('Handle ViolatedFields error', async () => {
    const violatedFields: Array<ViolatedFieldProps> = [];
    const error = new ViolatedFieldsException(violatedFields);

    errorHandler(
      error as ViolatedFieldsException,
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(error.getStatus());
    expect(mockResponse.json).toHaveBeenCalledWith({
      errors: violatedFields,
      message: error.getMessage(),
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  test('Handle BadCredentials error', async () => {
    const message = 'Errrror!';
    const error = new BadCredentialsException(message);

    errorHandler(
      error as BadCredentialsException,
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(error.getStatus());
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: error.getMessage(),
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  test('Handle BadRequest error', async () => {
    const message = 'Errooooor!';
    const error = new BadRequestException(message);

    errorHandler(
      error as BadRequestException,
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(error.getStatus());
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: error.getMessage(),
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });

  test('Handle Unknown error', async () => {
    const error = new Error();

    errorHandler(
      error as Error,
      mockRequest as Request,
      mockResponse as Response,
      nextFunction,
    );

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Unknown error',
    });
    expect(nextFunction).not.toHaveBeenCalled();
  });
});
