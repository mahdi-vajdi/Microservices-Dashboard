export class ForbiddenAccessError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, ForbiddenAccessError.prototype);

    // TODO:  add custom initialization logic here.
  }
}
