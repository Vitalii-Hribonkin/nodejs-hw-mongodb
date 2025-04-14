export const calculatePaginationData = ({ page, perPage, totalItems }) => {
    const totalPages = Math.ceil(totalItems / perPage);
    const hasPreviousPage = page > 1;
    const hasNextPage = page < totalPages;

    return {
        totalPages,
        hasPreviousPage,
        hasNextPage,
    };
};
