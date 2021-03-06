po = console.info;
var er_template;
var MEDIA_PATH = "//shmd.nyc3.cdn.digitaloceanspaces.com/";
var REP_PATH = "//rep.shortease.com/";
var CR_PATH = "//m.shortease.com/";

/*var MEDIA_PATH = "//devm.shortease.com/media/";
var REP_PATH = "//devrep.shortease.com/";
var CR_PATH = "//devm.shortease.com/";
*/
var shortease = function(){
	var status = {
		preview_show : 0,
		shortease_show : 0,
		touchstart_time :0,
		touchstartX : 0,
		touch_length :0,
		touchend_time :0,
		touch_speed :0,
		touchX : 0,
		touchY : 0,
		changeX : 0,
		touching_now : 0,
		touched_card:0,
		display_card:0,
		display_card_picture:0,
		next_card:0,
		left_card:0,	
		shift :0,
		touchCD : false,
		isImageMoved : false
	};
	var def = {
		d_holder_selector : "body",
		d_holder_function : "prepend",
		add_logo : true,
		target_holder_selector : '#er_str_out_holder',
		target_holder_prepend : 1,
		site_css : false,
		width : 0,
		dir : 'ltr',
		preview_texts : false,
		MAX_ARTICLES_NUM : 50,
		touch_only : 0,
		holder : null,
		items_number : 0,
		card_move_duration : 200,
		arrows_navigate : 0,
		coupon_frequency : 1,
		templates_map : ['blue','pink','yellow'], 
	}
	var images = [];
	var cards = [];

	var build = function(){
		$('body').append("<div class='close_x' ><img src='"+MEDIA_PATH+"images/close_x.png' /></div>");
		create_holder();
		prepare_cards();
	}

	var create_holder = function() {

		if ($('#sh_cards').length == 0) {
			var desktop_class = "";
			if (status.desktop) {
				desktop_class = "desk_holder";
				$('body').addClass('shdt');
			} else {
				$('body').addClass('shmb');
			}
			def.cards_hollder = $('<div class="sh_cards '+desktop_class+'"></div>'); 
			if (def.target_holder_prepend)	def.target_holder.prepend(def.cards_hollder);
			else def.target_holder.append(def.cards_hollder);
			shrt_holder_txt = "<div class='er_shrt_holder' id='er_shrt_holder' style='display:none'></div>";
			def.shrt_holder = $(shrt_holder_txt);
			def.cards_hollder.append(shrt_holder_txt);
			if (status.desktop) def.cards_hollder.append('<div class="sh_modal"></div>');
		}
		def.holder = $('#er_shrt_holder');
	};	
	/***
	*	called by touch_events
	*	controls widget moves
	***/
	var moves = function(e){
		if (status.preview_show) {
			//preview.move();
		}
		if (status.shortease_show) {
			move(e);
		}
	}

	/***
	*	called by moves function
	*	controls shorties moves
	***/
	var curLeft = 0, shift = 0;
	var move = function(event){
		if (!status.shortease_show) return;
		/// stop on edges
		var limitEdges = function(shift){
			var MIN_LEFT_POS = 0;
			var MAX_LEFT_POS = -1*(def.width * (def.items_number -1) + 0) - 0;
			if (shift > MIN_LEFT_POS) shift = MIN_LEFT_POS;
			if (shift < MAX_LEFT_POS) shift = MAX_LEFT_POS;
			return shift;
		}		
		/// calculate how mutch of two cards are showing
		var getDisplayPercent = function(shift){
			var rate = Math.abs(shift)/def.width;
			status.left_card = Math.ceil(rate)-1;
			if (status.left_card <0) status.left_card = 0; /// first card
			status.right_card = status.left_card+1 > def.items_number -1 ? -1 : status.left_card+1;
			if (status.right_card < 0.01){
				status.right_card = 0;
			}
			status.right_card_percent = rate - Math.floor(rate);
			status.left_card_percent = 1 - status.right_card_percent;
			if (status.right_card_percent == 0) status.left_card_percent = 0;
		}

		var setCardAngle = function(){
			var cards_holder_width = def.width*def.items_number;
			var rate = Math.abs(status.shift)/cards_holder_width;
			rate = rate > 0.5 ? 1 - rate : rate;
			rate = 0.5-rate;
			var perspective = 0.8*Math.sqrt( Math.pow((rate*cards_holder_width),2) + Math.pow(1000,2));
			def.er_articles_holder.css({'perspective':perspective+'px'});
			if (cards[status.left_card]){
				var left_card = cards[status.left_card].card;
				var angle = (40 - status.left_card_percent*40);
				if (status.left_card_percent == 0) angle = 0;
				left_card.css({'transform-origin': 'right center', 'transform' : 'translateZ(0vw) rotateY(-'+angle+'deg)'});
			}
			if (cards[status.right_card]){
				var right_card = cards[status.right_card].card;
				right_card.css({'transform-origin': 'left center', 'transform' : 'translateZ(0vw) rotateY('+(status.left_card_percent*35)+'deg)' });
			}
		}
		var move_image = function(imgChangeX){
			var MAX_MOVE = 50;
			imgChangeX = imgChangeX > MAX_MOVE ? MAX_MOVE : imgChangeX < -MAX_MOVE ? -MAX_MOVE : imgChangeX;
			var move_perc = 1 / MAX_MOVE * imgChangeX;
			var img_holder = cards[status.display_card].pictures[status.display_card_picture];
			var cur_image = $('.er_fore_img', img_holder);
			var img_width = cur_image.width();
			var holder_width = img_holder.width();
			if (holder_width/img_width > 0.75) { /// image not wide enough
				status.isImageMoved = false;
				return;
			}
			var move_pix =  -(img_width-holder_width)/2 + (img_width-holder_width)/2 * move_perc;
			cur_image.css('left', move_pix);
		}
		/// prevent cards moving if description is open
		if (status.description_open) return;
		var changeX = shortease.status.changeX;
		/// if finger stopped - move image
		if (!status.isImageMoved && status.touchstart_time > 20  && (Date.now() - status.touchstart_time > 130) && (status.left_card_percent < 0.01 || status.left_card_percent > 0.99))
			status.isImageMoved = true;
		if (changeX) { 
			if(status.isImageMoved) { 
				getDisplayPercent(curLeft);
				move_image(changeX);
			} else {	/// move to next card
				shift = curLeft + changeX;
				/// stop shifting on edges 
				shift = limitEdges(shift);
				status.shift = shift;
				getDisplayPercent(shift);
				setCardAngle();
				def.holder.css({'left':(shift)+'px'});
			}
		} else {
			curLeft = shift ;
			status.shift = shift;
		}
		/// 
		if (event && (event.type == 'touchstart' || event.type == 'mousedown')){
			cards[status.display_card].shift_line.stop();
		}
		if (event && (event.type == 'touchend' || event.type == 'mouseup')){
			cards[status.display_card].shift_line.start();
		}
		if (!status.isImageMoved && event && (event.type == 'touchend' || event.type == 'mouseup') && Math.abs(status.touch_speed) > 0) {
			/// move right
			if ( status.touch_speed < 1 && (status.left_card_percent < 0.8 || 
															(status.touch_speed < 3 && status.left_card_percent < 0.95))
				) { 
				/// quick swipe from first image
				if((Date.now() - shortease.status.lastTimeCardMoved)/1000 < 2 && status.display_card_picture == 0) {	
					report.add(iSiteId, st_tools[status.display_card].channel_id, st_tools[status.display_card].toolId, 7);
				}
				status.display_card_picture = 0;
				moveToCard(status.touched_card+1, def.card_move_duration);
			} else 	/// move left
				if ( status.touch_speed > 1 && (status.right_card_percent < 0.8 ||
															(status.touch_speed > 3 && status.right_card_percent < 0.95))
						&& status.touch_speed > 0
				) { 
				status.display_card_picture = 0;
				moveToCard(status.touched_card-1, def.card_move_duration);
			} else ///stay
			{	
				moveToCard(status.touched_card, def.card_move_duration);
			}
		}
		
	}

	var moveToCardTimer;
	status.lastTimeCardMoved = 0;
	var moveToCard = function(cardNum, duration){
		/// report tool impression
		if (st_tools[cardNum] && st_tools[cardNum].channel_id && st_tools[cardNum].toolId)
			report.add(iSiteId, st_tools[cardNum].channel_id, st_tools[cardNum].toolId, 1);
		/// card move cooldown
		status.lastTimeCardMoved = Date.now();

		if (cardNum < 0) cardNum = 0;
		if (cardNum > def.items_number-1) cardNum = def.items_number-1;
		if (status.display_card != cardNum) {	/// move to another card
			cards[status.display_card].shift_line.reset();
			cards[cardNum].shift_line.reset();
		}
		status.display_card = cardNum;
		showPicture();

		var targetShift = -(cardNum * def.width + status.shift);
		if (targetShift == 0) return; /// already there
		var steps = Math.abs(targetShift) > 50 ? 50 : Math.abs(targetShift);
		var stepShift = targetShift/steps;
		var stepDuration = duration/steps;
		if (duration > 0) {
			for(let i=1; i<=steps; i++){
				let curShift = i*stepShift;
				setTimeout(function() {
					status.changeX = curShift;
					move();
				}, stepDuration*i);
			}
		} else {
			status.changeX = targetShift;
			move();
		}
		clearTimeout(moveToCardTimer);
		moveToCardTimer = setTimeout(function() {
			status.changeX = 0;
			move();
		}, stepDuration*(steps+1));		
	}

	var showCard = function(card_id, picture_id = 0, animated){ 
		status.display_card_picture = picture_id ? picture_id : 0;
		status.display_card = card_id;
		var duration = animated ? def.card_move_duration : 0;
		moveToCard(card_id, duration);
	}

	var showPicture = function(picturIx){
		if (!status.shortease_show) return;
		status.display_card_picture = typeof picturIx != "undefined" ? picturIx : status.display_card_picture;
		var curCardPics = cards[status.display_card].pictures;
		cards[status.display_card].shift_line.start(status.display_card_picture);
		$(curCardPics).each(function() { $(this).hide(); });
		var cur_pic = curCardPics[status.display_card_picture];
		cur_pic.show();
		/// center image
		var curImg = cur_pic.find('.er_fore_img');
		curImg.css({'left':(def.width - curImg.width())/2})
	}

	var reset = function(){ 
	 	status.touchstart_time = 0;
	 	status.touchstartX = 0;
	 	status.touch_length = 0;
	 	status.touchend_time = 0;
	 	status.touch_speed = 0;
	 	status.touchX = 0;
	 	status.touchY = 0;
	 	status.changeX = 0;
	 	status.touched_card = 0;
	 	status.display_card = 0;
	 	status.display_card_picture = 0;
	 	status.left_card = 0;
	 	status.left_card_percent = 0;
	 	status.right_card_percent = 0;
	 	status.right_card = 1;
	 	status.shift = 0;

		def.holder.css({'left':'0px'});
		$('.er_article_holder').css({'transform': 'translateZ(0vw) rotateY(0deg);'});
		shift = 0;
		curLeft = 0;
		clearTimeout(moveToCardTimer);
		for (var i=0; i<cards.length;i++){
			cards[i].shift_line.reset();
		}
	};

	var showNextPicture = function(){		

		var curCardIx = status.display_card;
		var curPicIx = status.display_card_picture;
		var countCurCardPictures = cards[curCardIx].pictures.length;

		var animated = false;
		if (curPicIx + 1 >= countCurCardPictures) {
			curCardIx++;
			curPicIx = 0;
			animated = true;
		} else 
			curPicIx++;
		if (curCardIx >= def.items_number) return;
		else {
			if (animated) {
				showCard(curCardIx, curPicIx, animated);
			} else {
				cards[status.display_card].shift_line.reset();
				showPicture(curPicIx);
			}
		}
	}

	var showPrevPicture = function() {
		var curCardIx = status.display_card;
		var curPicIx = status.display_card_picture;
		var animated = false;

		if (curPicIx < 1) {
			curCardIx--;
			curPicIx = 0;
			animated = true;
		} else 
			curPicIx--;
		if (curCardIx < 0) return;
		else {
			if (animated) { 
				if (cards[status.touched_card-1]) cards[status.touched_card-1].shift_line.reset();
				cards[status.touched_card].shift_line.reset();
				showCard(curCardIx, curPicIx, animated);
			} else {
				cards[status.touched_card].shift_line.reset();
				showPicture(curPicIx);
			}
		}
	}

	var show = function(cardIx){
		reset();
		shortease.status.shortease_show = true;
		def.cards_hollder.addClass('open');
		def.target_holder.addClass('open');
		def.holder.width(def.width_open);
		$('body').css({'overflow': 'hidden'});
		$('.close_x').show();
		sh_preview.hide();
		/// report widget open
		var tid =  (typeof cardIx !="undefined") ? st_tools[cardIx].toolId : 0;
		report.add(iSiteId, iChannelId, tid, 9);
		report.timer(4);
	
		if (typeof sh_custom_show === "function") sh_custom_show();
	}
	
	var hide = function(){
		shortease.status.shortease_show = false;
		def.cards_hollder.removeClass('open');
		def.target_holder.removeClass('open');
		def.holder.width(def.preview_width);
		$('body').css({'overflow': 'unset'});
		$('.close_x').hide();
		reset();
		sh_preview.show();
		report.sendData();
		if (typeof sh_custom_hide === "function") sh_custom_hide();
	}

	var showDescription = function(){
		var curCard = cards[status.display_card];
		cards[status.display_card].shift_line.stop();
		status.description_open = true;
		$('.sh_description').removeClass('open');
		curCard.card.find('.sh_description').addClass('open');
		report.add(iSiteId, st_tools[status.display_card].channel_id, st_tools[status.display_card].toolId, 5);		
	}
	var hideDescription = function(){
		var curCard = cards[status.display_card];
		cards[status.display_card].shift_line.start();
		status.description_open = false;
		curCard.card.find('.sh_description').removeClass('open');
		hideCoupon();
	}

	var hideCoupon = function(){
		$('.sh_coupon_holder').remove();
	}

	var showCoupon = function(){
		if (!sh_channel_coupons || !sh_channel_coupons.length) return;		/// no coupons
		var curCard = cards[status.display_card].card;
		if (curCard.data('has_coupon')) return;
		/// get random for coupon display frequency
		var freq_random = Math.ceil(Math.random()*def.coupon_frequency);
		if (freq_random != def.coupon_frequency) {
			curCard.data('has_coupon',1)
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

		let coupon_code = atob(selected_coupon.code);
		// var coupon_icon = $('<img src = "'+MEDIA_PATH+'images/gift_box.png" class="sh_coupon_icon" />');
		var coupon_text = $('<div class="sh_coupon_text"></div>');
		var coupon_name = $('<div class="sh_coupon_name">'+selected_coupon.name+'</div>');
		var coupon_code_div = $('<div class="sh_coupon_code">'+coupon_code+'</div>');
		coupon_text.append(coupon_name);
		coupon_text.append(coupon_code_div);
		var coupon_holder = $('<div class="sh_coupon_holder"></div>');
		coupon_holder.append(coupon_text);
 
		//coupon_holder.append(coupon_icon);
		//coupon_holder.append(coupon_name);
		//coupon_holder.append(coupon_code);


		setTimeout(function() {
						curCard.append(coupon_holder);
						jQuery.extend(jQuery.easing,{easeOutBounce:function(e,n,u,r,t){return(n/=t)<1/2.75?r*(7.5625*n*n)+u:n<2/2.75?r*(7.5625*(n-=1.5/2.75)*n+.75)+u:n<2.5/2.75?r*(7.5625*(n-=2.25/2.75)*n+.9375)+u:r*(7.5625*(n-=2.625/2.75)*n+.984375)+u}});
						coupon_holder.animate({ top: '25%' }, 
								{duration:900, easing: "easeOutBounce", complete: function() { 
									coupon_holder.addClass("sh_shake");
									sh_shake(coupon_holder, 1,"sh_shake"); } }
							);
						
					}, 1000);
		$(coupon_holder).click(function(e) { 
			e.stopPropagation();
			e.preventDefault();
			return false;
		});
		curCard.data('has_coupon',1);

		coupon_holder.click(function(e){
			e.stopPropagation();
			e.preventDefault();
			coupon_holder.removeClass("sh_shake");
			report.add(iSiteId, st_tools[status.display_card].channel_id, st_tools[status.display_card].toolId, 6);		
			coupon_holder.animate({ width:'10px', height:'10px', opacity:'0' }, 
				{duration:600, complete: function() {  
					coupon_holder.addClass('show');
					coupon_holder.animate({ width:'120px', height:'157px', opacity:'1', top:"10%" }, 
						{duration:300}
					);
				} }
			);
		});
		return;

	}
	/***
	* 	setup touch events
	***/
	var touch_events = function() {
		$('body').on({ 'touchstart' : function(event){ 
				touch(event.touches[0].clientX, event);
			}
		});		
		$('body').on({ 'touchend' : function(event){ 
			leave(event);
		} });
		$('body').on({ 'touchmove' : function(event){ 
			move(event.touches[0].clientX, event.touches[0].clientY, event);
		} });
		if (status.desktop) {
			$('body').on('mousedown',def.holder, function(event){
				var clientX = event.pageX - shortease.def.holder.parent().offset().left;
				if (clientX > 0 && clientX < def.width) {
					touch(clientX, event);
					status.touched_card = status.display_card;
				}
			});
			$('body').on('mouseup',def.holder, function(event){
				leave(event);
			});
			$('body').on('mousemove',def.holder, function(event){
				if (shortease.status.touching_now) {
					var clientX = event.pageX - shortease.def.holder.parent().offset().left;
					var clientY = event.pageY - shortease.def.holder.parent().offset().top;
					move(clientX, clientY, event);
				}
			});
		}

		function touch(clientX, event) {
			/// check if there touch cool down
			var prev_touch_passed = (Date.now() - shortease.status.touchend_time);
			shortease.status.touchCD =( prev_touch_passed < shortease.def.card_move_duration && prev_touch_passed > 20);
			shortease.status.touching_now = true;
			if (!status.touchCD) {
				shortease.status.touchstart_time = Date.now();
				shortease.status.touchstartX = clientX;
				shortease.status.touchend_time = 0;
				shortease.status.touch_speed = 0;
				moves(event);
			}
			setTimeout( function() { report.timer(3); }, 1000);
		}
		function leave(event) {
			shortease.status.touching_now = false;
			if (!status.touchCD) {
				shortease.status.touchend_time = Date.now();
				shortease.status.touch_length = (Date.now() - shortease.status.touchstart_time) /1000;
				shortease.status.touchstart_time = 0;
				shortease.status.changeX = 0;
				setTimeout(function() { shortease.status.isImageMoved = false; } , 70); /// release imge move after short time
				moves(event);
			}
		}	

		function move(clientX, clientY, event) {
			if (!status.touchCD) {
				shortease.status.touchX = clientX;
				shortease.status.touchY = clientY;
				shortease.status.changeX = shortease.status.touchX - shortease.status.touchstartX;
				shortease.status.touch_length = (Date.now() - shortease.status.touchstart_time) /1000;
				shortease.status.touch_speed = (shortease.status.changeX/shortease.status.touch_length)/50;
				if (shortease.status.touch_length < 0.01) shortease.status.touch_speed = 1;
				moves(event);
			}
		}

		$('body').on('touchstart','.er_article_holder' , function(e){ 	
			status.touched_card = $(this).data('artix');
		});	

	}

	/***
	* 	prepare st_tools array. 
	***/
	var prepare_tools = function() { 
		/// remove tools that does not have scripts
		var temp_st_tools = [];
		for (var i = 0;i<st_tools.length;i++) {
			if (st_tools[i].tool_script && st_tools[i].tool_script.pictures.length) 
				temp_st_tools.push(st_tools[i]);
		}
		st_tools = temp_st_tools;
		/// limit number of items
		if (st_tools.length>def.MAX_ARTICLES_NUM) st_tools.length =  def.MAX_ARTICLES_NUM;
		shortease.def.items_number = st_tools.length;
		for (var i=0;i<st_tools.length;i++){
			if (st_tools[i]['tool_script']) {
				st_tools[i]['pictures'] = st_tools[i]['tool_script']['pictures'];
				st_tools[i].title = st_tools[i]['tool_script'].title;
				st_tools[i].subTitle = st_tools[i]['tool_script'].subTitle;
				st_tools[i].price = st_tools[i]['tool_script'].price;
				st_tools[i].price = st_tools[i].price ? st_tools[i].price : "";
			}
		}
	}

	var get_random_template = function() {
		var template_name = def.templates_map[Math.floor(Math.random() * def.templates_map.length)];
		return template_name;		
	}

	var prepare_cards = function(){ 
		/// if runs again after display turning - remove the holder first
		$('.er_articles_holder').remove();
		def.er_articles_holder = $('<div class="er_articles_holder"></div>'); 
		def.holder.append(def.er_articles_holder);
		def.er_articles_holder.css({'width': def.width_open+'px'});//(st_tools.length*100)+'%'});
		for (var i=0;i<st_tools.length;i++) {
			var er_article_holder = $('<div class="er_article_holder sh_tmpl_'+get_random_template()+'" data-artix="'+i+'"></div>');
			cards[i] = {};
			cards[i].card = er_article_holder;
			er_article_holder.width(def.width+'px');
			def.er_articles_holder.append(er_article_holder);
			/// create pictures in cards
			var curTool = st_tools[i];
			if (curTool.pictures) {
				cards[i].pictures = [];
				for(j=0;j<curTool.pictures.length;j++){
					curPic = curTool.pictures[j];
					var er_pic_holder = $('<div class="er_pic_holder"  data-artix="'+i+'" data-picix="'+j+'"></div>');
					cards[i].pictures[j] = er_pic_holder;
					var cover = $('<div class="sh_pic_cover"></div>');	/// cover to prevent image saveas menu
					er_pic_holder.append(cover);
					if (j==0) er_pic_holder.css({'display':'block'});
					/// show first picture of every card
					er_article_holder.append(er_pic_holder);
//					er_pic_holder.append('<div style="position:absolute;z-index:99999; top:20px;left:20px;font-size:30px;">card '+i+', pic '+j+'</div>');
					var imgHolder = $('<div class="er_img_holder"></div>');
					var foreImg = $('<img src="'+curPic.address+'" />');
					foreImg.addClass('er_fore_img');
					imgHolder.append(foreImg);
					er_pic_holder.append(imgHolder);
					var details_holder = $('<div class="sh_art_details"></div>');
					var title_text = $('<div class="text_holder sh_title">'+curTool['title']+'</div>');
					var desc_text = $('<div class="text_holder sh_description">'+curTool['subTitle']+'</div>');
					var price_text = $('<div class="text_holder sh_price"><span class="pr_text">Price : </span><span class="pr_val">'+curTool['price']+'</span></div>');
					var buttons_holder = $('<div class="sh_buttons_holder"></div>');
					/*var btn_show_description = $('<div class="btn_show_descr">\
						<div class="descr_arr_holder"><img class="descr_arr" src="'+MEDIA_PATH+'/images/arrup.png" /></div>\
						<div>Learn more</div></div>');*/
					var btn_show_description = $('<div class="btn_show_descr"></div>');
					var btn_show_product = $('<div class="btn_show_product"></div>');
					buttons_holder
								.append(btn_show_product)
								.append(btn_show_description);
					details_holder
								.append(title_text)
								.append(desc_text)
								.append(price_text)
								.append(buttons_holder);
					er_pic_holder.append(details_holder);

					let item_address = curTool['url'];
					btn_show_product.click(function(e) { 
						e.preventDefault();
						e.stopPropagation();
						/// report tool click
						report.add(iSiteId, st_tools[status.display_card].channel_id, st_tools[status.display_card].toolId, 2);
						location.href = item_address;
					});					
				}
			}
			cards[i].shift_line = new sh_shift_line();
			cards[i].shift_line.init({
				'holder':er_article_holder, 
				'num_of_items':curTool.pictures.length, 
				'callback':shortease.showNextPicture,
				card:i
			});

		}
		$('.er_fore_img, .er_arrow ').each(function() { this.draggable = false; });
	}

	var addArrows = function() { 
		if (def.arrows_navigate == 1) {	//// only ads
			var arrows_holder = $('.er_pic_holder.er_ad');
		}
		if (def.arrows_navigate == 2) {	//// every picture
			var arrows_holder = $('.er_pic_holder');
		}
		if (arrows_holder && arrows_holder.length)
			arrows_holder.append('<div class="er_arrow er_right"></div><div class="er_arrow er_left"></div>');
	}

	var controls = function(){
		$('.close_x, .sh_modal').click(function() { close_cards();	});
		$('.sh_modal').mousedown(function() { close_cards();	});
		$(document).keyup(function(e) {
		     if (e.key === "Escape") { 
		        close_cards();
		    }
		});
		function close_cards() {
			shortease.hide();
			sh_preview.show();
		} 
		/// on display turning - build cards
		$(window).on('orientationchange', function() {
		    $(window).on('resize', function() {
				def.width = def.target_holder.width();
				def.width_open = def.items_number * def.width;
				prepare_cards();
		    });
		});	
		/// click on card
		$('.er_article_holder').click(function(e){
			if (Date.now() - status.lastTimeCardMoved < def.card_move_duration) return;
			if (!status.touchCD) { /// cooldown
				if (status.description_open) hideDescription(); 
				var clickXperc = status.touchstartX / def.width;
				if (clickXperc < 0.3) showPrevPicture();
				else if (clickXperc > 0.7) showNextPicture();
			} 
		});
		/// click on description button 
		$('.btn_show_descr').click(function(e){ 
			if (!status.description_open) {
				showDescription();
				showCoupon();
			} else {
				hideDescription();
			}
			e.stopPropagation();			
		});

		$(window).on("beforeunload", function(e) {
			report.sendData();
		});
	}
	/***
	*	preload first images of showing items
	***/
	var preload = function(){
		var num_of_showing_items = 10;
		num_of_showing_items = num_of_showing_items <= def.items_number ? num_of_showing_items : def.items_number;
		for (var i = 0; i < num_of_showing_items; i++){
			if (st_tools[i].pictures[0]){
				$('<img src="'+st_tools[i].pictures[0].address+'" />');
			}
		}
	}
	var checkCrawlTools = function() {
		/// looking for tools that needs to be crawled
		var tool_should_be_crawled = false;
		for (var i = 0;i<st_tools.length;i++){
			var crawl_frequency = st_tools[i].crawl_frequency ? st_tools[i].crawl_frequency : 24;
			/// time passed from last crawl more that crawl_frequency
			if (((new Date(shtime)) - (new Date(st_tools[i].last_crawled)))/3600000 > crawl_frequency){
				tool_should_be_crawled = true;
			}
			if (tool_should_be_crawled) break;
		} 
		return tool_should_be_crawled;
	}

	var userData = function() {
		const TOP_TOOLS_STORAGE_NAME = 'sh_tt', TOP_CHANNELS_STORAGE_NAME = 'sh_tc';
		const NUM_OF_TOP_TOOLS = 10, NUM_OF_TOP_CHANNELS = 3;
		var topTools = {}, topChannels = {};

		var organizeData = function(user_data){
			var hasNewData = function(newData, oldData) {
				actualData = newData;
				/// if no new data or impressions less than 10 use old data
				if ((!newData.g[0][1] || newData.g[0][1] < 10 )				
					&& (oldData && oldData.g && oldData.g[0] && oldData.g[0][1] && oldData.g[0][1] > 10)){
						actualData = oldData;
				}
				return actualData;
			}

			setInterestRate(hasNewData(user_data.short, user_data.short_old));
			setInterestRate(hasNewData(user_data.medium, user_data.medium_old));
			setInterestRate(hasNewData(user_data.long, user_data.long_old));

			saveTops();

		}

		///********
		///	Saves topTools and topChannels to local storage
		///********
		var saveTops = function() {
			localStorage.setItem(TOP_TOOLS_STORAGE_NAME, topObjToStr(topTools));
			localStorage.setItem(TOP_CHANNELS_STORAGE_NAME, topObjToStr(topChannels));
		}

		var topObjToStr = function(topObj){
			var objStr = "";
			for (var key in topObj){
				objStr += key+":"+topObj[key]+";";
			}
			return objStr;
		}

		var setInterestRate = function(user_data){
			var channels = user_data.c;
			var tools = user_data.t;
			if (channels) {
				channels.forEach(function(channel, key) {
					var mark = getInteresRate(channel[1], channel[2], channel[3], channel[4], channel[7], channel[5]);
					channels[key]['ir'] = mark;
					updateMaximum(topChannels, NUM_OF_TOP_CHANNELS, key, mark);
				});
			}
			if (tools) {
				tools.forEach(function(tool, key) {
					var mark = getInteresRate(tool[1], tool[2], tool[3], tool[4], tool[7], tool[5]);
					tools[key]['ir'] = mark;
					updateMaximum(topTools, NUM_OF_TOP_TOOLS, key, mark);
				});
			}
		}

		var getInteresRate = function(impressions = 0, purchases = 0, pause_times = 0, view_times = 0, swipes = 0, descriptions = 0) {
			var MAX_PURCHASE = 0.0001, MAX_PAUSE = 0.7, MAX_VIEW = 10, MAX_SWIPE = 0.2, MAX_DESCRIPTIONS = 0.5;
			var PURCHASE_WEIGHT = 0.5, PAUSE_WEIGHT = 0.2, VIEW_WEIGHT = 0.1, SWIPE_WEIGHT = -0.5, DESCRIPTIONS_WEIGHT =  0.3; 
			var purchase_mark = Math.min((purchases/impressions)/MAX_PURCHASE*100, 100);
			var pause_mark = Math.min((pause_times/impressions)/MAX_PAUSE*100, 100);
			var view_mark = Math.min((view_times/impressions)/MAX_VIEW*100, 100);
			var swipe_mark = Math.min((swipes/impressions)/MAX_SWIPE*100, 100);
			var descriptions_mark = Math.min((descriptions/impressions)/MAX_DESCRIPTIONS*100, 100);
			var mark = ((purchase_mark>0?purchase_mark:50) * PURCHASE_WEIGHT) + 
						((pause_mark>0?pause_mark:50) * PAUSE_WEIGHT) + 
						((view_mark>0?view_mark:50) * VIEW_WEIGHT) + 
						((swipe_mark>0?swipe_mark:50) * SWIPE_WEIGHT) + 
						((descriptions_mark>0?descriptions_mark:50) * DESCRIPTIONS_WEIGHT) ;
			mark = mark < 0 ? 0 : mark > 100 ? 100 : mark;
			return Math.round(mark) ;
		}

		var updateMaximum = function(topObj, maxLength, topKey, topVal){
			var topObjKeys = Object.keys(topObj);
			if (topObjKeys.indexOf(""+topKey) >= 0 ) return; /// key already exists. do not replase - becouse order of top object short -> medium -> long
			var objLength = topObjKeys.length;
			if (objLength < maxLength) { 	/// not enough items
				topObj[topKey] = topVal;
			} else { 	/// if minimum value less than topVal - opdate minimum
				var minKey = null, minVal = null;
				for (var key in topObj){	/// iterate topObj
				    if (!minVal || topObj[key] < topVal ) {	/// check if cur item less than topVal or less prev found minimum
				    	minKey = key;
				    	minVal = topObj[key];
				    }
				}
				if (minVal < topVal) { 	/// if minimum found delete it and insert new top value
					delete topObj[minKey];
					topObj[topKey] = topVal;
				}

			}
		}

		return {
			organizeData : organizeData,
		}
	}();

	var report = function() {
		const STORAGE_NAME = 'sh_rep', STORAGE_UNSENDED_NAME = 'sh_rep_uns';
		const STORAGE_SHORT_RANGE = 'sh_sr', STORAGE_MEDIUM_RANGE = 'sh_mr', STORAGE_LONG_RANGE = 'sh_lr';
		const STORAGE_SHORT_RANGE_OLD = 'sh_sro', STORAGE_MEDIUM_RANGE_OLD = 'sh_mro', STORAGE_LONG_RANGE_OLD = 'sh_lro';

		var user_data_unsended = null;
		var user_data_short = null, user_data_medium = null, user_data_long = null;
		var user_data_short_old = null, user_data_medium_old = null, user_data_long_old = null;
		var user_data = {
			short 		: user_data_short,
			medium 		: user_data_medium,
			long 		: user_data_long,
			short_old 	: user_data_short_old,
			medium_old 	: user_data_medium_old,
			long_old 	: user_data_long_old,
		}
		const ITEM_DELIMITER = ";", DATA_DELIMITER = ":", EVENT_ID_DELIMITER = ".";
		const GENERAL_TYPES = ["g","s","c","t"];
		/// 1 - impression, 2 - click (buy), 3 - pause timer (interested), 4 - widget open timer, 5 - description opened, 6 - coupon clicked, 
		/// 7 - quick swipe, 8 - widget loaded, 9 - widget opened
		const EVENT_TYPES = [1, 2, 3, 4, 5, 6, 7, 8, 9];
		const SHORT_RANGE = 10, MEDIUM_RANGE = 30, LONG_RANGE = 182; /// days range to keep data

		var add = function (site_id, channel_id, tool_id, event_type, event_count) {
			if (!event_count) event_count = 1;
			event_count = event_count ? Math.round(event_count) : 1; 	
			getUserData();
//			saveData(user_data, site_id, channel_id, tool_id, event_type, event_count);

			saveData(user_data.short, site_id, channel_id, tool_id, event_type, event_count);
			saveData(user_data.medium, site_id, channel_id, tool_id, event_type, event_count);
			saveData(user_data.long, site_id, channel_id, tool_id, event_type, event_count);

			saveData(user_data_unsended, site_id, channel_id, tool_id, event_type, event_count);
			function saveData (data_obj, site_id, channel_id, tool_id, event_type, event_count){
				if (!EVENT_TYPES.includes(event_type)) return;  /// check permitted event

				if (site_id || channel_id || tool_id) {
					if (!data_obj.g) data_obj.g = [];
					if (!data_obj.g[0]) data_obj.g[0] = [];
					data_obj.g[0][event_type] = data_obj.g[0][event_type] ? data_obj.g[0][event_type]+event_count : event_count;
				}

				if (site_id) {
					if (!data_obj.s) data_obj.s = [];
					if (!data_obj.s[site_id]) data_obj.s[site_id] = [];
					data_obj.s[site_id][event_type] = data_obj.s[site_id][event_type] ? data_obj.s[site_id][event_type] + event_count : event_count;
				}

				if (channel_id) {
					if (!data_obj.c) data_obj.c = [];
					if (!data_obj.c[channel_id]) data_obj.c[channel_id] = [];
					data_obj.c[channel_id][event_type] = data_obj.c[channel_id][event_type] ? data_obj.c[channel_id][event_type] + event_count : event_count;
				}
				if (tool_id) {
					if (!data_obj.t) data_obj.t = [];
					if (!data_obj.t[tool_id]) data_obj.t[tool_id] = [];
					data_obj.t[tool_id][event_type] = data_obj.t[tool_id][event_type] ? data_obj.t[tool_id][event_type] + event_count : event_count;
				}
			}

			saveUserData();
		}

		var str_to_data = function(datastr) {
			/// string structure - g(general):eventIdeventCount;s(sites):eventIdeventCount:eventIdeventCount;c(channels):eventIdeventCount:eventIdeventCount;t(tools):eventIdeventCount:eventIdeventCount;
			var tmp_user_data = {};
			data_arr = datastr.split(ITEM_DELIMITER); 

			for (var i=0;i<data_arr.length;i++){	/// run on data report items 
				var item = data_arr[i];
				if (!item.length) continue;
				var item_arr = item.split(DATA_DELIMITER);
				var item_description = item_arr[0];	///  first item - is item description
				if (item_description == "st") tmp_user_data.st = item_arr[1]; /// start date
				var general_type = item_description[0]; /// first char of description is general type (site, channel ...)
				var item_id = 1*(item_description.substr(1));
				if (!GENERAL_TYPES.includes(general_type)) continue; /// if first char is not general type check next item
				if (!tmp_user_data[general_type]) tmp_user_data[general_type] = []; /// if general type not exists yet create it
				if (!tmp_user_data[general_type][item_id]) tmp_user_data[general_type][item_id] = []; /// if item id not exists yet create it
				for (var j=1;j<item_arr.length;j++){	/// run on item events
					var item_data = item_arr[j];
					var event_id_length = item_data.indexOf(EVENT_ID_DELIMITER); 	/// looking for EVENT_ID_DELIMITER in item_data
					if (event_id_length) item_data = item_data.replace(EVENT_ID_DELIMITER,""); 	/// remove EVENT_ID_DELIMITER
					event_id_length = event_id_length > 0 ? event_id_length : 1; 	/// if no EVENT_ID_DELIMITER in item_data event id length is 1
					var event_id = parseInt(item_data.substr(0,event_id_length));

					var event_count = parseInt(item_data.substring(event_id_length, item_data.length));
					if (!EVENT_TYPES.includes(event_id)) continue; /// if event id not permitted
					tmp_user_data[general_type][item_id][event_id] = event_count;
				}
			}
			return tmp_user_data;
		};

		var data_to_str = function(dataStructure) {
			var data_str = "";
			if (dataStructure.st) data_str = 'st:'+dataStructure.st +';';
			if (dataStructure.rg) data_str = 'rg:'+dataStructure.rg +';';
			if (dataStructure.t) data_str += arr2str("t",dataStructure.t); 
			if (dataStructure.g) data_str += arr2str("g",dataStructure.g); 
			if (dataStructure.s) data_str += arr2str("s",dataStructure.s); 
			if (dataStructure.c) data_str += arr2str("c",dataStructure.c); 
			return data_str;

			function arr2str(generalType, dataArr){
				var item_data_str = "";
				dataArr.forEach(function(item,item_id) { 
					item_id = item_id ? item_id : '';
					item_data_str += generalType+item_id+DATA_DELIMITER;
					item.forEach(function(event_count,event_id) { 
						if (EVENT_TYPES.includes(event_id)) {
							if (event_id > 9) event_id = event_id + ".";
							item_data_str += event_id+''+event_count+DATA_DELIMITER;
						}
					});
					item_data_str = item_data_str.slice(0, -1); /// remove last DATA_DELIMITER
					item_data_str+=ITEM_DELIMITER;
				});
				return item_data_str;
			}
		};
		/**
		*	saves user_data and user_data_unsended to localStorage
		**/
		var saveUserData = function() {
			//localStorage.setItem(STORAGE_NAME,		data_to_str(user_data));

			localStorage.setItem(STORAGE_SHORT_RANGE,		data_to_str(user_data.short));
			localStorage.setItem(STORAGE_MEDIUM_RANGE,		data_to_str(user_data.medium));
			localStorage.setItem(STORAGE_LONG_RANGE,		data_to_str(user_data.long));
			localStorage.setItem(STORAGE_UNSENDED_NAME,	data_to_str(user_data_unsended));
		};

		/**
		*	Get data from localStorage and set it to the user_data and user_data_unsended
		**/		
		var getUserData  = function() {
/*			var userStoredData = localStorage.getItem(STORAGE_NAME);
			user_data = userStoredData ? str_to_data(userStoredData) : { g:[], s:[], c:[], t:[]};

*/			/// get short range
			user_data.short_old = localStorage.getItem(STORAGE_SHORT_RANGE_OLD);
			user_data.short_old = user_data.short_old ? str_to_data(user_data.short_old) : null;

			user_data.short = localStorage.getItem(STORAGE_SHORT_RANGE);
			user_data.short = user_data.short ? str_to_data(user_data.short) : { st:getDateStr(), g:[], s:[], c:[], t:[]};
			if (getDateStr() - user_data.short.st > SHORT_RANGE) {	/// short range data is getting old
				user_data.short_old = user_data.short;
				user_data.short = { st:getDateStr(), g:[], s:[], c:[], t:[]};
				localStorage.setItem(STORAGE_SHORT_RANGE_OLD,		data_to_str(user_data.short_old));
			}

			/// get medium range
			user_data.medium_old = localStorage.getItem(STORAGE_MEDIUM_RANGE_OLD);
			user_data.medium_old = user_data.medium_old ? str_to_data(user_data.medium_old) : null;

			user_data.medium = localStorage.getItem(STORAGE_MEDIUM_RANGE);
			user_data.medium = user_data.medium ? str_to_data(user_data.medium) : { st:getDateStr(), g:[], s:[], c:[], t:[]};
			if (getDateStr() - user_data.medium.st > MEDIUM_RANGE) {	/// medium range data is getting old
				user_data.medium_old = user_data.medium;
				user_data.medium = { st:getDateStr(), g:[], s:[], c:[], t:[]};
				localStorage.setItem(STORAGE_MEDIUM_RANGE_OLD,		data_to_str(user_data.medium_old));
			}

			/// get long range
			user_data.long_old = localStorage.getItem(STORAGE_LONG_RANGE_OLD);
			user_data.long_old = user_data.long_old ? str_to_data(user_data.long_old) : null;

			user_data.long = localStorage.getItem(STORAGE_LONG_RANGE);
			user_data.long = user_data.long ? str_to_data(user_data.long) : { st:getDateStr(), g:[], s:[], c:[], t:[]};
			if (getDateStr() - user_data.long.st > LONG_RANGE) {	/// long range data is getting old
				user_data.long_old = user_data.long;
				user_data.long = { st:getDateStr(), g:[], s:[], c:[], t:[]};
				localStorage.setItem(STORAGE_LONG_RANGE_OLD,		data_to_str(user_data.long_old));
			}

			var userStoredDataUnsended = localStorage.getItem(STORAGE_UNSENDED_NAME);
			user_data_unsended = userStoredDataUnsended ? str_to_data(userStoredDataUnsended) : { g:[], s:[], c:[], t:[]};

		}

		/**
		*	after sending data to server remove it from user_data_unsended localStorage
		**/
		var removeUnsentData = function() { 
			localStorage.removeItem(STORAGE_UNSENDED_NAME);
		}

		/**
		*	send data to server 
		**/
		var sendData = function() {

			getUserData();
			if (user_data_unsended && user_data_unsended.g[0] /*&& user_data_unsended.g[0][8]*/) { /// there is report for widget loaded
				$.ajax({
					url: REP_PATH+"?t=sho&rep=1",
					data: { rd: data_to_str(user_data_unsended)},
				});
			}
			removeUnsentData();
		}

		var getDateStr = function(){
			var curDate = Date.now();
//			curDate = (new Date('2019 sep 1')).getTime();
			return Math.floor(curDate/1000/3600/24) ;
		}

		let i=0;
		var timer = function (event_id) {
			var check_condition = false;
			if (event_id == 3) check_condition = status.touchstart_time;
			if (event_id == 4) check_condition = status.shortease_show;
			var CHECK_DURATION = 1000;
			if (check_condition) { 
				/// count timer only if page visible and last interaction was less than 30 sec ago
				if (isPageVisible() && 
						(status.touching_now || 
							(Date.now() - status.touchend_time)/1000 < 30 ||
							(status.touchend_time == 0 && status.touchstart_time == 0 && (Date.now() - status.lastTimeCardMoved)/1000 < 30)
							)
					) {
					report.add(iSiteId, st_tools[status.display_card].channel_id, st_tools[status.display_card].toolId, event_id, CHECK_DURATION/1000);
				}
				setTimeout(function() { report.timer(event_id); }, CHECK_DURATION);
			}
		}

		return {
			sendData : sendData,
			add : add,
			timer:timer,
			user_data : user_data
		}
	}();


	/***
	* 	setup widget
	***/
	var init = function(options) {
		$.extend(def, options);
		if (!isTouchDevice()) status.desktop = true;
		if (!def.m_holder_selector) def.m_holder_selector = def.d_holder_selector;
		if (!def.m_holder_function) def.m_holder_function = def.d_holder_function;

		if (!$(def.target_holder_selector).length) {	/// holder not exists - add it 
			def.target_holder = $('<div id="er_str_out_holder"></div>');
			var holder_selector = status.desktop ? def.d_holder_selector : def.m_holder_selector;
			var holder_function = status.desktop ? def.d_holder_function : def.m_holder_function;
			var holderObj = $($(holder_selector)[0]);
			if (holder_function == "append" ) holderObj.append(def.target_holder);
			if (holder_function == "prepend" ) holderObj.prepend(def.target_holder);
			if (holder_function == "before" ) holderObj.before(def.target_holder);
			if (holder_function == "after" ) holderObj.after(def.target_holder);
		} else {
			def.target_holder = $(def.target_holder_selector);
		}
		/// after 5 seconds - check if somebody remove it - if yes reinit
		setTimeout(function(){
			if ($(def.target_holder_selector).length == 0) {
				reinit();
			}
		}, 10000);
		def.width = def.target_holder.width();
		def.preview_width = def.width;
		if (status.desktop) {
			def.width = $('body').innerWidth()/3;//$(document).width()/100*33;
			//def.target_holder.addClass('desk_holder');
		}

		$("<link/>", { rel: "stylesheet",  type: "text/css",  href: MEDIA_PATH+"assets/css/shortease.css?v=" /*+Math.ceil(Math.random()*10000) */}).appendTo("head");
		$("<link/>", { rel: "stylesheet",  type: "text/css",  href: MEDIA_PATH+"sites/"+iSiteId+"/init.css?v"+Math.ceil(Math.random()*10000)}).appendTo("head");
		if (def.site_css) { $("<link/>", { rel: "stylesheet",  type: "text/css",  href: def.site_css+"?v=" /*+Math.ceil(Math.random()*10000)*/ }).appendTo("head"); }

		touch_events();
		prepare_tools();
		if (!st_tools || !st_tools.length) {	/// no tools found
			def.target_holder.empty();
			return;
		}

		def.width_open = def.items_number * def.width;
		preload();
		build();
		controls();
		addArrows();
		sh_preview.init();
		sh_preview.show();
		report.add(iSiteId, iChannelId, 0, 8);		
		report.sendData();
		userData.organizeData(report.user_data);

		erJq = $;
		if (checkCrawlTools()) {
			$.getScript({url : CR_PATH+"components/shcr/shcr_prepare.php", data : { host:window.location.host.replace('www.',''), action:"getCrawlerItem", repeat :0 } });
		}		
	}

	var reinit = function() { 
		def.target_holder.empty();
		init(def);
	}

	return {
		init : init,
		reinit : reinit,
		status : status,
		def : def,
		show:show,
		hide:hide,
		showCard:showCard,
		move:move,
		cards:cards,
		showNextPicture:showNextPicture,
		showPrevPicture:showPrevPicture,
		reset:reset  ,
		curLeft:curLeft,
		showPicture:showPicture,
		report : report
	}
}();


var sh_preview = function(){
	var prevHolder, itemWidth = 0;
	var numOfArticles = 0;
	var def = {
		shift_delay : 4000,
		shift_duration : 500,
		thumb_gap : 80,	/// time(ms) between thumb to thumb shift
	};
	var items = [];

	var buld = function () { 
		$('.er_prev_holder').remove();
		items = [];
		prevHolder = $('<div class="er_prev_holder"></div>');
		if(shortease.def.add_logo && !$('.er_sh_logo').length)
			shortease.def.holder.parent().prepend("<img class='er_sh_logo' src='"+MEDIA_PATH+"images/logo.png' />");
		shortease.def.holder.append(prevHolder);

		for(var i=0;i<st_tools.length;i++){
			if (st_tools[i].title ) {
				var stList = $('<ul id="er_item_'+i+'" data-ix="'+i+'" class="er_item_list"></ul>');
				items[i] = {};
				items[i].thumb = stList;
				items[i].curthumb = 0;
				prevHolder.append(stList);

				var pictures = st_tools[i]['pictures'];
				if (pictures) {
					items[i].pictures = [];
					for(j=0;j<pictures.length;j++){
						var tmpLi = $('<li class="er_prev"></li>');
						tmpLi.append('<img class="er_art_picture" src="'+pictures[j]['address']+'"/>');
						if (j==0) tmpLi.css({'top':'0px'});
						items[i].pictures[j] = tmpLi;
						stList.append(tmpLi);
					}
				}
			}
		}
		numOfArticles = shortease.def.items_number;
		setTimeout(function() {
			itemWidth = $('.er_item_list').outerWidth(true);
			if (!itemWidth) itemWidth = 85;
			prevHolder.width(numOfArticles*itemWidth);
		},1000);
	};


	var thumbs_moveTimer;
	var show = function(){
		shortease.status.preview_show = true;
		clearTimeout(thumbs_moveTimer);
		thumbs_moveTimer = setTimeout (function() { thumbs_move(); }, def.shift_delay);
	}
	
	var hide = function(){
		shortease.status.preview_show = false;
	}

	/***
	*	shift thumnails in prevew
	***/
	var thumbs_move  = function(){
		var thumbs = prevHolder.find('ul');
		if (!document.hidden){
			for(var i=0;i<items.length;i++){
				//thumb = items[i].thumb;
				effect_shift(i);

			}
		}
		if (shortease.status.preview_show) {
			clearTimeout(thumbs_moveTimer);
			thumbs_moveTimer = setTimeout (function() { thumbs_move(); }, def.shift_delay);
		}

		function effect_shift(thumbIx){
			thumbObj = items[i];
			if (!thumbObj.pictures.length || thumbObj.pictures.length < 2) return;  
			//thumb_items = thumb.find('li');
			//thumb_items.css({'top':'-1000px'});
			$(thumbObj.pictures).each(function() { $(this).css({'top':'-1000px'}); });
			//var curThumbIx = thumb.data('curthumb');
			var curThumbIx = thumbObj.curthumb;
			/*if (!curThumbIx && curThumbIx!=0) { /// first time
				thumb.data('curthumb',0); 
				$(thumb_items[0]).css({'top':'0px'});
			} else {*/
			var nextThumbIx = curThumbIx+1 < thumbObj.pictures.length ? curThumbIx+1 : 0;
			var cur_thumb = thumbObj.pictures[curThumbIx];
			var next_thumb = thumbObj.pictures[nextThumbIx];
			// thumb_items.hide();
			cur_thumb.css({'top':'0px'});//.show();
			next_thumb.css({'top':itemWidth+'px'});//.show();
			var move_time = i*def.thumb_gap;	/// every next thumb move in delay for flip effect
			cur_thumb.delay( move_time ).animate({'top':-itemWidth+'px'}, def.shift_duration);
			next_thumb.delay( move_time ).animate({'top':'0px'}, def.shift_duration);
			//thumb.data('curthumb',nextThumbIx);
			thumbObj.curthumb = nextThumbIx; 
			//}
		}
		function effect_fall(thumb){

		}

	}

	var reset = function(){
		prevHolder.parent().css({'left':'0px'});
		buld();
		clearTimeout(thumbs_moveTimer);
	}
	/***
	*	called by shortease moves function
	*	controls preview moves
	***/
	var curPreviewLeft = 0, shift = 0;
	var move = function () { 
/* not neded. changed to scroll
		if (!itemWidth) itemWidth = $('.er_item_list').outerWidth(true);

		var limitEdges = function(shift){
			var MIN_LEFT_POS = 20;
			var MAX_LEFT_POS = -1*(itemWidth*numOfArticles - shortease.def.width + 20);
			if (shift > MIN_LEFT_POS) shift = MIN_LEFT_POS;
			if (shift < MAX_LEFT_POS) shift = MAX_LEFT_POS;
			return shift;
		}

		var changeX = shortease.status.changeX;
		if (changeX) { 
			shift = curPreviewLeft + changeX;
			/// stop shifting on edges 
			shift = limitEdges(shift);
			prevHolder.css({'left':(shift)+'px'});
		} else {
			curPreviewLeft = shift ;
		}
		
		if (!shortease.status.touching_now && Math.abs(shortease.status.touch_speed) > 10) {
			shift = curPreviewLeft + shortease.status.touch_speed*5;
			shift = limitEdges(shift);
			prevHolder.animate({'left':shift+'px'}, 1000);
			//prevHolder.css({'transition':'left 1s', 'left':shift+'px'});
			//setTimeout(function() { prevHolder.css({'transition':'left 0s'}); }, 1000);
		}
		*/
		/*
		prevHolder.stop( true, false );
		if (shortease.status.touch_speed) {
			shift = (shortease.def.width/100) * shortease.status.touch_speed;
			prevHolder.animate({'left':shift+'px'}, 200);
		}
		*/
	};

	/***
	*	prepare reactions for clicks
	***/
	var controls = function(){
		$('.er_item_list').click(function() {
			cardIx = $(this).data('ix');
			shortease.show(cardIx);
			shortease.showCard(cardIx);
			prevHolder.find('.er_arrow').remove();
		});
		var previewHolderWidth = shortease.def.target_holder.width();
		var previewHolderHeight = shortease.def.target_holder.height();
		var scrollHolder = prevHolder.parent();
		var prevewTop = scrollHolder.offset().top;

		/************* DESKTOP ***************/
/*		let scrollingDir = 0;
		var mouseOut = true;
		scrollHolder.mousemove(function( event ) { 
			var pageX = event.originalEvent.pageX;
			var pageY = event.originalEvent.pageY;
			var previewHolderWidth = shortease.def.target_holder.width();
			var previewHolderHeight = shortease.def.target_holder.height();
			mouseIn = pageX > scrollHolder.offset().left && pageX < scrollHolder.offset().left + previewHolderWidth
						&& pageY > scrollHolder.offset().top && pageY < scrollHolder.offset().top + previewHolderHeight
			if (!mouseIn)	scrollHolder.stop();
		});
		prevHolder.mousemove(function( event ) { 
			var pageX = event.originalEvent.pageX;
			var mouseX = pageX - scrollHolder.offset().left;
			var previewHolderWidth = shortease.def.target_holder.width();
			var mouseXperc = mouseX /previewHolderWidth;
			var previewWidth = itemWidth * numOfArticles;
			if (mouseXperc < .25 ) {  /// scroll preview left
				scrollingDir = -1;
				scrollHolder.stop();
				scrollHolder.animate({scrollLeft:'-='+previewWidth+'px'}, { 
					done: function() { scrollingDir = 0;},
					duration : 4000
				});
			} else if (mouseXperc > .75  ) {	/// scroll right
				scrollingDir = 1;
				scrollHolder.stop();
				scrollHolder.animate({scrollLeft:'+='+previewWidth+'px'}, { 
					done: function() { scrollingDir = 0;},
					duration : 4000
				});
			} else if ((mouseXperc >= .25 && mouseXperc <= .75) || mouseOut) {
				scrollingDir = 0;
				scrollHolder.stop();
			}
		});
		*/
		shortease.def.target_holder.mouseenter(function( event ) {
			shortease.def.target_holder.append('<div class="prarr er_left " ></div>')
//style="top:'+(shortease.def.target_holder.position().top + scrollHolder.height() - 25)+'px"
			shortease.def.target_holder.append('<div class="prarr er_right" ></div>')
			//style="top:'+(shortease.def.target_holder.position().top+ scrollHolder.height() - 25)+'px;left:'+ (previewHolderWidth - 25) +'px">
			setDisabledClass();
		}); 
		shortease.def.target_holder.mouseleave(function( event ) { 
			shortease.def.target_holder.find('.prarr').remove();
		});
		$(document).on('click','.er_prev_holder .er_left', function() {
			scrollHolder.animate({scrollLeft:'-='+previewHolderWidth+'px'}, { 
				done: function() { setDisabledClass(); },
				duration : 400,
			});
		});
		$(document).on('click','.er_prev_holder .er_right', function() {
			scrollHolder.animate({scrollLeft:'+='+previewHolderWidth+'px'}, { 
				done: function() { setDisabledClass(); },
				duration : 400
			});
		});
		function setDisabledClass (){
			var curScroll = scrollHolder[0].scrollLeft; 
			prevHolder.find('.er_arrow').removeClass('sh_disabled');
			if  (curScroll < 5)	
				prevHolder.find('.er_left').addClass('sh_disabled');
			if  (curScroll > prevHolder.width() - scrollHolder.width() - 5) 
				prevHolder.find('.er_right').addClass('sh_disabled');
		}
	}
	var init = function(){
		buld();
		controls();

	}
	return {
		init : init,
		move : move,
		show:show,
		hide:hide,
		thumbs_move:thumbs_move,
		items:items,
		reset:reset
	}
}();

var sh_shift_line = function(options) {
	var def = {
		holder : null,
		num_of_items : 0,
		item_margin : 0.5,
		item_duration : 2000,
		min_card_duration : 13000,
		callback : null
	};
	var status = {
		cur_ix : 0,
		cur_percent : 0,
	}
	var items = [];
	var buld = function(){
		if (!def.num_of_items) return;
		var item_width = 100/def.num_of_items - def.item_margin*2;
		var auto_shifter = $('<div class="auto_shifter"></div>'); 
		$(def.holder).append(auto_shifter);
		for (var i=0; i < def.num_of_items;i++){
			var shifter_line = $('<div class="shifter_line" ><div class="shifter_filler"></div></div>');
			shifter_line.css({'width': item_width+'%','margin':'0 '+ def.item_margin + '%'});
			items[i] = shifter_line;
			auto_shifter.append(shifter_line);
		}

		/// calculate item duration
		var total_duration = (def.item_duration * def.num_of_items < def.min_card_duration) ? def.min_card_duration : def.item_duration * def.num_of_items;
		def.item_duration = total_duration / def.num_of_items;
	}
	var start = function(itemIx){ 
		if (itemIx && itemIx != status.cur_ix) {	/// start from specific index
			reset();
			fillTo(itemIx);
		}
		var durationLeft = def.item_duration * ((100 - status.cur_percent) / 100);
		getCurFiller().stop();
		getCurFiller().animate(
							{width:'100%'},
							{ 	
								step: function( now, fx ) { status.cur_percent = now; },
								duration : durationLeft,
								complete: function(a,b) { 
										if (status.cur_ix + 1 < def.num_of_items) {
											status.cur_ix++;
											status.cur_percent = 0;
											def.callback();
											//start();	/// start filling next itetm
										} else { 	/// last item finished
											def.callback();
										}
									 }
						  	});
	}
	var stop = function(){
		getCurFiller().stop();
	}
	var fillTo = function(itemIx) {
		status.cur_ix = itemIx;
		for (var i=0;i<itemIx; i++) {
			getCurFiller(i).css({'width':'100%'});
		}
	}
	var getCurFiller = function(itemIx) {
		if (!itemIx && itemIx != 0 ) itemIx = status.cur_ix;
		var curLine = items[itemIx];
		var curFiller = !curLine ? null :curLine.find('.shifter_filler');
		return curFiller;
	}
	var reset = function(){ 
		stop();
		status.cur_ix = 0;
		status.cur_percent = 0;
		$(items).each(function(ix, item) {
			var filler = $(this).find('.shifter_filler');
			filler.stop();
			filler.width('0%');
		})
	}
	var init = function(options){
		$.extend(def, options);
		buld();
	}
	return {
		init : init,
		start : start,
		status : status,
		stop : stop,
		reset : reset,
		items : items
	}
};

function erLoad (url, callback) {
		var script = document.createElement("SCRIPT");
		script.src = url;
		script.type = 'text/javascript';
		if (callback) script.onload = function() { callback(); };
		document.getElementsByTagName("head")[0].appendChild(script);
}

erLoad("https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js", function() {
	$(document).ready(function() {
		erLoad(MEDIA_PATH+"sites/"+iSiteId+"/init.js?v"+Math.random(), function() {
			shortease.init(shorteaseOptions);
		});
	});
});

function isTouchDevice() {
    return (typeof window.orientation !== "undefined");
}
function sh_shake(shokeObj, repeat, checkClass) {
	let spin_duration = 1000, spin_delay = 4000;
	//transition" : "transform "+(spin_duration/1000)+"s", transform: rotateY(-360deg)
	//shokeObj.css({ "transition" : "transform 0s", transform:" rotateY(90deg)"});
	shokeObj.css({ "transition" : "transform "+(spin_duration/1000)+"s", transform:" rotateY(360deg)"});
	if (repeat) {
		setTimeout(function() { 
			shokeObj.css({ "transition" : "transform 0s", transform:" rotateY(0deg)"});
		 }, spin_duration);		
		setTimeout(function() { 
			if (shokeObj.hasClass(checkClass))	
				sh_shake(shokeObj, repeat, checkClass); 
		 }, spin_delay);
	}
	/*var horizontal_move = 3, 
		horizontal_time = 100,
		vertical_move =3;
	shokeObj.css({ "transition" : "transform "+(horizontal_time/1000)+"s", transform:" rotate(-30deg)"});
	setTimeout(function() { shokeObj.css({  transform:" rotate(0deg)"}); }, horizontal_time);
	setTimeout(function() { shokeObj.css({  transform:" rotate(30deg)"}); }, 2*horizontal_time);
	setTimeout(function() { shokeObj.css({  
											transform:" rotate(0deg)"}); 
											repeat--;
											if (repeat > 0) {
												sh_shake(shokeObj, repeat);
											}
				}, 3*horizontal_time);*/
}

sh_debug = function (message, overwrite = 1){
		var debugDiv = document.getElementById("debugdiv");

		if (!debugDiv) {
			debugDiv = document.createElement('div');
			debugDiv.id = 'debugdiv';
			debugDiv.style.width = '30%';
			debugDiv.style.height = '20%';
			debugDiv.style.position = 'fixed';
			debugDiv.style.zIndex = 1000000;
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

isPageVisible = function(){
	var isVisible = true;
	if ((typeof document.hidden !== "undefined" && document.hidden) ||
		(typeof document.webkitHidden !== "undefined" && document.webkitHidden) ||
		(typeof document.msHidden !== "undefined" && document.msHidden) 
		) {
		isVisible = false;
	}
	return isVisible;
}

Array.prototype.max = function() {
  return Math.max.apply(null, this);
};

Array.prototype.min = function() {
  return Math.min.apply(null, this);
};