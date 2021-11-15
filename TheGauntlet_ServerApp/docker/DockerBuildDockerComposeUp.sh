#!/usr/bin/env bash

#RUN ME!!!! :) this will spin up the server

cd ..

docker build -t tf/the-gauntlet-service -f Dockerfile .

docker-compose up

osascript -e 'display notification "Image built and is now running" with title "Build Complete" sound name "Glass"'