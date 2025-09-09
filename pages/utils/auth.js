const bcrypt = require('bcryptjs');

/**
* Hashea una contraseña utilizando bcrypt.
* @param {string} password - La contraseña en texto plano.
* @param {number} saltRounds - El número de rondas de sal (opcional, por defecto es 10).
* @returns {Promise<string>} - Devuelve la contraseña hasheada.
*/
async function hashPassword(password, saltRounds = 10) {
    // await espera a que termine el proceso de hash, sino esta lo realiza async
    // Es por eso que realiza una promesa, para que el codigo espere
    return await bcrypt.hash(password, saltRounds);
}

/**
* Compara una contraseña con su hash usando bcrypt.
* @param {string} plainText - La contraseña en texto plano.
* @param {string} hashed - Hash guardado en BD
* @returns {Promise<boolean>} - Devuelve true si coinciden, false en caso contrario.
*/
async function comparePassword(plainText, hashed) {
    return await bcrypt.compare(plainText, hashed);
}

module.exports = {
    hashPassword,
    comparePassword
};
