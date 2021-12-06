import type { NextFunction, Request, Response } from 'express'
import { inject, injectable } from 'inversify'
import { AuthService } from '../services'
import { BaseMiddleware } from 'inversify-express-utils'
import { UnauthorizedError } from '../errors'
import { constants } from '../util'

const { TYPES } = constants

@injectable()
export default class AuthMiddleware extends BaseMiddleware {
  @inject(TYPES.AuthService) private readonly authService!: AuthService

  public async handler (_req: Request, _res: Response, next: NextFunction): Promise<void> {
    const token = this.httpContext.request.headers['authorization']
    const forwardedUri = this.httpContext.request.headers['x-forwarded-uri'] as string
    if (typeof token === 'undefined' || typeof forwardedUri === 'undefined') {
      return next(new UnauthorizedError())
    }

    const matches = forwardedUri.match(/([^\/]*)\/([^\/]*)\.git/)
    if (matches === null) {
      return next(new UnauthorizedError())
    }

    const permissions = await this.authService.getRepoPermissions(matches[1], matches[2], token)
    if (!permissions.includes('push')) {
      return next(new UnauthorizedError())
    }

    next()
  }
}
