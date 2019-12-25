var po = console.info;

function et (translate_string) {
	return t && t[translate_string] ? t[translate_string] : translate_string;
}

function etl (translate_string) {
	return tl && tl[translate_string] ? tl[translate_string] : translate_string;
}

(function ($) {

    $.fn.filterByData = function (prop, val) {
        var $self = this;
        if (typeof val === 'undefined') {
            return $self.filter(
                function () { return typeof $(this).data(prop) !== 'undefined'; }
            );
        }
        return $self.filter(
            function () { return $(this).data(prop) == val; }
        );
    };

})(window.jQuery);


function arrayMin(arr) {
  var len = arr.length, min = Infinity;
  while (len--) {
    if (arr[len] < min) {
      min = arr[len];
    }
  }
  return min;
};

function arrayMax(arr) {
  var len = arr.length, max = -Infinity;
  while (len--) {
    if (arr[len] > max) {
      max = arr[len];
    }
  }
  return max;
};


var getInteresRate = function(impressions, purchases, pause_times, view_times, swipes, descriptions) {
   po(impressions, purchases, pause_times, view_times, swipes, descriptions);
   var MAX_PURCHASE = 0.1, MAX_PAUSE = 0.5, MAX_VIEW = 10, MAX_SWIPE = 0.2, MAX_DESCRIPTIONS = 0.5;
   var PURCHASE_WEIGHT = 1.2, PAUSE_WEIGHT = 0.6, VIEW_WEIGHT = 0.4, SWIPE_WEIGHT = -0.1, DESCRIPTIONS_WEIGHT =  0.2; 

   var purchase_mark = Math.min((purchases/impressions)/MAX_PURCHASE*100, 100);
   var pause_mark = Math.min((pause_times/impressions)/MAX_PAUSE*100, 100);
   var view_mark = Math.min((view_times/impressions)/MAX_VIEW*100, 100);
   var swipe_mark = Math.min((swipes/impressions)/MAX_SWIPE*100, 100);
   var descriptions_mark = Math.min((descriptions/impressions)/MAX_DESCRIPTIONS*100, 100);
   var mark = purchase_mark * PURCHASE_WEIGHT + pause_mark * PAUSE_WEIGHT + view_mark * VIEW_WEIGHT + swipe_mark * SWIPE_WEIGHT + descriptions_mark * DESCRIPTIONS_WEIGHT ;
   if (!mark || mark < 0) mark = 0;
   po(mark, purchase_mark, pause_mark, view_mark, swipe_mark, descriptions_mark);
   return mark;
}


function divCalc(val1, val2){
   if (val1 == 0 || val2 == 0) {
      return 0;
   } else {
      return val1/val2;
   }
}

function divPercCalc(val1, val2){
   var res = divCalc(val1, val2)*100;
   if (res < 0) res = 0;
   if (res > 100) res = 100;
   return res
}
