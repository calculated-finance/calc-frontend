#!/bin/bash

yarn build:production
yarn export
cd out && npx s3-deploy@1.4.0 './**' --bucket 'sandbox.calculated.fi' --region 'ap-southeast-2' --etag --gzip xml,html,htm,js,css,ttf,otf,svg,txt --cache max-age=31536000 && cd ..
