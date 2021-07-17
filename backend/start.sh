#!/bin/bash

docker-compose up -d
# Добавить создание базы


yarn

yarn run migration:run

yarn run build
yarn run start:prod
