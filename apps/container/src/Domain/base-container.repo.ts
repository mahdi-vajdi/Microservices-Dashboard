import { Container } from './models/container';

export abstract class ContainerRepository {
  abstract add(entity: Container): Promise<void>;
  abstract findById(id: string): Promise<Container>;
}
