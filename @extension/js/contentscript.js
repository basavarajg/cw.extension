var selection = window.getSelection();

var off = selection.anchorOffset;

// Only works with a single range
var range = selection.getRangeAt(0);

var elements = range.cloneContents();
//var children = elements.childNodes;
//alert(children[0].innerHTML);
var div = document.createElement('div');
div.appendChild(elements);
//alert(div.innerHTML);

/*chrome.storage.local.get(['arr'], function(obj) {
  var array = obj.arr?obj.arr:[];
  array.push(div.innerHTML);
  chrome.storage.local.set({
    'arr': array
  });
});*/
if(div.innerHTML) {
  chrome.runtime.sendMessage({html: div.innerHTML}, function(response) {
    console.log(response.status);
  });
}
//chrome.storage.sync.set({'html': div.innerHTML});
