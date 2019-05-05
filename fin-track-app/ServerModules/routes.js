module.exports = function (app, connection) {

    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
    
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;
    
        return [year, month, day].join('-');
    }

    app.route('/api/authenticate')
        .post(function (req, res) {
            console.log(req.body);
            res.end();
        });

    app.route('/api/sign-up')
        .post(function (req, res) {
            console.log(req.body);
            console.log(formatDate(new Date()))
            const User = {
                EMAIL: req.body.email,
                PASSWORD: req.body.password,
                DATE_CREATED: formatDate(new Date())
              }
              connection.query('INSERT INTO Users SET ?', User, (error, results, fields) => {
                if(error.errno===1062) {
                    console.log('Sign-Up: User already exist.');
                    res.json( { message: 'Duplicated' } );
                } else if (error) {
                  console.error('An error occurred while executing the query');
                  throw error
                }
              })
        });
}