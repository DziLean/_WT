var grid = angular.module("gridModu",[]);
function  addZero(number){
    if(number.toString().length==1)
        return '0'+number;
    else return number;
}
var getLastConnection = function(){
    var date = new Date(this.last_connection);
    return "" + addZero(date.getMonth()+1)+"/" + addZero(date.getDate()) +"/"+ (date.getFullYear()) + " "+ addZero(date.getHours())+":" + addZero(date.getMinutes());
}
var users=[];


grid.filter("gridFiltUser",function(){
    return function(massive,scope){

        if(scope.filtUser==undefined || massive ==null)
            return massive;
        else{

                var res =  scope.filtUser.trim()=="" ?  massive : massive.filter(function(item,i,arr){

                    return item.username.toLowerCase().indexOf(scope.filtUser.toLowerCase())>-1;
                });

            return res;
        }
    }});



grid.controller("gridCont",["$scope",function($scope){
    $scope.filtSele = null;//selection from select
    $scope.sortUserAsce= function(){
        var data = $scope.users;
        if(data == null)
            return;
        var ind;
        var res;
        var user;
        var swap;
        var i = 0;
        for(; i < data.length-1 ; ++i){
            user = data[i] ;
            ind = i;
            for(j = i+1 ; j < data.length ; ++j) {
                res = user.username.localeCompare(data[j].username);
                if(res>0){
                   ind = j;
                    user = data[ind];
                }
            }
            swap = data[i];
            data[i] = data[ind];
            data[ind] = swap;

        }
        $scope.users = data;
    };
    $scope.sortUserDesc= function(){

        var data = $scope.users;
        if(data == null)
            return;
        var ind;
        var res;
        var user;
        var swap;
        var i = 0;
        for(; i < data.length-1 ; ++i){
            user = data[i] ;
            ind = i;
            for(j = i+1 ; j < data.length ; ++j) {
                res = user.username.localeCompare(data[j].username);
                if(res<0){
                    ind = j;
                    user = data[ind];
                }
            }
            swap = data[i];
            data[i] = data[ind];
            data[ind] = swap;

        }
        $scope.users = data;
    };
   window.onload = function() {

        var xhr = new XMLHttpRequest();
        xhr.open("GET", "usersLog", true);
        xhr.onreadystatechange = function () {
            if (this.readyState != 4)
                return;
            else {
                if (this.status == 200 && this.readyState == 4)
                    success(this);
                else error()
            }
        }
        xhr.timeout = 30000;
        xhr.ontimeout = function () {
            error(this.responseText);
        }
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send();

        function success(xhr) {
            $scope.users = JSON.parse(xhr.responseText);
            $scope.$apply();
        }

        function error(str) {
            alert("Request error");
        }
    }
    $scope.patients = $scope.allPatients;//.slice(0,$scope.quantity);
    $scope.$watch(function(){return $scope.users},function(newV,oldV){
        if($scope.users)
           return;
    });
    $scope.$watch(function(){return $scope.filtSele},function(newV,oldV){
        if(newV==undefined || newV == null)
            return;
        $scope.users =  $scope.clinics.filter(function(item,i,arr){
            return item.clinic.toLowerCase().indexOf(newV.clinic.trim().toLowerCase())>-1;
        })[0].users;
    });

}]);



