

module.exports.getUser = (req, res) => {
    res.render('users/register')
}

module.exports.login = (req, res) => {
    res.render('users/login');
}

module.exports.logOut = (req, res) => {
    req.logOut(err => {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Logged out succesfully!');
        res.redirect('/campgrounds');
    });

}

module.exports.loginVal = (req, res) => {
    req.flash('success', 'Login Succesfull');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
}