/* global NexT, CONFIG, Velocity */

NexT.boot = {};

NexT.boot.registerEvents = function() {

    NexT.utils.registerScrollPercent();
    NexT.utils.registerCopyCode();

};

NexT.boot.refresh = function() {

  /**
   * Register JS handlers by condition option.
   * Need to add config option in Front-End at 'layout/_partials/head.swig' file.
   */
  CONFIG.fancybox && NexT.utils.wrapImageWithFancyBox();
  CONFIG.mediumzoom && window.mediumZoom('.post :not(a) > img, .post > img');
  CONFIG.lazyload && window.lozad('.post img').observe();
  CONFIG.pangu && window.pangu.spacingPage();

  CONFIG.exturl && NexT.utils.registerExtURL();
  CONFIG.copycode.enable && NexT.utils.registerCopyCode();
};
document.addEventListener('DOMContentLoaded', () => {
  NexT.boot.registerEvents();
  NexT.boot.refresh();
});
