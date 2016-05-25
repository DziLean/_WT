var myApp = angular.module('myApp',[]);
myApp.factory('Data',function(){
    return {message:"I am data from a service"}
});

myApp.filter('reverse', function(Data){
    return function (text){
        return text.split("").reverse().join("")+Data.message;
    }
});

myApp.controller('FirstCtrl',['$scope','Data',function($scope,Data){
    $scope.data = Data;
    $scope.$watch('data.message'
    ,function(newV,oldVal){
        $scope.data.message=newV;
    });


}]);
myApp.controller('SecondCtrl',['$scope','Data',function($scope,Data){
    $scope.data = Data;
    $scope.reversedMessage = function(message){
        return message.split("").reverse().join("")+Data.message;
    }
}]);

/*
function FirstCtrl($scope, Data){


}
function SecondCtrl($scope, Data){

    }
}*/
