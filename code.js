var searchBtn = document.getElementById("searchButton");
var results = document.getElementById("results");
var navBtns = document.getElementsByClassName("navBtn");
var url1 = "https://api.github.com/gists?page=1&per_page=75";
var url2 = "https://api.github.com/gists?page=2&per_page=75";
var gistObjArray = [];
var gistsToDisplay = [];
var gistsToDisplayFavorites = [];
makeAjaxCall(url1);
makeAjaxCall(url2);
var currentPage = 1;

var FavoriteList = document.getElementById("favList");


for(var i=0; i<navBtns.length; i++){
    navBtns[i].addEventListener('click', navClick, false);
}

function findbyUrl(url, callback){
	for (var i =0; i<gistsToDisplay.length; i++){
		if(gistsToDisplay[i].url==url){
			callback( i);
		}
	}
}

function gist(requestObj){
    this.url = requestObj.url;
    this.description = requestObj.description;
	
	this.convertToHTML = function(whichList){
        if(whichList === "Favoites")
		{
			var d = document.createElement('div');
            var a = document.createElement("a");
            var btn = document.createElement("Button");
            btn.innerHTML = "+";
            btn.className = "btn btn-primary";
            var myURL = this.url;
            btn.onclick = function (){
                var index = 0;
                for (var i =0; i<gistsToDisplay.length; i++){
                    if(gistsToDisplayFavorites[i].url==myURL){
                        index = i;
                    }
                }
                gistToDisplay.push(gistsToDisplayFavorites[index]);
                gistsToDisplayFavorites.splice(index,1);
                viewPage(currentPage);
                viewPageFavorites(currentPage);
            }
            
            //var a = document.createAttribute("href");
            a.setAttribute("href", this.url);
            var text = document.createTextNode(this.description);
            if(this.description == null || this.description.length == 0){
                text = document.createTextNode("No Description");
            }
            a.appendChild(text);
            d.appendChild(btn);
            d.appendChild(a);
            return d;
		}
		else{
			var d = document.createElement('div');
			var a = document.createElement("a");
			var btn = document.createElement("Button");
			btn.innerHTML = "+";
			btn.className = "btn btn-primary";
            var myURL = this.url;
			btn.onclick = function (){
                var index = 0;
                for (var i =0; i<gistsToDisplay.length; i++){
                    if(gistsToDisplay[i].url==myURL){
                        index = i;
                    }
                }
				gistsToDisplayFavorites.push(gistsToDisplay[index]);
                gistsToDisplay.splice(index,1);
                viewPage(currentPage);
                viewPageFavorites(currentPage);
			}
			
			//var a = document.createAttribute("href");
			a.setAttribute("href", this.url);
			var text = document.createTextNode(this.description);
			if(this.description == null || this.description.length == 0){
				text = document.createTextNode("No Description");
			}
			a.appendChild(text);
			d.appendChild(btn);
			d.appendChild(a);
			return d;
		}
	}
}


function makeAjaxCall(url){
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.send(null);
    request.onreadystatechange = function(){
        if (request.readyState === 4){
            if(request.status === 200){
                var serverResponse = JSON.parse(request.responseText);
                serverResponse.forEach(function(i){
                    var g = new gist(i);
                    gistObjArray.push(g);
                    searchBtn.onclick();
                })
            }
            else{
                alert("Error!");
            }
        }
    }
}

function viewPage(pageNum){
    currentPage = pageNum;
    pageNum--;
    while(results.firstChild){
        results.removeChild(results.firstChild);
    }
    if(gistsToDisplay.length != 0){
        if(pageNum*30 <= gistsToDisplay.length || (pageNum == 0 && gistsToDisplay.length>0)){
            for(var i = pageNum*30; (i < pageNum*30+30 && i<gistsToDisplay.length); i++){
                var li =  document.createElement("li");
                li.appendChild(gistsToDisplay[i].convertToHTML("General"));
                results.appendChild(li);
            }
        }
        else{
            var li =  document.createElement("li");
            text = document.createTextNode("No results on this page");
            li.appendChild(text);
            results.appendChild(li);
        }
    }
    else{
        var li =  document.createElement("li");
        text = document.createTextNode("No results");
        li.appendChild(text);
        results.appendChild(li);
    }
}

function viewPageFavorites(pageNum){
    currentPage = pageNum;
    pageNum--;
    while(FavoriteList.firstChild){
        FavoriteList.removeChild(FavoriteList.firstChild);
    }
    if(gistsToDisplayFavorites.length != 0){
        if(pageNum*30 <= gistsToDisplayFavorites.length || (pageNum == 0 && gistsToDisplayFavorites.length>0)){
            for(var i = pageNum*30; (i < pageNum*30+30 && i<gistsToDisplayFavorites.length); i++){
                var li =  document.createElement("li");
                li.appendChild(gistsToDisplayFavorites[i].convertToHTML("General"));
                FavoriteList.appendChild(li);
            }
        }
        else{
            var li =  document.createElement("li");
            text = document.createTextNode("No results on this page");
            li.appendChild(text);
            FavoriteList.appendChild(li);
        }
    }
    else{
        var li =  document.createElement("li");
        text = document.createTextNode("No results");
        li.appendChild(text);
        FavoriteList.appendChild(li);
    }
}


function navClick(){
    var whichBtn = this.getAttribute("id");
    var index = parseInt(whichBtn.slice(-1));
    viewPage(index);
}

searchBtn.onclick = function(){
    var key = document.getElementById("searchQuery");
    var keyword = key.value;
    if( keyword.length == 0){
        gistsToDisplay = gistObjArray;
    }
    else{
        gistsToDisplay = [];
        for( var i = 0; i < gistObjArray.length; i++){
            if(gistObjArray[i].description != null && gistObjArray[i].description.search(keyword) != -1){
                gistsToDisplay.push(gistObjArray[i]);
            }
        }
    }
    viewPage(1);
}