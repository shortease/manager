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

