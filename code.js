var searchBtn = document.getElementById("searchButton");
var results = document.getElementById("results");
var url1 = "https://api.github.com/gists?page=1&per_page=75";
var url2 = "https://api.github.com/gists?page=2&per_page=75";
var gistObjArray = [];

function gist(requestObj){
    this.url = requestObj.url;
    this.description = requestObj.description;
    this.convertToHTML = function(){
        var a = document.createElement("a");
        //var a = document.createAttribute("href");
        a.setAttribute("href", this.url);
        var text = document.createTextNode(this.description);
        if(this.description.length == 0){
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
                console.log(gistObjArray);
            }
            else{
                console.log("nope");
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
        for(var i = pageNum; i < pageNum+30; i++){
            var li =  document.createElement("li");
            li.appendChild(gistsToDisplay[i].convertToHTML());
            results.appendChild(li);
        }
    }
}

searchBtn.onclick = function(){
    /*console.log("hi");
    var li = document.createElement("li");*/
    var key = document.getElementById("searchQuery");
    var keyword = key.value;
    /*var text = document.createTextNode(keyword);
    li.appendChild(text);
    results.appendChild(li);*/
    console.log(gistObjArray);
    viewPage(1);
}

makeAjaxCall(url1);
makeAjaxCall(url2);
console.log(gistObjArray);
