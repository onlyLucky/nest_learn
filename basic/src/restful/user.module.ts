import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserService2 } from './user.service2';
import { UserService3 } from './user.service3';
import { UserController } from './user.controller';

@Module({
  controllers: [UserController],
  providers: [
    {
      provide: 'RestCode',
      useClass: UserService
    },
    {
      provide: "JD",
      useValue: ['TB', 'PDD', "JD"]
    },
    UserService2,
    {
      provide: "Test",
      inject: [UserService2],
      useFactory(UserService2: UserService2) {
        // 这里可以处理一些业务逻辑
        return new UserService3()
      }
    },
    {
      provide: "sync",
      inject: [UserService2],
      async useFactory() {
        return await new Promise((r) => {
          setTimeout(() => {
            r('sync')
          }, 3000)
        })
      }
    }
  ]
})
export class UserModule { }
