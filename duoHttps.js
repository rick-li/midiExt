(function() {
    var els = Array.prototype.slice.call(document.querySelectorAll('a[href]'));
    els.forEach(function(el) {

        if (isHttpHref(el.href)) {
            //console.log(el.href)
            el.href = el.href.replace('http:', 'https:');
        }
    });

    function isHttpHref(href) {

        return href && !/#$/.test(href) && /^http:/.test(href);
    }
})()