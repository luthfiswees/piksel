# Piksel
[![Build Status](https://travis-ci.org/luthfiswees/piksel.svg?branch=master)](https://travis-ci.org/luthfiswees/piksel) [![Coverage Status](https://coveralls.io/repos/github/luthfiswees/piksel/badge.svg?branch=experiment-sinon)](https://coveralls.io/github/luthfiswees/piksel?branch=experiment-sinon)

Pixel comparison microservice for visual diff testing

## Requirements
This repository needs `NodeJS` version 9 or above to work out.
Also, make sure you install `CouchDB` on your machine. Since this service is using that.

## Prerequisite Installation Reference

### NodeJS and Node Version Manager (NVM) Installation Reference
#### Install NVM
All of this information are taken from this [README](https://github.com/creationix/nvm)

Execute Installation script
```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
```
OR
```
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
```

And then, reload your `.bash_profile` (Or `.zshrc`, `.profile`, or `.bashrc`)
```
cd
source ~/.bash_profile
```

Then, install node version 9 and use that
```
nvm install v9.8.0
nvm use v9.8.0
```

### CouchDB Installation Reference
#### For Mac
```
brew install couchdb
brew services start couchdb
```
#### For Ubuntu
On Ubuntu, you could refer to this
[14.04](https://www.digitalocean.com/community/tutorials/how-to-install-couchdb-and-futon-on-ubuntu-14-04)
[16.04](https://www.hugeserver.com/kb/how-install-apache-couchdb-ubuntu-16/)

## Installation
Clone this repository, and do this command
```
git clone https://github.com/luthfiswees/piksel.git
cd piksel
npm install
npm start
```

Run the test to make sure it's okay with ...
```
npm test
```

## Using Docker
Make sure your docker client is ready. Just clone the repository and turn it on with docker compose
```
git clone https://github.com/luthfiswees/piksel.git
cd piksel
docker-compose up
```

Or run it on the background (detach)
```
docker-compose up -d
```

## Endpoints

#### POST `/send_image`
##### What it does
Store image in it's designated tags
##### Param
`name` : tag name of the image ; 
`screenshot` : File attachment in a form of image ;


#### POST `/change_baseline_image`
##### What it does
Replace baseline image on that particular tags
##### Param
`name` : tag name of the image ; 
`screenshot` : File attachment in a form of image ;


#### GET `/image`
##### What it does
Get original image on that particular tags
##### Param
`name` : tag name of the image ;


#### GET `/diff_image`
##### What it does
Get diff image on that particular tags
##### Param
`name` : tag name of the image ;
