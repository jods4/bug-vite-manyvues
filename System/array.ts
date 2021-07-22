export function remove<T>(array: T[], value: T) {
  const i = array.indexOf(value);
  if (i < 0) return false;
  array.splice(i, 1);
  return true;
}
