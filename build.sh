#!/bin/bash

# only proceed script when started not by pull request (PR)
if [ $TRAVIS_PULL_REQUEST == "true" ]; then
  echo "this is PR, exiting"
  exit 0
fi

# enable error reporting to the console
set -e

# build site, stored in '_site' folder
gulp

# cleanup
rm -rf ../eliasmeire.github.io.master

#clone `master' branch of the repository using encrypted GH_TOKEN for authentification
git clone https://${GH_TOKEN}@github.com/eliasmeire/eliasmeire.github.io.git ../eliasmeire.github.io.master

# copy generated HTML site to `master' branch
cp -R _site/* ../eliasmeire.github.io.master

# commit and push generated content to `master' branch
# since repository was cloned in write mode with token auth - we can push there
cd ../eliasmeire.github.io.master
git config user.email "eliasmeire.dbz@gmail.com"
git config user.name "Eliasbot"
git add -A .
git commit -a -m "Build from develop branch | Deployed by TravisCI #$TRAVIS_BUILD_NUMBER"
git push --quiet origin master > /dev/null 2>&1