const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
};

module.exports.register = async (req, res) => {
    try {
        const {email, username, password} = req.body;
        const user = new User({username, email});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to the Yelp Camp!');
            res.redirect('/campgrounds');
        })
    }
    catch(e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
};

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
};

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back!');
    // If there is a prev page
    const redirectURL = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // Redirect to a POST req
    // https://www.udemy.com/course/the-web-developer-bootcamp/learn/lecture/22346408#questions/13869042
    // https://stackoverflow.com/questions/38810114/node-js-with-express-how-to-redirect-a-post-request
    // else {
    //     res.redirect(307, redirectURL);
    // }
    res.redirect(redirectURL);
};

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'Goodbye!');
    res.redirect('/campgrounds');
};