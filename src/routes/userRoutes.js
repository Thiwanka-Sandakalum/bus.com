const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { auth, authRefreshToken } = require('../middlewares/authenticationMiddleware');
const { bus_search } = require('../controllers/searchController');
const { customer_auth } = require('../middlewares/authorizationMiddleware');
const { registerUser, showUsers, showUser, logout, login, update_password, update_phone, password_update, delete_user } = require('../controllers/userController');

// Validation rules for registerUser and updateUser
const userValidationRules = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('password').trim().notEmpty().withMessage('password is required'),
    body('role')
        .trim()
        .notEmpty().withMessage('Role is required')
        .custom((value) => {
            if (value !== 'driver' && value !== 'customer') {
                throw new Error('Role must be either "driver" or "customer"');
            }
            return true;
        }),

    body('phone_number')
        .trim()
        .notEmpty().withMessage('Phone number is required')
        .isLength({ min: 10, max: 10 }).withMessage('Phone number must be 10 characters')
        .isNumeric().withMessage('Invalid phone number')

];

router.post('/login', login);
router.post('/token', authRefreshToken);
router.post('/search', customer_auth, auth, bus_search);
router.post('/', userValidationRules, registerUser);


router.get('/details', customer_auth, auth, showUser);
// router.get('/pswd',password_update);
router.put('/password', customer_auth, auth, password_update);

// router.put('/phone',customer_auth,auth,update_phone)


router.delete('/logout', auth, logout);

router.delete('/',auth,delete_user);

module.exports = router;
