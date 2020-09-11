#!/bin/bash

declare -i server_port=3000
declare -i mongo_port=27017
declare DEBUG=false

function init_npm {
    npm i mongodb
    npm i express
    npm i yargs
}

function echo_help {
    echo "Usage:"
    echo "-p: set server port"
    echo "-m: set mongodb port"
    echo "-d: debug mode"
}

while getopts "h?p:m:d" opt; do
    case "$opt" in
    h|\?)
        echo_help
        exit 0
        ;;
    p)  server_port=$OPTARG
        ;;
    m)  mongo_port=$OPTARG
        ;;
    d)  DEBUG=true
    esac
done

init_npm
node  src/main.js -p $server_port -m $mongo_port