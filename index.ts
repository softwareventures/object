/** Union of all types that can be used as the key for property access.
 *
 * The type of `x` in the expression `o[x]` (for arbitrary `o`).
 *
 * As of TypeScript 4.9, equivalent to `string | number | symbol`. */
export type Key = keyof never;

export type NotFunction<T> = {[K in keyof T]: T[K]};

/** Creates a new object with the specified properties and a null prototype. */
export function object<T extends object>(properties: T): NotFunction<T> {
    return Object.assign(Object.create(null), properties) as NotFunction<T>;
}

/** Creates a shallow copy of the specified object.
 *
 * The new object will have the same prototype as the specified object.
 *
 * If the object is callable (is a `Function`), then the new object will also
 * be callable and will call the same function.
 *
 * If the object is newable (is a class), then the new object will also be
 * newable and will construct a subclass with no overrides.
 *
 * To create a copy that has a null prototype and that is not callable or
 * newable, use {@link object} instead. */
export function copy<T extends object>(object: T): T {
    let copy: object;
    if (typeof object === "function") {
        copy = function (this: unknown, ...args: unknown[]): unknown {
            return (object as (...args: unknown[]) => unknown).apply(this, args);
        };
        Object.setPrototypeOf(copy, Object.getPrototypeOf(object) as object | null);
    } else {
        copy = Object.create(Object.getPrototypeOf(object) as object | null) as object;
    }
    return Object.assign(copy, object);
}

/** The string property names of `T`. */
export type StringKey<T extends object> = T extends Record<infer K, unknown>
    ? K & string
    : never;

/** Returns an array of the object's own ennumerable string-keyed property names. */
// @ts-ignore duplicate identifier: This is the exported declaration, the implementation is below.
export function keys<T>(object: T): Array<StringKey<T>>;

/* @internal This implementation is for internal use only, the exported declaration is above */
// @ts-ignore duplicate identifier: This is the actual implementation, the exported declaration is above.
export const keys: <T>(object: T) => Array<StringKey<T>> = Object.keys;

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
