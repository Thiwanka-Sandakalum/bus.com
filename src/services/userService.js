const User = require('../models/user');


// creates

async function createUser(name, phone_number, password, role) {
    await User.create(
        {
            name: name,
            phone_number: phone_number,
            password: password,
            role: role
        }
    );
}

// reads

async function getUsers() {
    return await User.findAll();
}

async function getUserById(Id) {
    return await User.findByPk(Id);
}

async function getUser(phone_number) {
    return await User.findOne({ where: { phone_number: phone_number } });
}

async function getPswd(id) {
    return await User.findOne({
        attributes: ['password'],
        where: {
            id: id
        }
    });
}

// updates

// pswd
async function updatepswd(new_password, User_Id) {
    return await User.update(
        {
            password: new_password
        },
        {
            where: {
                id: User_Id,
            },
        }
    )
}


// phone_number
async function updatePhone(id, phone_number) {
    await User.update({ phone_number: phone_number }, {
        where: {
            id: id
        }
    });
}



// deletes

async function deleteUserById(Id) {
    return await User.destroy({
        where: {
            id: Id,
        },
    });
}

module.exports = {
    createUser,
    getUsers,
    getUser,
    getUserById,
    getPswd,
    updatepswd,
    deleteUserById,
    updatePhone
};
