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
