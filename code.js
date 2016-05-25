


/////////////////////////////////////////////////////
function goodSave(){
    message.setAttribute('style','color:green');
    message.innerHTML = "Success!:)";
}
function badSave(){
    message.setAttribute('style','color:red');
    message.style.display ="block"
    message.innerHTML = "Fail!:(";
}
function goodLoad(str){
    message.setAttribute('style','color:green');
    message.innerHTML = "Success!:)";
    codearea.value = str;
}
function badLoad(){
    message.setAttribute('style','color:red');
    message.style.display ="block";
    message.innerHTML = "Fail!:(";
}
function appendText(tag){
    if(codearea.value==undefined)
        codearea.value="";
    switch(tag){
        case 'p':
            codearea.value = codearea.value + '<p></p>';
            break;
        case 'div':
            codearea.value = codearea.value + '<div></div>';
            break;
        case 'span':
            codearea.value = codearea.value + '<span></span>';
            break;
    }
}
save.onclick = function(){
    var xhr = new XMLHttpRequest();
    xhr.open('POST','/save',true);
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4){
            if(xhr.status == 201) success();
            else fail();
        }
    }
    function success(){
        goodSave();
    };
    function fail(){
        badSave();
    }
    xhr.send(codearea.value);
}
load.onclick = function(){
    var xhr = new XMLHttpRequest();
    xhr.open('GET','/load',true);
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4){
            if(xhr.status == 200) success(xhr.responseText);
            else fail();
        }
    }
    function success(str){
        goodLoad(str);
    };
    function fail(){
        badLoad();
    }
    xhr.send(codearea.value);
}
p.onclick = function(){
   appendText('p');
}
div.onclick = function(){
    appendText('div');
}
span.onclick = function(){
    appendText('span');
}

var app = angular.module("app",['ngSanitize']);
app.controller("htmlController",["$scope",'$sce',function($scope){
    $scope.$watch(function(){return $scope.codeareaIn},function(newV,oldV) {
        if(newV!=undefined)
            iframe.innerHTML = newV;
    });

}]);

window.onload = function(){
    document.getElementById("userNow").firstElementChild.innerHTML = "Login: "+sessionStorage.getItem("userNow");
    var admin = document.getElementById("admin");
    if(admin != undefined)
        admin.onclick=function(){
            redirect('users');
    }
    settings.onclick = function(){
        menu.style.display="block";
        var box = document.createElement("div");
        box.id = "box";
        box.style.width = "100%";
        box.style.height = "100%";
        box.style.top = box.style.left = "0";
        box.style.position = "fixed";
        box.style.display = "block";
        box.style.backgroundColor = "rgba(0,0,0,0.5)";
        box.style.zIndex = "100";
        document.getElementsByTagName("body")[0].appendChild(box);


        var exit = document.createElement("img");
        exit.id = "exit";
        exit.style.width = "30px";
        exit.style.height = "30px";
        exit.style.top = exit.style.right = "0";
        exit.style.position = "absolute";
        exit.style.display = "inline-block";
        exit.style.zIndex = "110";
        exit.src="exit.png";
        exit.cursor="pointer";
        exit.onclick=function(){
            var exit = document.getElementById("exit");
            if(exit!=undefined)
                exit.parentElement.removeChild(exit);
            var box = document.getElementById("box");
            if(box!=undefined)
                box.parentElement.removeChild(box);
            var menu = document.getElementById("menu");
            if(menu!=undefined)
                menu.style.display="none";
        }

        document.getElementById('verborgen_file').style.display="none";
        document.getElementsByTagName("body")[0].appendChild(exit);
    }
    requestData("img");

}
menu.style.display="none";

$('#verborgen_file').hide();
$('#back').on('click', function () {
    $('#verborgen_file').click();
});

$('#verborgen_file').change(function () {
    var file = this.files[0];
    var reader = new FileReader();
    reader.onloadend = function () {
        $('body').css('background-image', 'url("' + reader.result + '")');

    }
    if (file) {
        reader.readAsDataURL(file);
    } else {
    }
});
saveChanges.onclick = function(){
    var xhr = new XMLHttpRequest();
    xhr.open('POST','/saveChanges',true);
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4){
            if(xhr.status == 200) success();
            else fail();
        }
    }
    function success(){
        goodSave();
    };
    function fail(){
        badSave();
    }

    var img = $('body').css('background-image').slice(4, -1).replace(/"/g, "");
    xhr.send(img);
}

function requestData(){
    var xhr = new XMLHttpRequest();
    xhr.open('POST','/requestData',true);
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4){
            if(xhr.status == 200) success(xhr);
            else fail();
        }
    }
    function success(obj){
        goodSave();
        $('body').css('background-image', 'url("' + obj.responseText + '")');

    };
    function fail(){
        badSave();
    }
    xhr.send("img");
}