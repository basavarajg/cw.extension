var express = require('express')
, bodyParser = require('body-parser')
, http = require('http')
, util = require('util')
, Promise = require('promise')
, Database = require('./database.js')
, path = require('path')
, nodemailer = require('nodemailer');;

var app = express();
//var htmlData = [];

//support parsing of application/json type post data
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/img',express.static(path.join(__dirname, '/public/images')));
app.use('/css',express.static(path.join(__dirname, '/public/css')));
app.use('/js',express.static(path.join(__dirname, '/public/js')));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/content.html');
});

app.route('/content')
  .get(function (req, res) {
    //console.log('getMethod '+htmlData[0]);
    res.sendFile(__dirname + '/content.html');
  })
  .post(function (req, res) {
    //console.log(req.body.html);
    let bodyHtml = req.body.html;
    if(undefined != bodyHtml
      && null != bodyHtml
      && '' != bodyHtml) {
        //htmlData.push(bodyHtml);
        //console.log('selected content ' + bodyHtml);
        var database = new Database();
        const checkDuplicateQuery = 'select * from select_content where content=?';
        var checkDuplicateArgs = [bodyHtml];
        database.query(checkDuplicateQuery, checkDuplicateArgs).then( rows => {
          if(rows.length > 0) {
            console.log('Content already exists');
          } else {
            const query = 'insert into sys.select_content (content, user, cre_time) values(?,?,now());';
            var args = [bodyHtml, 'zktewfm'];
            database.query(query, args).then(() => {
              console.log('record inserted!');
            });
          }
        }).then(() => {
          database.close().then(() => {
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.write('http://localhost:3000/');
            res.end();
          });
        });
      }
  });

  app.get('/getHtmlData', function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    var database = new Database();
    const query = 'select * from select_content order by content_id desc';
    var args = [];
    database.query(query, args).then( rows => {
      res.write(JSON.stringify(rows));
    }).then(() => {
      database.close().then(() => {
        res.end();
      });
    });
    //res.write(JSON.stringify(htmlData));
    //res.end();
  });

  app.post('/search', function (req, res) {
    let keyword = '%' + req.body.keyword +'%';
    console.log('Entered keyword is: ' + keyword);
    res.writeHead(200, {'Content-Type': 'text/plain'});
    var database = new Database();
    const query = 'select content_id as value, content as label from select_content where content_id like ? or content like ?';
    var args = [keyword, keyword];
    database.query(query, args).then( rows => {
      res.write(JSON.stringify(rows));
    }).then(() => {
      database.close().then(() => {
        res.end();
      });
    });
    //res.write(JSON.stringify(htmlData));
    //res.end();
  });

  app.post('/delete', function (req, res) {
    let content_id = req.body.id;
    var database = new Database();
    const query = 'delete from select_content where content_id = ?';
    var args = [content_id];
    database.query(query, args).then(() => {
      console.log('record deleted!');
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end();
    });
  });

  app.get('/getArchiveEmails', function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    var database = new Database();
    const query = 'select * from email_audit order by id desc';
    var args = [];
    database.query(query, args).then( rows => {
      res.write(JSON.stringify(rows));
    }).then(() => {
      database.close().then(() => {
        res.end();
      });
    });
    //res.write(JSON.stringify(htmlData));
    //res.end();
  });

app.get('/getUserName', function (req, res) {
  let userName = process.env['USERPROFILE'].split(path.sep)[2];
  //let loginId = path.join("domainName",userName);
  //console.log(loginId);
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write(userName);
  res.end();
});

app.post('/sendEmail', function (req, res) {
  let emailTo = req.body.emailTo;
  let emailFrom = req.body.emailFrom;
  //let emailFrom = 'codeweek@baml-test.com';
  let subject = req.body.subject;
  let body = req.body.body;

  //console.log(emailTo);
  //console.log(emailFrom);
  //console.log(subject);
  //console.log(body);

  res.writeHead(200, {'Content-Type': 'text/plain'});

  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'test01@test.com',
      pass: 'test'
    }
  });

  const mailOptions = {
    from: emailFrom, // sender address
    to: emailTo, // list of receivers
    subject: subject, // Subject line
    html: body// plain text body
  };

  transporter.sendMail(mailOptions, function (err, info) {
     if(err)
       console.log(err)
     else
       console.log(info);
  });

  var database = new Database();
  const query = 'insert into sys.email_audit (email_message, email_subject, email_from, email_to, cre_time) values(?, ?, ?, ?, now())';
  var args = [body, subject, emailFrom, emailTo];
  database.query(query, args).then(() => {
    console.log('record inserted!');
    res.write('Mail sent!');
    res.end();
  });
});

app.listen(3000, function () {
  console.log('App listening on port 3000!')
});
