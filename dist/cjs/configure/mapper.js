"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createKeysMapping = void 0;
const validators_js_1 = require("./validators.js");
const createTemplateStringFormTemplateArray = (templateArray, delimiter) => {
    (0, validators_js_1.validateValkeyKeyTemplate)(templateArray);
    if (templateArray.length === 0) {
        return null;
    }
    const templateString = templateArray
        .map((templateMember) => {
        if ((0, validators_js_1.isValkeyKeyParam)(templateMember)) {
            return `%${templateMember.name}%`;
        }
        return templateMember;
    })
        .join(delimiter);
    return templateString;
};
const createTemplateLeaf = (parentTemplateString, leafKeyTemplateArray, delimiter) => {
    (0, validators_js_1.validateValkeyKeyTemplate)(leafKeyTemplateArray);
    const templateString = createTemplateStringFormTemplateArray(leafKeyTemplateArray, delimiter);
    if (parentTemplateString != null && parentTemplateString.length > 0) {
        if (templateString) {
            return [parentTemplateString, templateString].join(delimiter);
        }
        return parentTemplateString;
    }
    return templateString;
};
const createTemplateScope = (parentTemplateString, scope, delimiter) => {
    const scopeTemplate = {};
    const scopeFirstPartString = createTemplateStringFormTemplateArray(scope.SCOPE_PREFIX, delimiter);
    for (const [key, value] of Object.entries(scope)) {
        if (key === 'SCOPE_PREFIX') {
            continue;
        }
        let templateString = null;
        if (parentTemplateString != null && parentTemplateString.length > 0) {
            if (scopeFirstPartString) {
                templateString = [parentTemplateString, scopeFirstPartString].join(delimiter);
            }
            else {
                templateString = parentTemplateString;
            }
        }
        else {
            templateString = scopeFirstPartString;
        }
        // is leaf
        if (Array.isArray(value)) {
            scopeTemplate[key] =
                createTemplateLeaf(templateString, value, delimiter) ||
                    parentTemplateString ||
                    '';
        }
        else if ((0, validators_js_1.isScopeLike)(value)) {
            // is scope
            scopeTemplate[key] = createTemplateScope(templateString, value, delimiter);
        }
    }
    return scopeTemplate;
};
const createKeysMapping = (valkeyKeysConfig, optionalDelimiter) => {
    if (optionalDelimiter != null) {
        (0, validators_js_1.validateDelimiter)(optionalDelimiter);
    }
    const delimiter = optionalDelimiter || ':';
    (0, validators_js_1.validateValkeyKeyConfig)(valkeyKeysConfig);
    const map = createTemplateScope(null, valkeyKeysConfig, delimiter);
    return map;
};
exports.createKeysMapping = createKeysMapping;
