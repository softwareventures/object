import {notNull} from "@softwareventures/nullable";
import test from "ava";
import {expectType} from "ts-expect";
import {
    copy,
    entries,
    excludeNullProperties,
    filterObject,
    filterObjectKeys,
    filterObjectValues,
    keys,
    mapObject,
    mapObjectKeys,
    mapObjectValues,
    mergeObjects,
    object,
    values
} from "./index";

const s = Symbol();

class A {
    public readonly a = 1;
    public readonly b = 2;
    public readonly [s] = 3;
}

test("object", t => {
    const o = object(new A());
    t.is(Object.getPrototypeOf(o), null);
    t.false(o instanceof A);
    t.deepEqual(o, {a: 1, b: 2, [s]: 3});

    const f = (): number => 1;
    const o2 = object(f);
    t.is(typeof o2, "object");
});

test("copy", t => {
    const f = (): number => 1;
    f.a = 1;
    f.b = 2;
    const o = copy(f);
    t.is(o.a, 1);
    t.is(o.b, 2);
    t.is(o(), 1);

    const o2 = copy(new A());
    t.true(o2 instanceof A);
    t.is(o2.a, 1);
    t.is(o2.b, 2);
    t.is(o2[s], 3);
});

class Furniture {
    public readonly hatstand = 3;
    public readonly sofa = "comfy";
}

test("keys", t => {
    t.deepEqual(keys(new Furniture()), ["hatstand", "sofa"]);
    t.deepEqual(keys({a: 1, b: 2}), ["a", "b"]);
});

test("values", t => {
    t.deepEqual(values(new Furniture()), [3, "comfy"]);
    t.deepEqual(values({a: 1, b: 2}), [1, 2]);
});

test("entries", t => {
    t.deepEqual(entries(new Furniture()), [
        ["hatstand", 3],
        ["sofa", "comfy"]
    ]);
    t.deepEqual(entries({a: 1, b: 2}), [
        ["a", 1],
        ["b", 2]
    ]);
});

test("mergeObjects", t => {
    const s = Symbol();
    const a = {a: 1, b: 2, [s]: false} as const;
    const b = {a: "hello", c: 3} as const;
    const c = {a: true, d: 4} as const;
    const d = {c: true, d: 5} as const;

    t.deepEqual(mergeObjects(a), {a: 1, b: 2, [s]: false});
    t.deepEqual(mergeObjects(a, b), {a: "hello", b: 2, c: 3, [s]: false});
    t.deepEqual(mergeObjects(a, b, c), {a: true, b: 2, c: 3, d: 4, [s]: false});
    t.deepEqual(mergeObjects(a, b, c, d), {a: true, b: 2, c: true, d: 5, [s]: false});
});

test("mapObject", t => {
    const a = {
        a: 1,
        b: 2
    } as const;

    const sa = Symbol();
    const sb = Symbol();

    const symbols: Record<string, symbol> = {
        a: sa,
        b: sb
    };

    t.deepEqual(
        mapObject(a, (key, value) => [notNull(symbols[key]), value + 1]),
        {
            [sa]: 2,
            [sb]: 3
        }
    );
});

test("mapObjectKeys", t => {
    const a = {
        a: 1,
        b: 2
    } as const;

    t.deepEqual(
        mapObjectKeys(a, key => `a${key}`),
        {
            aa: 1,
            ab: 2
        }
    );
});

test("mapObjectValues", t => {
    t.deepEqual(
        mapObjectValues({a: 1, b: 2}, value => value + 1),
        {a: 2, b: 3}
    );
    t.deepEqual(
        mapObjectValues({a: 1, b: 2}, (value, key) => (value * 2).toString(10) + key),
        {a: "2a", b: "4b"}
    );
});

test("filterObject", t => {
    const object = {
        a: 1,
        b: 2,
        c: 3,
        d: 4,
        e: 5
    } as const;

    t.deepEqual(
        filterObject(object, (key, value) => value % 2 === 0 || key === "c"),
        {
            b: 2,
            c: 3,
            d: 4
        }
    );
});

test("filterObjectKeys", t => {
    const object = {
        a: 1,
        b: 2,
        c: 3,
        d: 4,
        e: 5
    } as const;

    t.deepEqual(
        filterObjectKeys(object, key => key === "b" || key === "e"),
        {
            b: 2,
            e: 5
        }
    );
});

test("filterObjectValues", t => {
    const object = {
        a: 1,
        b: 2,
        c: 3,
        d: 17,
        e: 24
    } as const;

    t.deepEqual(
        filterObjectValues(object, value => value % 2 === 0),
        {b: 2, e: 24}
    );
});

test("excludeNullProperties", t => {
    const o = {
        a: 1,
        b: null as 2 | null,
        c: 3,
        d: 4,
        e: undefined
    } as const;

    const o2 = excludeNullProperties(o);
    expectType<{a?: 1; b?: 2; c?: 3; d?: 4}>(o2);
    t.deepEqual(o2, {a: 1, c: 3, d: 4});
});
