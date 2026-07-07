export const sortingHelper = (allowedSortFields: string[], sortBy?: string, sort?: "asc" | "desc") => {
    const sortCondition: { [key: string]: "asc" | "desc" } = {};

    if (sortBy && allowedSortFields.includes(sortBy)) {
        const sortOrder = sort === "asc" ? "asc" : "desc";

        sortCondition[sortBy] = sortOrder;
    }

    return sortCondition;
}