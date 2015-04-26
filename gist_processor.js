function Gist(gistID, gistDesc, gistURL){
  this.gistID = gistID; 
  this.gistDesc = gistDesc;
  this.gistURL = gistURL;
  this.fav = false; 
}

var favGists = []; 
var normGists = []; 
var allGists = []; 

function createGistList(listName) {
  var ul; 
  var gistList;
  if (listName === "fav") { 
    ul = document.getElementById("fav-list"); 
    gistList = favGists; 
  }
  else {
    ul = document.getElementById("norm-list"); 
    gistList = normGists; 
  }
  for (var k = ul.childNodes.length - 1; k >= 0; k--) {
    ul.removeChild(ul.childNodes[k]);
  }
  gistList.forEach(function(_gist) {
    var li = document.createElement("li");
    li.appendChild(listGists(_gist));
    ul.appendChild(li);
  });
}

function listGists(_gist) { 
  var dl = document.createElement("dl"); 
  var info = dlGists("Description", _gist.gistDesc); 
  dl.appendChild(info.dt);
  dl.appendChild(info.dd); 
  var info = dlGists("URL", _gist.gistURL); 
  dl.appendChild(info.dt); 
  dl.appendChild(info.dd); 
  return dl;  
}

function dlGists (name, desc) {
  var dt = document.createElement("dt"); 
  var dd = document.createElement("dd"); 
  dt.innerHTML = name; 
  dd.innerHTML = desc; 
  return {"dt":dt, "dd":dd}; 
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
        for (var j = 0; j < _gistList.length; j++) {
          var _gistURL = _gistList[j].html_url; 
          var _gistID = _gistList[j].id; 
          var _gistDesc = _gistList[j].description; 
          var inFavs = false; 
          if (_gistDesc === "")
            _gistDesc = "No Description Provided"; 
          for (var k = 0; k < favGists.length; k++) {
            if (_gistID == favGists[k].gistID) {
              inFavs = true; 
              break; 
            }
          }
          if (!inFavs) {
            var newGist = new Gist(_gistID, _gistDesc, _gistURL); 
            normGists.push(newGist);
          } 
        }
        createGistList(); 
      }
    }
  }
}

window.onload = function () {
  favGists = localStorage.getItem("favGists"); 
  if (favGists !== null) {
    favGists = JSON.parse(favGists); 
  }
  console.log(favGists); 
  gist_request(); 
  createGistList(); 
  console.log(normGists); 
}   