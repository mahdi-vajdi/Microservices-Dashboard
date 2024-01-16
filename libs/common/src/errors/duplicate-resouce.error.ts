export class DuplicateResourceError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, DuplicateResourceError.prototype);

    // TODO:  add custom initialization logic here.
  }
}
