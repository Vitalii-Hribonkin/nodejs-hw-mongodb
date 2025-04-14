import { sortList } from "../constants/index.js";

export const parseSortParams = ({ sortBy, sortOrder, sortFields }) => {
    const parsedSortOrder = sortList && sortList.includes(sortOrder) ? sortOrder : sortList ? sortList[0] : 'asc'; 
    const parsedSortBy = sortFields && sortFields.includes(sortBy) ? sortBy : '_id'; 

    return {
        sortBy: parsedSortBy,
        sortOrder: parsedSortOrder,
    };
};