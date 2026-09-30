import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // handle access status
    const isPublic = this.reflector.get<boolean>(
      IS_PUBLIC_KEY,
      context.getHandler(),
    );
    if (isPublic) return true;

    // verify token if verified return true, if not return false
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();

    const token = req.header('Authorization');

    if (!token) {
      throw new UnauthorizedException(
        'invalid token, please provide the' + 'token',
      );
    }
    return true;
  }
}
