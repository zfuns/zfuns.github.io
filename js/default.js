console.log('Hello Wolrd!');
var loadDiv = document.querySelector('#loadDiv');
var _LoadingHtml = `
<div id="loader">
  <div id="shadow"></div>
  <div id="box"></div>
</div>
<p id="loader-info">加载失败<br>api无法访问<p>`;

var Cog = document.querySelector('.cog');
    Cog.addEventListener('click', () => {
    alert("功能还没写呢\n('・ω・') ");
});
/*
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/sw.js', {scope: '/'})
      .then(function (registration) {
        // 注册成功
        registration.update();
        console.log('ServiceWorker 注册成功 范围: ', registration.scope)
      })
      .catch(function (err) {
        // 注册失败:(
        console.log('ServiceWorker 注册失败: ', err)
      })
  })
}*/

