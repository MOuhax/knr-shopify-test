(function () {
  var gap = 40;

  function h(selector) {
    var el = document.querySelector(selector);
    return el ? el.getBoundingClientRect().height : 0;
  }

  function update() {
    var info = document.querySelector('.product__info-wrapper.grid__item');
    var product = document.querySelector('.product--columns') || document.querySelector('.product');
    if (!info || !product) return;

    if (window.innerWidth < 750) {
      info.removeAttribute('style');
      return;
    }
    var stickyTop = h('.announcement-bar') + h('.header-wrapper') + gap;
    var productTop = product.getBoundingClientRect().top + window.scrollY;
    var productBottom = productTop + product.offsetHeight;
    var stopScroll = productBottom - info.offsetHeight - stickyTop;



    if (window.scrollY >= stopScroll) {
      info.style.position = 'static';
      info.style.top = 'auto';
      info.style.bottom = '0';
      info.style.right = '0';
      info.style.width = '';
    } else if (window.scrollY > productTop - stickyTop) {

      info.style.position = 'static';
      info.style.top = Math.max(stickyTop - product.getBoundingClientRect().top, 0) + 'px';
      info.style.bottom = 'auto';
      info.style.right = '0';
      info.style.width = '';
      
    } else {
      var rect = info.getBoundingClientRect();
      info.style.position = 'fixed';
      info.style.top = stickyTop + 'px';
      info.style.right = window.innerWidth - rect.right + 'px';
      info.style.bottom = 'auto';
      info.style.width = rect.width + 'px';
      
    }
  }

  window.addEventListener('load', update);
  window.addEventListener('resize', update);
  window.addEventListener('scroll', update, { passive: true });
  update();
})();
