var lclick = function(){
    if(userLogin.value=="" ||  userPassword.value==""){
        //message.setAttribute('style','color:red');
        //message.style.display ="block";
        //message.innerHTML = "Fail!:(";
        alert("Error: login and password should not be empty fields");
        return;
    }

    var user = {
                  userLogin: userLogin.value.toLowerCase(),
                  email:email.value.toLowerCase(),
                  userPassword: userPassword.value
            }
    var xhr = new XMLHttpRequest();
    xhr.open('POST','login_post',true);
    xhr.onreadystatechange = function(){
                if(xhr.readyState != 4) return;
                else{
                    if(xhr.status == 200) success(user);
                    else fail();
                }
            }
    function success(user){
                //message.setAttribute('style','color:green');
                //message.innerHTML = "Success!:)";
                alert("Ok: user successfuly has been logged in");
                sessionStorage.setItem("userNow",user.userLogin);
                var a = document.createElement('a');
                a.setAttribute('href','code')
                message.appendChild(a);
                a.click();
    };
    function fail(){
        //message.setAttribute('style','color:red');
        //message.style.display ="block";
        //message.innerHTML = "Fail!:(";
        alert("Error: loggin in failed");
    }
    xhr.send(JSON.stringify(user));
}

var rclick = function(){
    if(userLogin.value=="" ||  userPassword.value=="" ||  email.value==""){
        //message.setAttribute('style','color:red');
        //message.style.display ="block";
        //message.innerHTML = "Fail!:(";
        alert("Error: login , email and password should not be empty fields");
        return;
    }

    var user = {
        userLogin: userLogin.value.toLowerCase(),
        email:email.value.toLowerCase(),
        userPassword: userPassword.value
        }
    var xhr = new XMLHttpRequest();
    xhr.open('POST','sign_up_post',true);
    xhr.onreadystatechange = function(){
        if(xhr.readyState != 4) return;
        else{
            if(xhr.status == 200) success(user);
            else fail();
        }
    }

    function success(user){
            //message.setAttribute('style','color:green');
            //message.innerHTML = "Success!:)";
            alert("Ok: successful singing up");
            sessionStorage.setItem("userNow",user.userLogin);
            var a = document.createElement('a');
            a.setAttribute('href','code');
            message.appendChild(a);
            a.click();
        };

    function fail(){
        //message.setAttribute('style','color:red');
        //message.style.display ="block";
        //message.innerHTML = "Fail!:(";
        alert("Error: signing in failed");
    }
    xhr.send(JSON.stringify(user));
}
submit.onclick = lclick;
sign_in.onclick=function(){
    submit.onclick = lclick;
    sign_in.className="";
    sign_in.className="sign_button_white";
    sign_up.className="";
    sign_up.className="sign_button";
    stars[1].style.opacity = 0;
}
sign_up.onclick=function(){
    submit.onclick = rclick;
    sign_up.className="";
    sign_up.className="sign_button_white";
    sign_in.className="";
    sign_in.className="sign_button";
    stars[0].style.opacity = 1;
    stars[1].style.opacity = 1;
    stars[2].style.opacity = 1;
}
reset.onclick = function(){

    if(email.value=="" ){
        //message.setAttribute('style','color:red');
        //message.style.display ="block";
        //message.innerHTML = "Fail!:(";
        alert("Error: email field should be filled");
        return;
    }

    var user = {
        email:email.value.toLowerCase()
    }
    var xhr = new XMLHttpRequest();
    xhr.open('POST','forgot',true);
    xhr.onreadystatechange = function(){
        if(xhr.readyState != 4) return;
        else{
            if(xhr.status == 200) success();
            else fail();
        }
    }
    function success(){
        alert("Ok: the message with a password link has been sent to your email");
    };
    function fail(){
        //message.setAttribute('style','color:red');
        //message.style.display ="block";
        //message.innerHTML = "Fail!:(";
        alert("Error: email proccessing failed");
    }
    xhr.send(JSON.stringify(user));
}
var stars = document.getElementsByClassName("star");
stars[1].style.opacity = 0;

reset.onmouseover = function(){
    stars[0].style.opacity = 0;
    stars[2].style.opacity = 0;
    stars[1].style.opacity = 1;
}

reset.onmouseout = function(){
    stars[0].style.opacity = 1;
    stars[2].style.opacity = 1;
    stars[1].style.opacity = 1;
}