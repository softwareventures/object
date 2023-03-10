import {filter, map} from "@softwareventures/iterable";
import {isNotNull} from "@softwareventures/nullable";

/** The type of a property key of `T`.
 *
 * If `T` is not specified, the type of a property key of any object.
 *
 * As of TypeScript 4.9, `Key` is equivalent to `string | number | symbol`. */
export type Key<T extends object = never> = keyof T;

/** The type of a property value of `T`. */
export type PropertyValue<T extends object> = T[keyof T];

/** The type of a key-value pair for properties of `T`. */
export type Entry<T extends object> = [keyof T, T[keyof T]];

/** The string-keyed properties of `T`. */
export type StringKeyedProperties<T> = {
    [K in string & keyof T]: T[K];
};

/** The string property names of `T`. */
export type StringKey<T extends object> = Key<StringKeyedProperties<T>>;

/** The string-keyed property values of `T`. */
export type StringKeyedValue<T extends object> = PropertyValue<StringKeyedProperties<T>>;

/** Key-value pairs of the string-keyed properties of `T`. */
export type StringKeyedEntry<T extends object> = Entry<StringKeyedProperties<T>>;

/** The type `T`, but with any callable or newable signatures removed. */
export type NotFunction<T> = {[K in keyof T]: T[K]};

/** Creates a new object with the specified properties and a null prototype. */
export function object<T extends object>(properties: T): NotFunction<T> {
    return Object.assign(emptyObject(), properties);
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
    return Object.assign(emptyObject(), properties);
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

/** Transforms a list of key-value pairs into an object.
 *
 * If the same key is specified twice or more, then later values overwrite
 * earlier values. */
export function objectFromEntries<TKey extends Key, TValue>(
    entries: Iterable<readonly [key: TKey, value: TValue]>
): Record<TKey, TValue> {
    return Object.assign(emptyObject(), Object.fromEntries(entries)) as Record<TKey, TValue>;
}

/** Returns an array of the object's own ennumerable string-keyed property names. */
// @ts-ignore duplicate identifier: This is the exported declaration, the implementation is below.
export function keys<T extends object>(object: T): Array<StringKey<T>>;

/* @internal This implementation is for internal use only, the exported declaration is above */
// @ts-ignore duplicate identifier: This is the actual implementation, the exported declaration is above.
export const keys: <T extends object>(object: T) => Array<StringKey<T>> = Object.keys;

/** Returns an array of the object's own ennumerable string-keyed property
 * values. */
// @ts-ignore duplicate identifier: This is the exported declaration, the implementation is below.
export function values<T extends object>(object: T): Array<StringKeyedValue<T>>;

/* @internal This implementation is for internal use only, the exported declaration is above. */
// @ts-ignore duplicate identifier: This is the actual implementation, the exported declaration is above.
export const values: <T extends object>(object: T) => Array<StringKeyedValue<T>> = Object.values;

/** Returns an array of the object's own ennumerable string-keyed property
 * `[key, value]` pairs. */
// @ts-ignore duplicate identifier: This is the exported declaration, the implementation is below.
export function entries<T extends object>(object: T): Array<StringKeyedEntry<T>>;

/* @internal This implementation is for internal use only, the exported declaration is above. */
// @ts-ignore duplicate identifier: This is the actual implementation, the exported declaration is above.
export const entries: <T extends object>(object: T) => Array<StringKeyedEntry<T>> = Object.entries;

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
export function mapObject<TObject extends object, TNewKey extends Key, TNewValue>(
    object: Readonly<TObject>,
    f: (key: StringKey<TObject>, value: StringKeyedValue<TObject>) => readonly [TNewKey, TNewValue]
): Record<TNewKey, TNewValue> {
    return objectFromEntries(map(entries(object), ([key, value]) => f(key, value)));
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
export function mapObjectFn<TObject extends object, TNewKey extends Key, TNewValue>(
    f: (key: StringKey<TObject>, value: StringKeyedValue<TObject>) => readonly [TNewKey, TNewValue]
): (object: Readonly<TObject>) => Record<TNewKey, TNewValue> {
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
export function mapObjectKeys<TObject extends object, TNewKey extends Key = string>(
    object: Readonly<TObject>,
    f: (key: StringKey<TObject>) => TNewKey
): Record<TNewKey, StringKeyedValue<TObject>> {
    return objectFromEntries(map(entries(object), ([key, value]) => [f(key), value]));
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
export function mapObjectKeysFn<TObject extends object, TNewKey extends Key = string>(
    f: (key: StringKey<TObject>) => TNewKey
): (object: Readonly<TObject>) => Record<TNewKey, StringKeyedValue<TObject>> {
    return object => mapObjectKeys(object, f);
}

export type MapObjectValues<TObject extends object, TNewValue> = {
    [TKey in StringKey<TObject>]: TNewValue;
};

/** Creates a new object with string-keyed properties of the specified object
 * mapped to new values according to the specified mapping function. */
export function mapObjectValues<TObject extends object, TNewValue>(
    object: TObject,
    f: (value: StringKeyedValue<TObject>, key: StringKey<TObject>) => TNewValue
): MapObjectValues<TObject, TNewValue> {
    return objectFromEntries(map(entries(object), ([key, value]) => [key, f(value, key)]));
}

/** Curried variant of {@link mapObjectValues}.
 *
 * Returns a function that creates a new object with string-keyed properties
 * of the specified object mapped to new values according to the specified
 * mapping function. */
export function mapObjectValuesFn<TObject extends object, TNewValue>(
    f: (value: StringKeyedValue<TObject>, key: StringKey<TObject>) => TNewValue
): (object: TObject) => MapObjectValues<TObject, TNewValue> {
    return object => mapObjectValues(object, f);
}

/** Creates a new object that contains the string-keyed properties of the
 * specified object, filtered by the specified predicate. */
export function filterObject<T extends object>(
    object: Readonly<T>,
    predicate: (key: StringKey<T>, value: StringKeyedValue<T>) => boolean
): Partial<StringKeyedProperties<T>> {
    return objectFromEntries(
        filter(entries(object), ([key, value]) => predicate(key, value))
    ) as Partial<StringKeyedProperties<T>>;
}

/** Curried variant of {@link filterObject}.
 *
 * Returns a function that creates a new object that contains the string-keyed
 * properties of the specified object, filtered by the specified predicate. */
export function filterObjectFn<T extends object>(
    predicate: (key: StringKey<T>, value: StringKeyedValue<T>) => boolean
): (object: Readonly<T>) => Partial<StringKeyedProperties<T>> {
    return object => filterObject(object, predicate);
}

export type FilterObjectKeys<T extends object, U extends StringKey<T>> = {
    [K in U]: T[K];
};

/** Creates a new object that contains the string-keyed properties of the
 * specified object, filtered by the specified predicate. */
export function filterObjectKeys<T extends object, U extends StringKey<T>>(
    object: Readonly<T>,
    predicate: (key: StringKey<T>) => key is U
): FilterObjectKeys<T, U>;

/** Creates a new object that contains the string-keyed properties of the
 * specified object, filtered by the specified predicate. */
export function filterObjectKeys<T extends object>(
    object: Readonly<T>,
    predicate: (key: StringKey<T>) => boolean
): Partial<StringKeyedProperties<T>>;

export function filterObjectKeys<T extends object>(
    object: Readonly<T>,
    predicate: (key: StringKey<T>) => boolean
): Partial<StringKeyedProperties<T>> {
    return objectFromEntries(filter(entries(object), ([key]) => predicate(key))) as Partial<
        StringKeyedProperties<T>
    >;
}

/** Curried variant of {@link filterObjectKeys}.
 *
 * Returns a function that creates a new object that contains the string-keyed
 * properties of the specified object, filtered by the specified predicate. */
export function filterObjectKeysFn<T extends object, U extends StringKey<T>>(
    predicate: (key: StringKey<T>) => key is U
): (object: Readonly<T>) => FilterObjectKeys<T, U>;

/** Curried variant of {@link filterObjectKeys}.
 *
 * Returns a function that creates a new object that contains the string-keyed
 * properties of the specified object, filtered by the specified predicate. */
export function filterObjectKeysFn<T extends object>(
    predicate: (key: StringKey<T>) => boolean
): (object: Readonly<T>) => Partial<StringKeyedProperties<T>>;

/** Curried variant of {@link filterObjectKeys}.
 *
 * Returns a function that creates a new object that contains the string-keyed
 * properties of the specified object, filtered by the specified predicate. */
export function filterObjectKeysFn<T extends object>(
    predicate: (key: StringKey<T>) => boolean
): (object: Readonly<T>) => Partial<StringKeyedProperties<T>> {
    return object => filterObjectKeys(object, predicate);
}

export type FilterObjectValues<T extends object, U extends StringKeyedValue<T>> = {
    [K in StringKey<T>]: T[K] extends U ? T[K] : never;
};

export function filterObjectValues<T extends object, U extends StringKeyedValue<T>>(
    object: Readonly<T>,
    predicate: (value: StringKeyedValue<T>) => value is U
): FilterObjectValues<T, U>;

/** Creates a new object that contains the string-keyed properties of the
 * specified object, filtered by the specified predicate. */
export function filterObjectValues<T extends object>(
    object: Readonly<T>,
    predicate: (value: StringKeyedValue<T>) => boolean
): Partial<StringKeyedProperties<T>>;

export function filterObjectValues<T extends object>(
    object: Readonly<T>,
    predicate: (value: StringKeyedValue<T>) => boolean
): Partial<StringKeyedProperties<T>> {
    return objectFromEntries(filter(entries(object), ([_, value]) => predicate(value))) as Partial<
        StringKeyedProperties<T>
    >;
}

/** Curried variant of {@link filterObjectValues}.
 *
 * Returns a function that creates a new object that contains the string-keyed
 * properties of the specified object, filtered by the specified predicate. */
export function filterObjectValuesFn<T extends object, U extends StringKeyedValue<T>>(
    predicate: (value: StringKeyedValue<T>) => value is U
): (object: Readonly<T>) => FilterObjectValues<T, U>;

/** Curried variant of {@link filterObjectValues}.
 *
 * Returns a function that creates a new object that contains the string-keyed
 * properties of the specified object, filtered by the specified predicate. */
export function filterObjectValuesFn<T extends object>(
    predicate: (value: StringKeyedValue<T>) => boolean
): (object: Readonly<T>) => Partial<StringKeyedProperties<T>>;

export function filterObjectValuesFn<T extends object>(
    predicate: (value: StringKeyedValue<T>) => boolean
): (object: Readonly<T>) => Partial<StringKeyedProperties<T>> {
    return object => filterObjectValues(object, predicate);
}

/** Creates a new object that contains the string-keyed properties of the
 * specified object, excluded by the specified predicate. */
export function excludeObjectEntries<T extends object>(
    object: Readonly<T>,
    predicate: (key: StringKey<T>, value: StringKeyedValue<T>) => boolean
): Partial<StringKeyedProperties<T>> {
    return filterObject(object, (key, value) => !predicate(key, value));
}

/** Curried variant of {@link excludeObjectEntries}.
 *
 * Returns a function that creates a new object that contains the string-keyed
 * properties of the specified object, excluded by the specified predicate. */
export function excludeObjectEntriesFn<T extends object>(
    predicate: (key: StringKey<T>, value: StringKeyedValue<T>) => boolean
): (object: Readonly<T>) => Partial<StringKeyedProperties<T>> {
    return object => excludeObjectEntries(object, predicate);
}

/** Creates a new object that contains the string-keyed properties of the
 * specified object, excluded by the specified predicate. */
export function excludeObjectKeys<T extends object>(
    object: Readonly<T>,
    predicate: (key: StringKey<T>) => boolean
): Partial<StringKeyedProperties<T>> {
    return filterObjectKeys(object, key => !predicate(key));
}

/** Curried variant of {@link excludeObjectKeys}.
 *
 * Returns a function that creates a new object that contains the string-keyed
 * properties of the specified object, excluded by the specified predicate. */
export function excludeObjectKeysFn<T extends object>(
    predicate: (key: StringKey<T>) => boolean
): (object: Readonly<T>) => Partial<StringKeyedProperties<T>> {
    return object => excludeObjectKeys(object, predicate);
}

export type ExcludeObjectValues<
    TObject extends object,
    TExclude extends StringKeyedValue<TObject>
> = {
    [K in StringKey<TObject>]: TObject[K] extends TExclude ? never : TObject[K];
};

/** Creates a new object that contains the string-keyed properties of the
 * specified object, excluded by the specified predicate. */
export function excludeObjectValues<
    TObject extends object,
    TExclude extends StringKeyedValue<TObject>
>(
    object: Readonly<TObject>,
    predicate: (value: StringKeyedValue<TObject>) => value is TExclude
): ExcludeObjectValues<TObject, TExclude>;

/** Creates a new object that contains the string-keyed properties of the
 * specified object, excluded by the specified predicate. */
export function excludeObjectValues<T extends object>(
    object: Readonly<T>,
    predicate: (value: StringKeyedValue<T>) => boolean
): Partial<StringKeyedProperties<T>>;

export function excludeObjectValues<T extends object>(
    object: Readonly<T>,
    predicate: (value: StringKeyedValue<T>) => boolean
): Partial<StringKeyedProperties<T>> {
    return filterObjectValues(object, value => !predicate(value));
}

/** Curried variant of {@link excludeObjectValues}.
 *
 * Returns a function that creates a new object that contains the string-keyed
 * properties of the specified object, excluded by the specified predicate. */
export function excludeObjectValuesFn<
    TObject extends object,
    TExclude extends StringKeyedValue<TObject>
>(
    predicate: (value: StringKeyedValue<TObject>) => value is TExclude
): (object: Readonly<TObject>) => ExcludeObjectValues<TObject, TExclude>;

/** Curried variant of {@link excludeObjectValues}.
 *
 * Returns a function that creates a new object that contains the string-keyed
 * properties of the specified object, excluded by the specified predicate. */
export function excludeObjectValuesFn<T extends object>(
    predicate: (value: StringKeyedValue<T>) => boolean
): (object: Readonly<T>) => Partial<StringKeyedProperties<T>>;

export function excludeObjectValuesFn<T extends object>(
    predicate: (value: StringKeyedValue<T>) => boolean
): (object: Readonly<T>) => Partial<StringKeyedProperties<T>> {
    return object => excludeObjectValues(object, predicate);
}

export type ExcludeNullProperties<T extends object> = {
    [K in StringKey<T>]?: NonNullable<T[K]>;
};

export function excludeNullProperties<T extends object>(
    object: Readonly<T>
): ExcludeNullProperties<T> {
    return filterObjectValues(object, isNotNull) as ExcludeNullProperties<T>;
}
