"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDelimiter = exports.validateValkeyKeyConfig = exports.validateScope = exports.isValidScope = exports.isScopeLike = exports.validateValkeyKeyTemplate = exports.isValkeyKeyTemplate = exports.isValkeyKeyParam = void 0;
const isValkeyKeyParam = (templateMember) => {
    if (typeof templateMember === 'object' && templateMember.name) {
        return true;
    }
    if (typeof templateMember === 'string') {
        return false;
    }
    return false;
};
exports.isValkeyKeyParam = isValkeyKeyParam;
const isValkeyKeyTemplate = (possibleTemplate) => {
    return (Array.isArray(possibleTemplate) &&
        possibleTemplate.every((templateMember) => (0, exports.isValkeyKeyParam)(templateMember) || typeof templateMember === 'string'));
};
exports.isValkeyKeyTemplate = isValkeyKeyTemplate;
const validateValkeyKeyTemplate = (possibleTemplate) => {
    if ((0, exports.isValkeyKeyTemplate)(possibleTemplate) === false) {
        throw new Error(`Valkey Template Array must be an array of strings or Valkey Key Param objects`);
    }
};
exports.validateValkeyKeyTemplate = validateValkeyKeyTemplate;
const isScopeLike = (possibleScope) => {
    return (possibleScope != null &&
        typeof possibleScope === 'object' &&
        Object.keys(possibleScope).includes('SCOPE_PREFIX'));
};
exports.isScopeLike = isScopeLike;
const isValidScope = (scope) => {
    if ((0, exports.isScopeLike)(scope)) {
        for (const [key, value] of Object.entries(scope)) {
            if (key === 'SCOPE_PREFIX') {
                if ((0, exports.isValkeyKeyTemplate)(value) === false) {
                    return false;
                }
            }
            else if (Array.isArray(value)) {
                if ((0, exports.isValkeyKeyTemplate)(value)) {
                    continue;
                }
                else {
                    return false;
                }
            }
            else if ((0, exports.isScopeLike)(value)) {
                if ((0, exports.isValidScope)(value)) {
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
exports.isValidScope = isValidScope;
const validateScope = (scope, parentPath) => {
    try {
        if ((0, exports.isScopeLike)(scope)) {
            for (const [key, value] of Object.entries(scope)) {
                const keyPath = parentPath ? `${parentPath}.${key}` : '';
                if (key === 'SCOPE_PREFIX') {
                    (0, exports.validateValkeyKeyTemplate)(value);
                }
                else if (Array.isArray(value)) {
                    (0, exports.validateValkeyKeyTemplate)(value);
                }
                else if ((0, exports.isScopeLike)(value)) {
                    (0, exports.validateScope)(value, keyPath);
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
exports.validateScope = validateScope;
const validateValkeyKeyConfig = (valkeyKeyConfig) => {
    try {
        (0, exports.validateScope)(valkeyKeyConfig, null);
    }
    catch (error) {
        let message = 'unknown error';
        if (error instanceof Error) {
            message = error.message;
        }
        throw new Error('Valkey Key Config is not valid: ' + message);
    }
};
exports.validateValkeyKeyConfig = validateValkeyKeyConfig;
const validateDelimiter = (delimiter) => {
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
exports.validateDelimiter = validateDelimiter;
