var fs = require('fs');

app.directive('sidebarItem', function($state){
  return {
    restrict: 'E',
    scope: {
      item: '='
    },
    templateUrl: 'build/angular/sidebar/sidebar.item.html',
    link: function(scope){
      scope.secondaryProp = $state.current.name === 'login' ? scope.item.username : $state.current.name === 'creditCard' ? scope.item.cardNumber : scope.item.data
      scope.getImg = function(str){
        let fileNames = fs.readdirSync(__dirname +'/build/images/icons/');
        let strArr = str.toLowerCase().split(' ');
        let matches = strArr.filter(word => fileNames.indexOf(word += '.png') > -1)
        return matches.length > 0 ? 'build/images/icons/' + matches[0] + '.png' : 'build/images/icons/key.png';
      }
    }
  }
})

app.directive('sidebar', function($state){
  return {
    restrict: 'E',
    scope: {
      navItem: '=',
    },
    controller:'sidebarController',
    templateUrl: 'build/angular/sidebar/sidebar.html',
    link: function(scope){
    	scope.singleView = function (id){
      	var stateParent = $state.current.name.replace(/\.single/g, '').replace(/\.add/g, '')
      	console.log(stateParent)
      	$state.go(stateParent + '.single', {id: id})
      }

      scope.stateName = nameFormat($state.current.name.replace(/\.single/g, '').replace(/\.add/g, ''));


    	scope.addItem = function (){
    		var stateParent = $state.current.name.replace(/\.single/g, '').replace(/\.add/g, '')
    		$state.go(stateParent + '.add')
    	}


      scope.settingsView = function(navItem, second){
        $state.go('settings', {currentSidebar: navItem})
      }

      function nameFormat (name) {
        if (name.toLowerCase() === "home") return "Home"
        name = name[0].toLowerCase()+name.substring(1)
        var re = /[A-Z]/g
        var capitalsArr = name.match(re);
        var wordsArr = name.split(re);
        for (var i = 1; i < wordsArr.length; i ++) {
          wordsArr[i] = capitalsArr[i-1]+wordsArr[i]
        }
        var title = wordsArr.join(" ")
        title = title[0].toUpperCase()+title.substring(1)
        if (title[title.length-1] === "y") {
          title = title.slice(0, -1)+"ies"
        } else {
          title += "s"
        }
        return title
      }

    }
  }
})
