import { Controller, Get } from '@nestjs/common';

@Controller('isLogin')
export class IsLoginController {
    @Get() 
    IsLogin(){
      return {
          userName : 'admin',
          userRole : 'admin'
      }
    }
}
