export function calculateTotalPages(totalItems:number, itemsPerPage:number) {
    return totalItems === 0 ? 0 : Math.floor((totalItems - 1) / itemsPerPage) + 1;
}