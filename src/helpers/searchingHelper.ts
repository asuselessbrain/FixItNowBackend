export const searchingHelper = <T>(whereCondition: T[], allowedSearchFields: string[], searchTerm?: string) => {

    if (searchTerm) {
        const orCondition = allowedSearchFields.map(field => {
            if (field.includes(".")) {
                const parts = field.split(".");

                const condition: Record<string, any> = {};

                let currentLevel = condition;

                for (let i = 0; i < parts.length; i++) {
                    const part = parts[i];

                    if (i === parts.length - 1) {
                        currentLevel[part] = { contains: searchTerm, mode: "insensitive" };
                    } else {
                        currentLevel[part] = {};
                        currentLevel = currentLevel[part];
                    }
                }
                return condition;
            }
            return { [field]: { contains: searchTerm, mode: "insensitive" } };
        })

        whereCondition.push({ OR: orCondition } as unknown as T);
    }
    return whereCondition;
}