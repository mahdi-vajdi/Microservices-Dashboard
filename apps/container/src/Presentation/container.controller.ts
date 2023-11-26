import { AccessTokenGuard } from '@app/common';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateContainerCommand } from '../Application/commands/impl/create-container.command';
import { CreateContainerDto } from '../Application/dto/create-container.dto';
import { GetByIdQuery } from '../Application/queries/impl/get-by-id.query';
import { ContainerModel } from '../Infrastructure/models/container.model';

@Controller('container')
export class ContainerController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  async create(@Request() req, @Body() dto: CreateContainerDto): Promise<void> {
    await this.commandBus.execute<CreateContainerCommand, void>(
      new CreateContainerCommand(req.user.sub, dto),
    );
  }

  @UseGuards(AccessTokenGuard)
  @Get()
  async getOne(
    @Request() req,
    @Param('id') containerId: string,
  ): Promise<ContainerModel> {
    return await this.queryBus.execute<GetByIdQuery, ContainerModel>(
      new GetByIdQuery(req.user.id, containerId),
    );
  }
}
