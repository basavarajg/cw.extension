var table;
(function() {
  var tableData = [];

  $.ajax({
    url: "/getHtmlData",
    success: function(result){
      //let array = JSON.parse("[" + result + "]");
      let array = JSON.parse(result);
      for(let i=0; i< array.length; i++) {
        if(undefined != array[i]
          && null != array[i]
          && '' != array[i])
          tableData.push([
            `<a href="#"><img src="img/ic_add_box_black.png" height="30" width="30"></img></a>`,
            array[i].content_id,
            array[i].content,
            array[i].user,
            formatDate(new Date(array[i].cre_time)),
            `<a href="javascript:;" onclick="deleteId(this, '${array[i].content_id}')"><img src="img/ic_delete_black.png" height="30" width="30"></img></a>`,
            `<a href="javascript:;" onclick="playAudio(this)"><img src="img/ic_record_voice_over_black.png" height="30" width="30"></img></a>`
          ]);
      }
      table = $('#dataTable').DataTable({
        sScrollY: 590,
        data: tableData
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

})();

function playAudio(element) {
  let tr= (element).closest('tr');
  let childNodes = tr.childNodes;
  //console.log(childNodes[2].innerText);
  responsiveVoice.speak(childNodes[2].innerText,'US English Female');
}

function openMailBox() {
  $('#dialogDiv').dialog({
    title: "Compose Mail",
    show: { effect: "blind", duration: 800 },
    modal: true,
    width: 1000,
    height: 600,
    dialogClass: 'dialogHeader'
  });
}

function deleteId(element, id) {
  $.post("/delete",
  {
    id: id
  },
  function(data, status) {
    if('success' == status)
      (element).closest('tr').remove();
  });
}

function formatDate(date) {
  var utc = date.toUTCString() // 'ddd, DD MMM YYYY HH:mm:ss GMT'
  return utc.slice(8, 12) + utc.slice(5, 8) + utc.slice(12, 22)
}
