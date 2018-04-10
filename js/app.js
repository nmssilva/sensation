var baseUrl = "https://raw.githubusercontent.com/nmssilva/sensation/master/";

var apiBaseUrl = "https://www.googleapis.com/customsearch/v1";
var imageApikey = "AIzaSyBOasz8ZhCQiqPNnTvZyjveH_arTZnAvyw"; // nmssilva API key
var backupApikey = "AIzaSyB258Pcb4kRI4JtH4Q4KjRcLDAj22YxLOE"; // alagoa API key
var searchEngineId = "009202958278043524580:1mrllu72sxk";
var searchType = "image";
var imgSize = "huge";
var minWidth = 1920;

var sensation, imageUrl;

function hashCode(num) {
    var hash = 0,
        i, chr;
    if (num.length === 0) return hash;
    for (i = 0; i < num.length; i++) {
        chr = num.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

function readIntroFile(file, num) {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                var allText = rawFile.responseText;
                var words = allText.split("\n");
                var intro = words[Math.abs(num % (words.length - 1))];

                document.getElementById("intro").innerHTML = intro + "...";
                document.getElementById("title").innerHTML += intro + "... ";
            }
        }
    };
    rawFile.send(null);
}

function readTextFile(file, num) {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                var allText = rawFile.responseText;
                var words = allText.split("\n");
                sensation = words[Math.abs(num % (words.length - 1))];

                document.getElementById("sensation").innerHTML = sensation + " sensation";
                document.getElementById("title").innerHTML += sensation + " sensation :O";
            }
        }
    };
    rawFile.send(null);
}

function getImage(sensation) {
    $.ajax({
            'url': apiBaseUrl,
            'type': 'GET',
            'data': {
                "key": imageApikey,
                "cx": searchEngineId,
                "searchType": searchType,
                "imgSize": imgSize,
                'q': sensation,
            },
            contentType: 'application/json; charset=utf-8',
            success: function(response) {
                //  alert(response.status);
                var imageList = response['items'];
                var i = 0;
                // Get a suitable image
                while (true) {
                    if (imageList[i] != null) {
                        var width = imageList[i]['image']['width'];
                        var height = imageList[i]['image']['height'];
                        //if (width > height && width >= 1920 && height >= 1080) {
                        document.body.style["background-image"] = "url( " + imageList[i]['link'] + ")";
                        var img = new Image();
                        img.onload = function() {
                            document.getElementById("loader").style.display = "none";
                            document.getElementById("main").style.display = "block";
                        };
                        img.onerror = function() {
                            document.body.style["background-image"] = "url(bg.jpg)";
                            document.getElementById("loader").style.display = "none";
                            document.getElementById("main").style.display = "block";
                        };
                        img.src = imageList[i]['link'];
                        break;
                    }
                    i++;
                }
            },
            error: function() {
                $.ajax({
                    'url': apiBaseUrl,
                    'type': 'GET',
                    'data': {
                        "key": backupApikey,
                        "cx": searchEngineId,
                        "searchType": searchType,
                        "imgSize": imgSize,
                        'q': sensation,
                    },
                    contentType: 'application/json; charset=utf-8',
                    success: function(response) {
                        //  alert(response.status);
                        var imageList = response['items'];
                        var i = 0;
                        // Get a suitable image
                        while (true) {
                            if (imageList[i] != null) {
                                var width = imageList[i]['image']['width'];
                                var height = imageList[i]['image']['height'];
                                //if (width > height && width >= 1920 && height >= 1080) {
                                document.body.style["background-image"] = "url( " + imageList[i]['link'] + ")";
                                var img = new Image();
                                img.onload = function() {
                                    document.getElementById("loader").style.display = "none";
                                    document.getElementById("main").style.display = "block";
                                };
                                img.onerror = function() {
                                    document.body.style["background-image"] = "url(bg.jpg)";
                                    document.getElementById("loader").style.display = "none";
                                    document.getElementById("main").style.display = "block";
                                };
                                img.src = imageList[i]['link'];
                                break;
                            }
                            i++;
                        }
                    },
                    error: function() {
                        document.getElementById("loader").style.display = "none";
                        document.getElementById("main").style.display = "block";
                        document.body.style["background-image"] = "url(bg.jpg)";
                    }
                });
            }
    });
}

window.onload = function() {
    var d = new Date();
    var num = d.getDate() * 10000000 + d.getMonth() * 10000 + d.getFullYear();
    num = hashCode(num.toString());
    document.body.style.backgroundColor = "grey";
    readIntroFile(baseUrl + "misc/intros.txt", num);
    readTextFile(baseUrl + "misc/sensations.txt", num);
    getImage(sensation);
};
