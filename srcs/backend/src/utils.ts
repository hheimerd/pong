
type ArrayObjectMapCallback<T> = (value: T, key?: number, arr?: T[]) => ({key: string, value: any});

export function arrayToObjectMap<T>(array: T[], cb: ArrayObjectMapCallback<T>) {
  const obj = {};
  for (let i = 0; i < array.length; i++) {
    const item = cb(array[i], i, array);
    obj[item.key] = item.value;
  }
  return obj;
}