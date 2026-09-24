export class CategoryInUseError extends Error {
  constructor() {
    super("Cannot delete category because it is used by transactions");
    this.name = "CategoryInUseError";
  }
}
