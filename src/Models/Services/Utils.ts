import { v4 } from 'uuid';

/**
 * checks whether the provided value is one of the values in the provided enum type
 * @example isValueInEnum(DTDLSchemaType, schemaType)
 */
export const isValueInEnum = (enumType: any, value: any) => {
    return !!(<any>Object).values(enumType).includes(value);
};

export const createGUID = (isWithDashes = false) => {
    let id: string = v4();
    if (!isWithDashes) {
        id = id.replace(/-/g, '');
    }
    return id;
};

export const objectHasOwnProperty = (obj, propertyName) =>
    Object.prototype.hasOwnProperty.call(obj, propertyName);

export const applyMixins = (derivedCtor: any, constructors: any[]) => {
    constructors.forEach((baseCtor) => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
            Object.defineProperty(
                derivedCtor.prototype,
                name,
                Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
                    Object.create(null)
            );
        });
    });
};

export function deepCopy<T>(object: T): T {
    if (object) {
        return JSON.parse(JSON.stringify(object)) as T;
    } else {
        return object;
    }
}

/**
 * Sorts a list alphabetically ignoring casing
 * @example listItems.sort(sortCaseInsensitiveAlphabetically())
 * @returns Sort function to pass to `.sort()`
 */
export function sortCaseInsensitive(descending?: boolean) {
    return (a: string, b: string) => {
        let order = 0;
        if (a && b && typeof a === 'string' && typeof b === 'string') {
            order = a.toLowerCase() > b.toLowerCase() ? 1 : -1;
        } else if (isDefined(a)) {
            order = -1;
        } else if (isDefined(b)) {
            order = 1;
        }

        if (descending) {
            order = order * -1;
        }

        return order;
    };
}

/**
 * Sort function to order items from ascending or descending order, for boolean, numbers and strings. Case insensitive sort
 * NOTE: only works when property is one layer down
 * @param propertyName name of the property to sort on
 *  @example listItems.sort(sortAscendingOrDescending('textPrimary'))
 * @returns Sort function to pass to `.sort()`
 */
export function sortAscendingOrDescending<T>(
    propertyName: keyof T,
    descending?: boolean
) {
    return (a: T, b: T) => {
        let aVal = (a[String(propertyName)] as unknown) as string;
        // handle the case where the property is not a string, if no value, fall back to empty string so we can sort undefined values consistently
        aVal =
            aVal && typeof aVal === 'string' ? aVal.toLowerCase() : aVal || '';
        let bVal = (b[String(propertyName)] as unknown) as string;
        // handle the case where the property is not a string, if no value, fall back to empty string so we can sort undefined values consistently
        bVal =
            bVal && typeof bVal === 'string' ? bVal.toLowerCase() : bVal || '';
        let order = -1;
        if (!descending) {
            order = aVal > bVal ? 1 : -1;
        } else {
            order = aVal < bVal ? 1 : -1;
        }
        return order;
    };
}

/**
 * Modifies the collection in-place to shift an item up or down in the collection.
 * @param direction Direction to move the item
 * @param itemIndex index of the item to move
 * @param items collection of items
 * @returns reference to the original collection
 */
export const moveItemInCollection = <T>(
    direction: 'Up' | 'Down',
    itemIndex: number,
    items: T[]
): T[] => {
    const item = items[itemIndex];

    if (direction === 'Up') {
        if (itemIndex === 0) {
            console.warn('Cannot move item up. Already first item in list');
            // early return if the first item in the list
            return items;
        }

        // insert the item at the new position
        items.splice(itemIndex - 1, 0, item);
        // remove the old item
        items.splice(itemIndex + 1, 1);
        return items;
    } else {
        if (itemIndex === items.length - 1) {
            console.warn('Cannot move item down. Already last item in list');
            // early return if the last item in the list
            return items;
        }
        // insert the item at the new position
        items.splice(itemIndex + 2, 0, item);
        // remove the old item
        items.splice(itemIndex, 1);
        return items;
    }
};

export function getDebugLogger(
    context: string,
    enabled: boolean
): IConsoleLogFunction {
    if (!enabled) return () => undefined;
    return (
        level: 'debug' | 'info' | 'warn' | 'error',
        message: string,
        ...args: unknown[]
    ) => {
        const formattedMessage = `[CB-DEBUG][${context}] ${message}`;
        switch (level) {
            case 'debug':
                console.debug(formattedMessage, ...args);
                break;
            case 'error':
                console.error(formattedMessage, ...args);
                break;
            case 'warn':
                console.warn(formattedMessage, ...args);
                break;
            default:
                console.info(formattedMessage, ...args);
                break;
        }
    };
}

/** checks if a value is null or undefined and returns true if it's not one of those values */
export function isDefined(value: unknown) {
    return value != null && value != undefined;
}
