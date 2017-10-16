#!/bin/bash
#一个方便tomcat启动 重启 停止的脚本
H_TOMCAT_HOME="/usr/local/src/apache-tomcat-9.0.0.M22"
H_JAVA="/usr/local/src/jdk1.8.0_141/jre/bin/java"

function tomcat_status(){
        PID=$(ps aux|grep "${H_JAVA} -Djava.util.logging.config.file=${H_TOMCAT_HOME}"|grep -v grep|tail -n 1|awk '{print $2}')
        echo $PID
}

function tomcat_show(){
        PID=$(tomcat_status)
        if [ "$PID" == "" ]
        then
                echo "tomcat未启动"
        else
                echo "tomcat已启动，PID为$PID"
        fi
}

function tomcat_stop(){
        PID=$(tomcat_status)
        if [ "$PID" == "" ]
        then
                echo "tomcat未启动"
                return 0
        else
                `kill -9 $PID`
                echo "tomcat已关闭"
                return 1
        fi
}

function tomcat_start(){
        PID=$(tomcat_status)
        if [ "$PID" == ""  ]
        then
                START_INFO=$(${H_TOMCAT_HOME}/bin/startup.sh)
                tomcat_show
                return 1
        else
                echo "tomcat已经启动，PID为$PID"
                return 0
        fi
}

function tomcat_restart(){
        tomcat_stop
        if [ $? == "0" ]
        then
                echo "tomcat未启动，直接启动中"
        fi
        tomcat_start
}
case "$1" in
        clear)
                echo "" > ${H_TOMCAT_HOME}/logs/catalina.out ;;
        log)
                tail -f ${H_TOMCAT_HOME}/logs/catalina.out ;;
        java)
                ps aux|grep java|grep -v grep|grep -v h_tomcat ;;
        status)
                tomcat_show ;;
        stop)
                tomcat_stop ;;
        start)
                tomcat_start ;;
        restart)
                tomcat_restart ;;
        *)
                echo "Help:h_tomcat [clear|log|java|status|stop|start|restart]" ;;
esac