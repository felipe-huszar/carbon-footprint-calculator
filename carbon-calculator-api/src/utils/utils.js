function hasNegativeValues(obj) {
    return Object.values(obj).some(value => {
        if (typeof value === 'object') {
            return hasNegativeValues(value); // Recursively check nested objects
        }
        return value < 0;
    });
}

function isValidUSZip(zip) {
    return /^\d{5}(-\d{4})?$/.test(zip);
}

function roundDeep(obj) {
    for (let key in obj) {
        if (typeof obj[key] === 'number') {
            obj[key] = parseFloat(obj[key].toFixed(2));
        } else if (obj[key] && typeof obj[key] === 'object') {
            roundDeep(obj[key]);
        }
    }
    return obj;
}

module.exports = { hasNegativeValues, isValidUSZip, roundDeep };