import test from "ava";
import {Dictionary} from "dictionary-types";
import {entries, filter, map, values} from "./index";

test("map", t => {
    t.deepEqual(map({a: 1, b: 2}, value => value + 1), {a: 2, b: 3});
    t.deepEqual(map({a: 1, b: 2}, (value, key) => (value * 2) + key), {a: "2a", b: "4b"});
});

test("filter", t => {
    const dictionary = {a: 1, b: 2, c: 3, d: 17, e: 24};
    t.deepEqual(filter(dictionary, value => value % 2 === 0), {b: 2, e: 24});
    t.deepEqual(filter(dictionary, (value, key) => value % 2 === 1 && key !== "c"), {a: 1, d: 17});
});

interface Furniture {
    readonly hatstand: number;
    readonly sofa: string;
}

test("values", t => {
    const furniture: Furniture = {hatstand: 3, sofa: "comfy"};
    t.deepEqual(values(furniture), [3, "comfy"]);
    const dictionary: Dictionary<number> = {a: 1, b: 2};
    t.deepEqual(values(dictionary), [1, 2]);
});

test("entries", t => {
    const furniture: Furniture = {hatstand: 3, sofa: "comfy"};
    t.deepEqual(entries(furniture), [["hatstand", 3], ["sofa", "comfy"]]);
    const dictionary: Dictionary<number> = {a: 1, b: 2};
    const dictionaryEntries: Array<[string, number]> = entries(dictionary);
    t.deepEqual(dictionaryEntries, [["a", 1], ["b", 2]]);
});