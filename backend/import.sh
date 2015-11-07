#!/bin/sh

mongoimport --db teachme --collection users --drop --file seed.json --jsonArray
mongo teachme import.js
