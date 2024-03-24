//by zfuns
var replist = document.getElementById("list-content");

//1是追番，2是追剧
var type = 1;
//b站用户id
var vmid = 21729742;

async function get_bili_data (pn) {
    loadDiv.innerHTML = _LoadingHtml;
    var next_button="";
    if (pn > 1){
        var api_url=`https://api.xda.plus/api/bilibili?pn=${pn}`;
    }else{
        var api_url="https://api.xda.plus/api/bilibili";
    }
var bilibili_data = await fetch(api_url).then(function(res) {
    return res.json();
}).catch(function(err) {
    return;
});
var data= bilibili_data.data.list;
if (!data) {
    var err_info = document.getElementById("loader-info");
    err_info.style.display="block";
} else {
    var loadingMask = document.getElementById('loader');
        loadingMask.parentNode.removeChild(loadingMask);
}
console.log(bilibili_data.data['pn'])
if (bilibili_data.data['pn'] < bilibili_data.data['ps'] - 1){
    if (bilibili_data.data['pn'] > 1){
        var next_button = `
            <div class="page-navigator">
    <button class="extend prev" onclick="get_bili_data(${pn-1})">
    <i class="fad fa-angle-double-left"></i>
    </button>
    <span class="page-number current">${pn}</span>
    <button class="extend next" onclick="get_bili_data(${pn+1})">
    <i class="fad fa-angle-double-right"></i>
    </button>
  </div>`;
    }else{
        var next_button = `
        <div class="page-navigator">
        <span class="page-number current">${pn}</span>
        <button class="extend next" onclick="get_bili_data(${pn+1})">
        <i class="fad fa-angle-double-right"></i>
        </button>
        </div>
        `;
        }
}else {
    if (bilibili_data.data['pn'] > 1){
        var next_button = `
        <div class="page-navigator">
        <button class="extend prev" onclick="get_bili_data(${pn-1})">
        <i class="fad fa-angle-double-left"></i>
        </button>
        <span class="page-number current">${pn}</span>
            <p class="nonext">--到底了--</p>
            `;
    }else{
    var next_button = `
            <p class="nonext">--到底了--</p>
            `;
    }
}
var itemtem="";
for(var x in data){
    if (data[x]['horizontal_cover_16_9']){
        var cover = data[x]['horizontal_cover_16_9'].replace(/^http?\:/i, "");
    }else{
        var cover = data[x]['first_ep_info']['cover'].replace(/^http?\:/i, "");
    }
    var itemtem = itemtem + `
    <div class="list-item">
    <a href="${data[x]['url']}">
    <div class=list-item-nr>
        <div class="item-title">
            ${data[x]['title']}
        </div>
        <img src="${cover}" referrerpolicy="noreferrer"><img>
        <div class="item-sub">
            ${data[x]['evaluate']}
        </div>
        <div class="list-item-bar">
            <span>
                ${data[x]['season_type_name']}  <i class="fa-duotone fa-pipe"></i>  ${data[x]['areas']['0']['name']}
            </span>
            <span class="icon"></span>
            <span>
                ${data[x]['new_ep']['index_show']}
            </span>
        </div>
    </div>
    </a>
    </div>
        `;
}
    replist.innerHTML = itemtem + next_button;
    replist.classList.add('list-content-show');
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

get_bili_data(1);
