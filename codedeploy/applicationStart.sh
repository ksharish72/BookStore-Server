#!/bin/bash
ls -al
cd /home/ubuntu/webapp-server 
npm i 
# sudo chmod 777 server.js
# node server.js > output.log 2> output.log < /dev/null &
ps aux
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -s -c file:/opt/cloudwatch-config.json > output.log
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -m ec2 -a status > output.log
sudo systemctl daemon-reload
sudo systemctl restart application.service
sudo mv application.service /lib/systemd/system

sudo systemctl start application.service
sudo systemctl enable application.service