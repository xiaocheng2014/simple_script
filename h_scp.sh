#!/bin/bash
#该脚本就是把scp命令改成自己喜欢的参数 其实可以写那种通过命令加host的 但人懒 不想写 如果要加我就自己加这个文件里 其实也可以跟h_go脚本合一起 人懒不想合
first_host=cheng@172.16.178.129
second_host=cheng@172.16.178.130
scpStr='scp'
server_link=''
if [[ $1 = 'download' ]]
then
server_link=$2
elif [[ $1 = 'upload' ]]
then
server_link=$3
fi
case $server_link  in
        first_host) server_link=$first_host ;;
        second_host) server_link=$second_host ;;
        list)
                echo "first_host|second_host" ;;
        *)
                echo "Help: h_scp upload 本地文件路径 远程hostname 远程上传路径|h_scp download 远程hostname 远程文件路径 本地文件路径"
esac

if [[ $1 = 'download' ]]
then
scp $server_link:$3 $4
elif [[ $1 = 'upload' ]]
then
scp $2 $server_link:$4
server_link=$3
fi