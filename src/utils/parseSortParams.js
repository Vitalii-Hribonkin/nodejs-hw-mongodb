import { sortList } from "../constants/index.js";

export const parseSortParams = ({ sortBy, sortOrder, sortFields }) => {
    const isValidSortOrder = sortList?.includes(sortOrder);
    const isValidSortBy = sortFields?.includes(sortBy);

    return {
        sortBy: isValidSortBy ? sortBy : '_id',
        sortOrder: isValidSortOrder ? sortOrder : (sortList?.[0] || 'asc'),
    };
};
