angular.
		module('angSignup',[]).
  						controller('AddUserController',['$scope',function($scope){
  										$scope.message='lol ';
										$scope.user = {};
										$scope.$watch('user.first',function(newV,oldV){
												$scope.message = 'old ' + oldV + ' new ' + newV;
										});
										$scope.addUser=function(){
											$scope.message='Thanks, ' + $scope.user.first+', we added you!';};}]);