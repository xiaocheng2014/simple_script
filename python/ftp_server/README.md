# FTP 文件下载服务

快速在当前目录启动一个匿名 FTP 服务，供局域网内其他设备下载文件。

## 使用方法

```bash
# 启动服务（默认端口 2121）
python3 ftp_server.py

# 指定端口
python3 ftp_server.py 8080

# 停止服务
python3 ftp_server.py stop

# 查看状态
python3 ftp_server.py status

# 重启服务
python3 ftp_server.py restart
```

## 连接方式

启动后会显示可访问的地址，例如：

```
FTP 服务已启动
  目录: /path/to/current/dir
  端口: 2121
  用户: anonymous (无密码)
  PID:  12345

  访问: ftp://10.241.72.104:2121/
```

同一局域网下直接用显示的地址访问。

```bash
# 命令行登录
ftp 10.241.72.104 2121
# 用户名: anonymous（直接回车）
# 密码: （直接回车）

# 浏览器访问
ftp://10.241.72.104:2121/

# curl 下载
curl --noproxy '*' ftp://10.241.72.104:2121/filename -o filename
```

## 注意事项

- 代理/VPN 可能干扰连接，下载时使用 `--noproxy '*'` 或暂时关闭代理
- 服务仅限局域网内使用
- anonymous 用户只有读取权限（elr）
