export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, NotFoundError.prototype);

    // TODO:  add custom initialization logic here.
  }
}
