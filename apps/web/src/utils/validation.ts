export function isValidObjectId(id: string | undefined): id is string {
  return typeof id === 'string' && /^[a-f\d]{24}$/i.test(id);
}
