import { IdWithDisplayName } from "./definitions";

export function newUpdatedArray<T>(
    array: T[],
    selector: ((item: T, index: number, array: T[]) => boolean) | null,
    newItem: T | null,
    itemFunctor?: (matchedItem: T) => T
): T[] {
    const index = selector === null ? -1 : array.findIndex(selector),
        items = array.map(function (item) {
            return item;
        });

    if (index !== -1) {
        if (newItem === null && itemFunctor === undefined) {
            // matching item should be removed from the array
            items.splice(index, 1);
            return items;
        }

        if (itemFunctor !== undefined) {
            // apply the provided callback
            items[index] = itemFunctor(items[index]);
        } else {
            // matching item should be replaced with newItem
            // Note that it is considered an incorrect usage to supply null for newItem when the array element type doesn't permit null.
            // Null is used elsewhere as an instruction to remove an item.
            items[index] = newItem as T;
        }
    } else if (newItem !== null) {
        // no match and newItem is not null - add it to end of the array
        items.push(newItem);
    }

    return items;
}

export function newUpdatedObject<T extends Record<string, any>>(input: T, propertiesToUpdate: Partial<T>): T {
    return { ...input, ...propertiesToUpdate };
}

/**
 * Helps and eases combining plain strings (or property names of an object) into one string that can be passed directly to a React className property.
 * Accepts any number of objects, strings, null or undefined's. The truthy-valued properties of any object are kept as eligible class names, along with any
 * non-empty string. null/undefined values are ignored. The return value is either a string (consisting of all eligible class names separated by spaces), or undefined if there are none.
 */
export function classNames(...args: (Record<string, unknown> | string | null | undefined)[]) {
	const values = [] as string[];
	args.forEach(arg => {
		if (arg === undefined || arg === null) {
			return;
		}
		if (typeof arg === 'string') {
			if (arg !== '') {
				values.push(arg);
			}
		} else {
			Object.keys(arg)
				.filter(a => a !== '' && Boolean(arg[a]))
				.forEach(a => values.push(a));
		}
	});
	return values.length === 0 ? undefined : values.join(' ');
}


/**
 * Returns a dictionary object with a property for each item in the provided array.
 * The key for each property is calculated using the provided keySelector, and later entries will overwrite earlier ones with the same key.
 */
export function toDictionary<TItem, TKey extends string | number>(
	items: TItem[],
	keySelector: (item: TItem) => TKey
): Record<TKey, TItem>;

/**
 * Returns a dictionary object with a property for each item in the provided array.
 * The key for each property is calculated using the provided keySelector, and later entries will overwrite earlier ones with the same key.
 * The value for each property is calculated using the provided valueSelector.
 */
export function toDictionary<TItem, TKey extends string | number, TValue>(
	items: TItem[],
	keySelector: (item: TItem) => TKey,
	valueSelector: (item: TItem) => TValue
): Record<TKey, TValue>;

// This is the implementation for the previous two function declarations.
export function toDictionary<TItem, TKey extends string | number, TValue>(
	items: TItem[],
	keySelector: (item: TItem) => TKey,
	valueSelector?: (item: TItem) => TValue
): Record<TKey, TValue | TItem> {
	return Object.fromEntries(
		items.map(item => [keySelector(item), valueSelector ? valueSelector(item) : item])
	) as Record<TKey, TValue | TItem>;
}

export function isNullOrEmpty(value: string | undefined | null | number) {
    return value === undefined || value === null || value === ""
}

export function getNameById(options: IdWithDisplayName[], id: number | string) {
    const numberId = typeof id === "number" ? id : Number(id);
    return options.find(opt => opt.id === numberId)?.name
}