var searchBtn = document.getElementById("searchButton");
var results = document.getElementById("results");
var navTable = document.getElementById("navTable");
var url1 = "https://api.github.com/gists?page=1&per_page=75";
var url2 = "https://api.github.com/gists?page=2&per_page=75";
var gistObjArray = [];
var gistsToDisplay = [];
makeAjaxCall(url1);
makeAjaxCall(url2);

function gist(requestObj){
    this.url = requestObj.url;
    this.description = requestObj.description;
    this.convertToHTML = function(){
        var a = document.createElement("a");
        //var a = document.createAttribute("href");
        a.setAttribute("href", this.url);
        var text = document.createTextNode(this.description);
        if(this.description == null || this.description.length == 0){
            text = document.createTextNode("No Description");
        }
        a.appendChild(text);
        return a;
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
                })
            }
            else{
                alert("Error!");
            }
        }
    }
}

function viewPage(pageNum){
    while( results.firstChild){
        results.removeChild(results.firstChild);
    }
    if(gistsToDisplay.length != 0){
        console.log(gistsToDisplay);
        for(var i = pageNum-1; i < pageNum+29; i++){
            var li =  document.createElement("li");
            li.appendChild(gistsToDisplay[i].convertToHTML());
            results.appendChild(li);
        }
    }
    else{
        var li =  document.createElement("li");
        text = document.createTextNode("No results");
        li.appendChild(text);
        results.appendChild(li);
    }
    //navPages();
}

/*function navPages(){
    var tr = document.createElement("tr");
    for( var i = 0; i < gistsToDisplay.lenght/30 + 1; i++){
        var td = document.createElement("td");
        var currentButton = document.createElement("button");
        currentButton.setAttribute("id", "page" + i);
        currentButton.setAttribute("class", "btn btn-primary");
        currentButton.createTextNode(i);
        td.appendChild(currentButton);
        tr.appendChild(td);
    }
    navTable.removeChild(navTable.firstChild);
    navTable.appendChild(tr);
}*/

searchBtn.onclick = function(){
    var key = document.getElementById("searchQuery");
    var keyword = key.value;
    if( keyword.length == 0){
        gistsToDisplay = gistObjArray;
    }
    else{
        console.log(gistObjArray.length);
        gistsToDisplay = [];
        for( var i = 0; i < gistObjArray.length; i++){
            if(gistObjArray[i].description != null && gistObjArray[i].description.search(keyword) != -1){
                gistsToDisplay.push(gistObjArray[i]);
            }
        }
    }
    viewPage(1);
}

