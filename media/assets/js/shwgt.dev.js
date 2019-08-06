po = console.info;
var er_template;
var MEDIA_PATH = "//m.shortease.com/media/";
var REP_PATH = "//rep.shortease.com/";

var er_stories = function(options){
	self = this;
	this.shift_step = 3000;
	this.shift_delay = 160;
	var numOfArticles = 0;
	this.art_shifter = {};
	this.cur_template = 0;
	this.cur_position = 0;
	
	this.shift_prev = function (item_obj){
		var first_li = item_obj.find('.er_prev').first();
		var item_height = first_li.innerHeight();
		var cur_margin = parseInt(first_li.css('margin-top'));
		var margin_ix = -parseInt(cur_margin/item_height);
		var cloned_first;
		
		margin_ix++;
		
		/// prepare move to first element
		if (margin_ix > item_obj.find('.er_prev').length-1) {
			cloned_first = first_li.clone().css('margin-top','0px');
			cloned_first.appendTo( item_obj );
		}
		
		first_li.animate({ 'marginTop': -1*margin_ix*(item_height+3)+'px'}, 500, 
				function() {
					/// if first element cloned - move to real first element and remove clonend one
					if (cloned_first) {
						first_li.css('margin-top','0px');
						cloned_first.remove();
					}					
				}
			);
	}

	this.shift_items = function(){
		var items = $('.er_item_list').not(".open" );
		var cur_delay = 0;
		$(items).each(function(){ 
				var cur_item = $(this);
				setTimeout(function() { self.shift_prev(cur_item); }, cur_delay);
				cur_delay += self.shift_delay;
			});
		setTimeout(self.shift_items, self.shift_step);
	}
	
	this.create_elements = function() {
		numOfArticles = st_tools.length;
		for(i=0;i<st_tools.length;i++){
			if (st_tools[i]['tool_script']) {
				st_tools[i]['pictures'] = st_tools[i]['tool_script']['pictures'];
				st_tools[i].title = st_tools[i]['tool_script'].title;
				st_tools[i].subTitle = st_tools[i]['tool_script'].subTitle;
				st_tools[i].price = st_tools[i]['tool_script'].price;
				st_tools[i].price = st_tools[i].price ? st_tools[i].price : "";
			}
			/*var toolScript = st_tools[i]['tool_script'];
			st_tools[i]['title_el'] = $('<div class="er_art_title">'+toolScript['title']+'</div>');
			st_tools[i]['sub_title_el'] = $('<div class="er_art_sub_title">'+toolScript['subTitle']+'</div>');

			var pictures = toolScript['pictures'];
			st_tools[i]['pictures'] = [];
			for(j=0;j<pictures.length;j++){
				var picture = [];
				picture['img'] = $('<img class="er_art_picture" src="'+pictures[j]['address']+'"/>');
				picture['capture'] = $('<div class="er_art_picture_text">'+pictures[j]['text']+'</div>');
				st_tools[i]['pictures'].push(picture);
			}*/
		}
	}
	this.add_ad = function() {
		if (self.ad_freq_art_every < 2) return; 
		for(i=0;i<st_tools.length;i++){
			if (i % self.ad_freq_art_every == 0) {
				var ad_tool = {
					type:'ad',
					tool_script : {pictures:[]}
				}
				st_tools.splice(i, 0, ad_tool);
			}
		}
	}	

	this.add_arrows = function() { 
		if (self.arrows_navigate == 1) {	//// only ads
			var arrows_holder = $('.er_pic_holder.er_ad');
		}
		if (self.arrows_navigate == 2) {	//// every picture
			var arrows_holder = $('.er_pic_holder');
		}
		arrows_holder.append('<div class="er_arrow er_right"></div><div class="er_arrow er_left"></div>');
	}
	
	var startTouchX = 0;
	this.build_articles = function(){
		if (er_template) er_template = new er_template();
		var er_articles_holder = $('<div class="er_articles_holder"></div>'); 
		$('body').append("<div class='close_x' ><img src='"+MEDIA_PATH+"images/sh_x_1.png' /></div>");
		$('.close_x').click(function() {
			self.holder.removeClass('open');
			if (self.target_holder_prepend)	self.target_holder.prepend(self.holder);
			else self.target_holder.append(self.holder);			
			$('.close_x').removeClass('open');
			self.art_shifter.pause();
			$('.er_articles_holder').hide();
		} );
		self.holder.append(er_articles_holder);
		er_articles_holder.css({'width':(st_tools.length*100)+'%'});

		for(i=0;i<st_tools.length;i++)
		{
			var curTool = st_tools[i];
			if (!curTool.tool_script) continue;
			var er_article_holder = $('<div class="er_article_holder" data-artix="'+i+'"></div>');
			er_article_holder.width(self.width+'px');
			if (curTool.type == 'ad') { 
				var er_ad_pic_holder = $('<div class="er_pic_holder er_ad" data-artix="'+i+'" data-picix="0"></div>');
//				er_ad_pic_holder.append("<iframe id='er_p_77066_865' name='er_p_77066_885' src='http://rep.erate.co.il/?t=if&pid=77066&m=8&rnd=RANDOM_STRING_HERE&erprm=&rdclick=' allowtransparency='true'  frameborder='0' scrolling='no' style='width:100%; height:100%' width='100%' height='100%'> </iframe> ");
				//er_ad_pic_holder.load("http://rep.erate.co.il/?t=js&pid=77066&m=8");
/*				
				var ifr = document.createElement('iframe');
				ifr.src = 'http://devrep.eratead.com/?t=per&d=js&m=8&perId='+self.ad_placement_id+'&rnd=RANDOM_STRING_HERE&rdclick=';
				ifr.width = "100%";
				ifr.height = "100%";				
				er_ad_pic_holder.append(ifr);
				*/
				er_article_holder.append(er_ad_pic_holder);
			} else if (er_template)
			{
				er_template.prepare_tool(curTool);
			}
			er_articles_holder.append(er_article_holder);
			if (curTool.pictures) {
				if (!self.normalize) self.getRandTemplte();
				for(j=0;j<curTool.pictures.length;j++){
					if (self.normalize) self.getRandTemplte();
					var turn_class = self.turn_title ? "er_rotate" : "";
					var cur_tool_id = st_tools[i].toolId;
					var er_pic_holder = $('<div class="er_pic_holder er_tmpl_'+self.cur_template+' pos_'+self.cur_position+' '+turn_class+'" data-artix="'+i+'" data-picix="'+j+'" data-arturl="'+curTool['url']+'" data-toolid="'+curTool['toolId']+'"></div>');
					if (j==0) {	/// display first picture
						er_pic_holder.addClass('er_curr').addClass('er_showing');
					}
					er_article_holder.append(er_pic_holder);
					var curPic = curTool.pictures[j];

					if (er_template)
					{
						er_template.build_picture(curTool, curPic, er_pic_holder);
					} else 
					{
						//er_pic_holder.append('<img src="'+MEDIA_PATH+'/images/shorties/back'+ (Math.floor(Math.random() * 4) + 1) + '.png" class="er_back_img" />');
						/*if (!self.normalize) {
							er_pic_holder.append('<div class="er_art_title"><span class="text_holder">'+curTool['title']+'</span><span class="text_holder description">'+ curTool['subTitle']+'</span></div>');
						}*/
						var imgHolder = $('<div class="er_img_holder"></div>');
						var foreImg = $('<img src="'+curPic.address+'" />');//curPic.img.clone();
						foreImg.addClass('er_fore_img');//er_art_picture
						imgHolder.append(foreImg);
						/*var textPls = ['lt','rt'];
						var textPl = textPls[Math.floor(Math.random()*textPls.length)];
						if (curPic.text) {
							imgHolder.append($('<div class="er_art_picture_text">'+curPic.text+'</div>').addClass(textPl));
						}*/
						er_pic_holder.append(imgHolder);
						/*var articleLink ;
						if (self.show_link && curTool['url'].length > 8) {
							articleLink = "<div class='new_window_link'><img src='"+MEDIA_PATH+"images/sh_new_window_1.png' /></div>";
							//articleLink = "<a href='"+curTool['url']+"' class='new_window_link'></a>";
							$(articleLink).click(function() { self.report(self.placement_id, cur_tool_id, 2, 1); } );
						}*/
						/*var pic_txt = curTool['subTitle'];
						var txt_class = "er_art_sub_title";
						if (self.normalize) {
							pic_txt = curTool.subTitles_arr[j%curTool.pictures.length];
							if (j==0 || !pic_txt) {
								txt_class = "er_art_title";
								pic_txt = curTool.subTitles_arr[0];
							}
						}*/
					
						//er_pic_holder.append('<div class="er_art_sub_title"><span class="text_holder">'+curTool['subTitle']+ articleLink+'</span></div>');
						/*if (pic_txt) {
							er_pic_holder.append('<div class="'+txt_class+' new_window_text_link"><span class="text_holder">'+ pic_txt + articleLink+'</span></div>');
						}*/
						var details_holder = $('<div class="sh_art_details"></div>');
						var title_text = $('<div class="text_holder sh_title">'+curTool['title']+'</div>');
						var desc_text = $('<div class="text_holder sh_description">'+curTool['subTitle']+'</div>');
						var price_text = $('<div class="text_holder sh_price"><span class="pr_text">Price : </span><span class="pr_val">'+curTool['price']+'</span></div>');
						var buttons_holder = $('<div class="sh_buttons_holder"></div>');
						var btn_show_description = $('<div class="btn_show_descr">i</div>');
						var btn_show_product = $('<div class="btn_show_product">Buy</div>');
						buttons_holder
									.append(btn_show_product)
									.append(btn_show_description);
						details_holder
									.append(title_text)
									.append(desc_text)
									.append(price_text)
									.append(buttons_holder);
						er_pic_holder.append(details_holder);
						btn_show_product.click(function(e) { 
							e.preventDefault();
							e.stopPropagation();
							location.href = curTool['url'];
						});
					}				
				}
			}

			self.art_shifter.build(er_article_holder, curTool.pictures ? curTool.pictures.length : 1);
		}

		self.setOpenArticle();
		/// prevent context menu on tap for pause
		$('.er_pic_holder').contextmenu(function(){
			return false;
		});
		$('.er_pic_holder').click(function(event) {
			var holder = $(this);
			setTimeout(function(){ 
					self.navigatePictures(event, holder); 
				} , 10 );
		});
		$('body').on({ 'touchstart' : function(){ 
			startTouchX = event.touches[0].pageX; 
			self.art_shifter.pause();
		} });
		$('body').on({ 'touchmove' : function(e){ 
			var xChange = e.originalEvent.changedTouches[event.changedTouches.length-1].pageX - startTouchX;
			var artIx =$('.er_pic_holder.er_showing').data('artix');
			var shift_to_art_ix = artIx + (xChange>0 ? -1 : 1);
			if (Math.abs(xChange) > 20) {
				self.prepareNextArticle(shift_to_art_ix);
			}
		} });
		$('body').on({ 'touchend' : function(e){
			self.art_shifter.unpause();
			var xChange = e.originalEvent.changedTouches[event.changedTouches.length-1].pageX - startTouchX;
			if ( Math.abs(xChange) == 0 ) return;
			//var artIx = $(this).data('artix'); 
			var artIx =$('.er_pic_holder.er_showing').data('artix');
			if (self.holder.hasClass('open') && typeof artIx != 'undefined'){ 
				var shift_to_art_ix = artIx + (xChange>0 ? -1 : 1);
				if (Math.abs(xChange) > 100) {
					self.shiftArticlesAnimation(shift_to_art_ix, 0, 300);
					
				} else {
					self.shiftArticlesAnimation(artIx, 0, 200);
				}
				startTouchX = 0; 
				if (self.art_shifter) 
				{
					self.art_shifter.unpause();
				}
			}			
		} });
		$('body').on({ 'touchmove' : function(){ if (self.holder.hasClass('open') ) self.navigatePictures(event, $('.er_pic_holder.er_showing')); } });
		$('.btn_show_descr').on('click',function(e) {
			var article_holder = $(this).closest('.er_article_holder')
			if (!article_holder.data('descr_open')){
				article_holder.find('.sh_description').show();
				article_holder.data('descr_open',1);
				self.art_shifter.pause();
			} else {
				article_holder.find('.sh_description').hide();
				article_holder.data('descr_open',0);
				self.art_shifter.unpause();
			}
			self.showCoupon(article_holder);
			e.preventDefault();
			e.stopPropagation();
		});		
	}
	this.showCoupon = function(holder){
		var COUPON_FREQUENCY = 1;
		if (holder.data('has_coupon')) return;
		/// get random for coupon display frequency
		var freq_random = Math.ceil(Math.random()*COUPON_FREQUENCY);
		if (freq_random != COUPON_FREQUENCY) {
			holder.data('has_coupon',1)
			return;
		}
		var sum_weights = 0;
		for (var i=0;i<sh_channel_coupons.length;i++) sum_weights += 1*sh_channel_coupons[i].weight;
		var rand_weight = Math.ceil(Math.random()*sum_weights);
		var cum_weight = 0, selected_coupon = null;
		for (var i=0;i<sh_channel_coupons.length;i++) {
			cum_weight += 1*sh_channel_coupons[i].weight;
			if (!selected_coupon && cum_weight >= rand_weight) selected_coupon = sh_channel_coupons[i];
		}
		selected_coupon.code = atob(selected_coupon.code)
		var coupon_name = $('<div class="sh_coupon_name">Click for '+selected_coupon.name+'</div>');
		var coupon_code = $('<div class="sh_coupon_code">'+selected_coupon.code+'</div>');
		var coupon_holder = $('<div class="sh_coupon_holder"></div>');
		coupon_holder.append(coupon_name);
		coupon_holder.append(coupon_code);

		setTimeout(function() {
						holder.append(coupon_holder);
						coupon_holder.animate({ top: '10%' }, 400, function() {  });
					}, 1000);
		$(document).on('click',coupon_holder, function() {
			coupon_code.show();
			if (!$('#select_holder').length) $('body').append('<input type="hidden" name="select_holder" id="select_holder" value="" style="display:none">');
			$('#select_holder').val(selected_coupon.code);
			$('#select_holder')[0].select();
			document.execCommand("copy");
		});
		holder.data('has_coupon',1);
		return;
	}
	this.setOpenArticle = function(){ 
		var link_targets;
		if (self.show_link) {
			link_targets = '.new_window_link';
		}
		if (self.text_link) {
			link_targets += ', .new_window_text_link';
		}
		
		$(link_targets).click(function(e) {
			e.stopPropagation();
			var picholder = $(this).closest('.er_pic_holder');
			var art_url = picholder.data('arturl');
			var cur_tool_id = picholder.data('toolid');
			self.report(self.placement_id, cur_tool_id, 2, 1);
			window.location.replace(art_url);
		});
	}

	this.navigatePictures = function(e, picHolderObj) { 
		//e.preventDefault();
		var artIx = picHolderObj.data('artix');
		var picIx = picHolderObj.data('picix');
		if (e.type == 'click'){	
			var x = e.clientX;
			var nextPicIx = picIx + (x >= self.width/2 ? 1 : -1);
			self.showPicture(artIx, nextPicIx);
		}
		if (e.type == 'touchmove'){	
			if (self.art_shifter) 
			{
				self.art_shifter.pause();
			}	
			var xChange = e.touches[0].pageX - startTouchX;
			self.shiftArticles(artIx, xChange, 0);
		}
	}
	
	var curArtIx = 0;
	var curPicIx = 0;
 
	this.showPicture = function (artIx, picIx){ 
		if (artIx < 0) artIx = 0;
		if (artIx >= self.numOfArticles) self.numOfArticles = 0;
		curArtIx = artIx;
		curPicIx = picIx;

		if (picIx < 0){	//// show previos article
			if (artIx > 0) {
				self.prepareNextArticle(artIx-1);
				self.shiftArticlesAnimation(artIx-1, 0, 400);
				self.showPicture(artIx-1,0);
			}
			return;
		}
		if (typeof st_tools[artIx] == 'undefined' || typeof st_tools[artIx].pictures == 'undefined' || picIx >= st_tools[artIx].pictures.length) { 
			if (artIx < st_tools.length - 1) {
				self.prepareNextArticle(artIx+1);
				self.shiftArticlesAnimation(artIx+1, 0, 400);
				self.showPicture(artIx+1,0);
			}
			return;
		}
		/*if (st_tools[artIx].artAutoshift) {
			st_tools[artIx].artAutoshift.fill_item(picIx);
		}*/	
		if (self.art_shifter) 
		{
			self.art_shifter.fill($('.er_article_holder[data-artix='+artIx+']'), picIx, 0);
		}
		$('.er_pic_holder[data-artix="'+artIx+'"]').removeClass('er_curr');
		var curPic = $('.er_pic_holder[data-artix="'+artIx+'"][data-picix="'+picIx+'"]');
		$('.er_pic_holder').removeClass('er_showing');
		curPic.addClass('er_curr').addClass('er_showing');
/*		var curForeImg = curPic.find('.er_fore_img');
		
		curForeImg.css({right:(curForeImg.width()-$(window).width())/-2+'px'});
		*/
		er_orientation.save_position();
	}
	
	this.showNextPicture = function() {
		self.showPicture(curArtIx, curPicIx+1);
	}
	
	this.prepareNextArticle = function(artIx) {
		//// find first picture holder of next article
		var art1PicHolder = $($('.er_pic_holder[data-artix='+artIx+']')[0]);
		//// if it is ad holder and not ready yet
		if (art1PicHolder.hasClass('er_ad') && !art1PicHolder.hasClass('er_ad_ready')){
			//// remove ready mark from other pictures
			$('.er_pic_holder').removeClass('er_ad_ready');
			//// mark holder as ad ready
			art1PicHolder.addClass('er_ad_ready');
			
			po("add ad");
			//art1PicHolder.append($('#pl_holder'));
			//ervpl.getVASTfromURL("//ssp.lkqd.net/ad?pid=286&sid=619409&output=vast&execution=any&placement=&playinit=auto&volume=100&width=[WIDTH]&height=[HEIGHT]&dnt=[DO_NOT_TRACK]&gdpr=[GDPR]&gdprcs=[GDPRCS]&pageurl=[PAGEURL]&contentid=[CONTENT_ID]&contenttitle=[CONTENT_TITLE]&contentlength=[CONTENT_LENGTH]&contenturl=[CONTENT_URL]&rnd=[CACHEBUSTER]");			


			var ifr = document.createElement('iframe');
			ifr.src = 'http://devrep.eratead.com/?t=per&d=if&m=8&perId='+self.ad_placement_id+'&rnd=RANDOM_STRING_HERE&rdclick=';
			ifr.width = "100%";
			ifr.height = "100%";				
			art1PicHolder.append(ifr);
			
		}
	}
	
	var prev_move_pixel = 0;
	var prev_move_art_ix = 0;
	this.shiftArticles = function(artIx, movePixel, timeToComplete){
		if (artIx <= 0 && movePixel > 20) return;
		if (artIx >= numOfArticles-1 && movePixel < -20) {
			movePixel = 0;
			artIx = numOfArticles-1;
		}
		curArtIx = artIx;
		curPicIx = 0
		if (artIx < 0 || artIx >= numOfArticles || !st_tools[artIx]) return;
		self.report(self.placement_id, st_tools[artIx]["toolId"], 1, 1);

		if (st_tools[artIx].artAutoshift) {
			st_tools[artIx].artAutoshift.fill_item(0);
		}
		if (this.art_shifter) 
		{
			self.art_shifter.fill($('.er_article_holder[data-artix='+artIx+']'), 0, 0);
		}		
		var STEP_TIME = 10;
		var movePerc = (movePixel/self.width)*100
		var curArt = $('.er_article_holder[data-artix="'+artIx+'"]');
		var nextArt = $('.er_article_holder[data-artix="'+(artIx+(movePerc >=0 ? -1 : 1))+'"]');
		/*if (timeToComplete && timeToComplete > STEP_TIME-1){	//// create steps
			var endMovePixel = movePixel ? movePixel : prev_move_pixel;
			endMovePixel = endMovePixel - (endMovePixel / (timeToComplete/STEP_TIME));
			setTimeout( function() { self.shiftArticles(artIx, endMovePixel, timeToComplete- STEP_TIME); } ,STEP_TIME );
		}*/
		if (!self.holder.hasClass('open')) {
			$('.er_articles_holder').show();
			self.holder.addClass('open');
			$('body').prepend(self.holder);
			$('.close_x').addClass('open');
		}
		
		var coef = 0.920;
		var translateY = 20*(movePerc <50 ? movePerc : 50)/100;
		var translateZ = -Math.abs(translateY)*coef;
		var nextTranslateY= -20*(movePerc <50 ? 50 : (100 - movePerc))/100*(movePerc >=0 ? 1 : -1);
		var nextTranslateZ= nextTranslateY*coef*(movePerc >=0 ? 1 : -1);
		//curArt.css({'transform': 'translateZ('+translateZ+'vw) rotateY('+translateY+'deg)'});
		//nextArt.css({'transform': 'translateZ('+nextTranslateZ+'vw) rotateY('+nextTranslateY+'deg)'});
		
		//setTimeout(function() {$('.er_articles_holder').css({'left': -1*(artIx)*self.width + movePixel + 'px'});} , 20);
		
		$('.er_articles_holder').css({'left': -1*(artIx)*self.width + movePixel + 'px'});
		prev_move_pixel = movePixel;
		prev_move_art_ix = artIx;

		$('.er_pic_holder ').removeClass('er_showing');
		//$('.er_pic_holder').removeClass('er_curr');
		$(curArt.find('.er_pic_holder ').get(0)).addClass('er_curr').addClass('er_showing');
	}
	
	this.shiftArticlesAnimation = function (artIx, movePixel, timeToComplete){
		var STEP_TIME = 10;
		var startPixel = -parseInt($('.er_articles_holder').css('left'));
		if (startPixel < 0) startPixel = 0;
		var endPixel = (self.width * artIx + movePixel);
		if (endPixel > self.width * (numOfArticles - 1)) endPixel = self.width * (numOfArticles - 1);
		var pixelShift = startPixel - endPixel;
		var curArtIx = (startPixel - startPixel % self.width)/self.width;
		//startPixel = startPixel % self.width;
		var numOfSteps = timeToComplete/STEP_TIME;
		var curPixels = 0;
		for (i = 0; i<numOfSteps; i++)
		{	
			if (pixelShift > 0)
			{
				startPixel = startPixel - Math.abs(pixelShift/numOfSteps);
				if (startPixel < 0) 
				{
					startPixel = self.width;
					curArtIx = artIx ;
				}
			} else 
			{
				startPixel = startPixel + Math.abs(pixelShift/numOfSteps);
			}
			let _i = i, _curArtIx = curArtIx, _startPixel = -Math.abs(startPixel);//pixelShift > 0 ? -startPixel : startPixel;
			//setTimeout (function() { self.shiftArticles(_curArtIx, _startPixel, 0); }, STEP_TIME*_i);
			setTimeout (function() { $('.er_articles_holder').css({'left':_startPixel+'px'}); }, STEP_TIME*_i);
//self.shiftArticles(curArtIx, pix, 0);
		}
		setTimeout (function() { 
				self.shiftArticles(artIx, movePixel, 0); 
				$('.er_article_holder').css({'transform': 'translateZ(0vw) rotateY(0deg)'});}, 
			timeToComplete+STEP_TIME);
		//self.shiftArticles(artIx, 0, 0);
	}
	
	this.create_holder = function() {
		self.target_holder = $(self.target_holder);
		if ($('#er_shrt_holder').length == 0) {
			var shrt_holder_txt = "<div class='er_shrt_holder' id='er_shrt_holder'></div>";
			if (self.target_holder_prepend)	self.target_holder.prepend(shrt_holder_txt);
			else self.target_holder.append(shrt_holder_txt);
		}
		self.holder = $('#er_shrt_holder');
	}
	this.build_preview = function(){
		var prevHolder = $('<div class="er_prev_holder"></div>');
		self.holder.append("<img class='er_sh_logo' src='"+MEDIA_PATH+"images/logobl.png' />");
		var prevTextsHolder = $('<div class="er_pr_texts_holder"></div>');
		self.holder.append(prevHolder);
		for(i=0;i<st_tools.length;i++){
			if (st_tools[i].type != 'ad' && st_tools[i].title ) {
				var stList = $('<ul id="er_item_'+i+'" data-ix="'+i+'" class="er_item_list"></ul>');
				prevHolder.append(stList);
				if (self.preview_texts) {	/// add preview texts under the image , 
					var stPrList = $('<div class="er_pr_text">'+st_tools[i].title.replace('"','').replace("'","").replace(':','').replace(',','').replace('.','') +'</div>'); 
					prevTextsHolder.append(stPrList);
				}
				var pictures = st_tools[i]['pictures'];
				if (pictures) {
					for(j=0;j<pictures.length;j++){
						var tmpLi = $('<li class="er_prev"></li>')
						tmpLi.append('<img class="er_art_picture" src="'+pictures[j]['address']+'"/>');
						stList.append(tmpLi);
					}
				}
			}
		}
		if (self.preview_texts) {				
			prevHolder.append(prevTextsHolder);
		}
		$('.er_item_list').click(function() { 
				self.shiftArticles($(this).data('ix'),0,0);
				if (!self.normalize) {
					self.place_texts();
				}
				self.report(self.placement_id, sh_tool_id, 2, 1);
				self.art_shifter.unpause();
				//self.showArticle($(this).data('ix'), 0);
			} );
	}

	this.getRandTemplte = function(){
		var cur_temp = 0;
		if (self.templates_map.length < 2) {
			cur_temp = 1;
		} else {
			while (cur_temp == 0 || (cur_temp == self.cur_template)){
				cur_temp = getRandMap(self.templates_map);
			}
		}
		self.cur_template = cur_temp;
		var cur_pos = 0;
		if (self.positions_map.length < 2) {
			cur_pos = 1;
		} else {
			while (cur_pos == 0 || cur_pos == self.cur_position){
				cur_pos =  getRandMap(self.positions_map);;
			}
		}
		self.cur_position = cur_pos;
		if (self.text_tilt_random) {
			self.turn_title = (Math.ceil(Math.random()*self.text_tilt_random) == 1);
		}

		function getRandMap(arr) {
		   return arr[Math.floor(Math.random() * arr.length)];
		}
	}
	
	this.place_texts = function(){
/*		var TEXTS_GAP = 20;
		var sub_title_top;
		$('.er_pic_holder').each(function() {  /// set gap between two titles
			if (!$(this).hasClass('er_tmpl_1')) { 	/// template 1 has fixed possitions
				var title = $('.er_art_title', $(this));
				var title_top = parseInt(title.css('top'));
				var sub_title = $('.er_art_sub_title', $(this));
				sub_title_top = title.height() > 0 ? (title_top +title.height()+TEXTS_GAP) + 'px' : sub_title_top;
				sub_title.css({'top':sub_title_top});
			}
		});*/
	}
	
	this.debug = function (message, overwrite = 1){
		var debugDiv = document.getElementById("debugdiv");

		if (!debugDiv) {
			debugDiv = document.createElement('div');
			debugDiv.id = 'debugdiv';
			debugDiv.style.width = '30%';
			debugDiv.style.height = '20%';
			debugDiv.style.position = 'fixed';
			debugDiv.style.zIndex = 100000;
			debugDiv.style.color= "red";
			debugDiv.style.top = 0;
			debugDiv.style.left = 0;
			document.body.appendChild(debugDiv);
		}
		if (overwrite) {
			debugDiv.innerHTML = message;
		} else {
			debugDiv.innerHTML += '<br>'+ message;
		}
	}
	
	this.sendedEvents = [];
	this.report = function(pl_id,t_id, event_type, onlyOnce){
		if (!pl_id || !t_id) return;
		var pixel_src = REP_PATH+"?t=rep&pid="+pl_id+"&tid="+t_id+"&et="+ (typeof event_type != "undefined" ? event_type : 1) + "&rn=" + parseInt(Math.random()*99999);  
		var pixelObj =  document.createElement("IMG");
		var flowNum = pl_id+"_"+t_id+"_"+event_type;
		if(!onlyOnce || self.sendedEvents.indexOf(flowNum) < 0) {
			pixelObj.src = pixel_src;
			/// save sended flow once
			if (self.sendedEvents.indexOf(flowNum) < 0 ){
				self.sendedEvents.push(flowNum);
			}
		}
	}

	
	var curPreviewLeft = 0, shift = 0;
	this.interaction = function() { 
		var yChange = 15-erOrientationData.yChangeAng/2;
		yChange = yChange < 0 ? 0 : yChange > 28 ? 28 : yChange;
		var curImage = $('.er_curr.er_showing .er_fore_img');
		var MAX_MOVE = 40;
		if (!erOrientationData.yChangeAng) erOrientationData.yChangeAng = 0;
		var movePer = (erOrientationData.yChangeAng/MAX_MOVE*50+50)/100;
		movePer = movePer > 1 ? 1 : movePer < 0 ? 0 : movePer;
		var shoulderWidth = (curImage.width() - $(window).width());
		//self.debug(shoulderWidth);
		if (self.dir == 'ltr') {
			$('.er_fore_img').css({'left':0});
			curImage.css({'left':(-(movePer*shoulderWidth)) +'px'});
		} else {
			$('.er_fore_img').css({'right':0});
			curImage.css({'right':(-(movePer*shoulderWidth)) +'px'});
		}		
		var er_prev_holder = $('.er_prev_holder');
		/************/
		if (erOrientationData.xChangePx ) {
			shift = curPreviewLeft + erOrientationData.xChangePx;
			/// stop shifting on edges
			if (shift > 20) shift = 20;
			self.itemWidth = $('.er_item_list').outerWidth(true);
			if (shift < -1*(self.itemWidth*numOfArticles - self.width + 20)) shift = -1*(self.itemWidth*numOfArticles - self.width + 20);
			er_prev_holder.css({'left':(shift)+'px'});
		} else {
			curPreviewLeft = shift ;
		}
		//curPreviewLeft = shift;
		/*************/
		/*
		if (erOrientationData.xChangePx != 0 || erOrientationData.yChangePx != 0) 
		{
			if (!self.holder.hasClass('open')) 
			{
				var addShift = (Math.abs(erOrientationData.xChangePx) > Math.abs(erOrientationData.yChangePx)) ? erOrientationData.xChangePx : erOrientationData.yChangePx;
				var shift = curPreviewLeft + addShift;
				shift = -shift > (er_prev_holder.width() - $(window).width()+20) ? -(er_prev_holder.width() - $(window).width()+20) : shift > 20 ? 20 : shift;
				er_prev_holder.css({'left':(shift)+'px'});
			}
			
		} else 
		{
			curPreviewLeft = parseInt(er_prev_holder.css('left'));
		}
		*/
		var pixLeft = Math.abs(parseInt($('.er_articles_holder').css('left')))
		if (self.holder.hasClass('open') && pixLeft%$(window).width() >8)
		{
			var artLeft = pixLeft/$(window).width();
			var leftMoveIx = Math.floor(artLeft);
			var rightMoveIx = Math.ceil(artLeft);
			var leftArt = $($('.er_article_holder').get(leftMoveIx));
			var rightArt = $($('.er_article_holder').get(rightMoveIx));
			var viewPosition = (artLeft-leftMoveIx)*100;
			var perspectiveLength = 600+ Math.abs(numOfArticles*$(window).width()/2- pixLeft)/1.2;
			$('.er_articles_holder').css('perspective',perspectiveLength+'px');
			var translateY = -50*viewPosition/100;
			var nextTranslateY= 50*(100 - viewPosition)/100; 
			leftArt.css({'transform': 'rotateY('+translateY+'deg)', 'transform-origin': 'right'});
			rightArt.css({'transform': 'rotateY('+nextTranslateY+'deg)', 'transform-origin': 'left'});
		}

		requestAnimationFrame(self.interaction);
	} 
	//*******
	//** if pictures less then 3 and long subtitle or short subtitle and lot of pictures 
	//** cat long subtitle to array of sentences or dublicate pictures 
	//*******
	this.normalize_subtitles_pictures = function(){
		for (i=0;i<st_tools.length;i++){
			var cTool = st_tools[i];
			if (cTool.tool_script) {
				cTool.subTitles_arr = [];
				cTool.subTitles_arr[0] = cTool.tool_script.title;
				var wordsSplit =  cTool.tool_script.subTitle.split(" ");
				if (wordsSplit.length > self.max_subtitle_words) {
					for (j=0;j < wordsSplit.length;j=j+self.max_subtitle_words){
						var shortSubtitle = '';
						for (k=j;k<j+self.max_subtitle_words && k<wordsSplit.length;k++){
							shortSubtitle += ' '+ wordsSplit[k];
						}
						cTool.subTitles_arr.push(shortSubtitle);
					}
				}
				var pics = cTool.tool_script.pictures;
				var startPicsLengs = pics.length;
				/// if there are more texts than pictures dublicate pictures
				if (cTool.subTitles_arr.length > pics.length){
					for (j=startPicsLengs;j<cTool.subTitles_arr.length;j++){
						pics[j] = jQuery.extend({}, pics[j%startPicsLengs]); 
					}
				}
				st_tools[i].tool_script.pictures = pics;
			}
		}
	}

	this.width;
	this.orientation;
	this.init = function(options){ 
		er_orientation.init();

		self.placement_id = typeof options.placement_id != 'undefined' ? options.placement_id : 0 ;
		self.ad_placement_id = typeof options.ad_placement_id != 'undefined' ? options.ad_placement_id : 0 ;
		self.target_holder = typeof options.target_holder != 'undefined' &&  options.target_holder.length > 0 ? options.target_holder : 'body' ; 	//// target to add shorties
		self.target_holder_prepend = typeof options.target_holder_prepend != 'undefined' ? options.target_holder_prepend : 1 ;	//// add shorties as 1 or last element in target
		self.site_css = typeof options.site_css != 'undefined' ? options.site_css : 0 ;
		
		self.width = options.width ? options.width : $(window).width() ;
		self.preview_texts = typeof options.preview_texts != 'undefined' ? options.preview_texts : false ;
		self.dir = options.dir ? options.dir : 'ltr' ;
		if (self.dir == 'rtl') $('body').addClass('er_rtl');
		self.show_link = typeof options.show_link != 'undefined' ? options.show_link : true;
		self.MAX_ARTICLES_NUM = 50;
		self.templates_map = typeof options.templates_map != 'undefined' ? options.templates_map : [1,2,3,4];
		self.positions_map = typeof options.positions_map != 'undefined' ? options.positions_map : [1,2,3,4,5];
		self.normalize = typeof options.normalize != 'undefined' ? options.normalize : false;	
		self.max_subtitle_words = typeof options.max_subtitle_words != 'undefined' ? options.max_subtitle_words : 10; 
		self.arrows_navigate = typeof options.arrows_navigate != 'undefined' ? options.arrows_navigate : 1; 	//// 0 no arrows, 1 - only on ads, 2 - every pictur
		self.ad_freq_art_every = typeof options.ad_freq_art_every != 'undefined' ? options.ad_freq_art_every : 0;
		self.init_callback = typeof options.init_callback != 'undefined' && options.init_callback.length > 0 ? options.init_callback : function() {};
		self.touch_only = typeof options.touch_only != 'undefined' ? options.touch_only : 1;
		//if (!isTouchDevice() && self.touch_only) { return;}
		self.text_tilt_random = typeof options.text_tilt_random != 'undefined' ? options.text_tilt_random : 0; 	//// Text tilt : 0 - no, 1 - every text, n > 1 - every n texts
		self.text_link = typeof options.text_link != 'undefined' ? options.text_link : 0;	//// Is text opens the article
		
		/// remove tools that does not have scripts
		var temp_st_tools = [];
		for (var i = 0;i<st_tools.length;i++) {if (st_tools[i].tool_script) temp_st_tools.push(st_tools[i]);}
		st_tools = temp_st_tools;
		if (st_tools.length>self.MAX_ARTICLES_NUM) st_tools.length =  self.MAX_ARTICLES_NUM;
		if(self.normalize) self.normalize_subtitles_pictures();
		self.art_shifter = new er_shift_line({shift_delay:3000, callback:function() { self.showNextPicture(); } });
		
		
		$("<link/>", { rel: "stylesheet",  type: "text/css",  href: MEDIA_PATH+"assets/css/shortease.css?v="+Math.ceil(Math.random()*10000)}).appendTo("head");
		if (self.site_css) { $("<link/>", { rel: "stylesheet",  type: "text/css",  href: self.site_css+"?v="+Math.ceil(Math.random()*10000)}).appendTo("head"); }
		self.create_holder();
		self.create_elements();
		if (self.ad_placement_id) self.add_ad();
		self.build_preview();
		//erLoadScript(MEDIA_PATH+"/scripts/shorties/templates/channels/"+iChannelId+".js", self.build_articles);
		var template = new templates();
		if (template.get_path(iSiteId, iChannelId).length) erLoadScript(template.get_path(iSiteId, iChannelId), self.build_articles);
		else {
			self.build_articles();
		}
		if (self.arrows_navigate) self.add_arrows();
		setTimeout(self.shift_items, self.shift_step); 	//// start preview sliding
		/*or_obj = new er_orientation();
		self.orientation = or_obj;
		po("opientation = ",or_obj, new er_orientation());*/
		self.interaction();

		self.init_callback();
		self.report(self.placement_id, sh_tool_id, 1, 1);
		//self.art_shifter.unpause();

		/// TODO - get indication if there is items to crawl from mongo
		erJq = $;
		$.getScript({url : "//m.shortease.com/components/shcr/shcr_prepare.php", data : { host:window.location.host.replace('www.',''), action:"getCrawlerItem", repeat :0 } });
		self.itemWidth = $('.er_item_list').outerWidth(true);
		po(self.itemWidth);
	}
	return {
		init : init,
		prepareNextArticle : prepareNextArticle,
		//orientation : self.orientation
	}
	
}();

/***
*	wait for jQuery to be ready
*	waitUntil - maximum wait time. Should be Date.now() + YOUR_SECONDS*1000
***/
/*
var er_str;
erLoad("https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js", function() {;
	erWaitForGlobal("erStoriesOptions", function() {
		erWaitForGlobal("st_tools", function() {
			er_str = new er_stories();
			er_str.init(erStoriesOptions);
		});
	});
});

function erLoad (url, callback) {
		var script = document.createElement("SCRIPT");
		script.src = url;
		script.type = 'text/javascript';
		if (callback) script.onload = function() { callback(); };
		document.getElementsByTagName("head")[0].appendChild(script);
}
	
	
function erWaitForGlobal(key, callback) {
  if (window[key]) {
    callback();
  } else {
    setTimeout(function() {
      erWaitForGlobal(key, callback);
    }, 50);
  }
};
*/
function erLoad (url, callback) {
		var script = document.createElement("SCRIPT");
		script.src = url;
		script.type = 'text/javascript';
		if (callback) script.onerror = script.onload = function() { callback(); };
		document.getElementsByTagName("head")[0].appendChild(script);
}


erLoad("https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js", function() {
	$(document).ready(function() {
		erLoad(MEDIA_PATH+"sites/"+iSiteId+"/init.js", function() {
			er_stories.init(erStoriesOptions);
		});
	});
});




var fillerTimer;

var er_shift_line = function(options)
{
	var self = this;
	var callback = options.callback ? options.callback : function() {};
	var shift_delay = options.shift_delay ? options.shift_delay : 2000;
	var is_active = false;
	var MIN_ARTICLE_TIME = 13000;

	this.build = function(shift_holder, num_of_shift_items) 
	{
		var item_margin = 1/2;
		var item_width = 100/num_of_shift_items - item_margin*2;
		var auto_shifter = $('<div class="auto_shifter" data-items="'+num_of_shift_items+'"></div>'); 
		$(shift_holder).append(auto_shifter);
		for (ki=0;ki<num_of_shift_items;ki++){
			var shifter_line = $('<div class="shifter_line" data-shifterix="'+i+'" style="width:'+item_width+'%;margin:0 '+item_margin+'%;"><div class="shifter_filler"></div></div>');
			auto_shifter.append(shifter_line);
		}
	}
	
	var cur_holder, cur_item_ix, cur_fill_percent;
	this.fill = function(shift_holder, item_ix, fill_percent){
		if (!fill_percent) fill_percent = 0;
		cur_holder = shift_holder;
		cur_item_ix = item_ix;
		cur_fill_percent = fill_percent;
		if (!is_active) return;
		var num_of_items = $('.shifter_line',shift_holder).length;
		//// prepare next article if this is the last picture started
		if(cur_item_ix == num_of_items - 1  && fill_percent > 3) {
			var curArtIx = parseInt(shift_holder.data('artix'));
			er_stories.prepareNextArticle(curArtIx + 1);
		}
		var art_delay = shift_delay * num_of_items < MIN_ARTICLE_TIME ? MIN_ARTICLE_TIME / num_of_items : shift_delay;
		$('.shifter_line',shift_holder).each(function(ix, el){
			if (ix < item_ix) $(this).find('.shifter_filler').css({'width':'100%'});
			if (ix > item_ix) $(this).find('.shifter_filler').css({'width':'0%'});
		});
		var cur_item = $('.shifter_line',shift_holder).get(item_ix);
		if (item_ix < 0 || item_ix >= $(cur_item).data('items')) return;
		if (fillerTimer && fill_percent == 0) {
			clearTimeout(fillerTimer);
		}
		if (fill_percent < 100 && is_active) {
			fill_percent++;
			var delay = art_delay/100;
			$('.shifter_filler',cur_item).css({'width':fill_percent+'%'});
			fillerTimer = setTimeout(function() { self.fill(shift_holder, item_ix, fill_percent) }, delay);
		} else if (fill_percent == 100) {
				callback();
		}
		
	}
	
	this.pause = function()
	{
		is_active = false;
	}
	
	this.unpause = function()
	{
		is_active = true;
		var cur_ix = 0, prev_ix_width = 0, cur_perc_width = 0, temp_perc_width = 0;
		$('.shifter_filler',cur_holder).each(function(ix, el){ 
			var curEl = $(this);
			cur_ix_width = parseInt(curEl.css('width'));
			temp_perc_width = cur_ix_width/parseInt(curEl.parent().css('width'))*100;
			if ((cur_ix_width > 0 && cur_ix_width < prev_ix_width) || (ix == 0 && temp_perc_width > 0 && temp_perc_width < 100)) 
			{
				cur_ix = ix;
				cur_perc_width = temp_perc_width;
			}
			prev_ix_width = cur_ix_width;
		});
		self.fill(cur_holder, cur_item_ix, parseInt(cur_perc_width));
	}

}

var erOrientationData ={alpha:0,beta:0,gamma:0, curX:0, curY:0}, erStartOrientationData = {alpha:0,beta:0,gamma:0, curX:0, curY:0};
var erTapHold = false, erTouchStartTime = 0, erTIME_TO_HOLD = 500, erMOVE_TO_NOT_HOLD = 1;
var er_orientation = function () 
{
	var save_position = function(){
		erStartOrientationData = $.extend({}, erOrientationData);
	}
	
	var checkHold = function(){
		//// check if holding more than erTIME_TO_HOLD and moved less than erMOVE_TO_NOT_HOLD
		if (erTouchStartTime > 0 && Date.now() - erTouchStartTime > erTIME_TO_HOLD  && erOrientationData.yChangePx < erMOVE_TO_NOT_HOLD) {
			erTapHold = true;
		} else erTapHold = false;
	}

	var init = function() { 
		var firstRun = true;
		window.addEventListener('deviceorientation', function(event) { 
			//var firstRun = (erOrientationData.alpha == 0 && erOrientationData.beta == 0);
			erOrientationData.alpha	= event.alpha;
			erOrientationData.beta	= event.beta;
			erOrientationData.gamma	= event.gamma; 		
			if (!firstRun) {
				erOrientationData.xChangeAng = erOrientationData.beta - erStartOrientationData.beta;
				erOrientationData.yChangeAng = erOrientationData.gamma - erStartOrientationData.gamma;
				erOrientationData.zChangeAng = erOrientationData.alpha - erStartOrientationData.alpha;
			}
				
			if (firstRun) save_position();
			firstRun = false;
		});	
		window.addEventListener('touchmove', function(e) { 
			//var firstRun = (erOrientationData.curX == 0 && erOrientationData.curY == 0);
			erOrientationData.curX = e.targetTouches[0].pageX;
			erOrientationData.curY = e.targetTouches[0].pageY;
			if (!firstRun) 
			{
				var xChangePx = erOrientationData.curX - erStartOrientationData.curX;
				erOrientationData.xChangePx = xChangePx;
				erOrientationData.yChangePx = erOrientationData.curY - erStartOrientationData.curY;
			}
			if (firstRun) save_position();
			checkHold();
			firstRun = false;
		});	
		window.addEventListener('touchstart', function(e) {
			erStartOrientationData.curX = e.touches[0].pageX;
			erStartOrientationData.curY = e.touches[0].pageY;
			erTouchStartTime = Date.now();
			setTimeout(function(){ checkHold();}, erTIME_TO_HOLD);
		});
		window.addEventListener('touchend', function(e) {
			erOrientationData.xChangePx = 0;
			erOrientationData.yChangePx = 0;
			erTouchStartTime = 0;
		});
	}
	return {
		init:init,
		save_position : save_position
	}
}();


var templates = function () 
{
	var SITES_PATH = "scripts/shorties/templates/sites/";
	var CHANNELS_PATH = "scripts/shorties/templates/channels/";
	var channel_template_ids = [];
	channel_template_ids['31'] = "weddings_dresses";
	
	var site_template_ids = [];
	site_template_ids['21'] = "weddings";
	
	this.get_path = function(siteId, channelId)
	{
		var temp_path = "";
		if (channel_template_ids[channelId]) {
			temp_path =  MEDIA_PATH + SITES_PATH + channel_template_ids[channelId] + ".js?v=1";
		} else if (site_template_ids[siteId]) {
			temp_path =  MEDIA_PATH + CHANNELS_PATH + site_template_ids[siteId] + ".js?v=11";
		}
		return temp_path;
	}
}
detectTurn();

function detectTurn(){

	var prevQ = 0;
	function rotatePa (){
		var u,v,w,m,Q,a;
		u = -Math.cos(degToRad(erOrientationData.beta))*Math.sin(degToRad(erOrientationData.gamma));
		v = Math.sin(degToRad(erOrientationData.beta));
		w = Math.cos(degToRad(erOrientationData.beta))*Math.cos(degToRad(erOrientationData.gamma));

		m = Math.sqrt(Math.pow(u, 2) +  Math.pow(v, 2));
		/// epsilon check ?
		if (m < 0.05) {
			return prevQ;
		}
		a = (Math.acos(v/m)*180) / Math.PI;
		Q = (u < 0 ? -a : a);
		prevQ = Q;
		return Q;
	}
	function degToRad(deg)// Degree-to-Radian conversion
	{
		 return deg * Math.PI / 180; 
	}
	function erRotate(){
		var ang = rotatePa();
		if (typeof $ != 'undefined') {
			$('.er_rotate .er_art_title, .er_rotate .er_art_sub_title').css({'transform':'rotate('+(ang/-2.5)+'deg)'});
		}

		requestAnimationFrame( erRotate );
	}
	erRotate();
}

function isTouchDevice() {
    return 'ontouchstart' in document.documentElement;
}