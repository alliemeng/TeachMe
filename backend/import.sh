#!/bin/sh

mongoimport --db teachme --collection users --drop --file seed.json
mongo teachme import.js
