#!/bin/bash
cd app
find . -name "*.js" -exec rm '{}' \;
find . -name "*.js.*" -exec rm '{}' \;
