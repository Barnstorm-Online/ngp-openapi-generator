#!/usr/bin/env bash

npm run template
npm run sync
docker-compose up
echo "Fixing permissions...."
sudo chown "$(whoami)":"$(whoami)" -R ./packages
find . -name "git_push.sh" -exec chmod +x {} \;
find . -name "git_push.sh" -execdir ./{} \;