var validator_URLlistener = {
  QueryInterface: function(aIID)
  {
   if (aIID.equals(Components.interfaces.nsIWebProgressListener) ||
       aIID.equals(Components.interfaces.nsISupportsWeakReference) ||
       aIID.equals(Components.interfaces.nsISupports))
     return this;
   throw Components.results.NS_NOINTERFACE;
  },
  onLocationChange: function(aProgress, aRequest, aURI)
  {
    validator.validate(aURI);
  },

  onStateChange: function() {},
  onProgressChange: function() {},
  onStatusChange: function() {},
  onSecurityChange: function() {},
  onLinkIconAvailable: function() {}
};

var validator = {
    curr_page_URL: null,
    URL: "http://projectpossibility.org/projects/handicapannotate/dev/request.php",

    init: function() {
        // Listen for webpage loads
        gBrowser.addProgressListener(validator_URLlistener,
            Components.interfaces.nsIWebProgress.NOTIFY_STATE_DOCUMENT);
        //var appcontent = document.getElementById("appcontent");   // browser
        //appcontent.addEventListener("DOMContentLoaded", function() { validator.onPageLoad(); }, false);
    },
    uninit: function() {
        gBrowser.removeProgressListener(validator_URLlistener);
    },

//    onLoad: function(e) { // initialization code
//        this.initialized = true; //do something with this later
//        //this.strings = document.getElementById("handicapannotator-strings");
//    },
    display_cb: function(responsetxt) {
        alert("display_cb got " + responsetxt);
        var panel = document.getElementById("siteannotate-panel");
        //panel.setAttribute("label", "Accessibility errors: " + responsetxt);
        panel.setAttribute("label", "bobobobAccessibility errors: " + responsetxt);
    },
    validate: function(aURI) {
        if (aURI.spec == this.curr_page_URL //page did not change. don't re-validate
            || aURI.spec == "" //e.g. opened/switched to a new tab/window
            || ((aURI.spec.search(/http:\/\//) == -1)
                && (aURI.spec.search(/https:\/\//) == -1)))
            return;
        else {
            var pos = aURI.spec.search(/\?/);
            if (pos > 0)
                this.curr_page_URL = aURI.spec.substr(0, pos);
            else
                this.curr_page_URL = aURI.spec;
        }

        var xmlHttp = new XMLHttpRequest();
        if (xmlHttp == null) {
            alert ("Your browser does not support AJAX!");
            return;
        } 
        alert("curr_page_URL == " + this.curr_page_URL);
        var curr;
//        if (doc) {
//            alert("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
//            curr = doc.location;
//            alert("aaa: "+curr);
//        }
//        else {
//            alert("zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz");
//            curr = window.top.content.document.location;
//            alert("zzz: "+curr);
//        }
        curr = this.curr_page_URL;
        var param = "?url=" + curr + "&sid=" + Math.random();
        xmlHttp.onreadystatechange = function() { 
            if (xmlHttp.readyState == 4) {
                if (xmlHttp.status == 200) {
                    alert("status is 200");
                    validator.display_cb(xmlHttp.responseText);
                    alert("status was 200");
                }
                else
                    alert("2statechanged: " + xmlHttp.status);
            }
        };
        alert("about to open(" + this.URL + param + ")");
        xmlHttp.open("GET", this.URL + param, true);
        xmlHttp.send(null);
        alert("2345");
    },
//    onPageLoad: function(aEvent) {
//        alert("onpageload triggered");
//        var doc = aEvent.originalTarget; // doc is document that triggered "onload" event
//        alert(doc);
//        alert(doc.id);
//        validator.validate(doc);
//    },
};
//window.addEventListener("load", function(e) { validator.onLoad(e); }, false);
window.addEventListener("load", function(e) { validator.init(e); }, false);
window.addEventListener("unload", function(e) { validator.uninit(e); }, false);
