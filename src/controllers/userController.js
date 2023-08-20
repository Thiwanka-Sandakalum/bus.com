const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const token = require('../services/RefreshToken');
const userService = require('../services/userService');
require('dotenv').config();

// User login
const login = async (req, res) => {
    try {
        const { password, phone_number } = req.body;
        const user = await userService.getUser(phone_number);

        if (!user) {
            return res.status(404).json({ message: 'This number is not registerd' });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (isPasswordMatch) {
            const data = { id: user.id, role: user.role, phone_number: user.phone_number };
            const access_token = jwt.sign(data, process.env.TOKEN_KEY, { expiresIn: process.env.duration_access_token });
            const refresh_token = jwt.sign(data, process.env.RE_TOKEN_KEY, { expiresIn: process.env.duration_refresh_token });

            try {
                await token.createToken(user.id, refresh_token);
                console.log({ access_token, refresh_token });
                res.send({ access_token, refresh_token });

            } catch (error) {
                res.status(500).json({ error: error.errors[0].message });
            }
        } else {
            res.status(401).json({ message: 'Invalid password' });
        }
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            console.error('Duplicate entry error:', error);
            res.status(500).json({ error: 'Duplicate entry error' });
        } else {
            console.error('Error during login:', error);
            res.status(500).json({ error: 'Error during login' });
        }
    }
};

// User logout 
const logout = async (req, res) => {
    try {
        const { id } = req.data;
        console.log(id);

        const dbToken = await token.getToken(id);

        if (!dbToken) {
            return res.status(401).json({ message: 'refresh key not found' });
        }

        const removed = await token.removeToken(id); // Remove refresh token from the database

        if (removed === undefined) {
            return res.status(200).json({ message: 'Successfully logged out' });
        } else {
            return res.status(500).json({ message: 'Failed to log out' });
        }
    } catch (error) {
        return res.status(500).json({ error });
    }
};


// User registration
const registerUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { phone_number, name, password, role } = req.body;
        const existingUser = await userService.getUser(phone_number);

        if (existingUser) {
            return res.status(409).json({ message: 'This phone number is already registered' });
        }

        await userService.createUser(name, phone_number, password, role)
            .then(() => {
                res.status(201).json({ message: 'Successfully registered' });
            })
            .catch(err => {
                res.status(500).json({ message: err.message });
            });

    } catch (error) {
        console.error('Error during user registration:', error);
        res.status(500).json({ massage: error });
    }
};

// Delete user
const delete_user = async (req, res) => {
    try {
        const { id } = req.data;
        const dbToken = await token.getToken(id);
        if (!dbToken) {
            return res.status(401).json({ message: 'refresh key not found' });
        }
        const removed = await token.removeToken(id);
        if (removed === undefined) {
            await userService.deleteUserById(req.data.id)
            return res.status(200).json({ message: "User removed successfully" });
        } else {
            return res.status(500).json({ message: 'Failed to log out' });
        }
    } catch (error) {
        console.error('Error during user removing:', error);
        res.status(500).json({ massage: error });
    }
};

// Get all users
const showUsers = async (req, res) => {
    try {
        const users = await userService.getUsers();
        res.status(200).json({ users });
    } catch (error) {
        console.error('Error while fetching users:', error);
        res.status(500).json({ massage: err.message });
    }
};

// Get a single user
const showUser = async (req, res) => {
    try {
        const userId = req.data.id;
        const user = await userService.getUserById(userId);
        const user_data = { phone_number: user.phone_number, name: user.name }

        if (user) {
            res.status(200).json({ user_data });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error while fetching user:', error);
        res.status(500).json({ massage: error });
    }
};

// update password
const password_update = async (req, res) => {
    try {
        const { new_pswd, old_pswd } = req.body;
        const { id } = req.data;

        const user = await userService.getPswd(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isPasswordMatch = await bcrypt.compare(old_pswd, user.password);
        if (isPasswordMatch) {
            await userService.updatepswd(new_pswd, id);
            res.json({ message: 'Password successfully updated' });
        } else {
            console.log(isPasswordMatch)
            res.json({ message: 'Wrong password try agin' });
        }
    } catch (error) {
        console.error('Error while updating password:', error);
        res.status(500).json({ error: 'Error while updating password' });
    }
};


module.exports = {
    login,
    registerUser,
    showUsers,
    showUser,
    logout,
    password_update,
    delete_user
};
