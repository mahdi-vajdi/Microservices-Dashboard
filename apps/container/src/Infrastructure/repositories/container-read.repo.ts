import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ContainerModel } from '../models/container.model';
import { Model } from 'mongoose';

@Injectable()
export class ContainerReadRepository {
  constructor(
    @InjectModel(ContainerModel.name)
    private readonly containerModel: Model<ContainerModel>,
  ) {}

  async findOneById(id: string): Promise<ContainerModel | null> {
    return this.containerModel.findById(id, {}, { lean: true }).exec();
  }

  async findByUser(userId: string): Promise<ContainerModel[]> {
    return await this.containerModel
      .find({ owner: userId }, { lean: true })
      .exec();
  }
}
