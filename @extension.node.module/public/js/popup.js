//chrome.storage.sync.clear()
(function() {
  'use strict';

  function getAll(query) {
    return [].slice.call(document.querySelectorAll(query));
  }
  function matches(elem, selector) {
    var nativeMatches = elem.matches || elem.webkitMatchesSelector || elem.mozMatchesSelector || elem.msMatchesSelector || elem.oMatchesSelector;
    return nativeMatches.call(elem, selector);
  }
  function closest(elem, selector) {
    while (elem) {
      if (matches(elem, selector)) {
        return elem;
      }
      elem = elem.parentElement;
    }
    return null;
  }

  function HtmlData(id,htmlContent,user,time) {
    this.id = id;
    this.htmlContent = htmlContent;
    this.user = user;
    this.time = time;
  }

  var tableData = [];

  $.ajax({
    url: "/getHtmlData",
    success: function(result){
      //let array = JSON.parse("[" + result + "]");
      let array = JSON.parse(result);
      for(let i=0; i< array.length; i++) {
        console.log(array[i]);
        if(undefined != array[i]
          && null != array[i]
          && '' != array[i])
          tableData.push([array[i].content_id, array[i].content, array[i].user, array[i].cre_time]);
      }
      $('#dataTable').DataTable({
        data: tableData,
            columns: [
                { title: "ID" },
                { title: "Content" },
                { title: "Owner" },
                { title: "Created Time" }
            ]
      });
    }
  });
  //ajax call to get windows logged in user name
  /*$.ajax({
    url: "/getUserName",
    success: function(result) {
      $("#username").html('Hello, ' + result.toUpperCase());
    }
  });*/
  /*
  * Drawer
  */
  var drawerEl = document.querySelector('.mdc-temporary-drawer');
  var drawer = new mdc.drawer.MDCTemporaryDrawer(drawerEl);
  getAll('.demo-drawer-toggle').forEach(function(toggleElem) {
    toggleElem.addEventListener('click', function() {
      drawer.open = true;
    });
  });
  drawerEl.addEventListener('MDCTemporaryDrawer:open', function() {
    //console.log('Received MDCTemporaryDrawer:open');
  });
  drawerEl.addEventListener('MDCTemporaryDrawer:close', function() {
    //console.log('Received MDCTemporaryDrawer:close');
  });
})();
