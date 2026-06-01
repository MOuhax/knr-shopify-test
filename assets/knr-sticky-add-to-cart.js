(function () {
  function currentOptions() {
    var seen = [];

    return Array.from(document.querySelectorAll('variant-selects fieldset input:checked, variant-selects select'))
      .map(function (input) {
        return input.tagName === 'SELECT' ? input.options[input.selectedIndex].text : input.value;
      })
      .filter(function (option) {
        if (!option || seen.indexOf(option) !== -1) return false;
        seen.push(option);
        return true;
      });
  }

  function currentPrice(sectionId) {
    var price = document.querySelector('#price-' + sectionId + ' .price-item--sale');
    price = price || document.querySelector('#price-' + sectionId + ' .price-item--regular');
    return price ? price.textContent.trim() : '';
  }

  function syncStickyCart(variant) {
    var bar = document.querySelector('.knr-sticky-cart');
    if (!bar) return;

    var sectionId = bar.dataset.sectionId;
    var options = bar.querySelector('.knr-sticky-cart__options');
    var price = bar.querySelector('.knr-sticky-cart__price');
    var image = bar.querySelector('.knr-sticky-cart__image');
    var button = bar.querySelector('[data-sticky-add-to-cart]');
    var mainButton = document.querySelector('#ProductSubmitButton-' + sectionId);

    if (options) {
      options.innerHTML = currentOptions()
        .map(function (option) {
          return '<span>' + option + '</span>';
        })
        .join('');
    }

    if (price) price.textContent = currentPrice(sectionId) || price.textContent;

    if (variant && variant.featured_media && variant.featured_media.preview_image && image) {
      image.src = variant.featured_media.preview_image.src;
    }

    if (button && mainButton) {
      button.disabled = mainButton.disabled || mainButton.getAttribute('aria-disabled') === 'true';
      button.querySelector('span').textContent = mainButton.querySelector('span').textContent.trim();
    }
  }

  function mainButton(sectionId) {
    return document.querySelector('#ProductSubmitButton-' + sectionId);
  }

  function updateVisibility() {
    var bar = document.querySelector('.knr-sticky-cart');
    if (!bar) return;

    var button = mainButton(bar.dataset.sectionId);
    if (!button || window.innerWidth < 750) {
      bar.classList.remove('is-visible');
      return;
    }

    var rect = button.getBoundingClientRect();
    var isVisible = rect.bottom > 0 && rect.top < window.innerHeight;

    bar.classList.toggle('is-visible', !isVisible);
  }

  function initVisibility() {
    var bar = document.querySelector('.knr-sticky-cart');
    if (!bar) return;

    var button = mainButton(bar.dataset.sectionId);
    if (!button) return;

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        bar.classList.toggle('is-visible', !entries[0].isIntersecting && window.innerWidth >= 750);
      }).observe(button);
    } else {
      updateVisibility();
      window.addEventListener('scroll', updateVisibility, { passive: true });
    }

    window.addEventListener('resize', updateVisibility);
  }

  document.addEventListener('click', function (event) {
    if (!event.target.closest('[data-sticky-add-to-cart]')) return;

    var sectionId = event.target.closest('.knr-sticky-cart').dataset.sectionId;
    var mainButton = document.querySelector('#ProductSubmitButton-' + sectionId);
    if (mainButton) mainButton.click();
  });

  if (typeof subscribe === 'function' && typeof PUB_SUB_EVENTS !== 'undefined') {
    subscribe(PUB_SUB_EVENTS.variantChange, function (event) {
      syncStickyCart(event.data.variant);
    });
  }

  window.addEventListener('load', function () {
    syncStickyCart();
    initVisibility();
  });

  initVisibility();
})();
