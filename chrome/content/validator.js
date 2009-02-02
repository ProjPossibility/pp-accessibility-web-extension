var validator_URLlistener = { // listens to changes in URL
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
    URL: //"http://projectpossibility.org/projects/handicapannotate/dev/request.php",
         "http://169.232.161.6/dev/request.php",

    init: function() {
        // Listen for webpage loads
        gBrowser.addProgressListener(validator_URLlistener,
            Components.interfaces.nsIWebProgress.NOTIFY_STATE_DOCUMENT);
    },
    uninit: function() {
        gBrowser.removeProgressListener(validator_URLlistener);
    },

    display_cb: function(responsetxt) { // callback to display to status bar
        //alert("display_cb got " + responsetxt);
        var panel = document.getElementById("siteannotator-panel");
        var image = document.createElement("image");
        image.setAttribute("width", "80");
        image.setAttribute("height", "16");
        if (responsetxt < 0) {
            panel.setAttribute("label", "Unvalidated");
            return;
        }
        else if (responsetxt <= 10)
            image.setAttribute("src", "chrome://siteannotator/skin/img/star_16_5.png");
        else if (responsetxt <= 25)
            image.setAttribute("src", "chrome://siteannotator/skin/img/star_16_4.png");
        else if (responsetxt <= 60)
            image.setAttribute("src", "chrome://siteannotator/skin/img/star_16_3.png");
        else if (responsetxt <= 200)
            image.setAttribute("src", "chrome://siteannotator/skin/img/star_16_2.png");
        else
            image.setAttribute("src", "chrome://siteannotator/skin/img/star_16_1.png");
        if (panel.hasChildNodes() ) {
            while (panel.childNodes.length >= 1 )
                panel.removeChild(panel.firstChild );       
        }
        panel.removeAttribute("label");
        panel.appendChild(image);
    },

    validate: function(aURI) {
        if (aURI.spec == this.curr_page_URL //page did not change. don't re-validate
            || aURI.spec == "" //e.g. opened/switched to a new tab/window
            || ((aURI.spec.search(/http:\/\//) == -1)
                && (aURI.spec.search(/https:\/\//) == -1))) {
            return;
        }
        else {
            var pos = aURI.spec.search(/\?/);
            this.curr_page_URL = pos > 0 ? aURI.spec.substr(0, pos) : aURI.spec;
            var panel = document.getElementById("siteannotator-panel");
            if (panel.hasChildNodes() ) {
                while (panel.childNodes.length >= 1 ) panel.removeChild(panel.firstChild );       
            }
            panel.setAttribute("label", "Unvalidated");
        }

        var xmlHttp = new XMLHttpRequest();
        if (xmlHttp == null) {
            alert("Your browser does not support AJAX!");
            return;
        } 
        //alert("curr_page_URL == " + this.curr_page_URL);
        var param = "?url=" + this.curr_page_URL + "&sid=" + Math.random();
        xmlHttp.onreadystatechange = function() { 
            if (xmlHttp.readyState == 4) {
                if (xmlHttp.status == 200) {
                    //alert("status is 200");
                    validator.display_cb(xmlHttp.responseText);
                }
                else
                    alert("statechanged error status: " + xmlHttp.status);
            }
        };
        //alert("about to open(" + this.URL + param + ")");
        xmlHttp.open("GET", this.URL + param, true);
        xmlHttp.send(null);
    },
};
window.addEventListener("load", function(e) { validator.init(e); }, false);
window.addEventListener("unload", function(e) { validator.uninit(e); }, false);
