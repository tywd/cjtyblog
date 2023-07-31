# nginx常用命令
### 1、 开启
`start nginx 或 nginx.exe`
注：建议使用第一种，第二种会使你的cmd窗口一直处于执行中，不能进行其他命令操作
### 2、停止：
`nginx -s stop 或 nginx -s quit`
注：stop是快速停止nginx，可能并不保存相关信息；quit是完整有序的停止nginx，并保存相关信息。
### 3、重新载入Nginx：
`nginx -s reload`
当配置信息修改，需要重新载入这些配置时使用此命令。
### 4、重新打开日志文件
`nginx -s reopen`
### 5、为 Nginx 指定一个配置文件，来代替缺省的
`nginx -c filename`
### 6、不运行，而仅仅测试配置文件。nginx 将检查配置文件的语法的正确性，并尝试打开配置文件中所引用到的文件
`nginx -t`
### 7、显示 nginx 的版本
`nginx -v`
### 8、显示 nginx 的版本，编译器版本和配置参数
`nginx -V`
### 9、格式换显示 nginx 配置参数
2>&1 nginx -V | xargs -n1
2>&1 nginx -V | xargs -n1 | grep lua