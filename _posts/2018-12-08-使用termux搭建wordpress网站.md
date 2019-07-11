---
title: 使用termux搭建wordpress网站
date: 2018-12-08 17:03:19
tags: 
- termux 
- wordpress 
- 网站 
- 博客
- mysql
- php
categories: 
- 应用软件
comments: true
---
wordpress介绍
====
&emsp;&emsp; WordPress 是一种使用 PHP 语言和 MySQL 数据库开发的开源、免费的 Blog（博客，网志）引擎，用户可以在支持 PHP，MySQL 数据库的服务器上建立自己的 Blog。
&emsp;&emsp; termux基于Linux，当然可以安装数据库当然也可以使用wordpress。
MariaDB 数据库管理系统是 MySQL 的一个分支，主要由开源社区在维护，采用 GPL 授权许可。开发这个分支的原因之一是：甲骨文公司收购了 MySQL 后，有将 MySQL 闭源的潜在风险，因此社区采用分支的方式来避开这个风险。
# 一、安装
1. 安装 mariadb
```
pkg install mariadb
```
2. 安装基本数据
```
mysql_install_db
```
3. 启动 mariadb 服务修改密码后续使用必须开启后台服务否则报错。
```
mysqld
```
如果提示错误没有my.cnf.d文件夹下面创建创建文件夹
```
mkdir $PREFIX/etc/my.cnf.d
```

需要在次初始化数据库
```
mysql_install_db
```
直接mysqld退出后必须重新启动才能使用，可以通过tmux来管理就不需要重启了
```
tmux new -s mysql
```
启动数据库服务器
```
mysqld
```
4.打开一个新窗口修改密码
```
mysql_secure_installation
```
输入当前输入密码
因为是空密码, 这里默认 回车
```
Enter current password for root (enter for none):
```
设置新密码 
这里设置新的root密码
```
Set root password? [Y/n] y
New password:
Re-enter new password:
```
其他设置下面根据个人偏好来进行设置,没有绝对的要求
```
Remove anonymous users? [Y/n] Y                #是否移除匿名用户
Disallow root login remotely? [Y/n] n          #是否不允许root远程登录
Remove test database and access to it? [Y/n] n #是否移除test数据库
Reload privilege tables now? [Y/n] y           #是否重新加载表的权限
```
5.安装PHP
```
pkg install php
```
<escape><!-- more --></escape>
# 二、使用PHP服务器web server
1. 新建数据库 提示下面*就是之前设置的密码
```
mysql -uroot -p*** -e"create database wordpress;show databases;"
```
2. 下载解压 wordpress
```
wget https://cn.wordpress.org/wordpress-5.0.3-zh_CN.tar.gz
tar -zxvf wordpress-5.0.3-zh_CN.tar.gz
```
3. 进入wordpress文件夹
```
cd wordpress
```
4. 配置wp -config
图下是设置只需要修改用户名和密码
![](01.jpg)
5. 浏览器输入172.0.0.1:9000登录
```
php -S 127.0.0.1:9000
```
设置配置文件用户名密码
![](https://i.bmp.ovh/imgs/2019/02/b961fded72875694.jpg)
然后配置网站标题用户名密码登录，详细内容这里就不做演示了。
# 使用nginx服务器
## 1. 安装nginx和php-fpm
```
pkg install nginx php-fpm
```
## 2. 安装模拟root
```
pkg install proot
```
## 3. 进入模拟root模式
```
termux-chroot
```
## 4. 修改php-fpm
 ### 查找
```
listen = /data/data/com.termux/files/usr/var/run/php-fpm.sock
```
### 修改
```
listen = 127.0.0.1:9000
```
### 测试
```
termux-chroot
php-fpm
```
### 问题处理

>如果如下报错，可以说如果不修改一定有报错，这个问题困扰了我好久，通过搜索反复测试，最终解决。
```
[07-Jul-2019 00:22:28] NOTICE: [pool www] 'user' directive is ignored when FPM is not running as root
[07-Jul-2019 00:22:28] NOTICE: [pool www] 'group' directive is ignored when FPM is not running as root
[07-Jul-2019 00:22:28] ERROR: unable to bind listening socket for address '127.0.0.1:9999': Address already in use (98)
[07-Jul-2019 00:22:28] ERROR: FPM initialization failed
```
解决办法是在
```
user = nobody
group = nobody
```
前面加上分号**当然是英文模式下输入**
```
;user = nobody
;group = nobody
```
OK😊问题解决
## 4. 修改nginx
>只需要修改如下两部分就可以了，**非常重要的是一定要取消注释(删除前面的#号希望可以帮到小白用户)**   

第一部分

```
server {
        listen       8080;
        server_name  localhost;

        #charset koi8-r;

        #access_log  logs/host.access.log  main;

        location / {
            root   /data/data/com.termux/files/home/wordpress;
            index  index.html index.htm index.php;
```
第二部分
```
location ~ \.php$ {
            root           html;
            fastcgi_pass   127.0.0.1:9000;
            fastcgi_index  index.php;
            fastcgi_param  SCRIPT_FILENAME  /data/data/com.termux/files/home/wordpress$fastcgi_script_name;
            include        fastcgi_params;
        }
```
## 5. 启动
### 1. 启动数据库服务器
#### 新建一个MYSQL服务
```
tmux new -s MYSQL
```
#### 启动
```
mysqld
```
### 2. 在新窗口进入模拟人root模式
```
termux-chroot
```
### 3. 启动nginx php-fpm
```
php-fpm
nginx
```
## 进入安装界面
在浏览器输入如下地址进入安装界面
http://127.0.0.1:8080/wp-admin/setup-config.php