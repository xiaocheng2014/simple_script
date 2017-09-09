#!/bin/bash
#该脚本是简单的配置可以ssh的机器，方便跳转 其实可以写那种通过命令加host的 但人懒 不想写 如果要加我就自己加这个文件里
first_host=cheng@172.16.178.129
second_host=cheng@172.16.178.130
sshStr='ssh'
if [[ $2 = 'sftp' ]]
then
        sshStr='sftp'
elif [[ $2 = 'debug' ]]
then
        sshStr='ssh -R 9001:localhost:9001 '
fi
case "$1" in
        first_host) $sshStr $first_host -p2206 ;;
        second_host) $sshStr $second_hot ;;
        list)
                echo "first_host|second_host" ;;
        *)
        echo "Help: go [server_name] [sftp|debug|ssh(default)]" ;;
esac