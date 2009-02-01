<html>
<head>
<script type="text/javascript">

var validator = "http://www.wave.webaim.com/report?url="

function validate()
{
   var current_pages_url=window.self.location.href; // get the current url
   current_pages_url=current_pages_url.replace("http://", "");   //get rid of "http://"
   var request_url = validator + current_pages_url;
   window.open(request_url); // open a new window with the combanation url
}

</script>
</head>

<body>
</body>
</html>