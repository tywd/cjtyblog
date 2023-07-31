# nginx安装介绍
## Nginx概述

Nginx（“engine x”）是一个高性能的HTTP和反向代理服务器，高级负载均衡器，特点是占有内存少，并发能力强，事实上Nginx的并发能力确实在同类型的网页服务器中表现较好

[nginx 官方地址](http://nginx.org)
[nginx 学习参考](https://blog.csdn.net/qq_38490457/article/details/108300342)

## 一、windows 安装

### 1、稳定版本安装

使用稳定版本即可此处 以 nginx/Windows-1.22.1 为例

### 2、解压后得到以下目录

```nginx
- conf
- contrib
- docs
- html
- logs
- temp
  nginx.exe
```

双击 `nginx.exe` 启动 `nginx` 服务，在浏览器输入 127.0.0.1，出现以下信息表示启动成功

```nginx
Welcome to nginx!
If you see this page, the nginx web server is successfully installed and working. Further configuration is required.
For online documentation and support please refer to nginx.org.
Commercial support is available at nginx.com.
Thank you for using nginx.
```

### 3、配置环境变量

右击我的电脑 -> 属性 -> 高级系统设置 -> 环境变量 -> 修改系统变量 path
将 `nginx` 解压缩后的位置写入
例如：我i的nginx路径（`D:\software\nginx-1.22.1`）

此时可直接打开cmd窗口执行 `nginx` 的命令，具体常用命令参考 `nginx` 常用命令
使用 `start nginx` 也可以启动 nginx 服务

## 二、Linux 安装
[参考链接](https://blog.csdn.net/t8116189520/article/details/81909574)
### 1、安装依赖包
```nginx
//一键安装四个依赖
yum -y install gcc zlib zlib-devel pcre-devel openssl openssl-devel
```

### 2、下载并解压安装包
```nginx
//创建一个文件夹
cd /usr/local
mkdir nginx
cd nginx
//下载tar包
wget http://nginx.org/download/nginx-1.22.1.tar.gz
tar -xvf nginx-1.22.1.tar.gz
```

### 3、安装nginx
```nginx
//进入nginx目录
cd /usr/local/nginx
//进入目录
cd nginx-1.22.1
//执行命令 考虑到后续安装ssl证书 添加两个模块
./configure --with-http_stub_status_module --with-http_ssl_module
//执行make命令
make
//执行make install命令
make install
```

### 4、启动nginx服务
```nginx
 ​​​​​/usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf
```

### 5、配置nginx.conf
```nginx
# 打开配置文件
vi /usr/local/nginx/conf/nginx.conf
```
将端口号改成8089(随便挑个端口)，因为可能apeache占用80端口，apeache端口尽量不要修改，我们选择修改nginx端口。

将localhost修改为你服务器的公网ip地址。
```nginx
http {
  log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

  server {
      listen       8089; #配置监听端口
      server_name  localhost; #配置服务名
      charset utf-8; #配置字符集
      access_log  logs/host.access.log  main; #配置本虚拟主机的访问日志，main变量指向上面的 log_format main
      
      location / {
          root html; #root是配置服务器的默认网站根目录位置，默认为Nginx安装主目录下的html目录
          index index.html index.htm; #配置首页文件的名称
      }
      
      error_page 404             /404.html; #配置404错误页面
      error_page 500 502 503 504 /50x.html; #配置50x错误页面
  }
}
```
6、重启nginx

`/usr/local/nginx/sbin/nginx -s reload`

查看nginx进程是否启动：

linux 查看的命令 `ps -ef | grep nginx`
