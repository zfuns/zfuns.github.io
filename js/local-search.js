/* global CONFIG, pjax, LocalSearch */
alert('本地搜索加载')
  const localSearch = new LocalSearch({
    path             : CONFIG.path,
    top_n_per_article: CONFIG.localsearch.top_n_per_article,
    unescape         : CONFIG.localsearch.unescape
  });
  const input = document.querySelector('.search-input');
  const inputEventFunction = () => {
    if (!localSearch.isfetched) return;
    const searchText = input.value.trim().toLowerCase();
    const keywords = searchText.split(/[-\s]+/);
    const container = document.querySelector('.search-result-container');
    let resultItems = [];
    if (searchText.length > 0) {
      // Perform local searching
      resultItems = localSearch.getResultItems(keywords);
    }
    if (keywords.length === 1 && keywords[0] === '') {
      container.classList.add('no-result');
      container.innerHTML = '<img src="/images/search-bg.svg"></img>';
    } else if (resultItems.length === 0) {
      container.classList.add('no-result');
      container.innerHTML = '<div class="search-result-icon"><i class="far fa-frown fa-5x"></i>6666</div>';
    } else {
      resultItems.sort((left, right) => {
        if (left.includedCount !== right.includedCount) {
          return right.includedCount - left.includedCount;
        } else if (left.hitCount !== right.hitCount) {
          return right.hitCount - left.hitCount;
        }
        return right.id - left.id;
      });
      const stats = resultItems.length+'个搜索结果';

      container.classList.remove('no-result');
      container.innerHTML = `<div class="search-stats">${stats}</div>
        <hr>
        <ul class="search-result-list">${resultItems.map(result => result.item).join('')}</ul>`;
      if (typeof pjax === 'object') pjax.refresh(container);
    }
  };

  localSearch.highlightSearchWords(document.querySelector('.page-panel'));
  if (CONFIG.localsearch.preload) {
    localSearch.fetchData();
  }

  if (CONFIG.localsearch.trigger === 'auto') {
    input.addEventListener('input', inputEventFunction);
  } else {
    document.querySelector('.search-icon').addEventListener('click', inputEventFunction);
    input.addEventListener('keypress', event => {
      if (event.key === 'Enter') {
        inputEventFunction();
      }
    });
  }
  window.addEventListener('search:loaded', inputEventFunction);

  // Handle and trigger popup window
  document.querySelectorAll('.popup-trigger').forEach(element => {
    element.addEventListener('click', () => {
      document.body.classList.add('search-active');
      // Wait for search-popup animation to complete
      setTimeout(() => input.focus(), 500);
      if (!localSearch.isfetched) localSearch.fetchData();
    });
  });


