var Crawler = function() {

	/**
	*	get channel data from api and run getLinks()
	**/
	var crawlChannel = function(channelId) {
		$.ajax({url : "/?page=crawler&task=api&action=get_crawl_tmplates", data : { channel_id : channelId} })
			.done(function(response){
				if (response) {
					var channel_url 		= response.channel_url;
					var links_template 		= unescape(response.links_template);
					var article_template 	= unescape(response.article_template);
					//po(channel_url, links_template,article_template);
					getLinks(channelId, channel_url, links_template);
				}
			});
	}

	/**
	*	crawl to channel address and get article links from it
	**/
	var getLinks = function(channelId, channel_url, links_template){
		var url = encodeURIComponent(channel_url);
		$.ajax({url : url})
			.done(function(response) {
				var body_DOM = $(response);
				var fn = links_template;
				eval(fn);

				var links = links_template(body_DOM);
				$.map( links, function( link, i ) {	/// if links are relative vhange it to full links
					links[i] = (new URL(link,channel_url)).href;
				});
				po(links);
				filterLinks(links);
			});
	}

	/**
	*	send links to api and get from it only new links to crawl
	**/
	var filterLinks = function (channelId, links) {
		$.ajax({url : "/?page=crawler&task=api&action=filter_links", data : { "channel_id" : channelId, "links" : JSON.stringify(links)} })
			.done(function(response){
				if (response) {
					po(response);
				}
			});		
	}


	/**
	*	
	**/
	var crawlItem = function(){
		$.ajax({url : "/?page=crawler&task=api&action=get_crawl_channel", data : { } })
			.done(function(response){
				po(response);
			});

	}
	/**
	*	
	**/

    return {
        init: function() {
        },
        crawlChannel : crawlChannel,
        crawlItem : crawlItem
    };
}();

// Class initialization on page load
/*jQuery(document).ready(function() {
    Crawler.init();
});*/

/*
tool for create templates
var jq = document.createElement('script');
jq.src = "https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js";
document.getElementsByTagName('head')[0].appendChild(jq);
jq.onload = function() {
	$ = jQuery.noConflict();
	
	$('body').append('<div id="shloader"></div>');$('#shloader').load('https://devm.shortease.com/components/shcr/crTemplatePrepare.php');
}
	

load ui before :
$('head').append('<link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css" type="text/css" />');
$.getScript('https://code.jquery.com/ui/1.12.1/jquery-ui.js').done(function( script, textStatus ) {
  });
====
  
    $( "#dialog" ).dialog({dialogClass: 'fixed-dialog', height:300});
*/
/*
get current page on ajax

var body_DOM;
$.ajax(location.href).done(function(data) { body_DOM = $(data);})
*/

/*
var bodyHtml; $.ajax({url:"http://www.shortease.com/shop/jewelry/"}).done(function(data){bodyHtml = data;});

var jq = document.createElement('script');
jq.src = "https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js";
document.getElementsByTagName('head')[0].appendChild(jq);

jq.onload = function() {
	erJq = jQuery.noConflict();
	erJq.getScript({url : "//m.shortease.com/components/shcr/shcr_prepare.php", data : { host:window.location.host.replace('www.',''), action:"getCrawlerItem", repeat :0 } })
			
}


*/