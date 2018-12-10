const express = require('express')
const https = require('https')
const app = express()

const backend_host = "11xhm45wa7.execute-api.us-west-2.amazonaws.com"
const environment = "/test"

app.delete('/:pac_id', function(req, response) {
    console.log("Deleting proxy config");
    var id = req.params.pac_id;
    var pac_path = environment +"/pac/" + id;
    var request = https.request({hostname:backend_host, path:pac_path, method: 'DELETE', headers:{'Content-Type':'application/json'}}, function(res){
	console.log("Sent to backend");
	res.setEncoding('utf8');
	res.on('data', function(d) {
	    console.log("resonse from backend: ");
	    console.log(d)
	});
    });
    request.end();
});

app.post('/:pac_id', function(req, response) {
    console.log("setting proxy config");
    var id = req.params.pac_id;
    var pac_path = environment +"/pac/" + id;
    req.setEncoding('utf8');
    req.on('data', function(data) {
	console.log("setting proxy: " + data)
	var request = https.request({hostname:backend_host, path:pac_path, method: 'POST', headers:{'Content-Type':'application/json'}}, function(res){
	    console.log("Sent to backend");
	    res.setEncoding('utf8');
	    res.on('data', function(d) {
		console.log("resonse from backend: ");
		console.log(d)
	    });
	});
	request.write(data);
	request.end();
	
    });
    
});

app.get('/:pac_id', function (req, response) {
    var id = req.params.pac_id;
    var pac_url = "https://" + backend_host+environment+"/pac/" + id;
    var proxy_url = "https://" + backend_host + environment + "/proxy/"
    https.get(proxy_url, function(res) {
	res.on('data', (data) => {
	    var items = JSON.parse(data);
	    	    console.log(items)
	    var html = `<head>
    <script src=\"https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js\"></script>
<script>
function setProxy(host, port)
{
    $.post(\"/${id}\",JSON.stringify({host:host, port:port}),function(data, status){ });
    return false;
}
function unsetProxy()
{
    $.ajax({url:\"/${id}\", type:'DELETE'});
    return false;
}
</script>
</head>
<a href=\"${pac_url}/profile\">Download the PAC profile</a><br><br>\n`

items.forEach(function(item) { 
		html += "<h1>" + (item.online ? "Online" : "Offline") + ` <a href=\"#\" onClick=\"setProxy('${item.host}', ${item.port})\">${item.host}</a>  <a href=\"${proxy_url + item.guid}/cert\">cert</a></h1><br>\n`;    
})
	    html += `<a href=\"#\" onClick=\"unsetProxy()\">No Proxy</a>`;
	    response.set('Content-Type', 'text/html');
	    response.send(html)	    
	});
    })
    

})

app.listen(80, () => console.log("Listenting on port 80"))

