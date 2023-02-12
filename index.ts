/** Union of all types that can be used as the key for property access.
 *
 * The type of `x` in the expression `o[x]` (for arbitrary `o`).
 *
 * As of TypeScript 4.9, equivalent to `string | number | symbol`. */
export type Key = keyof never;

/** Creates a new dictionary with the specified properties. */
export function dictionary<T, K extends Key = string>(
    properties?: Readonly<Record<K, T>>
): Record<K, T> {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return copy(properties ?? ({} as Readonly<Record<K, T>>));
}

/** Creates a shallow copy of the specified dictionary. */
export function copy<T, K extends Key, L extends K = K>(
    dictionary: Readonly<Record<K, T>>
): Record<K, T> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
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

export function empty<T>(dictionary: Readonly<Record<Key, T>>): boolean {
    return keys(dictionary).length === 0;
}

export function merge<T>(...dictionaries: Array<Readonly<Record<string, T>>>): Record<string, T> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result: Record<string, T> = Object.create(null);
    for (let i = 0; i < dictionaries.length; ++i) {
        Object.assign(result, dictionaries[i]);
    }
    return result;
}

export function mergeFn<T>(
    ...dictionaries: Array<Readonly<Record<string, T>>>
): (...dictionaries: Array<Readonly<Record<string, T>>>) => Record<string, T> {
    const a = merge(...dictionaries);
    return (...b) => merge(a, ...b);
}

export function map<T, U>(
    dictionary: Readonly<Record<string, T>>,
    f: (value: T, key: string) => U
): Record<string, U> {
    const result = Object.create(null) as Record<string, U>;
    for (const [key, value] of entries(dictionary)) {
        result[key] = f(value, key);
    }
    return result;
}

export function mapFn<T, U>(
    f: (value: T, key: string) => U
): (dictionary: Readonly<Record<string, T>>) => Record<string, U> {
    return dictionary => map(dictionary, f);
}

export function filter<T, U extends T>(
    dictionary: Readonly<Record<string, T>>,
    predicate: (value: T) => value is U
): Record<string, U>;
export function filter<T>(
    dictionary: Readonly<Record<string, T>>,
    predicate: (value: T, key: string) => boolean
): Record<string, T>;
export function filter<T>(
    dictionary: Readonly<Record<string, T>>,
    predicate: (value: T, key: string) => boolean
): Record<string, T> {
    const result = Object.create(null) as Record<string, T>;
    for (const [key, value] of entries(dictionary)) {
        if (predicate(value, key)) {
            result[key] = value;
        }
    }
    return result;
}

export function filterFn<T, U extends T>(
    predicate: (value: T) => value is U
): (dictionary: Readonly<Record<string, T>>) => Record<string, U>;
export function filterFn<T>(
    predicate: (value: T, key: string) => boolean
): (dictionary: Readonly<Record<string, T>>) => Record<string, T>;
export function filterFn<T>(
    predicate: (value: T, key: string) => boolean
): (dictionary: Readonly<Record<string, T>>) => Record<string, T> {
    return dictionary => filter(dictionary, predicate);
}

export function excludeNull<T>(
    dictionary: Readonly<Record<string, T | undefined | null>>
): Record<string, T> {
    return filter(dictionary, notNull);
}

function notNull<T>(value: T | undefined | null): value is T {
    return value != null;
}

export function forEach<T>(
    dictionary: Readonly<Record<string, T>>,
    f: (value: T, key: string) => void
): void {
    for (const [key, value] of entries(dictionary)) {
        f(value, key);
    }
}

export function forEachFn<T>(
    f: (value: T, key: string) => void
): (dictionary: Readonly<Record<string, T>>) => void {
    return dictionary => void forEach(dictionary, f);
}
