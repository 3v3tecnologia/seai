/**
 * @description
 * Convert an object attribute to optional
 *
 * @example
 * type User={
 *  id:string;
 *  name:string
 * }
 *
 * Optional<User,'id'>
 */
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
