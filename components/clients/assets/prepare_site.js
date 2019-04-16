$("<style type='text/css'> .shhigh{ border:1px solid blue;} </style>").appendTo("head");
var po = console.log;

$('*').mouseover(function(e) {
	e.stopPropagation();
	$('*').removeClass('shhigh');
	$(this).addClass('shhigh');

})

$(document).keydown(function(e) {
    if (e.shiftKey) {
        print_links($(this));
    }
});

function stripHTML(dirtyString) {
  var container = document.createElement('div');
  var text = document.createTextNode(dirtyString);
  container.appendChild(text);
  return container.innerHTML; 
}

function print_links(overObj){
	var outputStr = '';
	$('a',overObj).each(function(){
		outputStr += $(this).text().replace(/(?:\r\n|\r|\n|  )/g, '')+' : ' +$(this).attr('href') + ";\r";
	});
	po(outputStr);
}
