import { Controller, Post, Body } from '@nestjs/common';
import { User } from './user.interface';
const jwt = require('jsonwebtoken');
//加密的私钥
const accessTokenSecret = 'youraccesstokensecret';

// @UseInterceptors(LoggingInterceptor)
@Controller('login')
export class LoginController {
    @Post()
    Verify(@Body() user: User): object {
        if (!user) {
            return null;
        }

        if (user.userName === 'admin' && user.password === 'admin') {

            const accessToken = jwt.sign({ username: user.userName }, accessTokenSecret);
            return {
                userName: user.userName,
                token: accessToken,
                success: true
            };
        }
        return null;
    }
}


