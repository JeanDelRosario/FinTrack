module.exports = function(app, connection) {

    const jwt = require('jsonwebtoken');
    const bcrypt = require('bcrypt');
    const path = require('path');
    const cookieParser = require('cookie-parser');

    const withAuth = require('./middleware');

    app.use(cookieParser());

    const isCorrectPassword = function(password, realPassword, callback) {
        bcrypt.compare(password, realPassword, function(err, same) {
            if (err) {
                callback(err);
            } else {
                callback(err, same);
            }
        });
    }

    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    app.get('/checkToken', withAuth, function(req, res) {
        res.sendStatus(200);
    });

    app.route('/api/signIn')
        .post(function(req, res) {
            const { email, password } = req.body;

            connection.query('SELECT EMAIL, PASSWORD FROM Users WHERE EMAIL = ?', [email],
                (error, results) => {
                    if (error) {
                        console.error('An error occurred while executing the query');
                        res.status(500)
                            .json({
                                error: 'Internal error please try again'
                            });
                    } else if (results[0] === undefined) {
                        res.status(401)
                            .json({
                                error: 'Incorrect email or password'
                            });
                    } else {
                        console.log(results)
                        isCorrectPassword(password, results[0].PASSWORD, function(err, same) {
                            if (err) {
                                res.status(500)
                                    .json({
                                        error: 'Internal error please try again'
                                    });
                            } else if (!same) {
                                res.status(401)
                                    .json({
                                        error: 'Incorrect email or password'
                                    });
                            } else {
                                // Issue token

                                const payload = { email };
                                const token = jwt.sign(payload, process.env.SECRET);
                                res.cookie('token', token, { httpOnly: true, secure: false }).sendStatus(200);
                            }
                        });
                    }
                });
        });

    app.route('/api/sign-up')
        .post(function(req, res) {

            bcrypt.hash(req.body.password, 12, function(err, hashedPassword) {
                if (err) console.log(err);

                const User = {
                    EMAIL: req.body.email,
                    PASSWORD: hashedPassword,
                    DATE_CREATED: formatDate(new Date())
                }

                connection.query('INSERT INTO Users SET ?', User, (error, results, fields) => {
                    if (error) {
                        if (error.errno === 1062) {
                            console.log('Sign-Up: Email already exist.');
                            res.json({ message: 'Duplicated' });
                        } else {
                            console.error('An error occurred while executing the query');
                            console.error(error)
                            res.json({ message: 'Error' })
                        }
                    } else {
                        console.log('User logged succesfully.')
                        res.json({ message: 'Success' })
                    }

                });
            });
        });

    app.route('/api/finantial-info')
        .post(withAuth, function(req, res) {
            const email = req.email;
            if (!req.body.description) req.body.description = 'NAN';
            const transaction = [email, ...Object.values(req.body)];
            console.log(req.body)
            connection.query("INSERT INTO Users_Transactions (EMAIL, DATE, CATEGORY, AMOUNT, DESCRIPTION) VALUES ('" + transaction.join("','") + "')", (error, results) => {
                if (error) console.error(error);
            })

            res.end()
        })
        .get(withAuth, function(req, res) {
            const email = req.email;

            connection.query("SELECT * FROM Users_Transactions WHERE EMAIL = ? AND EXTRACT(YEAR FROM DATE) = EXTRACT(YEAR FROM SYSDATE() ) ORDER BY DATE DESC",
                email,
                (error, results) => {
                    if (error) console.error(error);
                    res.json({ "info": results.slice(0, 20), "email": email });
                });
        })
        .delete(withAuth, function(req, res) {

            connection.query("DELETE FROM Users_Transactions WHERE PRIMARY_INT = ?",
                req.body.PRIMARY_INT,
                (error, results) => {
                    if (error) console.error(error);

                    console.log(results);
                    res.end();
                }
            )
        })

    app.get('/api/logout', function(req, res) {
        res.clearCookie('token').sendStatus(200);
    })

    app.get('*', (req, res, next) => {
        res.sendFile(path.resolve('build/index.html'));
    });

}