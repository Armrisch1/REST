const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

function generateSecretToken(size){
    return crypto.randomBytes(size).toString('hex');
}

function generateAccessToken(username, expiresIn = CONFIG.get('jwt.expiresIn')) {
    return jwt.sign({username : username, salt : generateSecretToken(10)}, CONFIG.get('jwt.secret'), { expiresIn: expiresIn });
}

function generateRefreshToken(username, expiresIn = CONFIG.get('jwt.refreshExpiresIn')){
    return jwt.sign({username : username, salt : generateSecretToken(10)}, CONFIG.get('jwt.secret'), { expiresIn: expiresIn });
}

async function generateEncryptedPass(password, salt = CONFIG.get('app.passwordSalt')){
    return await bcrypt.hash(password, salt);
}

async function verifyEncryptedPass(plainPassword, encryptedPassword){
    return await bcrypt.compare(plainPassword, encryptedPassword);
}

module.exports = {
    generateSecretToken : generateSecretToken,
    generateAccessToken : generateAccessToken,
    generateRefreshToken : generateRefreshToken,
    generateEncryptedPass : generateEncryptedPass,
    verifyEncryptedPass : verifyEncryptedPass
}