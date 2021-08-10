import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data : unknown , context : ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    console.log("I am running")
    return req.userInfo;
  }
)
