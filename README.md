
# Hyppykeli.fi

Hyppysäätä suomen dropzoneille.


## Hacking

Get with node.js 7.6 and yarn 0.20 or later

Install yarn using

    npm install -g yarn

Start by installing all the deps from `package.json`

    make

Start development server

    make js-server

and open <http://localhost:8080/> and hack on `src/index.js`

Build production bundle with

    make js

