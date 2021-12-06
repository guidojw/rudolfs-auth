import {
  BaseHttpController,
  controller,
  httpGet,
  type interfaces
} from 'inversify-express-utils'
import { type ValidationChain, header } from 'express-validator'
import { constants } from '../util'

const { TYPES } = constants

@controller('/auth')
export default class AuthController extends BaseHttpController implements interfaces.Controller {
  @httpGet(
    '/',
    ...AuthController.validate('postAuth'),
    TYPES.ErrorMiddleware,
    TYPES.AuthMiddleware
  )
  public async postAuth (): Promise<void> {}

  private static validate (method: string): ValidationChain[] {
    switch (method) {
      case 'postAuth':
        return [
          // header('authorization').exists(),
          header('x-forwarded-uri').exists()
        ]

      default:
        return []
    }
  }
}
