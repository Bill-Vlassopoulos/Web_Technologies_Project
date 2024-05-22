import bcrypt from 'bcrypt'

import * as userModel from '../model/sqlite-async/admin-sqlite-async.mjs';

const cssFilePath = '/admin-style.css';

export let showLogInForm = function (req, res) {
    res.render('admin-login', {layout:'admin', css:cssFilePath, model: process.env.MODEL});
}

export let doLogin = async function (req, res) {
    try {
        const user = await userModel.getUserByUsername(req.body.username);

        if (!user) {
            res.render('admin-login', { layout: 'admin', css:cssFilePath, message: 'Δεν βρέθηκε αυτός ο χρήστης' });
        } else {
            const plainTextPassword = req.body.password;
            const hashedPassword = user.password.toString();

            const match = await bcrypt.compare(plainTextPassword, hashedPassword);
            if (match) {
                req.session.loggedUserId = user.id;
                req.session.save(err => {
                    if (err) {
                        //console.error('Session save error:', err);
                        res.status(500).render('admin-login', { layout: 'admin', css:cssFilePath,message: 'Σφάλμα εσωτερικού διακομιστή' });
                    } else {
                        //console.log('Session loggedUserId set to:', req.session.loggedUserId);
                        const redirectTo = req.session.originalUrl || '/admin/edit';
                        res.redirect(redirectTo);
                    }
                });
            } else {
                res.render('admin-login', { layout: 'admin',css:cssFilePath, css:cssFilePath, message: 'Ο κωδικός πρόσβασης είναι λάθος' });
            }
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).render('admin-login', { layout: 'admin', css:cssFilePath, message: 'Σφάλμα εσωτερικού διακομιστή' });
    }
};

export let checkAuthenticated = function (req, res, next) {
    if (req.session.loggedUserId) {
        next();
    } else {
        if (req.originalUrl === '/admin/login') {
            next();
        } else {
            res.render('admin-login',{ layout: 'admin', css:cssFilePath, message: 'Συνδεθείτε για να έχετε πρόσβαση' });
        }
    }
};

export let doLogout = (req, res) => {
    //Σημειώνουμε πως ο χρήστης δεν είναι πια συνδεδεμένος
    req.session.destroy();
    res.redirect('/admin/login');
}