from mitmproxy import options
from mitmproxy import ctx
import socket
import requests
import uuid
import json
import base64

guid = socket.gethostname() #uuid.uuid4()
data = {}
def configure(options, updated):
    #options.cadir +
    f = open( "/Users/i52884/.mitmproxy/mitmproxy-ca-cert.cer","rb")
    ca = base64.standard_b64encode(f.read()).decode("utf-8", "ignore")  
    data = {'host':socket.gethostname(), 'port':options.listen_port, 'ca':ca, 'online':True}
    ctx.log.info(json.dumps(data))
    r = requests.post("https://11xhm45wa7.execute-api.us-west-2.amazonaws.com/test/proxy/{0}".format(str(guid)), headers={'content-type':'application/json'}, data=json.dumps(data))
    ctx.log.info(r.text)
    
def done():
    data["online"] = False
    r = requests.post("https://11xhm45wa7.execute-api.us-west-2.amazonaws.com/test/proxy/{0}".format(str(guid)), headers={'content-type':'application/json'}, data=json.dumps(data))
    ctx.log.info("script shutdown")
        
