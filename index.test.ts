import test from "ava";
import {map} from "./index";

test("map", t => {
    t.deepEqual(map({a: 1, b: 2}, value => value + 1), {a: 2, b: 3});
    t.deepEqual(map({a: 1, b: 2}, (value, key) => (value * 2) + key), {a: "2a", b: "4b"});
});