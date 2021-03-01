import {Dictionary, Key, ReadonlyDictionary} from "dictionary-types";

/** Creates a new dictionary with the specified properties. */
export function dictionary<T, K extends Key = string>(
    properties?: ReadonlyDictionary<T, K>
): Dictionary<T, K> {
    return copy(properties ?? ({} as ReadonlyDictionary<T, K>));
}

/** Creates a shallow copy of the specified dictionary. */
export function copy<T, K extends Key, L extends K = K>(
    dictionary: ReadonlyDictionary<T, K>
): Dictionary<T, L> {
    return Object.assign(Object.create(null), dictionary);
}

// @ts-ignore duplicate identifier: This is the exported declaration, the implementation is below.
export function keys<T extends Key>(dictionary: Readonly<Record<T, unknown>>): string[];

/* @internal This implementation is for internal use only, the exported declaration is above */
// @ts-ignore duplicate identifier: This is the actual implementation, the exported declaration is above.
export const keys: <T extends Key>(dictionary: Readonly<Record<T, unknown>>) => string[] =
    Object.keys;

// @ts-ignore duplicate identifier: This is the exported declaration, the implementation is below.
export function values<TKey extends Key, TValue>(
    dictionary: Readonly<Record<TKey, TValue>>
): TValue[];

/* @internal This implementation is for internal use only, the exported declaration is above. */
// @ts-ignore duplicate identifier: This is the actual implementation, the exported declaration is above.
export const values: <TKey extends Key, TValue>(
    dictionary: Readonly<Record<TKey, TValue>>
) => TValue[] = Object.values;

// @ts-ignore duplicate identifier: This is the exported declaration, the implementation is below.
export function entries<TKey extends Key, TValue>(
    dictionary: Readonly<Record<TKey, TValue>>
): Array<[string, TValue]>;

/* @internal This implementation is for internal use only, the exported declaration is above. */
// @ts-ignore duplicate identifier: This is the actual implementation, the exported declaration is above.
export const entries: <TKey extends Key, TValue>(
    dictionary: Readonly<Record<TKey, TValue>>
) => Array<[string, TValue]> = Object.entries;

export function empty<T>(dictionary: ReadonlyDictionary<T>): boolean {
    return keys(dictionary).length === 0;
}

export function merge<T>(...dictionaries: Array<ReadonlyDictionary<T>>): Dictionary<T> {
    const result: Dictionary<T> = Object.create(null);
    for (let i = 0; i < dictionaries.length; ++i) {
        Object.assign(result, dictionaries[i]);
    }
    return result;
}

export function mergeFn<T>(
    ...dictionaries: Array<ReadonlyDictionary<T>>
): (...dictionaries: Array<ReadonlyDictionary<T>>) => Dictionary<T> {
    const a = merge(...dictionaries);
    return (...b) => merge(a, ...b);
}

export function map<T, U>(
    dictionary: ReadonlyDictionary<T>,
    f: (value: T, key: string) => U
): Dictionary<U> {
    const result: Dictionary<U> = {};
    for (const [key, value] of entries(dictionary)) {
        result[key] = f(value, key);
    }
    return result;
}

export function mapFn<T, U>(
    f: (value: T, key: string) => U
): (dictionary: ReadonlyDictionary<T>) => Dictionary<U> {
    return dictionary => map(dictionary, f);
}

export function filter<T, U extends T>(
    dictionary: ReadonlyDictionary<T>,
    predicate: (value: T) => value is U
): Dictionary<U>;
export function filter<T>(
    dictionary: ReadonlyDictionary<T>,
    predicate: (value: T, key: string) => boolean
): Dictionary<T>;
export function filter<T>(
    dictionary: ReadonlyDictionary<T>,
    predicate: (value: T, key: string) => boolean
): Dictionary<T> {
    const result: Dictionary<T> = {};
    for (const [key, value] of entries(dictionary)) {
        if (predicate(value, key)) {
            result[key] = value;
        }
    }
    return result;
}

export function filterFn<T, U extends T>(
    predicate: (value: T) => value is U
): (dictionary: ReadonlyDictionary<T>) => Dictionary<U>;
export function filterFn<T>(
    predicate: (value: T, key: string) => boolean
): (dictionary: ReadonlyDictionary<T>) => Dictionary<T>;
export function filterFn<T>(
    predicate: (value: T, key: string) => boolean
): (dictionary: ReadonlyDictionary<T>) => Dictionary<T> {
    return dictionary => filter(dictionary, predicate);
}

export function excludeNull<T>(
    dictionary: ReadonlyDictionary<T | undefined | null>
): Dictionary<T> {
    return filter(dictionary, notNull);
}

function notNull<T>(value: T | undefined | null): value is T {
    return value != null;
}

export function forEach<T>(
    dictionary: ReadonlyDictionary<T>,
    f: (value: T, key: string) => void
): void {
    for (const [key, value] of entries(dictionary)) {
        f(value, key);
    }
}

export function forEachFn<T>(
    f: (value: T, key: string) => void
): (dictionary: ReadonlyDictionary<T>) => void {
    return dictionary => forEach(dictionary, f);
}
