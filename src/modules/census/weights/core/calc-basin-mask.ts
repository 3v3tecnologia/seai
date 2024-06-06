export function convertBasinsIDsToMask(ids: Array<number>) {
    return ids.reduce((prev, current) => prev += 2 ** (current - 1), 0)
}