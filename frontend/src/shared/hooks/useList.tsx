import { useCallback, useState } from "react";

export default function useList<T = unknown>(defaultList: T[] = []) {
  const [list, setList] = useState(defaultList);

  const set = useCallback((value: T[] | React.SetStateAction<T[]>) => {
    setList(value);
  }, []);

  const push = useCallback((value: T) => {
    setList((prev) => [...prev, value]);
  }, []);

  const removeAt = useCallback((index: number) => {
    setList((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const insertAt = useCallback((index: number, value: T) => {
    setList((prev) => prev.toSpliced(index, 0, value));
  }, []);

  const updateAt = useCallback((index: number, value: T) => {
    setList((prev) => prev.map((v, i) => (i === index ? value : v)));
  }, []);

  const clear = useCallback(() => {
    setList([]);
  }, []);

  return [list, { set, push, removeAt, insertAt, updateAt, clear }];
}
