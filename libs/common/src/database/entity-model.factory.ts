import { AggregateRoot } from '@nestjs/cqrs';

export interface EntityModelFactory<TEntity extends AggregateRoot, TModel> {
  create(entity: TEntity): TModel;
  createFromModel(model: TModel): TEntity;
}
