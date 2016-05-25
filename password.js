
function resetPassword(person){
    var xhr = new XMLHttpRequest();
    xhr.open('POST','../../resetPassword',true);
    xhr.onreadystatechange = function(){
        if(xhr.readyState != 4) return;
        else{
            if(xhr.status == 200) success(user);
            else fail();
        }
    }
    function success(user){
        alert("Ok: password has been changed");
        var a = document.createElement('a');
        a.setAttribute('href','../../index.html')

        a.click();
    };
    function fail(){
        alert("Fail!:(");
    }
    var user = {}
    user.password = person;
    xhr.send(JSON.stringify(user));
}