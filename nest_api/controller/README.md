# 控制器（Controller）

## Request

Nest 提供的装饰器及其代表的底层平台特定对象的对照列表。

| 装饰器                    | http                              |
| ------------------------- | --------------------------------- |
| `@Request()，@Req()`      | `res`                             |
| `@Next()`                 | `next`                            |
| `@Session() `             | `req.session`                     |
| `@Param(key?: string)`    | `req.params`/`req.params[key]`    |
| `@Body(key?: string)`     | `req.body`/`req.body[key]`        |
| `@Query(key?: string)`    | `req.query`/`req.query[key]`      |
| `@Headers(name?: string)` | `req.headers`/`req.headers[name]` |
| `@Ip()`                   | `req.ip `                         |
| `@HostParam()`            | `req.hosts`                       |

Nest 为所有标准的 HTTP 方法提供了相应的装饰器：`@Put()`、`@Delete()`、`@Patch()`、`@Options()`、以及 `@Head()`。此外，`@All()` 则用于定义一个用于处理所有 HTTP 请求方法的处理程序。

## 路由通配符

```ts
@Get('ab*cd')
findAll() {
  return 'This route uses a wildcard';
}
```

路由路径 'ab\*cd' 将匹配 abcd 、ab_cd 、abecd 等

字符 ? 、+ 、 \* 以及 () 是它们的正则表达式对应项的子集。连字符（-） 和点（.）按字符串路径逐字解析。

## 状态码

```ts
@Post()
@HttpCode(204)
create() {
  return 'This action adds a new cat';
}

```

## Headers

```ts
@Post()
@Header('Cache-Control', 'none')
create() {
  return 'This action adds a new cat';
}
```

## 重定向

`@Redirect()` 装饰器有两个可选参数，`url` 和 `statusCode`。 如果省略，则 `statusCode` 默认为 302。

```typescript
@Get()
@Redirect('https://nestjs.com', 301)
```

如果想要动态决定重定向的 url,可以通过路由处理返回下面格式的对象

```json
{
  "url": string,
  "statusCode": number
}
```

比如以下代码：

```typescript
@Get('docs')
@Redirect('https://docs.nestjs.com', 302)
getDocs(@Query('version') version) {
  if (version && version === '5') {
    return { url: 'https://docs.nestjs.com/v5/' };
  }
}
```

## 路由参数

可以使用 @Param() 装饰器访问，该装饰器应添加到函数签名中。

路由动态参数如下

```typescript
@Get(':id')
findOne(@Param() params): string {
  console.log(params.id);
  return `This action returns a #${params.id} cat`;
}
```

## 异步性

每个异步函数都必须返回一个 Promise。这意味着您可以返回延迟值，而 Nest 将自行解析它。让我们看看下面这个例子:

通过返回 RxJS observable 流，Nest 路由处理程序将更加强大。 Nest 将自动订阅下面的源并获取最后发出的值（在流完成后）。

```typescript
@Get()
findAll(): Observable<any[]> {
  return of([]);
}
```

## 请求负载

处理程序没有接受任何客户端参数。我们在这里通过添加 @Body() 参数来解决这个问题。

```typescript
export class CreateCatDto {
  readonly name: string;
  readonly age: number;
  readonly breed: string;
}
```

# 提供者（Providers）

控制器应处理 HTTP 请求并将更复杂的任务委托给 providers。

@Injectable() provider 装饰器

> 要使用 CLI 创建服务类，只需执行 $ nest g service cats 命令。

## 可选提供者

constructor 的参数中使用 @Optional() 装饰器。

```typescript
import { Injectable, Optional, Inject } from '@nestjs/common';

@Injectable()
export class HttpService<T> {
  constructor(
    @Optional() @Inject('HTTP_OPTIONS') private readonly httpClient: T,
  ) {}
}
```

# 模块 (Module)

具有 @Module() 装饰器的类。 @Module() 装饰器提供了元数据，Nest 用它来组织应用程序结构。

每个 Nest 应用程序至少有一个模块，即根模块

@module() 装饰器接受一个描述模块属性的对象：

| 属性        | 描述                                                       |
| ----------- | ---------------------------------------------------------- |
| providers   | 由 Nest 注入器实例化的提供者，并且可以至少在整个模块中共享 |
| controllers | 必须创建的一组控制器                                       |
| imports     | 导入模块的列表，这些模块导出了此模块中所需提供者           |
| exports     | 由本模块提供并应在其他模块中可用的提供者的子集。           |

可以将从模块导出的提供程序视为模块的公共接口或 API

> 要使用 CLI 创建模块，只需执行 $ nest g module cats 命令。

## 共享模块

把 CatsService 放到 exports 数组中

```typescript
import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService],
})
export class CatsModule {}
```

每个导入 CatsModule 的模块都可以访问 CatsService ，并且它们将共享相同的 CatsService 实例。

## 模块导出

模块可以导出他们的内部提供者。 而且，他们可以再导出自己导入的模块。

```typescript
@Module({
  imports: [CommonModule],
  exports: [CommonModule],
})
export class CoreModule {}
```

## 依赖注入

提供者也可以注入到模块(类)中（例如，用于配置目的）：但是，由于循环依赖性，模块类不能注入到提供者中。

```typescript
import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {
  constructor(private readonly catsService: CatsService) {}
}
```

## 全局模块

@Global 装饰器使模块成为全局作用域。 全局模块应该只注册一次，最好由根或核心模块注册。 CatsService 组件将无处不在，而想要使用 CatsService 的模块则不需要在 imports 数组中导入 CatsModule。

## 动态模块

# 中间件

在路由处理程序 之前 调用的函数

中间件函数可以执行以下任务:

- 执行任何代码。
- 对请求和响应对象进行更改。
- 结束请求-响应周期。
- 调用堆栈中的下一个中间件函数。
- 如果当前的中间件函数没有结束请求-响应周期, 它必须调用 next() 将控制传递给下一个中间件函数。否则, 请求将被挂起。

## 依赖注入

Nest 中间件完全支持依赖注入。 就像提供者和控制器一样，它们能够注入属于同一模块的依赖项（通过 constructor ）。

## 中间件使用

```typescript
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { LoggerMiddleware } from './logger.middleware';
import { CatsService } from './cats.service';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService],
})
export class CatsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('cats');
  }
}
```

> 可以使用 async/await 来实现 configure()方法的异步化(例如，可以在 configure()方法体中等待异步操作的完成)。

## 路由通配符

```typescript
forRoutes({ path: 'ab*cd', method: RequestMethod.ALL });
```

## 中间件消费者

forRoutes() 可接受一个字符串、多个字符串、对象、一个控制器类甚至多个控制器类。在大多数情况下，您可能只会传递一个由逗号分隔的控制器列表。以下是单个控制器的示例：

以下是单个控制器的示例：

```typescript
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { CatsModule } from './cats/cats.module';
import { CatsController } from './cats/cats.controller.ts';

@Module({
  imports: [CatsModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(CatsController);
  }
}
```

> 该 apply() 方法可以使用单个中间件，也可以使用多个参数来指定多个多个中间件

可以使用该 exclude() 方法轻松排除某些路由

```typescript
consumer
  .apply(LoggerMiddleware)
  .exclude(
    { path: 'cats', method: RequestMethod.GET },
    { path: 'cats', method: RequestMethod.POST },
    'cats/(.*)',
  )
  .forRoutes(CatsController);
```

> 该 exclude() 方法使用 path-to-regexp 包支持通配符参数。

## 多个中间件

为了绑定顺序执行的多个中间件，我们可以在 apply() 方法内用逗号分隔它们。

```typescript
consumer.apply(cors(), helmet(), logger).forRoutes(CatsController);
```

## 全局中间件

如果我们想一次性将中间件绑定到每个注册路由，我们可以使用由 INestApplication 实例提供的 use()方法：

```typescript
const app = await NestFactory.create(AppModule);
app.use(logger);
await app.listen(3000);
```

# 异常过滤器

内置的异常层负责处理整个应用程序中的所有抛出的异常。当捕获到未处理的异常时，最终用户将收到友好的响应。

## 基础异常类

HttpException 构造函数有两个必要的参数来决定响应:

- `response` 参数定义 `JSON` 响应体。它可以是 `string` 或 `object`，如下所述。

- `status`参数定义 HTTP 状态代码。

- 默认情况下，`JSON` 响应主体包含两个属性：

- `statusCode`：默认为 `status` 参数中提供的 `HTTP` 状态代码

- `message`:基于状态的 `HTTP` 错误的简短描述

## 自定义异常

如果确实需要创建自定义的异常，则最好创建自己的异常层次结构，其中自定义异常继承自 HttpException 基类。

## 内置 HTTP 异常

为了减少样板代码，Nest 提供了一系列继承自核心异常 HttpException 的可用异常。所有这些都可以在 @nestjs/common 包中找到：

- BadRequestException
- UnauthorizedException
- NotFoundException
- ForbiddenException
- NotAcceptableException
- RequestTimeoutException
- ConflictException
- GoneException
- PayloadTooLargeException
- UnsupportedMediaTypeException
- UnprocessableException
- InternalServerErrorException
- NotImplementedException
- BadGatewayException
- ServiceUnavailableException
- GatewayTimeoutException

## 异常过滤器

```typescript
// http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
```

> 所有异常过滤器都应该实现通用的 ExceptionFilter<T> 接口,它需要你使用有效签名提供 catch(exception: T, host: ArgumentsHost)方法。T 表示异常的类型。

@Catch() 可以传递多个参数，所以你可以通过逗号分隔来为多个类型的异常设置过滤器。

## 绑定过滤器

```typescript
// cats.controller.ts
@Get()
  @UseFilters(new HttpExceptionFilter)
  async findAll(@Req() request: Request) {
    // return 'This action returns all cats'
    /* throw new HttpException({s
      status: HttpStatus.FORBIDDEN,
      error: 'This is a custom message'
    }, HttpStatus.FORBIDDEN) */
    throw new ForbiddenException();
  }
```

使用了 @UseFilters() 装饰器。和 @Catch()装饰器类似，它可以使用单个过滤器实例，也可以使用逗号分隔的过滤器实例列表

### 全局使用

```typescript
// main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
}
bootstrap();
```

但是 useGlobalFilters() 方法不会为网关和混合应用程序设置过滤器。

为了解决这个问题，你可以注册一个全局范围的过滤器直接为任何模块设置过滤器：

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
```

## 捕获异常

为了捕获每一个未处理的异常(不管异常类型如何)，将 @Catch() 装饰器的参数列表设为空，例如 @Catch()。

```typescript
// any-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      statusCode: status,
      timestamps: new Date().toISOString(),
      path: request.url,
    });
  }
}
```

使用方式同上面的方式一样

## 继承

```typescript
import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    super.catch(exception, host);
  }
}
```

# 管道

管道是具有 @Injectable() 装饰器的类。管道应实现 PipeTransform 接口。

管道有两个典型的应用场景:

- 转换：管道将输入数据转换为所需的数据输出(例如，将字符串转换为整数)
- 验证：对输入数据进行验证，如果验证成功继续传递; 验证失败则抛出异常

Nest 自带很多开箱即用的内置管道。你还可以构建自定义管道。

## 内置管道

- ValidationPipe
- ParseIntPipe
- ParseFloatPipe
- ParseBoolPipe
- ParseArrayPipe
- ParseUUIDPipe
- ParseEnumPipe
- DefaultValuePipe
- ParseFilePipe
