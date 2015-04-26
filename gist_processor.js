function Gist(gistID, gistDesc, gistURL){
  this.gistID = gistID; 
  this.gistDesc = gistDesc;
  this.gistURL = gistURL;
  this.fav = false; 
}

var favGists = new Array(); 
var normGists = new Array(); 

function findById(_gistID, listName) {
  if (listName == "fav") { 
    for (var i = 0; i < favGists.length; i++) {
      if (favGists[i].gistID === _gistID) { 
        return i; 
      }
    }
  }
  else {
    for (var i = 0; i < normGists.length; i++) {
      if (normGists[i].gistID === _gistID) {
        return i; 
      }
    }
  } 
}

function favoriteGistAdd(i) { 
  favGists.push(normGists[i]);     
  createGistList("fav"); 
  normGists.splice(i, 1);  
  createGistList("norm"); 
  localStorage.setItem("favGists", JSON.stringify(favGists)); 
}

function favoriteGistRem(i) {
  favGists.splice(i, 1);  
  
  createGistList("fav"); 
  localStorage.setItem("favGists", JSON.stringify(favGists)); 
}

function createGistList(listName) {
  var div; 
  var gistList;
  if (listName == "fav") { 
    div = document.getElementById("fav-list"); 
    gistList = favGists; 
  }
  else {
    div = document.getElementById("norm-list"); 
    gistList = normGists; 
  }
  for (var k = div.childNodes.length - 1; k >= 0; k--) {
    div.removeChild(div.childNodes[k]);
  }
  gistList.forEach(function (_gist) {
    var innerDiv = document.createElement("div");
    innerDiv.id = _gist.gistID; 
    // button code adapted from professor Soroush Ghorashi Piazza post
    if (listName == "fav") {
      var fbutton = document.createElement("button"); 
      fbutton.innerHTML = "-"; 
      fbutton.setAttribute("gistID", _gist.gistID); 
      fbutton.onclick = function() {
        var gistID = this.getAttribute("gistID"); 
        var toBeRemovedGist = findById(gistID, listName);
        favoriteGistRem(toBeRemovedGist);  
      }
    }
    else {
      var fbutton = document.createElement("button"); 
      fbutton.innerHTML = "+"; 
      fbutton.setAttribute("gistID", _gist.gistID); 
      fbutton.onclick = function() {
        var gistID = this.getAttribute("gistID"); 
        var toBeFavoritedGist = findById(gistID, listName);
        favoriteGistAdd(toBeFavoritedGist);  
      }
    }
    innerDiv.appendChild(fbutton); 
    var descDiv = document.createElement("span");
    descDiv.innerHTML = _gist.gistDesc; 
    innerDiv.appendChild(descDiv);
    var br = document.createElement("br"); 
    innerDiv.appendChild(br); 
    var link = document.createElement("a"); 
    var text = document.createTextNode(_gist.gistURL.toString()); 
    link.appendChild(text); 
    link.title = "Gist URL"; 
    link.href = _gist.gistURL; 
    innerDiv.appendChild(link); 
    div.appendChild(innerDiv);
  });
}


function gist_request() {
	var url = "https://api.github.com/gists/public?page=1"; 
  normGists = [];
  var pageSelect = document.getElementById("page-numbers"); 
  var pageNum = pageSelect.options[pageSelect.selectedIndex].value;

  for (var i = 1; i <= pageNum; i++){	
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
          if (_gistDesc === "" || _gistDesc === null)
            _gistDesc = "No Description Provided"; 
          if (favGists !== null) {
            for (var k = 0; k < favGists.length; k++) {
             if (_gistID == favGists[k].gistID) {
                inFavs = true; 
               break; 
              }
            }
          }
          if (!inFavs) {
            var newGist = new Gist(_gistID, _gistDesc, _gistURL); 
            normGists.push(newGist);
          } 
        }
        createGistList("norm"); 
      }
    }
  }
}

window.onload = function () {
  favGists = localStorage.getItem("favGists"); 
  if (favGists !== null) {
    favGists = JSON.parse(favGists); 
    createGistList("fav"); 
  }
  else {
    favGists = new Array();
  }
}   