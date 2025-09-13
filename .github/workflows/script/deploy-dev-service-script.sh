#!/bin/bash
set -e

SERVICE_NAME=$1
TAR_FILE=deploy-$SERVICE_NAME.tar.gz

cd ~/inhu-backend
tar -xzf "$TAR_FILE"
rm "$TAR_FILE"
pm2 reload "inhu-backend-$SERVICE_NAME-dev"
