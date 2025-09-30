#!/bin/bash
set -e

SERVICE_NAME=$1
TAR_FILE=deploy-$SERVICE_NAME.tar.gz
TARGET_DIR="dist/apps/$SERVICE_NAME-server"

cd ~/inhu-backend

mkdir -p "$TARGET_DIR"

tar -xzf "$TAR_FILE" -C "$TARGET_DIR" --strip-components=1

rm "$TAR_FILE"

pm2 reload "inhu-backend-$SERVICE_NAME-dev"
