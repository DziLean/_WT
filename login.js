angular.
		module('angLogin',[]).
  						controller('AddUserController',['$scope',function($scope){
  										$scope.message='lol ';
										$scope.user = {};
										$scope.$watch('user.first',function(newV,oldV){
												$scope.message = 'old ' + oldV + ' new ' + newV;
										});
										$scope.addUser=function(){
											$scope.message='Thanks, ' + $scope.user.first+', we added you!';};}]);
function handler(e){
	  var xhr = new XMLHttpRequest();
	  xhr.open('POST','login_post',true);
	  xhr.onreadystatechange = function(){
	  if(xhr.readyState != 4) return;
	  else{
	  		if(xhr.status == 200) success();
	  		else fail();
	  	}
	  }

  function success(){
		var div = document.getElementById("message");
		div.setAttribute('style','color:green');
		div.innerHTML = "Success:)"
			var a = document.createElement('a');
		a.setAttribute('href','draw.html');
		div.appendChild(a);
		a.click();
    };

  function fail(){
	  	var div = document.getElementById("message");
		div.setAttribute('style','color:red');
		div.innerHTML = "Fail!:("
	  	}
	  	var user = {
	  		userLogin: userLogin.value,
	  		userPassword: userPassword.value 
	  	}
	  	xhr.send(JSON.stringify(user));
  }
