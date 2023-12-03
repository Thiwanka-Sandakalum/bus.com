const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const token = require('../services/RefreshToken');
const userService = require('../services/userService');
const { logger } = require('../logger/index');
require('dotenv').config();

// User login
const login = async (req, res) => {
    try {
        const { password, phone_number } = req.body;
        const user = await userService.getUser(phone_number);

        if (!user) {
            logger.warn(`Login attempt with non-registered phone number: ${phone_number}`);
            return res.status(404).json({ message: 'This number is not registered' });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (isPasswordMatch) {
            const data = { id: user.id, role: user.role, phone_number: user.phone_number };
            const access_token = jwt.sign(data, process.env.TOKEN_KEY, { expiresIn: process.env.duration_access_token });
            const refresh_token = jwt.sign(data, process.env.RE_TOKEN_KEY, { expiresIn: process.env.duration_refresh_token });

            try {
                await token.createToken(user.id, refresh_token);
                logger.info('User logged in successfully.');
                res.send({ access_token, refresh_token });

            } catch (error) {
                logger.error(`Error creating refresh token: ${error.errors[0].message}`);
                res.status(500).json({ error: error.errors[0].message });
            }
        } else {
            logger.warn(`Login attempt with invalid password for phone number: ${phone_number}`);
            res.status(401).json({ message: 'Invalid password' });
        }
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            logger.error('Duplicate entry error during login:', error);
            res.status(500).json({ error: 'Duplicate entry error' });
        } else {
            logger.error(`Error during login: ${error.message}`);
            console.error(error);
            res.status(500).json({ error: 'Error during login' });
        }
    }
};

// User logout
const logout = async (req, res) => {
    try {
        const { id } = req.data;
        logger.info(`User logged out with ID: ${id}`);

        const dbToken = await token.getToken(id);

        if (!dbToken) {
            return res.status(401).json({ message: 'Refresh key not found' });
        }

        const removed = await token.removeToken(id);

        if (removed === undefined) {
            return res.status(200).json({ message: 'Successfully logged out' });
        } else {
            logger.error('Failed to log out');
            return res.status(500).json({ message: 'Failed to log out' });
        }
    } catch (error) {
        logger.error(`Error during user logout: ${error.message}`);
        return res.status(500).json({ error: error.message });
    }
};

// User registration
const registerUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.warn('Validation error during user registration');
            return res.status(400).json({ errors: errors.array() });
        }

        const { phone_number, name, password, role } = req.body;
        const existingUser = await userService.getUser(phone_number);

        if (existingUser) {
            logger.warn(`Registration attempt with duplicate phone number: ${phone_number}`);
            return res.status(409).json({ message: 'This phone number is already registered' });
        }

        await userService.createUser(name, phone_number, password, role)
            .then(() => {
                logger.info('User registered successfully.');
                res.status(201).json({ message: 'Successfully registered' });
            })
            .catch(err => {
                logger.error(`Error during user registration: ${err.message}`);
                res.status(500).json({ message: err.message });
            });

    } catch (error) {
        logger.error(`Error during user registration: ${error.message}`);
        console.error('Error during user registration:', error);
        res.status(500).json({ massage: error.message });
    }
};

// Delete user
const delete_user = async (req, res) => {
    try {
        const { id } = req.data;
        const dbToken = await token.getToken(id);
        if (!dbToken) {
            logger.warn(`Logout attempt with missing refresh token for user ID: ${id}`);
            return res.status(401).json({ message: 'Refresh key not found' });
        }
        const removed = await token.removeToken(id);
        if (removed === undefined) {
            await userService.deleteUserById(req.data.id)
            logger.info(`User removed successfully with ID: ${id}`);
            return res.status(200).json({ message: 'User removed successfully' });
        } else {
            logger.error('Failed to log out');
            return res.status(500).json({ message: 'Failed to log out' });
        }
    } catch (error) {
        logger.error(`Error during user removal: ${error.message}`);
        console.error('Error during user removal:', error);
        res.status(500).json({ massage: error.message });
    }
};

// Get all users
const showUsers = async (req, res) => {
    try {
        const users = await userService.getUsers();
        logger.info('Fetched all users.');
        res.status(200).json({ users });
    } catch (error) {
        logger.error(`Error while fetching users: ${error.message}`);
        console.error('Error while fetching users:', error);
        res.status(500).json({ massage: error.message });
    }
};

// Get a single user
const showUser = async (req, res) => {
    try {
        const userId = req.data.id;
        const user = await userService.getUserById(userId);
        const user_data = { phone_number: user.phone_number, name: user.name }

        if (user) {
            logger.info(`Fetched user with ID: ${userId}`);
            res.status(200).json({ user_data });
        } else {
            logger.warn(`User not found with ID: ${userId}`);
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        logger.error(`Error while fetching user: ${error.message}`);
        console.error('Error while fetching user:', error);
        res.status(500).json({ massage: error.message });
    }
};

// Update password
const password_update = async (req, res) => {
    try {
        const { new_pswd, old_pswd } = req.body;
        const { id } = req.data;

        const user = await userService.getPswd(id);
        if (!user) {
            logger.warn(`Password update attempt for non-existing user with ID: ${id}`);
            return res.status(404).json({ message: 'User not found' });
        }

        const isPasswordMatch = await bcrypt.compare(old_pswd, user.password);
        if (isPasswordMatch) {
            await userService.updatepswd(new_pswd, id);
            logger.info(`Password successfully updated for user with ID: ${id}`);
            res.json({ message: 'Password successfully updated' });
        } else {
            logger.warn(`Password update attempt with wrong old password for user ID: ${id}`);
            console.log(isPasswordMatch);
            res.json({ message: 'Wrong password, try again' });
        }
    } catch (error) {
        logger.error(`Error while updating password: ${error.message}`);
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
