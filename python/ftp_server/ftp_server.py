#!/usr/bin/env python3
"""
FTP Server - 快速启动当前目录的文件下载服务
用法:
  python3 ftp_server.py [端口]        启动 FTP 服务
  python3 ftp_server.py stop          停止 FTP 服务
  python3 ftp_server.py status         查看运行状态
  python3 ftp_server.py restart [端口] 重启服务
"""

import os
import sys
import signal
import subprocess
import argparse

DEFAULT_PORT = 2121
PID_FILE = "/tmp/ftp_server.pid"

def get_pid():
    try:
        with open(PID_FILE) as f:
            return int(f.read().strip())
    except:
        return None

def is_running(pid):
    try:
        os.kill(pid, 0)
        return True
    except OSError:
        return False

def start(port=DEFAULT_PORT):
    pid = get_pid()
    if pid and is_running(pid):
        print(f"FTP 服务已在运行 (PID: {pid})，端口: {port}")
        return

    cwd = os.getcwd()
    script = f"""
from pyftpdlib.authorizers import DummyAuthorizer
from pyftpdlib.handlers import FTPHandler
from pyftpdlib.servers import FTPServer
from pyftpdlib.filesystems import UnixFilesystem

authorizer = DummyAuthorizer()
authorizer.add_anonymous('{cwd}', perm='elr')

handler = FTPHandler
handler.authorizer = authorizer
handler.perm_slist = ['elr']
handler.fs = UnixFilesystem

server = FTPServer(('0.0.0.0', {port}), handler)
server.serve_forever()
"""

    with open("/tmp/ftp_server_runner.py", "w") as f:
        f.write(script)

    proc = subprocess.Popen(
        ["python3", "/tmp/ftp_server_runner.py"],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        start_new_session=True
    )

    with open(PID_FILE, "w") as f:
        f.write(str(proc.pid))

    import time
    time.sleep(0.5)
    if is_running(proc.pid):
        print(f"FTP 服务已启动")
        print(f"  目录: {cwd}")
        print(f"  端口: {port}")
        print(f"  用户: anonymous (无密码)")
        print(f"  PID:  {proc.pid}")
        print()
        _show_access_ips()
    else:
        print("启动失败")

def stop():
    pid = get_pid()
    if not pid or not is_running(pid):
        print("FTP 服务未运行")
        try:
            os.remove(PID_FILE)
        except:
            pass
        return

    os.kill(pid, signal.SIGTERM)
    try:
        os.remove(PID_FILE)
    except:
        pass
    print("FTP 服务已停止")

def status():
    pid = get_pid()
    if pid and is_running(pid):
        print(f"FTP 服务运行中 (PID: {pid})，端口: {DEFAULT_PORT}")
    else:
        print("FTP 服务未运行")

def _show_access_ips():
    import subprocess
    result = subprocess.run(
        ["ifconfig"], capture_output=True, text=True
    )
    for line in result.stdout.split("\n"):
        if "inet " in line and "127.0.0.1" not in line:
            parts = line.split()
            if len(parts) >= 2:
                ip = parts[1]
                print(f"  访问: ftp://{ip}:{DEFAULT_PORT}/")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="FTP 文件下载服务")
    parser.add_argument("action", nargs="?", default="start",
                        choices=["start", "stop", "status", "restart"])
    parser.add_argument("port", nargs="?", type=int, default=DEFAULT_PORT)
    args = parser.parse_args()

    if args.action == "start":
        start(args.port)
    elif args.action == "stop":
        stop()
    elif args.action == "status":
        status()
    elif args.action == "restart":
        stop()
        start(args.port)
