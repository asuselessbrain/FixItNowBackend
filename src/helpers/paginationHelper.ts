export const paginationHelper = (page: string, limit: string) => {
    const take = limit ? parseInt(limit) : 10;
    const skip = page ? (parseInt(page) - 1) * take : 0;

    return { take, skip };
}