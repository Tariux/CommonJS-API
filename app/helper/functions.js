class Xhelper {
    static findItemsByKeyValueInArray(items, key, value) {
        return items.filter(item => item[key] === value);
    }
}

module.exports = {Xhelper}