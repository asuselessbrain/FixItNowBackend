export const filterHelper = <T>(
    whereCondition: T[],
    filters: Record<string, any>,
    allowedFilterFields: string[]
): T[] => {
    
    const filterKeys = Object.keys(filters);

    if (filterKeys.length > 0) {
        filterKeys.forEach(key => {
            const value = filters[key];

            if (allowedFilterFields.includes(key) && value !== undefined && value !== null && value !== '') {
                
                if (key.includes('.')) {
                    const parts = key.split('.');
                    const nestedFilterObj: Record<string, any> = {};
                    
                    let current = nestedFilterObj;
                    for (let i = 0; i < parts.length; i++) {
                        const part = parts[i];
                        
                        if (i === parts.length - 1) {
                            current[part] = value === 'true' ? true : value === 'false' ? false : value;
                        } else {
                            current[part] = {};
                            current = current[part];
                        }
                    }

                    whereCondition.push(nestedFilterObj as unknown as T);
                } else {
                    whereCondition.push({
                        [key]: value === 'true' ? true : value === 'false' ? false : value
                    } as unknown as T);
                }
            }
        });
    }

    return whereCondition;
};