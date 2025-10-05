const bcrypt = require('bcrypt');

exports.doHash = (value, saltValue) => {
    const result = bcrypt.hash(value, saltValue);
    return result;
}

exports.doComparation = (value, hashValue) =>{
    const result = bcrypt.compare(value, hashValue);
    return result;
}