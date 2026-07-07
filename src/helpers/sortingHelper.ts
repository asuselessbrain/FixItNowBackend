export const sortingHelper = (allowedSortFields: string[], sortBy?: string, sort?: "asc" | "desc") => {
    const sortCondition: Record<string, any> = {};

    if (sortBy && allowedSortFields.includes(sortBy)) {
        const sortOrder = sort === "asc" ? "asc" : "desc";

        if (sortBy.includes(".")) {
            const fields = sortBy.split(".");

            let currentLevel = sortCondition;

            for (let i = 0; i < fields.length; i++) {
                const field = fields[i];

                if (i === fields.length - 1) {
                    currentLevel[field] = sortOrder;
                } else {
                    currentLevel = currentLevel[field] = {};
                }
            }
        } else {
            sortCondition[sortBy] = sortOrder;
        }
    } else {
        sortCondition["createdAt"] = "desc";
    }

    return sortCondition;
}