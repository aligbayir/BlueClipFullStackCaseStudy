import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { DecodedUser } from './user.interface';

export const GetUser = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): DecodedUser => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);
