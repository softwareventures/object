import {Dictionary, ReadonlyDictionary} from "dictionary-types";

/** Creates a shallow copy of the specified dictionary. */
export function copy<T>(dictionary: ReadonlyDictionary<T>): Dictionary<T> {
    return {...dictionary};
}

export const keys: <T>(dictionary: ReadonlyDictionary<T>) => string[] = Object.keys;

export const values: <T>(dictionary: ReadonlyDictionary<T>) => T[] = Object.values;

export const entries: <T>(dictionary: ReadonlyDictionary<T>) => Array<[string, T]> = Object.entries;