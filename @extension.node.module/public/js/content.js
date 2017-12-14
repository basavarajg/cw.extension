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
        fixedColumns: true,
        data: tableData
      });
      $('#archiveTable').hide();
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

function showArchiveMailDetails(id) {
  $.ajax({
    url: "/getArchiveEmail?id="+id,
    success: function(result){
      //console.log(result);
      let row = JSON.parse(result)[0];
        if(undefined != row && null != row) {
          $('#archiveEmailTo').val(row.email_to);
          $('#archiveEmailSub').val(row.email_subject);
          $('#archiveEmailBody').html(row.email_message);

          $('#archiveMailbox').dialog({
            title: "Archived Mail",
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
      }
  });
}

function getArchiveEmails() {
  var archiveData = [];

  table.destroy();

  $('#dataTable').hide();
  $('#archiveTable').show();

  $.ajax({
    url: "/getArchiveEmails",
    success: function(result){
      //let array = JSON.parse("[" + result + "]");
      let array = JSON.parse(result);
      for(let i=0; i< array.length; i++) {
        if(undefined != array[i]
          && null != array[i]
          && '' != array[i])
          archiveData.push([
            `<a href="javascript:;" onclick="showArchiveMailDetails('${array[i].id}')">${array[i].id}</a>`,
            array[i].email_subject,
            array[i].email_from,
            //array[i].email_to,
            formatDate(new Date(array[i].cre_time)),
            //array[i].email_message
          ]);
      }
      table = $('#archiveTable').DataTable({
        sScrollY: 590,
        fixedColumns: true,
        data: archiveData
      });
    }
  });
}

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

function forwardEmail() {

  $('#archiveMailbox').dialog("close");

  //let email_to = $('#archiveEmailTo').val();
  let email_subject = $('#archiveEmailSub').val();
  let email_message = $('#archiveEmailBody').html();

  $('#emailSub').val('FW:'+email_subject);
  $('.note-editable').html(email_message);

  openMailBox();

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
