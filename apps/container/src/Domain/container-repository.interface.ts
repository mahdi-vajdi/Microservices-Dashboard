export interface IContainerRepository<TEntity> {
  create(entity: TEntity): Promise<void>;
  findByAccountId(accountId: string): Promise<TEntity[]>;
  findOneById(id: string): Promise<TEntity>;
}
