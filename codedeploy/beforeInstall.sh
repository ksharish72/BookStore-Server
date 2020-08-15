#!/bin/bash
sudo rm -rf /home/ubuntu/webapp-server
sudo rm -rf /opt/cloudwatch-config.json
cd $HOME
#sudo pkill -f node #stop all node process
# kill -9 $(lsof -t -i:8080) #kill the 8080 port 

#uid=$(forever list | grep serve | cut -c24-27) && forever stop $uid #stop forever process
# forever stopall
if ps -p $(lsof -t -i:3000) > /dev/null
then
   echo "$(lsof -t -i:3000) is running"
   # Do something knowing the pid exists, i.e. the process with $PID is running
   kill -9 $(lsof -t -i:3000) #kill the 3000 port 
fi

#stop cloud watch agent
# sudo service awslogs stop
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -m ec2 -a stop > /home/ubuntu/output.log
# sudo systemctl stop application.service

