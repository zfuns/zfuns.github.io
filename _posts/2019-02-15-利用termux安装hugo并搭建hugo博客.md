---
title: "利用termux安装hugo并搭建hugo博客"
date: 2019-02-15T13:58:14Z
lastmod: 2019-02-15T13:58:14Z
draft: false
keywords: []
description: ""
tags: [termux,hugo,github,备份]
categories: []
comment: true
---

一、安装配置
termux安装hugo
```
apt install hugo
```
1.生成站点
```
hugo new site blog
```
2.进入
```
cd blog
```
3.下载主题
```
git clone https://github.com/olOwOlo/hugo-theme-even themes/even
```
重要: 在主题的 exampleSite 目录下有一个 config.toml 文件，将这个 config.toml 文件复制到你的站点目录下，根据自己的需求更改即可。
```
cp themes/even/exampleSite/config.toml ~
```
注意: 对于这个主题，你应该使用 post 而不是 posts，即 hugo new post/some-content.md。
三、关于部署
1.假设你需要部署在 GitHub Pages 上，首先在GitHub上创建一个Repository，命名为：coderzh.github.io （coderzh替换为你的github用户名）。
2.生成ssh密匙
```
ssh-keygen -t rsa -C "你github登录邮箱"
```
直接回车3次生成成功
```
cat .ssh/id_rsa.pub
```
复制内容添加到github ssh密匙
3.在站点根目录执行 Hugo 命令生成最终页面：提示theme=后面是你下载主题的名称，baseUrl双引号中改成你自己项目的地址
```
$ hugo --theme=hyde --baseUrl="http://coderzh.github.io/"
```
<!--more-->
如果一切顺利，所有静态页面都会生成到 public 目录，将pubilc目录里所有文件 push 到刚创建的Repository的 master 分支。
```
cd public
git init
git remote add origin https://github.com/coderzh/coderzh.github.io.git
git add -A
git commit -m "first commit"
git push -u origin master
```
浏览器里访问：http://coderzh.github.io/

二、备份

1.进入博客目录
```
cd blog
```

2.初始化版本库

```
git init
```

3.github或者gitee新建一个仓库blog


4.连接到远程库
```
git remote add origin https://gitee.com/xxx/blog.git
```
5.进入主题目录
```
cd /themes/xxxx
```
6.将主题设置为子模
```
git submodule init
```
7.在blog目录下新建忽略文件
```
vim .gitignore
```
8.输入忽略的文件夹
```
public/
```

9.添加全部博客文件

```
git add -A
```

10.注释
```
git commit -m "hugo博客备份"
```

11.第一次部署强制上传到服务器
```
git push -u origin master
```

12.以后在更新直接更新
```

git push origin master
```

三、恢复

1.克隆备份的blog
```
git clone git@gitee.com:xxx/blog.git
```
2.进入主题目录更新主题
```
cd /theme/even
```
3.初始化子模
```
git submodule init
```
4.更新主题
```
git submodule update
```
由于hugo需要将生成的文件通过git 一个命令一个是操作，我想到一个备份，使用脚本，执行一下运行包括生成部署所有的命令 。
1.vim建主一个脚本文件文件名可以任意设置
```
vim building.sh
```
加入内容
```
hugo -D 
cd public
git add -A
git commit -m "生成部署到网站"
git push origin master
```
添加权限
```
chmod 777  building.sh
```
后续直接在hugo目录下执行就自动生成部署了
```
./building.sh
```


