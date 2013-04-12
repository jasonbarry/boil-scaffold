/**
 * Wraps the {@code document.querySelectorAll()} function.
 * @param {String} qs The query selector.
 * @return {HTMLElement | Array} The matching HTMLElement, or an array of matching elements.
 * if multiple matches, convert nodelist to array
 * if single match, return single htmlelement
 * if no matches, return empty array
 */
var $ = function(qs) {
    var matches = document.querySelectorAll(qs);
    return (matches.length === 1) ? matches[0] : [].slice.call(matches);
};

/**
 * Extends {@code Array.forEach()} functionality on {@code HTMLElement} objects.
 * @param {Function} fn The function to perform on this element.
 */
HTMLElement.prototype.forEach = function(fn) {
    fn(this);
};

var J = {};

// returns browser's transition end event
J.Event = {
    transitionEnd: function () {
    	var domStyle = document.body.style;
        if ('webkitTransition' in domStyle) {
            return 'webkitTransitionEnd';
        }
        else if ('mozTransition' in domStyle) {
            return 'transitionend';
        }
        else if ('oTransition' in domStyle) {
            return 'otransitionend';
        }
        else {
            return 'transitionend';
        }
    }
};