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

var name = '';
var email = '';

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
    if('' == name)
      name = req.body.name;
    if('' == email)
      email = req.body.email;

    console.log('Name: ' + name);
    console.log('Email: ' + email);

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
            var args = [bodyHtml, name];
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
    const query = 'select id, email_subject, email_from, cre_time from email_audit order by id desc';
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

  app.get('/getArchiveEmail', function (req, res) {
    let id = req.query.id;
    res.writeHead(200, {'Content-Type': 'text/plain'});
    var database = new Database();
    const query = 'select email_subject, email_to, email_message from email_audit where id=?';
    var args = [id];
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
    //res.writeHead(200, {'Content-Type': 'application/json'});
    //res.write(userName);
    res.json({
      "name": name,
      "email": email
    });
    //res.end();
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
      service: '<your smpt>',
      auth: {
        user: '<your email account>',
        pass: '<your password>'
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
    const query = 'insert into sys.email_audit (email_message, email_subject, email_from, email_to, cre_time, user) values(?, ?, ?, ?, now(), ?)';
    var args = [body, subject, emailFrom, emailTo, name];
    database.query(query, args).then(() => {
      console.log('record inserted!');
      res.write('Mail sent!');
      res.end();
    });
  });

  app.get('/getChartData', function (req, res) {
    let type = req.query.type;

    let query = '';
    if('chart1' == type) {
      query = `select count(user) as y, user as x from select_content group by user;`;
    } else if('chart2' == type) {
      query = `select count(user) as y, user as x from email_audit group by user;`;
    } else if('chart3' == type) {
      query = `select COALESCE((SELECT COUNT(content_id) FROM select_content WHERE DATE_FORMAT(cre_time, '%Y-%m-%d') = a.Date), 0) as y
        , DATE_FORMAT(a.Date, "%D %b") AS x
        from (
          select curdate() - INTERVAL (a.a + (10 * b.a) + (100 * c.a)) DAY as Date
          from (select 0 as a union all select 1 union all select 2 union all select 3 union all select 4 union all select 5 union all select 6 union all select 7 union all select 8 union all select 9) as a
          cross join (select 0 as a union all select 1 union all select 2 union all select 3 union all select 4 union all select 5 union all select 6 union all select 7 union all select 8 union all select 9) as b
          cross join (select 0 as a union all select 1 union all select 2 union all select 3 union all select 4 union all select 5 union all select 6 union all select 7 union all select 8 union all select 9) as c
        ) a
        where a.Date between DATE_SUB(CURDATE(), INTERVAL 7 DAY) and CURDATE()
        ORDER BY a.Date`;
    } else if('chart4' == type) {
      query = `select COALESCE((SELECT COUNT(id) FROM email_audit WHERE DATE_FORMAT(cre_time, '%Y-%m-%d') = a.Date), 0) as y
        , DATE_FORMAT(a.Date, "%D %b") AS x
        from (
          select curdate() - INTERVAL (a.a + (10 * b.a) + (100 * c.a)) DAY as Date
          from (select 0 as a union all select 1 union all select 2 union all select 3 union all select 4 union all select 5 union all select 6 union all select 7 union all select 8 union all select 9) as a
          cross join (select 0 as a union all select 1 union all select 2 union all select 3 union all select 4 union all select 5 union all select 6 union all select 7 union all select 8 union all select 9) as b
          cross join (select 0 as a union all select 1 union all select 2 union all select 3 union all select 4 union all select 5 union all select 6 union all select 7 union all select 8 union all select 9) as c
        ) a
        where a.Date between DATE_SUB(CURDATE(), INTERVAL 7 DAY) and CURDATE()
        ORDER BY a.Date`;
    }
    res.writeHead(200, {'Content-Type': 'text/plain'});
    var database = new Database();
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

  app.listen(3000, function () {
    console.log('App listening on port 3000!')
  });
//select count(user), user from select_content group by user;
//select count(user), user from email_audit group by user;
/*
select DATE_FORMAT(a.Date, "%D %b") AS date,
       COALESCE((SELECT COUNT(content_id)
                 FROM select_content
                 WHERE DATE_FORMAT(cre_time, '%Y-%m-%d') = a.Date), 0) as COUNT
from (
    select curdate() - INTERVAL (a.a + (10 * b.a) + (100 * c.a)) DAY as Date
    from (select 0 as a union all select 1 union all select 2 union all select 3 union all select 4 union all select 5 union all select 6 union all select 7 union all select 8 union all select 9) as a
    cross join (select 0 as a union all select 1 union all select 2 union all select 3 union all select 4 union all select 5 union all select 6 union all select 7 union all select 8 union all select 9) as b
    cross join (select 0 as a union all select 1 union all select 2 union all select 3 union all select 4 union all select 5 union all select 6 union all select 7 union all select 8 union all select 9) as c
) a
where a.Date between DATE_SUB(CURDATE(), INTERVAL 7 DAY) and CURDATE()
ORDER BY a.Date


select DATE_FORMAT(a.Date, "%D %b") AS date,
       COALESCE((SELECT COUNT(id)
                 FROM email_audit
                 WHERE DATE_FORMAT(cre_time, '%Y-%m-%d') = a.Date), 0) as COUNT
from (
    select curdate() - INTERVAL (a.a + (10 * b.a) + (100 * c.a)) DAY as Date
    from (select 0 as a union all select 1 union all select 2 union all select 3 union all select 4 union all select 5 union all select 6 union all select 7 union all select 8 union all select 9) as a
    cross join (select 0 as a union all select 1 union all select 2 union all select 3 union all select 4 union all select 5 union all select 6 union all select 7 union all select 8 union all select 9) as b
    cross join (select 0 as a union all select 1 union all select 2 union all select 3 union all select 4 union all select 5 union all select 6 union all select 7 union all select 8 union all select 9) as c
) a
where a.Date between DATE_SUB(CURDATE(), INTERVAL 7 DAY) and CURDATE()
ORDER BY a.Date
*/
