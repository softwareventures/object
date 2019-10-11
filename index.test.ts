import test from "ava";
import {filter, map} from "./index";

test("map", t => {
    t.deepEqual(map({a: 1, b: 2}, value => value + 1), {a: 2, b: 3});
    t.deepEqual(map({a: 1, b: 2}, (value, key) => (value * 2) + key), {a: "2a", b: "4b"});
});

test("filter", t => {
    const dictionary = {a: 1, b: 2, c: 3, d: 17, e: 24};
    t.deepEqual(filter(dictionary, value => value % 2 === 0), {b: 2, e: 24});
    t.deepEqual(filter(dictionary, (value, key) => value % 2 === 1 && key !== "c"), {a: 1, d: 17});
});