const express = require('express');
const router = express.Router();
const {validateUserInput}=require("../utils/validation");
const { auth, authRefreshToken } = require('../middlewares/authenticationMiddleware');
const { bus_search } = require('../controllers/searchController');
const { customer_auth } = require('../middlewares/authorizationMiddleware');
const { registerUser, showUser, logout, login, password_update, delete_user } = require('../controllers/userController');


router.post('/login', login);
router.post('/token', authRefreshToken);
router.post('/search', customer_auth, auth, bus_search);
router.post('/', validateUserInput, registerUser);

router.get('/details', customer_auth, auth, showUser);
router.put('/password', customer_auth, auth, password_update);
router.delete('/logout', auth, logout);
router.delete('/', auth, delete_user);

module.exports = router;
