export class DatabaseError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, DatabaseError.prototype);

    // TODO:  add custom initialization logic here.
  }
}
