let resourceCache = {};
var readyCallbacks = [];

function load(urlOrArr){
    if(urlOrArr instanceof Array) {
        urlOrArr.forEach(function(url) {
            loadSheet(url);
        });
    }
    else {
        loadSheet(urlOrArr);
    }
}

function loadSheet(url) {
    if(resourceCache[url]) {
        return resourceCache[url];
    }
    
    let img = new Image();
    img.src = url;
    resourceCache[url] = false;    

    img.onload = function() {
        resourceCache[url] = img;

        if(isReady()) {
            readyCallbacks.forEach((func) => func() );
        }
    };    
}

function get(url) {
    return resourceCache[url];
}

function isReady() {
    var ready = true;
    for(var k in resourceCache) {
        if(resourceCache.hasOwnProperty(k) && !resourceCache[k]) {
            ready = false;
        }
    }
    return ready;
}

function onReady(func) {
    readyCallbacks.push(func);
}

export { 
    load,
    get,
    onReady,
    isReady
}