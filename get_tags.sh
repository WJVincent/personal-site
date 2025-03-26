#!/usr/bin/env sh

result=$(rg "\[tags\]:-" **/*.md)

if [ $? -eq 0 ]; then
    echo "$result" >tags.txt
else
    echo "search failed"
    exit 1
fi
