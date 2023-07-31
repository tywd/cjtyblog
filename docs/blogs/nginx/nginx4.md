# nginx部署vue项目
## 前端项目准备
将vue项目打包好后的 dist 包准备好，放到安装好的 nginx 文件夹下

此处以windows 做参考，我的nginx 安装路径为 `D:\software\nginx-1.22.1\`

将打包后的dist文件夹里面的内容放入 `D:\software\nginx-1.22.1\html` 下

## 启动 nginx
cmd 窗口 重新启动 nginx，执行命令`nginx -s reload`

## 查看页面
浏览器访问 127.0.0.1 即可 访问项目

> 注意：此处页面刷新时会出现 404 找不到页面的情况，这是vue的 history 模式出现的

### history 模式

比如当我们在 127.0.0.1/login 页执行刷新操作，nginx location 是没有相关配置的，所以就会出现 404 的情况，

dist下只有一个 index.html 文件及一些静态资源，这个是因为Vue是单页应用(SPA)，只有一个index.html作为入口文件，其它的路由都是通过JS来进行跳转

### hash 模式
为什么hash模式下没有问题

router hash 模式我们都知道是用符号#表示的，如  website.com/#/login, hash 的值为 #/login

它的特点在于：hash 虽然出现在 URL 中，但不会被包括在 HTTP 请求中，对服务端完全没有影响，因此改变 hash 不会重新加载页面

hash 模式下，仅 hash 符号之前的内容会被包含在请求中，如 website.com/#/login 只有 website.com 会被包含在请求中 ，因此对于服务端来说，即使没有配置location，也不会返回404错误

### 解决404问题
location 加入以下代码即可
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

这里有一个小细节，如果出现真的 404 页面了呢？比如 website.com/notfound

因为这么做以后，你的服务器就不再返回 404 错误页面，因为对于所有路径都会返回 index.html 文件。为了避免这种情况，你应该在 Vue 应用里面覆盖所有的路由情况，然后在给出一个 404 页面

```js
const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '*', component: NotFoundComponent }
  ]
})
```

## 修改前端项目的部署位置
### a. D: 下新建 frontend 文件夹，将前端包解压到该目录下
### b．将 `D:\software\nginx-1.22.1\conf\nginx.conf` 文件做如下修改
server里的location 的 root 路径改为 `D:/frontend` 来指定到前端的默认访问路径
```nginx
location / {
    add_header 'Access-Control-Allow-Origin' *;
    add_header 'Access-Control-Allow-Credentials' 'true';
    add_header 'Access-Control-Allow-Methods' *;
    add_header 'Access-Control-Allow-Headers' *;
    root D:/frontend;
    index index.html index.htm;

    try_files $uri $uri/ /index.html;
}

#error_page  404              /404.html;

# redirect server error pages to the static page /50x.html
#
error_page   500 502 503 504  /50x.html;
location = /50x.html {
    root   D:/frontend;
}
```
### c．重启nginx 服务
打开cmd从窗口进入 `D:\software\nginx-1.22.1` 执行 `nginx –s reload`
### d. c步骤不生效的情况
- 先  `nginx –s stop`
- 再 `nginx   -c    D:/software/nginx-1.22.1/conf/nginx.conf`
- 最后重复 c步骤，去浏览器访问 ctrl + F5 刷新即可

