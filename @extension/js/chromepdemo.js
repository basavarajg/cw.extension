var contextMenuItem = {
  "id": "annotationHtml",
  "title": "Annotate Content",
  "contexts": ["selection"]
}

chrome.contextMenus.create(contextMenuItem);

let tabId = '';

chromep.contextMenus.onClicked.addListener(function(selectedData){
  //selectedData.selectionText
  //chrome.storage.sync.set({'selectedData': selectedData});
  const chromep = new ChromePromise();
  alert(chromep);
  chromep.storage.local.remove(['arr'],function() {
   var error = chromep.runtime.lastError;
      if (error) {
          console.error(error);
      } else {
        alert('arr storage cleared');
      }
  }).then(function() {
    chromep.tabs.executeScript({
      file: "js/contentscript.js"
    }, function() {
      chromep.storage.local.get(['arr'], function(obj) {
        var htmlData = obj.arr?obj.arr:[];
        $.post("http://localhost:3000/main",
        {
          html: htmlData
        },
        function(data, status) {
          if('' == tabId) {
            chromep.tabs.create(
            {
              url: data
            }, function(tab) {
              tabId = tab.id
            });
          }
        });
      });
    });
  });
});
