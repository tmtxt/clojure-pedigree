FROM ubuntu:14.04

RUN apt-get update
RUN apt-get install -y zip unzip

COPY backup.sh /backup.sh
RUN chmod +x /backup.sh

COPY restore.sh /restore.sh
RUN chmod +x /restore.sh

WORKDIR /
