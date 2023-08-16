// pswd validation
const userService = require('../services/userService');
const bcrypt = require('bcrypt');

async function ps_validate(id) {
    const password = await userService.getPswd(id);
    console.log({password:password.password});
    // pswd de hash and check password after return boolean value


}

module.exports={ps_validate}