// profile.js
const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

const router = express.Router();

router.get('/', async (req, res) => {
    if (!req.session.userId) {
        req.flash('error_msg', 'You need to log in to access this page.');
        return res.redirect('/auth/login');
    }

    const user = await User.findByPk(req.session.userId);
    res.render('profile', { user });
});

//upon submission 
router.post('/update', async (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/auth/login');
    }

    const { name, address, phone, age, email, password } = req.body;
    const user = await User.findByPk(req.session.userId);

    if (password) {
        user.password = await bcrypt.hash(password, 12);
    }

    user.name = name;
    user.address = address;
    user.phone = phone;
    user.age = age;
    user.email = email;

    await user.save();
    req.flash('success_msg', 'Profile updated successfully');
    res.redirect('/profile');
});

module.exports = router;
