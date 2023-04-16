function onlyUnique(value, index, array) {
    return array.indexOf(value) === index;
}

export function arrayUnique(array) {
    return array.filter(onlyUnique);
}