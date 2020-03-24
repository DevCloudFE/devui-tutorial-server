import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpException, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
const jwt = require('jsonwebtoken');
//解密的私钥
const accessTokenSecret = 'youraccesstokensecret';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const [req] = context.getArgs();
        // 登录接口不拦截，其他接口拦截
        if ((req.url === '/login' && req.method === 'POST') || req.url.startsWith('/articles')) {
            return next.handle();
        } else {
            const authHeader = req.headers.authorization;
            if (authHeader) {
                const token = authHeader.split(' ')[1];
                return jwt.verify(token, accessTokenSecret, (err, user) => {
                    if (err) {
                        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
                    } else {
                        return next.handle();
                    }
                })
            } else {
                throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
            }
        }
    }
}