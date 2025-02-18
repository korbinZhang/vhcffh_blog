#! /bin/sh
#
# push.sh
# Copyright (C) 2025 frey <frey@wsl>
#
# Distributed under terms of the MIT license.
#

function GIT()
{
    git --git-dir=.git_develop --work-tree=doc_build $*
}


function main()
{
    rm -rf doc_build
    npm run build
    GIT add .
    GIT commit -m $(git log -1 --format=%H)
    GIT push
}

main

