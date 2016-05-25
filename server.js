///Summary
///Server creation, signing in, signing out
///Summary
//preparations
//____________________________________________________________________________________________________________
var http = require('http');
var fs = require('fs');
var express = require('express');
//var route = require('./route.js');
var User = require('./models/user.js').User;
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var dataBase = require('./createDb.js');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var smtpTransport = require("nodemailer-smtp-transport")
///
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');
var async = require('async');
var session  = require('express-session');


///

mongoose.connect('mongodb://localhost/test', function (error) {
    console.log('opened');
    dataBase.state();
});
var app = express();

app.set('port', 3200);
http.createServer(app).listen(app.get('port'),function(){
   console.log('Express');
});
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());
var generate_key = function() {
    var sha = crypto.createHash('sha256');
    sha.update(Math.random().toString());
    return sha.digest('hex');
};
var encryptPassword = function(user,password){
    var encr = crypto.createHmac('sha1',user.salt).update(password).digest('hex');
    return encr;
};
var checkPassword = function(dataBaseUser,password){
    var enc = encryptPassword(dataBaseUser,password);
    return  enc=== dataBaseUser.hashedPassword;
};
//___________________________________________________________________________________________________________________


//express

function usersLog(req,res) {
    //if admin
    var cookie = validateCookieForAnyFile(req);
    if(cookie == undefined){
        _403NoCoookie(res);
        return;
    }

    User.findOne({sid: cookie}, function (err, foundUser) {

        if (!foundUser) { //if no such a user
            res.writeHead(404, {"Content-Type": "text/html"});
            res.end('No user');
            return;
        }// if admin
        else {
            //if found a user
            if (foundUser.sid != "3550a423481d3ddae4aa5ceaac4d0161a5f7783f21b567d1af6f80edf993f63d") {
                res.writeHead(403, {"Content-Type": "text/html"});
                res.end("Forbidden");
                return;
            }
            else {
                User.find(function(err,us){
                    if(!us) {
                        console.log(err);
                        res.writeHead(500, {"Content-Type":"text/html"});
                        res.end("Interanl server error");
                        return;
                    }
                    else {
                        res.json(us);
                        return;
                    }
                });
                //res.writeHead(408, {"Content-Type":"text/html"});
                //res.end("Request timeout");
            }
        }
    });

}

function users(req,res) {
    //if admin
    var cookie = validateCookieForAnyFile(req);
    if(cookie == undefined){
        _403NoCoookie(res);
        return;
    }
    User.findOne({sid:cookie}, function (err, foundUser) {

        if (!foundUser) { //if no such a user
            res.writeHead(404, {"Content-Type": "text/html"});
            res.end('No user');
            return;
        }// if admin
        else {
            //if found a user
            if (foundUser.sid != "3550a423481d3ddae4aa5ceaac4d0161a5f7783f21b567d1af6f80edf993f63d") {//admin's

            }
            else {
                User.find(function(err,us){
                    if(!us) {
                        console.log(err);
                        res.writeHead(500, {"Content-Type":"text/html"});
                        res.end("Interanl server error");
                        return;
                    }
                    else {
                        sendFileHtml("./grid.html",res);
                        //res.json(us);
                        return;
                    }
                });
                //res.writeHead(408, {"Content-Type":"text/html"});
                //res.end("Request timeout");
            }
        }
    });

}
// there are no admin's urls ( almost)) lal) but the there are admin's htmls
function anyUrl(url,req,res,differAdminAndUser,ignoreUser) {
    //if admin
    if(differAdminAndUser==undefined)//should we separate admin and user?
        differAdminAndUser = false;
    if(ignoreUser==undefined)//should we ignore user?
        ignoreUser = false;
    var cookie = validateCookieForAnyFile(req);//cookie if presented
    if(cookie == undefined || cookie == false  ) {
        _403NoCoookie(res);
        return;

    }//if no cookie next code is useless
    User.findOne({sid: cookie}, function (err, foundUser) {

        if (!foundUser) { //if no such a user
            _404NoUserFound(res);
            console.log("anyUrl - no user found");
        }// if admin
        else {
            //if found a user
            if(!differAdminAndUser){//user=admin
               // if(checkIfFileStoreIsCreated(cookie,""+url+".html")){ //url is with /
               //     var file =  "./fileStore/"+cookie+url+".html";
               //     sendFileHtml(file,res);
               // }
               // else{
                    var file =  "."+url+".html";
                    sendFileHtml(file,res);
                //}
            }
            else{//admin!!
                if (foundUser.sid != "3550a423481d3ddae4aa5ceaac4d0161a5f7783f21b567d1af6f80edf993f63d") {//not admin's
                 //   if(checkIfFileStoreIsCreated(cookie,""+url+".html")){ //url is with /
                 //       var file =  "./fileStore/"+cookie+url+".html";
                 //       sendFileHtml(file,res);
                 //   }
                 //   else{
                    if(ignoreUser){//reject
                        _404NotFound(res);
                    }
                    else{
                        var file =  "."+url+".html";
                        sendFileHtml(file,res);
                    }

                 //   }
                }
                else {//admin
                   // if(checkIfFileStoreIsCreated(cookie,""+url+".html")){ //url is with /
                   //     var file =  "./fileStore/"+cookie+url+".html";
                   //     sendFileHtml(file,res);
                   // }
                    // else{
                        var file =  "."+url+"Admin.html";
                        sendFileHtml(file,res);
                    //}
                }
            }


        }
    });

}// for admin  - his content, for user - user's content
function onlyAdminHtml(url,req,res) { // url = blabla.html
    //if admin

    var cookie = validateCookieForAnyFile(req);//cookie if presented
    if(cookie == undefined){
        _403NoCoookie(res);
        return;
    }//if no cookie next code is useless


    User.findOne({sid:cookie}, function (err, foundUser) {

        if (!foundUser) { //if no such a user
            _404NoUserFound(res);
            console.log("validateAnyUrlExceptIndex - no user found");
        }// if admin
        else {
            //if found a user

                if (foundUser.sid != "3550a423481d3ddae4aa5ceaac4d0161a5f7783f21b567d1af6f80edf993f63d") {//not admin's
                    //   if(checkIfFileStoreIsCreated(cookie,""+url+".html")){ //url is with /
                    //       var file =  "./fileStore/"+cookie+url+".html";
                    //       sendFileHtml(file,res);
                    //   }
                    //   else{
                    _404NotFound(res);
                    return;
                    //   }
                }
                else {//admin
                    // if(checkIfFileStoreIsCreated(cookie,""+url+".html")){ //url is with /
                    //     var file =  "./fileStore/"+cookie+url+".html";
                    //     sendFileHtml(file,res);
                    // }
                    // else{
                    var file =  "."+url+"";//./blabla
                    sendFileHtml(file,res);
                    //}
                }
        }
    });

}// for admin  - his content, for user - no content

app.use(function(req,res) {
    switch (req.method) {

        case "GET":

            var _ = req.url.indexOf('/password/');//if url begins with /password/
            if(_==0){
                var tempUrl = req.url.substr(10,req.url.length - 10);

                if(tempUrl == undefined || tempUrl == ""){
                    _400BadRequest(res);
                    return;
                }
                console.log("tempUrl: "+tempUrl);
                passwordCookieRequest(tempUrl,res);

                break;
            }
            processGet(req,res);
            break;
        case "POST":
            processPost(req,res);
            break;
        default:
            console.log("GET/POST: Unknown method");
            res.end("GET/POST: Unknown method");
            break;

    }});

function processGet(req,res){
    console.log("GET");
    switch (req.url) {


        case '/code':
            anyUrl("/code",req,res,true,false);//differ the admin and a user,no ignore
            break;
        case '/codeAdmin.html':
            onlyAdminHtml("/codeAdmin.html",req,res);//only admin
            break;
        case '/usersAdmin.html':
            onlyAdminHtml("/usersAdmin.html",req,res);//only admin
            break;
        case '/users':
            anyUrl('/users',req,res,true,true);//only admin,ignore user
            break;
        case '/usersLog'://plain text view
            usersLog(req,res);
            break;
        case '/load':
            var cookie = validateCookieForAnyFile(req);
            if(cookie==undefined) {
                _403NoCoookie(res);
                return;
            }
            else{
                var dir = createFileStore(cookie);
                sendFilePlainText(dir+'/content.html',res);
            }
            break;
        case '/password.html':
            _403Forbidden(res);
            return;
            break;



        default:
            var url = req.url;
            console.log("url: "+url);
            var urlSearch = url.search(/(\.js|\.css|\.jpg|\.gif|\.html|\.ico|\.png)\b/i);
            var resourse;
            if (urlSearch > -1) {//if we have found the resourse
                resourse = url.substr( urlSearch + 1, url.length - urlSearch);

                switch('./'+resourse){

                    case './js':
                        sendFileJs('.'+url,res);
                        break;//|\.css|\.jpg|\.gif|\.html|\.ico)
                    case './css':
                        sendFileCss('.'+url,res);
                        break;
                    case './jpg':
                        sendFileJpg('.'+url,res);
                        break;
                    case './gif':
                        sendFileGif('.'+url,res);
                        break;
                    case './html':
                        sendFileHtml('.'+url,res);
                        break;
                    case './ico':
                        sendFileIco('.'+url,res);
                        break;
                    case './png':
                        sendFilePng('.'+url,res);
                        break;
                    default:
                        res.statusCode = 404;
                        res.end("Not Found");
                        break;
                }

            }
            else{
                res.statusCode = 404;
                res.end("Not Found");
                return;
            }
    }
}
function processPost(req,res){
    console.log("POST");
    var url = req.url;
    switch(url) {
        case "/resetPassword":
           resetPassword(req,res);
            break;

        case '/forgot':
                reset(req,res);
            break;
        case '/requestData':
            var cookie = validateCookieForAnyFile(req);
            if(cookie == undefined){
                _403NoCoookie(res);
                return;
            }

            var reqBody="";

            req.on('data', function (data) {
                if(data!=undefined)
                    reqBody += data;
            });
            req.on('end', function (data) {
                if(data!=undefined)
                    reqBody += data;
                getData(cookie,reqBody,res);
            });

            break;

        case '/sign_up_post':
            var cookieValue;
            var reqBody = '';
            var newUser;
            req.on('data', function (data) {
                reqBody += data;
            });
            req.on('end', function (data) {
                newUser = JSON.parse(reqBody);

                console.log('The new user to be created - ', newUser.userLogin, newUser.userPassword);


                User.findOne({username: newUser.userLogin}, function (err, foundUser) {
                    console.log('User from the database - ', foundUser);
                    if (foundUser != null) {//username is ok
                        res.writeHead(201, {"Content-Type": "plain/text"});
                        console.log('Such a login has been already used');
                        res.end('Such a login has been already used');
                        return;
                    }
                    else {

                        console.log('New user will be registered ');

                        var sid = generate_key();
                        var tempUrl = generate_key();
                        dataBase.createUser({
                            username: newUser.userLogin,
                            email: newUser.email,
                            password: newUser.userPassword,
                            sid: sid,
                            tempUrl:tempUrl+""
                        });
                        res.cookie('sid', sid, {
                            path: "/",
                            httpOnly: true
                        });
                        res.writeHead(200, {"Content-Type": "plain/text"});
                        res.end();
                        return;
                    }
                });
            });
            break;
        case '/login_post':
            var cookieValue;
            var reqBody = '';
            var newUser;
            req.on('data', function (data) {
                reqBody += data;
            });
            req.on('end', function (data) {
                newUser = JSON.parse(reqBody);

                console.log('The user wats to be logged in - ', newUser.userLogin, newUser.userPassword);

                User.findOne({username: newUser.userLogin}, function (err, foundUser) {

                    console.log('User from the database - ', foundUser);

                    if (!foundUser) { //if no such a user
                        res.writeHead(201, {"Content-Type": "plain/text"});
                        res.end('Such a login is absent');
                        return;
                    }
                    else {//username is ok
                        console.log('Password checking - ',  foundUser, newUser.userPassword);
                        var isValidPassword = checkPassword(foundUser, newUser.userPassword);

                        console.log("Valid? - "+ isValidPassword);

                        if (!isValidPassword) {//wrong password

                            console.log('Wrong password');

                            res.writeHead(201, {"Content-Type": "plain/text"});
                            res.end('Wrong password');
                            return;
                        }
                        else {
                            res.cookie('sid', foundUser.sid, {
                                path: "/",
                                httpOnly: true
                            });
                            res.writeHead(200, {"Content-Type": "plain/text"});
                            res.end();
                            return;
                        }
                    }
                });
            });
            break;
        case "/save":
            var cookie = validateCookieForAnyFile(req);
            if(cookie == undefined){
                _403NoCoookie(res);
                return;
            }



            var reqBody="";

            req.on('data', function (data) {
                if(data!=undefined)
                    reqBody += data;
            });
            req.on('end', function (data) {
                if(data!=undefined)
                    reqBody += data;
                saveInFile(cookie,'content.html',reqBody,res);
            });

            break;
        case '/saveChanges':
            var cookie = validateCookieForAnyFile(req);
            if(cookie == undefined){
                _403NoCoookie(res);
                return;
            }



            var reqBody="";

            req.on('data', function (data) {
                if(data!=undefined)
                    reqBody += data;
            });
            req.on('end', function (data) {
                if(data!=undefined)
                    reqBody += data;
                    var img = "img";
                    updateUserDb(cookie,img,reqBody,res);
            });
            break;
        default:
            console.log("Unknown post");
            res.end("Unknown post");
            break;
    }
}

function sendFileHtml(path,res){

    fs.stat(path, function(err,stats){

        if(err || !stats.isFile()) {
            res.statusCode = 404;
            res.end("Not found");
            return;
        }

        var file = new fs.ReadStream(path);//html page
        res.writeHead(200, {"Content-Type": "text/html"});
        file.on('readable', function () {
            var data = file.read();
            //console.log("sendFileHtml - data: ",path);
            if (data)
                res.write(data);
        });
        file.on('end', function () {
            //console.log("sendFileHtml - ",path, " end.");
            res.end();
            return;
        });

    });


};

function sendFileHtmlWithCookie(path,sid,res){

    fs.stat(path, function(err,stats){

        if(err || !stats.isFile()) {
            res.statusCode = 404;
            res.end("Not found");
            return;
        }

        var file = new fs.ReadStream(path);//html page
        /*res.cookie('sid', sid, {
            path: "/",
            httpOnly: true
        });*/
        res.writeHead(200, {"Content-Type": "text/html"});
        file.on('readable', function () {
            var data = file.read();
            if (data)
                res.write(data);
        });
        file.on('end', function () {
            console.log("sendFileHtml - ",path, " end.");
            res.end();
            return;
        });

    });


};

function sendFileJs(path,res){


    fs.stat(path, function(err,stats) {

        if (err || !stats.isFile()) {
            res.statusCode = 404;
            res.end("Not found");
            return;
        }

        var file = new fs.ReadStream(path);
        res.writeHead(200, {"Content-Type": "text/js"});
        file.on('readable', function () {
            var data = file.read();
           // console.log("sendFileJs - data: ",path);
            if (data)
                res.write(data);
        });
        file.on('end', function () {
            //console.log("sendFileJs - ",path, " end.");
            res.end();
            return;
        });

    });


};

function sendFilePlainText(path,res){

    fs.stat(path, function(err,stats) {

        if (err || !stats.isFile()) {
            res.statusCode = 404;
            res.end("Not found");
            return;
        }

        var file = new fs.ReadStream(path);
        res.writeHead(200, {"Content-Type": "text/plain"});
        file.on('readable', function () {
            var data = file.read();
            //console.log("sendFilePlainText - data: ",path);
            if (data)
                res.write(data);
        });
        file.on('end', function () {
            //console.log("sendFilePlainText - ",path," end.");
            res.end();
            return;
        });

    });


};

function sendFileCss(path,res){

    fs.stat(path, function(err,stats) {

        if (err || !stats.isFile()) {
            res.statusCode = 404;
            res.end("Not found");
            return;
        }


        var file = new fs.ReadStream(path);
        res.writeHead(200, {"Content-Type": "text/css"});
        file.on('readable', function () {
            var data = file.read();
            //console.log("sendFileCss - data: ",path);
            if (data)
                res.write(data);
        });
        file.on('end', function () {
            //console.log("sendFileCss - ",path," end.");
            res.end();
            return;
        });

    });

};
function sendFileJpg(path,res){

    fs.stat(path, function(err,stats) {

        if (err || !stats.isFile()) {
            res.statusCode = 404;
            res.end("Not found");
            return;
        }

        var file = new fs.ReadStream(path);
        res.writeHead(200, {"Content-Type": "image/jpeg"});
        file.on('readable', function () {
            var data = file.read();
            //console.log("sendFileJpg - data: ",path);
            if (data)
                res.write(data);
        });
        file.on('end', function () {
            //console.log("sendFileJpg - ",path," end.");
            res.end();
            return;
        });

    });


};
function sendFileGif(path,res){

    fs.stat(path, function(err,stats) {

        if (err || !stats.isFile()) {
            res.statusCode = 404;
            res.end("Not found");
            return;
        }

        var file = new fs.ReadStream(path);
        res.writeHead(200, {"Content-Type": "image/gif"});
        file.on('readable', function () {
            var data = file.read();
            //console.log("sendFileGif - data: ",path);
            if (data)
                res.write(data);
        });
        file.on('end', function () {
            //console.log("sendFileGif - ",path," end.");
            res.end();
            return;
        });

    });




};

function sendFilePng(path,res){

    fs.stat(path, function(err,stats) {

        if (err || !stats.isFile()) {
            res.statusCode = 404;
            res.end("Not found");
            return;
        }

        var file = new fs.ReadStream(path);
        res.writeHead(200, {"Content-Type": "image/png"});
        file.on('readable', function () {
            var data = file.read();
            //console.log("sendFilePng - data: ",path);
            if (data)
                res.write(data);
        });
        file.on('end', function () {
            //console.log("sendFilePng - ",path," end.");
            res.end();
            return;
        });

    });




};


function sendFileIco(path,res){

    res.statusCode = 200;
    res.end();
    return;

};

function codeHtml(res,req){
    var cookie = req.headers.cookie;
    //console.log('Cookie - ', cookie);
    if (!cookie) {
        codeHtmlNoCookie(res);
    }
    else {
        codeHtmlYesCookie(res,cookie);
    }
}
function sendHtmlAboutNoCookie(res){
    res.writeHead(403, {"Content-Type": 'text/plain'});
    res.end("No cookie");
    return;
}
function codeHtmlYesCookie(res,cookie){
    cookie = cookie.split('=')[1];
    User.findOne({sid: cookie}, function (err, user) {
        if (user == null) {//user null
            //console.log('There is no user wth such a sid');
            res.writeHead(201, {"Content-Type": 'text/plain'});
            res.end("Invalid sid");
            return;
        }
        else {
            //console.log('User - ', user);
            sendFileHtml('code.html', res);
        }
    });
}
function indexHtml(res,req){
    sendFileHtml("./index.html",res);
}

function sendResourse(res,req,path){

}
function saveInFile(cookie,filename,content,res){
    var dir = createFileStore(cookie);
    var file = dir +"/"+filename;
    fs.writeFile(file,content, function(err) {
        if(err) throw err;
        console.log("The file was created!");
        res.writeHead(201, {"Content-Type": "plain/text"});
        res.end("Created");
    });
}
function createFileStore(cookie){
    var dir = './fileStore';
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    dir = './fileStore/'+cookie;
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    return dir;
}


function reset(req,res){

    var cookieValue;
    var reqBody = '';
    var newUser;
    req.on('data', function (data) {
        reqBody += data;
    });
    req.on('end', function (data) {
            newUser = JSON.parse(reqBody);


            User.findOne({ email: newUser.email }, function(err, user) {
                if (!user) {
                   console.log("reset: error with email")
                    _404NoUserFound(res);
                    return;
                }



                var smtp = nodemailer.createTransport(smtpTransport({
                    host : "smtp.yandex.ru",
                    secureConnection : false,
                    port: 465,
                    auth : {
                        user : "gestaltldi@yandex.ru",
                        pass : "denisigordzilean"
                    }
                }));

                var mailOptions={
                    from : "gestaltldi@yandex.ru",
                    to : user.email,
                    subject : "Your Subject",
                    text :  'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    ' http://' + req.headers.host + '/password/' + user.tempUrl + ' \n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n',

                    html : "", attachments : []
                }
                console.log("Mail options: "+mailOptions);
                console.log("tempUrl: "+user.tempUrl);
                smtp.sendMail(mailOptions, function(error, response){
                    if(error){
                        console.log("error: "+error);
                        _500Internal(res);
                    }else{

                        console.log("response: "+response.response.toString());
                        _200Ok(res);

                    }
                });


            })
    })
}


/*
 var transport = nodemailer.createTransport('SMTP', {
 service: 'Gmail',
 auth: {
 user: 'leadzian213@gmail.com', // a gmail corporate account
 pass: 'dzilean613'  // the password
 }
 });



 var mail = {
 from: 'leadzian213@gmail.com', // the account from above
 to: user.email, // my account on the same domain
 subject: 'nodemailer test',
 text: 'as'
 };


 transport.sendMail(mail, function handler(err, response) {
 if (err) {
 console.log('error: '+err);
 _500Internal(res);
 } else {

 _200Ok(res);
 }
 });


 */

function resetPassword(req,res){

    var cookie = validateCookieForAnyFile(req);
    if(cookie==undefined){
        console.log("cookie: absent in resetPassword")
        _403NoCoookie(res);
        return;
    }

    var reqBody="";

    req.on('data', function (data) {
        if(data!=undefined)
            reqBody += data;
    });
    req.on('end', function (data) {
        if(data!=undefined)
            reqBody += data;
        var password = JSON.parse(reqBody);
        updateUserDb2(cookie,"hashedPassword",password,res);
    });

}
function passwordCookieRequest(digest,res){

    User.findOne({tempUrl: digest}, function (err, foundUser) {

        if (!foundUser) { //if no such a user
            _404NoUserFound(res);
            console.log("passwordCookieRequest - no user found by tempUrl");
        }
        else {
        res.cookie('sid', foundUser.sid, {
            path: "/",
            httpOnly: true
        });
        sendFileHtml("./password.html",res);
        }
    });
}
function validateCookieForAnyFile(req){
    if (!req.headers.cookie) {
        console.log("validateCookieForAnyFile - no cookie");
        return undefined;
    }
    console.log("validateCookieForAnyFile - ok");
    return  req.headers.cookie.split('=')[1];
}

function checkIfFileStoreIsCreated(cookie,url){
    var dir = './fileStore';
    if (!fs.existsSync(dir)){
        return false;
    }
    dir = './fileStore/'+cookie;
    if (!fs.existsSync(dir)){
        return false;
    }
    var file = './fileStore/'+cookie+url;
    if (!fs.existsSync(file)){
        return false;
    }
    return true;
}
function _403NoCoookie(res){
    res.writeHead(403, {"Content-Type": "text/html"});
    res.end('No cookie');
}
function _404NoUserFound(res){
    res.writeHead(404, {"Content-Type": "text/html"});
    res.end('No user');
}
function _404NotFound(res){
    res.writeHead(404, {"Content-Type": "text/html"});
    res.end('Not found');
}
function _403Forbidden(res){
    res.writeHead(403, {"Content-Type": "text/html"});
    res.end("Forbidden");
}
function _400BadRequest(res){
    res.writeHead(400, {"Content-Type": "text/html"});
    res.end("Bad request");
}
function _500Internal(res){
    res.writeHead(500, {"Content-Type":"text/html"});
    res.end("Interanal server error");
}
function _200Ok(res){
    res.writeHead(200, {"Content-Type":"text/html"});
    res.end("Ok");
}
function updateUserDb(sid,param,value,res){
    User.findOne({sid: sid}, function (err, foundUser) {

        if (!foundUser) { //if no such a user
            _404NoUserFound(res);
            return;
        }// if admin
        else {
                var search = {};
                search[param] = value;
                User.update({sid: sid},{$set:search},function(err,us){
                    if(err) {
                        console.log(err);
                        _500Internal(res);
                        return;
                    }
                    else {
                        _200Ok(res);
                        return;
                    }
                });


        }
    });
}

function updateUserDb2(sid,param,value,res){
    User.findOne({sid: sid}, function (err, foundUser) {

        if (!foundUser) { //if no such a user
            _404NoUserFound(res);
            return;
        }// if admin
        else {
            var search = {};
            search[param] = crypto.createHmac('sha1',foundUser.salt).update(value.password).digest('hex');
            User.update({sid: sid},{$set:search},function(err,us){
                if(err) {
                    console.log(err);
                    _500Internal(res);
                    return;
                }
                else {
                    updateUserDb(sid,"tempUrl",generate_key(),res)
                    return;
                }
            });


        }
    });
}

function getData(sid,param,res){
    var search = {};
    search[param] = 1
    User.findOne({sid: sid},search,function (err, foundUser) {

        if (!foundUser) { //if no such a user
            _404NoUserFound(res);
            return;
        }// if admin
        else {
            var found = foundUser._doc[param];
            res.writeHead(200, {"Content-Type":"text/html"});
            res.end(found);
        }
    });
}
