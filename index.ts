import {map} from "@softwareventures/iterable";

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

/** Creates a new empty object with a null prototype typed as a
 * `Partial<T>`. */
export function emptyObject<T extends object>(): Partial<NotFunction<T>> {
    return Object.create(null) as Partial<NotFunction<T>>;
}

/** Creates a new record with the specified properties and a null prototype. */
export function record<TKey extends Key, TValue>(
    properties?: Record<TKey, TValue>
): Record<TKey, TValue> {
    return Object.assign(Object.create(null), properties) as Record<TKey, TValue>;
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
export type StringKey<T extends object> = T extends Record<infer K, unknown> ? K & string : never;

/** Returns an array of the object's own ennumerable string-keyed property names. */
// @ts-ignore duplicate identifier: This is the exported declaration, the implementation is below.
export function keys<T>(object: T): Array<StringKey<T>>;

/* @internal This implementation is for internal use only, the exported declaration is above */
// @ts-ignore duplicate identifier: This is the actual implementation, the exported declaration is above.
export const keys: <T>(object: T) => Array<StringKey<T>> = Object.keys;

/** The string-keyed property values of `T`. */
export type StringKeyedValue<T extends object> = T extends Record<infer K, unknown>
    ? K extends string
        ? T[K]
        : never
    : never;

/** Returns an array of the object's own ennumerable string-keyed property
 * values. */
// @ts-ignore duplicate identifier: This is the exported declaration, the implementation is below.
export function values<T extends object>(object: T): Array<StringKeyedValue<T>>;

/* @internal This implementation is for internal use only, the exported declaration is above. */
// @ts-ignore duplicate identifier: This is the actual implementation, the exported declaration is above.
export const values: <T extends object>(object: T) => Array<StringKeyedValue<T>> = Object.values;

/** Key-value pairs of the string-keyed properties of `T`. */
export type StringKeyedEntry<T extends object> = T extends Readonly<Record<infer K, unknown>>
    ? K extends string
        ? [K, T[K]]
        : never
    : never;

/** Returns an array of the object's own ennumerable string-keyed property
 * `[key, value]` pairs. */
// @ts-ignore duplicate identifier: This is the exported declaration, the implementation is below.
export function entries<T>(object: T): Array<StringKeyedEntry<T>>;

/* @internal This implementation is for internal use only, the exported declaration is above. */
// @ts-ignore duplicate identifier: This is the actual implementation, the exported declaration is above.
export const entries: <T>(object: T) => Array<StringKeyedEntry<T>> = Object.entries;

/** Tests if the specified record is empty of own ennumerable string-keyed
 * properties.
 *
 * Properties keyed by symbols, inherited properties, and non-ennumerable
 * properties are not considered, so an "empty" record may in fact have
 * properties of those types. */
export function empty<T>(record: Readonly<Record<string, T>>): boolean {
    return keys(record).length === 0;
}

export type Merge<A extends object, B extends object> = {
    [K in keyof A | keyof B]: K extends keyof B ? B[K] : K extends keyof A ? A[K] : never;
};

/** Creates a new object that contains the properties of all the specified
 * objects.
 *
 * If two or more of the specified objects have properties with the same key,
 * then the newly created object will contain the property value from the last
 * such specified object. */
export function mergeObjects<A extends object>(a: A): NotFunction<A>;

/** Creates a new object that contains the properties of all the specified
 * objects.
 *
 * If two or more of the specified objects have properties with the same key,
 * then the newly created object will contain the property value from the last
 * such specified object. */
export function mergeObjects<A extends object, B extends object>(a: A, b: B): Merge<A, B>;

/** Creates a new object that contains the properties of all the specified
 * objects.
 *
 * If two or more of the specified objects have properties with the same key,
 * then the newly created object will contain the property value from the last
 * such specified object. */
export function mergeObjects<A extends object, B extends object, C extends object>(
    a: A,
    b: B,
    c: C
): Merge<Merge<A, B>, C>;

/** Creates a new object that contains the properties of all the specified
 * objects.
 *
 * If two or more of the specified objects have properties with the same key,
 * then the newly created object will contain the property value from the last
 * such specified object. */
export function mergeObjects<
    A extends object,
    B extends object,
    C extends object,
    D extends object
>(a: A, b: B, c: C, d: D): Merge<Merge<Merge<A, B>, C>, D>;

/** Creates a new object that contains the properties of all the specified
 * objects.
 *
 * If two or more of the specified objects have properties with the same key,
 * then the newly created object will contain the property value from the last
 * such specified object. */
export function mergeObjects<
    A extends object,
    B extends object,
    C extends object,
    D extends object,
    E extends object
>(a: A, b: B, c: C, d: D, e: E): Merge<Merge<Merge<Merge<A, B>, C>, D>, E>;

/** Creates a new object that contains the properties of all the specified
 * objects.
 *
 * If two or more of the specified objects have properties with the same key,
 * then the newly created object will contain the property value from the last
 * such specified object. */
export function mergeObjects<K extends Key, T>(
    ...records: Array<Readonly<Record<K, T>>>
): Record<K, T>;

export function mergeObjects<K extends Key, T>(
    ...records: Array<Readonly<Record<K, T>>>
): Record<K, T> {
    const result = record<K, T>();
    for (let i = 0; i < records.length; ++i) {
        Object.assign(result, records[i]);
    }
    return result;
}

/** Curried variant of {@link mergeObjects}.
 *
 * Returns a function that creates an object that contains the properties of
 * all the specified objects.
 *
 * If two or more of the specified objects have properties with the same key,
 * then the newly created object will contain the property value from the last
 * such specified object. */
export function mergeObjectsFn<A extends object>(): (a: A) => NotFunction<A>;

/** Curried variant of {@link mergeObjects}.
 *
 * Returns a function that creates an object that contains the properties of
 * all the specified objects.
 *
 * If two or more of the specified objects have properties with the same key,
 * then the newly created object will contain the property value from the last
 * such specified object. */
export function mergeObjectsFn<A extends object, B extends object>(b: B): (a: A) => Merge<A, B>;

/** Curried variant of {@link mergeObjects}.
 *
 * Returns a function that creates an object that contains the properties of
 * all the specified objects.
 *
 * If two or more of the specified objects have properties with the same key,
 * then the newly created object will contain the property value from the last
 * such specified object. */
export function mergeObjectsFn<A extends object, B extends object, C extends object>(
    b: B,
    c: C
): (a: A) => Merge<Merge<A, B>, C>;

/** Curried variant of {@link mergeObjects}.
 *
 * Returns a function that creates an object that contains the properties of
 * all the specified objects.
 *
 * If two or more of the specified objects have properties with the same key,
 * then the newly created object will contain the property value from the last
 * such specified object. */
export function mergeObjectsFn<
    A extends object,
    B extends object,
    C extends object,
    D extends object
>(b: B, c: C, d: D): (a: A) => Merge<Merge<Merge<A, B>, C>, D>;

/** Curried variant of {@link mergeObjects}.
 *
 * Returns a function that creates an object that contains the properties of
 * all the specified objects.
 *
 * If two or more of the specified objects have properties with the same key,
 * then the newly created object will contain the property value from the last
 * such specified object. */
export function mergeObjectsFn<
    A extends object,
    B extends object,
    C extends object,
    D extends object,
    E extends object
>(b: B, c: C, d: D, e: E): (a: A) => Merge<Merge<Merge<Merge<A, B>, C>, D>, E>;

/** Curried variant of {@link mergeObjects}.
 *
 * Returns a function that creates an object that contains the properties of
 * all the specified objects.
 *
 * If two or more of the specified objects have properties with the same key,
 * then the newly created object will contain the property value from the last
 * such specified object. */
export function mergeObjectsFn<K extends Key, T>(
    ...records: Array<Readonly<Record<K, T>>>
): (record: Readonly<Record<K, T>>) => Record<K, T>;

export function mergeObjectsFn<K extends Key, T>(
    ...records: Array<Readonly<Record<K, T>>>
): (record: Readonly<Record<K, T>>) => Record<K, T> {
    return record => mergeObjects(record, ...records);
}

/** Creates a new object with properties mapped from the string-keyed
 * properties of the specified object according to the specified mapping
 * function.
 *
 * Only the string-keyed properties of the input object are considered, but
 * the mapping function may produce keys of any suitable type.
 *
 * If the mapping function returns the same key twice, then later values will
 * overwrite earlier ones. */
export function mapObject<T, U>(
    object: Readonly<Record<string, T>>,
    f: (key: string, value: T) => readonly [string, U]
): Record<string, U>;

/** Creates a new object with properties mapped from the string-keyed
 * properties of the specified object according to the specified mapping
 * function.
 *
 * Only the string-keyed properties of the input object are considered, but
 * the mapping function may produce keys of any suitable type.
 *
 * If the mapping function returns the same key twice, then later values will
 * overwrite earlier ones. */
export function mapObject<TValue, TNewKey extends Key, TNewValue>(
    object: Readonly<Record<string, TValue>>,
    f: (key: string, value: TValue) => readonly [TNewKey, TNewValue]
): Record<TNewKey, TNewValue>;

export function mapObject<TValue, TNewKey extends Key, TNewValue>(
    object: Readonly<Record<string, TValue>>,
    f: (key: string, value: TValue) => readonly [TNewKey, TNewValue]
): Record<TNewKey, TNewValue> {
    return Object.assign(
        Object.create(null),
        Object.fromEntries(map(Object.entries(object), ([key, value]) => f(key, value)))
    ) as Record<TNewKey, TNewValue>;
}

/** Curried variant of {@link mapObject}.
 *
 * Returns a function that creates a new object with properties mapped from the
 * string-keyed properties of the specified object according to the specified
 * mapping function.
 *
 * Only the string-keyed properties of the input object are considered, but
 * the mapping function may produce keys of any suitable type.
 *
 * If the mapping function returns the same key twice, then later values will
 * overwrite earlier ones. */
export function mapObjectFn<T, U>(
    f: (key: string, value: T) => readonly [string, U]
): (object: Readonly<Record<string, T>>) => Record<string, U>;

/** Curried variant of {@link mapObject}.
 *
 * Returns a function that creates a new object with properties mapped from the
 * string-keyed properties of the specified object according to the specified
 * mapping function.
 *
 * Only the string-keyed properties of the input object are considered, but
 * the mapping function may produce keys of any suitable type.
 *
 * If the mapping function returns the same key twice, then later values will
 * overwrite earlier ones. */
export function mapObjectFn<TValue, TNewKey extends Key, TNewValue>(
    f: (key: string, value: TValue) => readonly [TNewKey, TNewValue]
): (object: Readonly<Record<string, TValue>>) => Record<TNewKey, TNewValue>;

export function mapObjectFn<TValue, TNewKey extends Key, TNewValue>(
    f: (key: string, value: TValue) => readonly [TNewKey, TNewValue]
): (object: Readonly<Record<string, TValue>>) => Record<TNewKey, TNewValue> {
    return object => mapObject(object, f);
}

/** Creates a new object with string-keyed properties of the specified object
 * mapped to new keys according to the specified mapping function.
 *
 * Only the string-keyed properties of the input object are considered, but the
 * mapping function may produce keys of any suitable type.
 *
 * If the mapping function returns the same key twice, then later values will
 * overwrite earlier ones. */
export function mapObjectKeys<TValue, TNewKey extends Key = string>(
    object: Readonly<Record<string, TValue>>,
    f: (key: string) => TNewKey
): Record<TNewKey, TValue> {
    return Object.assign(
        Object.create(null),
        Object.fromEntries(map(Object.entries(object), ([key, value]) => [f(key), value]))
    ) as Record<TNewKey, TValue>;
}

/** Curried variant of {@link mapObjectKeys}.
 *
 * Returns a function that creates a new object with string-keyed properties of
 * the specified object mapped to new keys according to the specified mapping
 * function.
 *
 * Only the string-keyed properties of the input object are considered, but the
 * mapping function may produce keys of any suitable type.
 *
 * If the mapping function returns the same key twice, then later values will
 * overwrite earlier ones. */
export function mapObjectKeysFn<TValue, TNewKey extends Key = string>(
    f: (key: string) => TNewKey
): (object: Readonly<Record<string, TValue>>) => Record<TNewKey, TValue> {
    return object => mapObjectKeys(object, f);
}

export type MapObjectValues<TObject extends object, TNewValue> = {
    [TKey in string & keyof TObject]: TNewValue;
};

/** Creates a new object with string-keyed properties of the specified object
 * mapped to new values according to the specified mapping function. */
export function mapObjectValues<TObject extends object, TNewValue>(
    object: TObject,
    f: (value: TObject[keyof TObject], key: keyof TObject) => TNewValue
): MapObjectValues<TObject, TNewValue>;

/** Creates a new object with string-keyed properties of the specified object
 * mapped to new values according to the specified mapping function. */
export function mapObjectValues<T, U>(
    object: Readonly<Record<string, T>>,
    f: (value: T, key: string) => U
): Record<string, U>;

export function mapObjectValues<T, U>(
    object: Readonly<Record<string, T>>,
    f: (value: T, key: string) => U
): Record<string, U> {
    return Object.assign(
        Object.create(null),
        Object.fromEntries(map(Object.entries(object), ([key, value]) => [key, f(value, key)]))
    ) as Record<string, U>;
}

/** Curried variant of {@link mapObjectValues}.
 *
 * Returns a function that creates a new object with string-keyed properties
 * of the specified object mapped to new values according to the specified
 * mapping function. */
export function mapObjectValuesFn<TObject extends object, TNewValue>(
    f: (value: TObject[keyof TObject], key: keyof TObject) => TNewValue
): (object: TObject) => MapObjectValues<TObject, TNewValue>;

/** Curried variant of {@link mapObjectValues}.
 *
 * Returns a function that creates a new object with string-keyed properties
 * of the specified object mapped to new values according to the specified
 * mapping function. */
export function mapObjectValuesFn<T, U>(
    f: (value: T, key: string) => U
): (object: Readonly<Record<string, T>>) => Record<string, U>;

export function mapObjectValuesFn<T, U>(
    f: (value: T, key: string) => U
): (object: Readonly<Record<string, T>>) => Record<string, U> {
    return object => mapObjectValues(object, f);
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
