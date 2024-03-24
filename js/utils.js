/* global NexT, CONFIG */

HTMLElement.prototype.wrap = function(wrapper) {
  this.parentNode.insertBefore(wrapper, this);
  this.parentNode.removeChild(this);
  wrapper.appendChild(this);
};

NexT.utils = {

  /**
   * Wrap images with fancybox.
   */
  wrapImageWithFancyBox: function() {
    document.querySelectorAll('.post-body :not(a) > img, .post-body > img').forEach(element => {
      var $image = $(element);
      var imageLink = $image.attr('data-src') || $image.attr('src');
      var $imageWrapLink = $image.wrap(`<a class="fancybox fancybox.image" href="${imageLink}" itemscope itemtype="http://schema.org/ImageObject" itemprop="url"></a>`).parent('a');
      if ($image.is('.post-gallery img')) {
        $imageWrapLink.attr('data-fancybox', 'gallery').attr('rel', 'gallery');
      } else if ($image.is('.group-picture img')) {
        $imageWrapLink.attr('data-fancybox', 'group').attr('rel', 'group');
      } else {
        $imageWrapLink.attr('data-fancybox', 'default').attr('rel', 'default');
      }

      var imageTitle = $image.attr('title') || $image.attr('alt');
      if (imageTitle) {
        $imageWrapLink.append(`<p class="image-caption">${imageTitle}</p>`);
        // Make sure img title tag will show correctly in fancybox
        $imageWrapLink.attr('title', imageTitle).attr('data-caption', imageTitle);
      }
    });

    $.fancybox.defaults.hash = false;
    $('.fancybox').fancybox({
      loop   : true,
      helpers: {
        overlay: {
          locked: false
        }
      }
    });
  },

  registerExtURL: function() {
    document.querySelectorAll('span.exturl').forEach(element => {
      let link = document.createElement('a');
      // https://stackoverflow.com/questions/30106476/using-javascripts-atob-to-decode-base64-doesnt-properly-decode-utf-8-strings
      link.href = decodeURIComponent(atob(element.dataset.url).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      link.rel = 'noopener external nofollow noreferrer';
      link.target = '_blank';
      link.className = element.className;
      link.title = element.title;
      link.innerHTML = element.innerHTML;
      element.parentNode.replaceChild(link, element);
    });
  },

  /**
   * One-click copy code support.
   */
  registerCopyCode: function() {
    document.querySelectorAll('figure.highlight').forEach(element => {
      const box = document.createElement('div');
      element.wrap(box);
      box.classList.add('highlight-container');
      box.insertAdjacentHTML('beforeend', '<div class="copy-btn"><i class="fa fa-clipboard fa-fw"></i></div>');
      var button = element.parentNode.querySelector('.copy-btn');
      button.addEventListener('click', event => {
        var target = event.currentTarget;
        var code = [...target.parentNode.querySelectorAll('.code .line')].map(line => line.innerText).join('\n');
        var ta = document.createElement('textarea');
        ta.style.top = window.scrollY + 'px'; // Prevent page scrolling
        ta.style.position = 'absolute';
        ta.style.opacity = '0';
        ta.readOnly = true;
        ta.value = code;
        document.body.append(ta);
        const selection = document.getSelection();
        const selected = selection.rangeCount > 0 ? selection.getRangeAt(0) : false;
        ta.select();
        ta.setSelectionRange(0, code.length);
        ta.readOnly = false;
        var result = document.execCommand('copy');
        if (CONFIG.copycode.show_result) {
          target.querySelector('i').className = result ? 'fa fa-check fa-fw' : 'fa fa-times fa-fw';
        }
        ta.blur(); // For iOS
        target.blur();
        if (selected) {
          selection.removeAllRanges();
          selection.addRange(selected);
        }
        document.body.removeChild(ta);
      });
      button.addEventListener('mouseleave', event => {
        setTimeout(() => {
          event.target.querySelector('i').className = 'fa fa-clipboard fa-fw';
        }, 300);
      });
    });
  },

  wrapTableWithBox: function() {
    document.querySelectorAll('table').forEach(element => {
      const box = document.createElement('div');
      box.className = 'table-container';
      element.wrap(box);
    });
  },

  registerVideoIframe: function() {
    document.querySelectorAll('iframe').forEach(element => {
      const supported = [
        'www.youtube.com',
        'player.vimeo.com',
        'player.youku.com',
        'player.bilibili.com',
        'www.tudou.com'
      ].some(host => element.src.includes(host));
      if (supported && !element.parentNode.matches('.video-container')) {
        const box = document.createElement('div');
        box.className = 'video-container';
        element.wrap(box);
        let width = Number(element.width);
        let height = Number(element.height);
        if (width && height) {
          element.parentNode.style.paddingTop = (height / width * 100) + '%';
        }
      }
    });
  },

  registerScrollPercent: function() {
    var THRESHOLD = 50;
    var backToTop = document.querySelector('.back-to-top');
    var readingProgressBar = document.querySelector('.reading-progress-bar');
    // For init back to top in sidebar if page was scrolled after page refresh.
    window.addEventListener('scroll', () => {
      if (backToTop || readingProgressBar) {
        var docHeight = document.querySelector('.clearfix').offsetHeight;
        var winHeight = window.innerHeight;
        var contentVisibilityHeight = docHeight > winHeight ? docHeight - winHeight : document.body.scrollHeight - winHeight;
        var scrollPercent = Math.min(100 * window.scrollY / contentVisibilityHeight, 100);
        if (backToTop) {
          backToTop.classList.toggle('back-to-top-on', window.scrollY > THRESHOLD);
          backToTop.querySelector('span').innerText = Math.round(scrollPercent) + '%';
        }
        if (readingProgressBar) {
          readingProgressBar.style.width = scrollPercent.toFixed(2) + '%';
        }
      }
    });

    backToTop && backToTop.addEventListener('click', () => {
      window.anime({
        targets  : document.scrollingElement,
        duration : 500,
        easing   : 'linear',
        scrollTop: 0
      });
    });
  },


};
