function Gist(gistID, gistDesc, gistURL){
  this.gistID = gistID; 
  this.gistDesc = gistDesc;
  this.gistURL = gistURL;
  this.fav = true; 
}

var favGists = []; 
var normGists = []; 
var allGists = []; 

function createList(gistList) {
  for (var k = 0; k < gistList.length; k++) {
    if (gistList[k].fav === true) {

    }

  }

}

function gist_request() {
	var url = "https://api.github.com/gists/public?page=1"; 
  
  for (var i = 1 ; i <= 1; i++){	
    var req = new XMLHttpRequest(); 
  	if(!req){
  		throw "Unable to create the Http Request"; 
  	}

    url = url.substring(0, url.length - 1); 
    url += i; 
  	req.open("Get", url); 
  	req.send(); 

  	req.onreadystatechange = function() {
  		if(this.readyState === 4) {
  			var _gistList = JSON.parse(this.responseText); 
        for (var j = 0; j < _gistList.length; j++)
        {
          var _gistURL = _gistList[j].html_url; 
          var _gistID = _gistList[j].id; 
          var _gistDesc = _gistList[j].description; 
          var newGist = new Gist(_gistID, _gistDesc, _gistURL); 
          allGists.push(newGist); 
        }
      }
    }
  }
  console.log(allGists); 
}

window.onload = function () {
  gist_request(); 
  createList(allGists); 
}