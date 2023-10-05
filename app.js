const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');

const app = express();

passport.use(
    new GoogleStrategy(
        {
            clientID: '746005843544-atk5tu7gc0svtpk01mmklttvnavcri75.apps.googleusercontent.com',
            clientSecret: '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',
            callbackURL: 'http://localhost:3000/auth/google/callback'
        },
        (accessToken, refreshToken, profile, done) => {
            return done(null, profile);
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// Middleware
app.use(
    session({
        secret: 'your-secret-key',
        resave: true,
        saveUninitialized: true
    })
);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get('/', (req, res) => {
    
    const loginPageHTML = `<div style="margin-left:100px;">
        <img src="https://storage.googleapis.com/gd-prod/images/a910d418-7123-4bc4-aa3b-ef7e25e74ae6.faa49ab5e1fff880.webp" alt="Google Logo" style="width:300px;height:300px;margin-left:20px;" class="google-logo">
        <h1>Login with Google</h1>
        <p>Sign in with your Google account to continue.</p>
        <button style="height:40px;background-color:rgba(0,0,0,0.1);border-radius:6px;border:none;text-align:center;"> <a href="http://localhost:3000/auth/google" class="btn btn-lg btn-google">Sign in with Google</a> </button></div>
    `;
    res.send(loginPageHTML);
});


app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get(
    '/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/profile');
    }
);

app.get('/profile', (req, res) => {
    const user = req.user;
    const displayName = user.displayName;
    const email = user.emails[0].value; 
    const profileImageURL = user.photos[0].value; 

    const cardHTML = `
        <div class="card" style="width: 18rem;">
            <img src="${profileImageURL}" class="card-img-top" alt="${displayName}'s Profile Picture">
            <div class="card-body">
                <h5 class="card-title">${displayName}</h5>
                <p class="card-text">Email: ${email}</p>
            </div>
        </div>
    `;

    res.send(`
        <div class="container">
            <h1>Hello, ${displayName}!</h1>
            ${cardHTML}
        </div>
    `);
});


// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
