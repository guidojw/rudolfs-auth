import { AuthMiddleware, ErrorMiddleware } from '../middlewares'
import { AuthService } from '../services'
import { Container } from 'inversify'
import { constants } from '../util'

const { TYPES } = constants

const container = new Container()
const bind = container.bind.bind(container)

bind<AuthMiddleware>(TYPES.AuthMiddleware).to(AuthMiddleware)
bind<ErrorMiddleware>(TYPES.ErrorMiddleware).to(ErrorMiddleware)

bind<AuthService>(TYPES.AuthService).to(AuthService)

export default container
