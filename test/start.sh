#!/bin/sh

BASEDIR=$(dirname $0)

$BASEDIR/../node_modules/mocha/bin/mocha --reporter spec $(find $BASEDIR -name '*.js')