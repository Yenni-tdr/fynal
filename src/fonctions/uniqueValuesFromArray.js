function onlyUnique(value, index, array) {
    return array.indexOf(value) === index;
}

export default function arrayUnique(array) {
    return array.filter(onlyUnique);
}