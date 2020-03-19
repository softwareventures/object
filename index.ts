import {Dictionary, Key, ReadonlyDictionary} from "dictionary-types";

/** Creates a shallow copy of the specified dictionary. */
export function copy<T, K extends Key, L extends K = K>(dictionary: ReadonlyDictionary<T, K>): Dictionary<T, L> {
    return Object.assign(Object.create(null), dictionary);
}

// @ts-ignore duplicate identifier: These overrides constitute the exported declaration, the implementation is below.
export function keys<T, K extends Key>(dictionary: ReadonlyDictionary<T, K>): K[];
// @ts-ignore duplicate identifier: These overrides constitute the exported declaration, the implementation is below.
export function keys<T>(dictionary: Readonly<T>): Array<keyof T>;

/* @internal This implementation is for internal use only, the exported declaration is above */
// @ts-ignore duplicate identifier: This is the actual implementation, the exported declaration is above.
// tslint:disable-next-line:no-unbound-method
export const keys: <T>(dictionary: Readonly<T>) => Array<keyof T> = Object.keys;

// tslint:disable-next-line:no-unbound-method
export const values: <T>(dictionary: Readonly<T>) => Array<T[keyof T]> = Object.values;

// @ts-ignore duplicate identifier: These overrides constitute the exported declaration, the implementation is below.
export function entries<T, K extends Key>(dictionary: ReadonlyDictionary<T, K>): Array<[K, T]>;
// @ts-ignore duplicate identifier: These overrides constitute the exported declaration, the implementation is below.
export function entries<T>(dictionary: Readonly<T>): Array<[keyof T, T[keyof T]]>;

/* @internal This implementation is for internal use only, the exported declaration is above */
// @ts-ignore duplicate identifier: This is the actual implementation, the exported declaration is above.
// tslint:disable-next-line:no-unbound-method
export const entries: <T>(dictionary: Readonly<T>) => Array<[keyof T, T[keyof T]]> = Object.entries;

export function empty<T>(dictionary: ReadonlyDictionary<T>): boolean {
    return keys(dictionary).length === 0;
}

export function map<T, U>(dictionary: ReadonlyDictionary<T>, f: (value: T, key: string) => U): Dictionary<U> {
    const result: Dictionary<U> = {};
    for (const [key, value] of entries(dictionary)) {
        result[key] = f(value, key);
    }
    return result;
}

export function mapFn<T, U>(f: (value: T, key: string) => U): (dictionary: ReadonlyDictionary<T>) => Dictionary<U> {
    return dictionary => map(dictionary, f);
}

export function filter<T>(dictionary: ReadonlyDictionary<T>,
                          predicate: (value: T, key: string) => boolean): Dictionary<T> {
    const result: Dictionary<T> = {};
    for (const [key, value] of entries(dictionary)) {
        if (predicate(value, key)) {
            result[key] = value;
        }
    }
    return result;
}

export function filterFn<T>(
    predicate: (value: T, key: string) => boolean
): (dictionary: ReadonlyDictionary<T>) => Dictionary<T> {
    return dictionary => filter(dictionary, predicate);
}

export function forEach<T>(dictionary: ReadonlyDictionary<T>, f: (value: T, key: string) => void): void {
    for (const [key, value] of entries(dictionary)) {
        f(value, key);
    }
}

export function forEachFn<T>(f: (value: T, key: string) => void): (dictionary: ReadonlyDictionary<T>) => void {
    return dictionary => forEach(dictionary, f);
}