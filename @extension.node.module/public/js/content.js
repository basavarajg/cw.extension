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
            `<a href="javascript:;" onclick="addToEmailBody(this)"><img src="img/ic_add_box_black.png" height="30" width="30"></img></a>`,
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

function sendEmail() {
  let emailTo = $('#emailTo').val();
  let subject = $('#emailSub').val();
  let message = $('.note-editable').html();
  $.post("/sendEmail",
  {
    emailTo: emailTo,
    emailFrom: 'codeweek@baml-test.com',
    subject: subject,
    body: message
  },
  function(data, status) {
    console.log(status);
    $('#mailbox').dialog("close");
  });
}

function addToEmailBody(element) {
  let tr= (element).closest('tr');
  let childNodes = tr.childNodes;
  let content = childNodes[2].innerHTML;
  let  body = $('.note-editable').html();
  body = body.concat('<br>');
  body = body.concat(content);
   $('.note-editable').html(body);
}

function openMailBox() {
  $('#mailbox').dialog({
    title: "Compose Mail",
    show: { effect: "fold", duration: 800 },
    hide: { effect: "fold", duration: 800 },
    modal: true,
    width: 750,
    height: 700,
    dialogClass: 'dialogHeader',
    create: function(event, ui) {
      var widget = $(this).dialog("widget");
      $(".ui-dialog-titlebar-close span", widget)
      .removeClass("ui-icon-closethick").addClass("dialog-close-icon");
    }
  });
}

function deleteId(element, id) {
  $('#deleteWarning').dialog({
    title: "Delete?",
    show: { effect: "clip", duration: 800 },
    hide: { effect: "clip", duration: 800 },
    modal: true,
    width: 450,
    height: 100,
    dialogClass: 'dialogHeader',
    buttons: {
      "Confirm": function() {
        $.post("/delete",
        {
          id: id
        },
        function(data, status) {
          if('success' == status)
            (element).closest('tr').remove();
        });
        $(this).dialog("close");
      },
      "Cancel": function() {
        $(this).dialog("close");
      }
    },
    create: function(event, ui) {
      var widget = $(this).dialog("widget");
      $(".ui-dialog-titlebar-close span", widget)
      .removeClass("ui-icon-closethick").addClass("dialog-close-icon");
      $(".ui-dialog-buttonpane button", widget)
      .removeClass("ui-button").addClass("btn").addClass("btn-primary");
    },
  });
}

function formatDate(date) {
  var utc = date.toUTCString() // 'ddd, DD MMM YYYY HH:mm:ss GMT'
  return utc.slice(8, 12) + utc.slice(5, 8) + utc.slice(12, 22)
}
