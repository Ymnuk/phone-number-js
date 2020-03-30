function prepare(value) {
    if (typeof (value) !== 'string') {
        value = `${value}`;
    }
    value = value.replace(/\D/g, '');
    if (value.length === 10) {
        value = `7${value}`;
    }
    if (value.length === 11) {
        if (/^8/.test(value)) {
            value = value.replace(/^8/, '7');
        }
    }
    return value;
}

function isMobile(value) {
    if (value.length === 11) {
        if (/^79/.test(value)) {
            return true;
        }
    }
    return false;
}

module.exports = {
    prepare: prepare,
    isMobile: isMobile
}