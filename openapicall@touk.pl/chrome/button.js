const CORE_API = "https://developers.t-mobile.pl/api/"

const PERMISSION_LIST = CORE_API + "permission/list"     
const PERMISSION_GET = CORE_API + "permission/get"
const TELEPHONY_SETUP_CALL = CORE_API + "telephony/setup_call"
const PERMISSION_TIME = "10"

let prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService)
let branch = prefs.getBranch("extensions.openapicall.")

CustomButton = { 

1: function () { 

    let numberFrom = branch.getCharPref("number")
    let appcode = branch.getCharPref("appcode")
        
    let permissionList = PERMISSION_LIST + "?appkey=" + appcode + "&target=48" + numberFrom 
    let permissionGet = PERMISSION_GET + "?appkey=" + appcode + "&target=48" + numberFrom + "&permissions=call_on_behalf&period=" + PERMISSION_TIME   

    let telephonekind = branch.getIntPref("telephonekind")
   
    let numberNode

    if (telephonekind == 1)
        numberNode = document.getElementById("cvPhCellular").textContent
    else if (telephonekind == 2)
        numberNode = document.getElementById("cvPhWork").textContent
    else if (telephonekind == 3)
        numberNode = document.getElementById("cvPhHome").textContent

    if (numberNode != "") {
        let numberTo = numberNode.split(":")[1].trim()
        let telephonySetupCall = TELEPHONY_SETUP_CALL + "?appkey=" + appcode + "&from=48" + numberFrom + "&to=48" + numberTo   
        getHttp(permissionList, permissionGet, telephonySetupCall)
     } else
        alert("Numer telefonu nie jest zdefiniowany")
  }, 
}

function evaluateXPath(aNode, aExpr) {  
    let xpe = new XPathEvaluator();  
    let nsResolver = xpe.createNSResolver(aNode.ownerDocument == null ? aNode.documentElement : aNode.ownerDocument.documentElement);  
    let result = xpe.evaluate(aExpr, aNode, nsResolver, 0, null);  
    let found = [];  
    let res;  
    while (res = result.iterateNext())  
        found.push(res.textContent);  
    return found;  
} 

function callCallback(request, setupCallUrl, permissionGet) {
    if (request.readyState == 4) {
        if (request.status == 200) {
            let xPathResult = evaluateXPath(request.responseXML, "/api/request/permission/type/text()");
            if (xPathResult.indexOf("call_on_behalf") == -1) {
                alert("Nie wyraziłeś zgody na zestawianie połączeń")
                let callOnBehalf = new XMLHttpRequest()
                callOnBehalf.open('GET', permissionGet, true)
                callOnBehalf.send(null);
            } else {
                //alert("Można dzwonić" + setupCallUrl)
                let setupCall = new XMLHttpRequest();
                setupCall.open('GET', setupCallUrl, true)
                setupCall.send(null)
            }
       } 
   }
} 

function getHttp(permissionList, permissionGet, setupCallUrl) {
    let request = new XMLHttpRequest();
    request.open('GET', permissionList, true); 
    request.onreadystatechange = callCallback.bind(request, request, setupCallUrl, permissionGet);
    request.send(null); 
}

