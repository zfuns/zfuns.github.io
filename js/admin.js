//by zfuns
//静态博客后台管理
//有时间在继续搞
var req = {};
req.query = function(){
  const json = {};
  const prestr= location.search;
  const str =prestr.slice(1); 
  if(str.includes('&')){
    const params = str.split('&');
    params.forEach((item,index)=>{
      splits(item)
    })
  }else{
    splits(str)
  }
  function splits(e){
    const par= e.split('=')
    json[par[0]] =par[1]
  }
  return json;
}()
//alert(JSON.stringify(req.query))

dynamic_content = document.querySelector('#dynamic-content');


/*
if (req.query.access_token){
  alert(req.query.access_token)
}
*/

switch(req.query.page){
  case 'new_post':
    page_new_post();
    break;
  case 'edit_post':
    page_edit_post();
    break;
  default:
    isLogin();
}


async function curl(method,url,payload){
  const access_token = localStorage.access_token;
  if(method != 'GET'){
    const data = await fetch(url,{
      method: method,
      body: JSON.stringify(payload),
      headers: {
        "Accept": "application/json",
        'content-type': 'application/json',
        "User-Agent": "zfuns",
        "Authorization": `token ${access_token}`
      }
    }).then(function(response) {
      return response.json();
    }).catch(function(err) {
      return;
    });
    return data;
  } else {
    console.log(url)
    const data = await fetch(url,{
      headers: {
        "Accept": "application/json",
        "User-Agent": "zfuns",
        "Authorization": `token ${access_token}`
      }
    }).then(function(response) {
      return response.json();
    }).catch(function(err) {
      return;
    });
    return data;
  }
}

async function isLogin(){
  if(localStorage.access_token){
    FileList();
  }else{
    if(req.query.access_token){
      localStorage.access_token = req.query.access_token;
    }else{
      dynamic_content.innerHTML = `<a href="https://github.com/login/oauth/authorize?client_id=f79c789ffe1b721ace9c&redirect_uri=https://send.xda.plus/api/gitlogin&scope=repo">github登录</a>`;
    }
  }
}

async function FileList(){
  const json = await curl('GET',"https://api.github.com/repos/zfuns/blog/contents/source/_posts")
  dynamic_content.innerHTML = `<h4 class="list-title">文章列表</h4>`;
  json.forEach((item)=>{
    console.log(item.name)
    dynamic_content.innerHTML += `<div><p>${item.name}<span><a href="/admin?page=edit_post&post_name=${item.name}">编辑</a></span></p></div>`
  })
}

//var encodedData = window.btoa("Hello, world");
//alert(encodedData)
//
async function page_new_post(){
  dynamic_content.innerHTML = `
  <h4 class="list-title">撰写新文章</h4>
  <input id="new_file_name" type="text" value="文件名.md"></input>
  <div id="admin-header">
    <span>撰写</span>
    <span>预览</span>
  </div>
  <textarea id="new_file_value" type="text">
  title: 文章标题
tags:
    - test
categories:
    - 默认分类
date: 2015-1-1
comments: false
---
文章内容</textarea>
<p>
  <button onclick="btn_save_file()">保存文章</button>
</p>
  `;
}

async function page_edit_post(){
  dynamic_content.innerHTML = `
  <h4 class="list-title">编辑文章</h4>
  <input id="new_file_name" type="text" value="${decodeURI(req.query.post_name)}"></input>
  <div id="admin-header">
    <span>撰写</span>
    <span>预览</span>
  </div>
  <textarea id="new_file_value" type="text">${Base64.decode((await curl("GET", "https://api.github.com/repos/zfuns/blog/contents/source/_posts/"+req.query.post_name, '')).content)}</textarea>
  <p>
  <button onclick="btn_save_file()">保存文章</button>
  <p>
  `;
}

async function btn_save_file(){
  new_file_name = document.querySelector('#new_file_name');
  new_file_value = document.querySelector('#new_file_value');
  const url = `https://api.github.com/repos/zfuns/gatsby/contents/${new_file_name.value}`;
  console.log(new_file_value.value)
  const content = Base64.encode(new_file_value.value)
  const payload = {
    message: new_file_name.value,
    content: content
  }
  console.log(new_file_value.value)
  const res = await curl('PUT',url,payload);
  console.log(res)
  if(res.content){
    alert('保存成功')
  }else{
    if(res.message.indexOf('sha') != -1){
      alert('文件已存在')
    }else{
      alert('失败:'+res.message)
    }
  }
}

async function page_edit_post_save(){
  new_file_name = document.querySelector('#new_file_name');
  new_file_value = document.querySelector('#new_file_value');
  const url = `https://api.github.com/repos/zfuns/gatsby/contents/${new_file_name.value}`;
  console.log(new_file_value.value)
  const content = Base64.encode(new_file_value.value)
  const payload = {
    message: '修改文章',
    sha: sha,
    content: content
  }
  console.log(new_file_value.value)
  const res = await curl('PUT',url,payload);
  console.log(res)
  if(res.content){
    alert('保存成功')
  }else{
    if(res.message.indexOf('sha') != -1){
      alert('文件已存在')
    }else{
      alert('失败:'+res.message)
    }
  }
}
