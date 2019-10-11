import {Dictionary, ReadonlyDictionary} from "dictionary-types";

/** Creates a shallow copy of the specified dictionary. */
export function copy<T>(dictionary: ReadonlyDictionary<T>): Dictionary<T> {
    return {...dictionary};
}

// tslint:disable-next-line:no-unbound-method
export const keys: <T>(dictionary: ReadonlyDictionary<T>) => string[] = Object.keys;

// tslint:disable-next-line:no-unbound-method
export const values: <T>(dictionary: ReadonlyDictionary<T>) => T[] = Object.values;

// tslint:disable-next-line:no-unbound-method
export const entries: <T>(dictionary: ReadonlyDictionary<T>) => Array<[string, T]> = Object.entries;

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