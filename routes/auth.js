const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const router = express.Router();

router.get('/register', (req, res) => {
    res.render('register');
});

// Handle Registration
router.post('/register', async (req, res) => {
    const { name, email, password, address, phone, age } = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);

    try {
        await User.create({
            name,
            email,
            password: hashedPassword,
            address,
            phone,
            age,
        });
        res.redirect('/auth/login');
    } catch (err) {
        res.status(500).send('Error registering new user');
    }
});



router.get('/login', (req, res) => {
    res.render('login');
});

// Handle Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
        return res.status(401).send('Invalid email, please try again');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
        return res.status(401).send('Invalid password, please try again');
    }

    req.session.userId = user.id;
    // res.redirect('/profile');
    // res.redirect('/posts');
    res.redirect('/dashboard');

}); 

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/profile');
        }
        res.redirect('/auth/login');
    });
});

//password forgot and reset 
router.get('/forgot-password', (req, res) => {
    res.render('forgot-password');
});

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            req.flash('error', 'No account with that email found.');
            return res.redirect('/auth/forgot-password');
        }
        else{
            alert("email sent successfully !"); //check
        }
        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'temp@gmail.com',
                pass: 'epfp fiar bwim tqid'
            }
        });

        const mailOptions = {
            to: user.email,
            from: 'passwordreset@demo.com',
            subject: 'Password Reset',
            text: `This is a message to reset your password for the (Auth App).\n\n
            Please click on the following link, or paste this into your browser to complete the process:\n\n
            http://${req.headers.host}/auth/reset/${token}\n\n
            Ignore this email and your password will remain unchanged.\n`
        };

        await transporter.sendMail(mailOptions);

        req.flash('info', `An e-mail has been sent to ${user.email} with further instructions.`);
        setTimeout(() => {
            res.redirect('/auth/login');
        }, 3000);
    } catch (error) {
        console.error(error);
        res.redirect('/auth/forgot-password');
    }
});


//reset
router.get('/reset/:token', async (req, res) => {
    try {
        const user = await User.findOne({
            where: {
                resetPasswordToken: req.params.token,
                resetPasswordExpires: { [Op.gt]: Date.now() }
            }
        });

        if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('/auth/forgot-password');
        }

        res.render('reset-password', { token: req.params.token });
    } catch (error) {
        console.error(error);
        res.redirect('/auth/login');
    }
});


//pass update in db
const { Op } = require('sequelize');

router.post('/reset/:token', async (req, res) => {
    const { password } = req.body;

    try {
        const user = await User.findOne({
            where: {
                resetPasswordToken: req.params.token,
                resetPasswordExpires: { [Op.gt]: Date.now() }
            }
        });

        if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('/auth/forgot-password');
        }

        user.password = await bcrypt.hash(password, 12);
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        req.flash('success', 'Password has been updated.');
        res.redirect('/auth/login');
    } catch (error) {
        console.error(error);
        res.redirect('/auth/forgot-password');
    }
});

module.exports = router;
