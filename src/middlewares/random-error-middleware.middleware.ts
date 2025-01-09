import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RandomErrorMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const randomNumber = Math.random();

    if (randomNumber < 0.3) {
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    } else {
      next();
    }
  }
}