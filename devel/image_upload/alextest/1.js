var http = require('http');
var formidable = require('formidable');
var fs = require('fs');

http.createServer(function (req, res)
{
  if(req.url == '/fileupload')
  {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
      var op = files.filetoupload.path;
      var np = '~/img/' + files.filetoupload.name;
      fs.rename(op, np, function(err) {
        if(err) 
          throw err;

/*
        img = {
          path: 'hello this is the path'
        };
        var data = JSON.stringify(img);
        fs.writeFileSync('~/asdf.json', data);
*/
        res.write('Complete');
        res.end();
      });
    });
  }
  else
  {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<form id="upload" accept="image/*" action="fileupload" method="post" enctype="multipart/form-data">');
    res.write('<input name="filetoupload" type="file">');
    res.write('<button type="submit">Submit</button>');
    res.write('</form>');
    return res.end();
  }
}).listen(8080); 
