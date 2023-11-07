import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class UploadGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const email = this.extractEmailFromRequest(request);
    if (email)
      return !!email;
  }

  private extractEmailFromRequest(request: Request): string | undefined {
    const session = request.session;
    return session?.['modmail'];
  }
}
