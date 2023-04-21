export function isInt(n) {
    return Number.isInteger(Number(n));
}

export function isFloat(n) {
    const floatN = Number(n);
    return Number(floatN) === floatN && floatN % 1 !== 0;
}

export function isPositive(n, type) {
    if(type == 0) return n >= 0;
    else return n > 0;
}

export function verifIntPositive(n, type) {
    return isInt(n) && isPositive(parseInt(n), type);
}

export function verifFloatPositive(n, type) {
    return ( isFloat(n) || isInt(n) ) && isPositive(parseFloat(n), type);
}