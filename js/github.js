//by zfuns
var replist = document.getElementById("list-content");

(async function () {
    loadDiv.innerHTML = _LoadingHtml;
var api_url="https://api.github.com/orgs/unwd/repos";
var data = await fetch(api_url).then(function(response) {
    return response.json();
}).catch(function(err) {
    return;
});
if (!data) {
    var err_info = document.getElementById("loader-info")
    err_info.style.display="block";
} else {
    var loadingMask = document.getElementById('loader');
        loadingMask.parentNode.removeChild(loadingMask);
}
for(var x in data)
{
    var repo_language ='';
    if (data[x]['language']){
        var repo_language = `
        <span class="language">
        <i title="${data[x]['language']}"></i>
        ${data[x]['language']}
        </span>`;
    }

    const itemtem = `
    <div class="list-item">
    <a href="${data[x]['html_url']}" target=_blank rel="noopener">
    <div class=list-item-nr>
        <div class="item-title">
            ${data[x]['name']}
        </div>
        <div class="item-sub">
            ${data[x]['description']}
        </div>

        <div class="item-bar">
            <span>
                <i class="fad fa-star"></i>
                ${data[x]['stargazers_count']}
            </span>
            ${repo_language}
            <span class="forks_count">
                <i class="fad fa-random"></i>
                ${data[x]['forks_count']}
            </span>
        </div>
    </div>
    </a>
    </div>`;
    replist.innerHTML = replist.innerHTML + itemtem;
    replist.classList.add('list-content-show');
}
})();
