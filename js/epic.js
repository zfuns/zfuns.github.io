//by zfuns
var replist = document.getElementById("list-content");

(async function () {
    loadDiv.innerHTML = _LoadingHtml;
var api_url="https://api.xda.plus/api/epic";
var data = await fetch(api_url).then(function(res) {
    return res.json();
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
for(var x in data){
    const itemtem = `
    <div class="list-item">
    <a href="${data[x]['url']}">
    <div class=list-item-nr>
        <div class="item-title">
            ${data[x]['title']}
        </div>
        <img src="${data[x]['image']}"><img>
        <div class="item-sub">
            ${data[x]['description']}
        </div>
        <div class="list-item-bar">
            <span>
                ${formatUTC(data[x]['start'])}
            </span>
            <span class="icon">
                <i class="fa-light fa-shuffle"></i>
            </span>
            <span>
                ${formatUTC(data[x]['end'])}
            </span>
        </div>
    </div>
    </a>
    </div>`;
    replist.innerHTML = replist.innerHTML + itemtem;
    replist.classList.add('list-content-show');
}
})();
function formatUTC(utc_datetime) {
  var T_pos = utc_datetime.indexOf('T');
  var Z_pos = utc_datetime.indexOf('Z');
  var year_month_day = utc_datetime.substr(0,T_pos);
  var hour_minute_second = utc_datetime.substr(T_pos+1,Z_pos-T_pos-1);
  var new_datetime = year_month_day+" "+hour_minute_second;
  timestamp = new Date(Date.parse(new_datetime));
  timestamp = timestamp.getTime();
  timestamp = timestamp/1000;
  var timestamp = timestamp+8*60*60;
  var beijing_datetime = new Date(parseInt(timestamp) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/ 日/g, " ").replace(/上午12:/g,"");
  return beijing_datetime;
}
