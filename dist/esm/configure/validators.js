export const isValkeyKeyParam = (templateMember) => {
    if (typeof templateMember === 'object' && templateMember.name) {
        return true;
    }
    if (typeof templateMember === 'string') {
        return false;
    }
    return false;
};
export const isValkeyKeyTemplate = (possibleTemplate) => {
    return (Array.isArray(possibleTemplate) &&
        possibleTemplate.every((templateMember) => isValkeyKeyParam(templateMember) || typeof templateMember === 'string'));
};
export const validateValkeyKeyTemplate = (possibleTemplate) => {
    if (isValkeyKeyTemplate(possibleTemplate) === false) {
        throw new Error(`Valkey Template Array must be an array of strings or Valkey Key Param objects`);
    }
};
export const isScopeLike = (possibleScope) => {
    return (possibleScope != null &&
        typeof possibleScope === 'object' &&
        Object.keys(possibleScope).includes('SCOPE_PREFIX'));
};
export const isValidScope = (scope) => {
    if (isScopeLike(scope)) {
        for (const [key, value] of Object.entries(scope)) {
            if (key === 'SCOPE_PREFIX') {
                if (isValkeyKeyTemplate(value) === false) {
                    return false;
                }
            }
            else if (Array.isArray(value)) {
                if (isValkeyKeyTemplate(value)) {
                    continue;
                }
                else {
                    return false;
                }
            }
            else if (isScopeLike(value)) {
                if (isValidScope(value)) {
                    continue;
                }
                else {
                    return false;
                }
            }
            else {
                // Any other type is invalid
                return false;
            }
        }
        return true;
    }
    return false;
};
export const validateScope = (scope, parentPath) => {
    try {
        if (isScopeLike(scope)) {
            for (const [key, value] of Object.entries(scope)) {
                const keyPath = parentPath ? `${parentPath}.${key}` : '';
                if (key === 'SCOPE_PREFIX') {
                    validateValkeyKeyTemplate(value);
                }
                else if (Array.isArray(value)) {
                    validateValkeyKeyTemplate(value);
                }
                else if (isScopeLike(value)) {
                    validateScope(value, keyPath);
                }
                else {
                    // Any other type is invalid
                    throw new Error(`Invalid Valkey Key Scope on Path: <${keyPath}>`);
                }
            }
        }
        else {
            if (parentPath == null) {
                throw new Error(`Config Object itself is not a valid Valkey Key Scope`);
            }
            else {
                throw new Error(`Invalid Valkey Key Scope on Path: <${parentPath}>`);
            }
        }
    }
    catch (error) {
        let message = 'unknown error';
        if (error instanceof Error) {
            message = error.message;
        }
        throw new Error(message);
    }
};
export const validateValkeyKeyConfig = (valkeyKeyConfig) => {
    try {
        validateScope(valkeyKeyConfig, null);
    }
    catch (error) {
        let message = 'unknown error';
        if (error instanceof Error) {
            message = error.message;
        }
        throw new Error('Valkey Key Config is not valid: ' + message);
    }
};
export const validateDelimiter = (delimiter) => {
    if (typeof delimiter !== 'string') {
        throw new Error('Delimiter must be a string');
    }
    if (delimiter === '' || delimiter.length === 0) {
        throw new Error('Delimiter cannot be empty string');
    }
    if (delimiter === '%') {
        throw new Error('Invalid delimiter. Delimiter cannot be "%". This is used for params in Valkey Key templates.');
    }
};
