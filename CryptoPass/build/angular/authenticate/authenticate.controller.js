
// reminder of functions and utilities available throughout application
// var utils = require('../../utilities/encrypt.file.js')
// var validate = utils.validate;
// var decryptFile = utils.decryptFile
// var encryptFile = utils.encryptFile
// var masterObj;

app.controller('authController', function($scope, $state, $rootScope){

	$scope.master = null;

	$scope.authenticatePassword = function (master){
		var isValid = validate(master)
		if (!isValid) {
			$scope.master = null
			return
		} else if (isValid){
			decryptFile(master)
			.then(function (obj){
				masterObj = obj
				masterPass = master;
				$rootScope.validated = true;
				$rootScope.$evalAsync()
				$state.go('home')
			})
			.catch(function(err){
				console.log(err);
			})
		}
	}
});
