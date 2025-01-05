export const isParamValueValid = (paramValue) => {
    if (typeof paramValue === 'string' && paramValue.length > 0) {
        return true;
    }
    return false;
};
