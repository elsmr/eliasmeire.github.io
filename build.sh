#!/bin/bash

SOURCE_BRANCH="develop"
TARGET_BRANCH="master"
GH_REF="github.com/eliasmeire/eliasmeire.github.io"
DIST_FOLDER="_site"

# only proceed script when started not by pull request (PR)
if [ $TRAVIS_PULL_REQUEST == "true" ]; then
  echo "this is a PR, exiting"
  exit 0
fi

# enable error reporting to the console
set -e

REPO=`git config remote.origin.url`

# clean
rm -rf ../eliasmeire.github.io.${TARGET_BRANCH}

# make new folder for generated files
mkdir ../eliasmeire.github.io.${TARGET_BRANCH}

# clone into target folder
git clone $REPO ../eliasmeire.github.io.${TARGET_BRANCH}

# build site, stored in dist folder
gulp build

# copy dist folder to new folder
cp -R ${DIST_FOLDER}/* ../eliasmeire.github.io.${TARGET_BRANCH}

# go to new folder
cd ../eliasmeire.github.io.${TARGET_BRANCH}

# go to target branch
git checkout $TARGET_BRANCH || git checkout --orphan $TARGET_BRANCH

# git configuration
git config user.email "eliasmeire.dbz@gmail.com"
git config user.name "Eliasbot"

# add and commit
git add -A .
git commit -am "Build from ${SOURCE_BRANCH} branch | Deployed by TravisCI (Build #$TRAVIS_BUILD_NUMBER)"

# force push to github
git push -f "https://${GH_TOKEN}@${GH_REF}" ${TARGET_BRANCH} > /dev/null 2>&1