const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const sequelize = require('./config/database');
const flash = require('connect-flash');
const User = require('./models/user');
const cookieParser=require('cookie-parser')
const postRoutes = require('./routes/postRoutes'); 
const commentRoutes = require('./routes/commentRoutes'); 
const dashboardRoutes = require('./routes/dashRoutes');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
}));
app.use(cookieParser())
app.use(
    session({
        resave : false,
        saveUninitialized : false,
        secret : 'your-secret-key',
        cookie : {
            secure : false,
        }
    })
)

app.use(flash());

// Middleware to make flash messages available in all templates
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});

// Routes Ensure this is after session and flash middleware
app.use('/', postRoutes); 
app.use('/', commentRoutes); 
app.use('/', dashboardRoutes);
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');

app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

// Root route
app.get('/', (req, res) => {
    res.redirect('/auth/login');
});

sequelize.sync()
    .then(result => {
        app.listen(3000, () => console.log('Server started on http://localhost:3000'));
    })
    .catch(err => console.log(err));
