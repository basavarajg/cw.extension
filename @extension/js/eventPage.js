var contextMenuItem = {
  "id": "annotationHtml",
  "title": "Annotate Content",
  "contexts": ["selection"]
}

chrome.contextMenus.create(contextMenuItem);

let tabId = '';

chrome.contextMenus.onClicked.addListener(function(selectedData){
  //selectedData.selectionText
  //chrome.storage.sync.set({'selectedData': selectedData});
  chrome.tabs.executeScript({
    file: "js/contentscript.js"
  });
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if(request.html) {
    $.post("http://localhost:3000/content",
    {
      html: request.html
    },
    function(data, status) {
      chrome.tabs.query({'url': data}, function(tabs) {
        if ( tabs.length > 0 ) {
          chrome.tabs.update(tabs[0].id,{'active':true});
        } else {
          chrome.tabs.create({'url':data});
        }
      });
    });
  }
  sendResponse({status: "200"});
});
