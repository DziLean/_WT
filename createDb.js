//module.exports = function() {
    var mongoose = require('mongoose');
    var User = require('./models/user.js').User;
    onOpen = function(){
        mongoose.connect('mongodb://localhost/test', function (error) {
            console.log('opened');
            state();
        });
    }

    function createUser(userObj) {
        (function () {
            var newUser = new User({username: userObj.username, email: userObj.email, password: userObj.password,sid:userObj.sid,tempUrl:userObj.tempUrl});
            newUser.save.call(newUser,function (err) {
                if (err) console.log(err);
                console.log('saved' + newUser);
            });
        })();
        console.log('--saved--');
    }

    function close() {
        mongoose.disconnect(function () {
            console.log('disconected')
        });
    }

    function state() {
        console.log(mongoose.connection.readyState);
    }

module.exports = {
    state: state,
    close: close,
    createUser: createUser,
    onOpen: onOpen
}





