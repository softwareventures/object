import {Dictionary, ReadonlyDictionary} from "dictionary-types";

/** Creates a shallow copy of the specified dictionary. */
export function copy<T>(dictionary: ReadonlyDictionary<T>): Dictionary<T> {
    return {...dictionary};
}