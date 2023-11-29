import { CommonAccessTokenGuard, JwtPayload } from '@app/common';
import { Controller, Req, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Request } from 'express';
import { UpdateUserInfoDto } from '../Application/dto/request/update-user-info.dto';
import { UpdateUserInfoCommand } from '../Application/commands/impl/update-user-info.command';

@Controller('user')
export class UserController {
  constructor(private readonly commandBus: CommandBus) {}

  @UseGuards(CommonAccessTokenGuard)
  async updateUserInfo(
    @Req() req: Request,
    dto: UpdateUserInfoDto,
  ): Promise<void> {
    const user = req['user'] as JwtPayload;
    return await this.commandBus.execute<UpdateUserInfoCommand, void>(
      new UpdateUserInfoCommand(user.sub, dto),
    );
  }
}
