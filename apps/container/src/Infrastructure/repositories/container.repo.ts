import { Container } from '../../Domain/Container';
import { IContainerRepository } from '../../Domain/container-repository.interface';

export class ContainerRepository implements IContainerRepository<Container> {
  create(entity: Container): Promise<void> {
    throw new Error('Method not implemented.');
  }
  findByAccountId(accountId: string): Promise<Container[]> {
    throw new Error('Method not implemented.');
  }
  findOneById(id: string): Promise<Container> {
    throw new Error('Method not implemented.');
  }
}
