export const searchingHelper = <T>(whereCondition: T[], allowedSearchFields: string[], searchTerm?: string) => {

    if (searchTerm) {
        whereCondition.push({
            OR: allowedSearchFields.map(field => ({
                [field]: { contains: searchTerm, mode: "insensitive" }
            }))
        } as unknown as T);
    }
    return whereCondition;
}