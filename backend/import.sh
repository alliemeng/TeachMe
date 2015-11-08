#!/bin/sh

node generate_seed.js
mongoimport --db teachme --collection users --drop --file seed.json --jsonArray
mongo teachme import.js
