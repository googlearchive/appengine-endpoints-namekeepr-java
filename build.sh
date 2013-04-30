#!/bin/bash

if [ ! -f lib/SoyToJsSrcCompiler.jar ]
then
  echo "Please download the Google Closure compiler from " \
    "https://code.google.com/p/closure-compiler/ and place the file " \
    "SoyToJsSrcCompiler.jar in the lib/ directory"
  exit 1
fi

java_bin=`which java`
if [ "$java_bin" == "" ]
then
  echo "Please ensure that you have a JRE installed and that the java " \
    "executable is on the PATH"
  exit 1
fi

$java_bin -jar lib/SoyToJsSrcCompiler.jar --outputPathFormat war/js/businessCards.js --srcs war/templates/businessCards.soy

