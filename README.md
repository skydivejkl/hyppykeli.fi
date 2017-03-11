
# Hyppykeli.fi

Skydiving weather for Finnish Dropzones.

## Havaintoasemat

<http://ilmatieteenlaitos.fi/havaintoasemat>

Kartalla: <https://drive.google.com/open?id=1N_DKKUhwuirVsGHV3R14VYfJH7o&usp=sharing>

CSV:n generointi

```js
c = (el, i) => jQuery(jQuery("td", el).get(i)).text().trim(); document.body.innerHTML = "<pre>" + jQuery(".stations tr").toArray().slice(1).map(el => `${c(el, 0)} (${c(el, 1)}),${c(el, 4).replace(",", ".")}0000,${c(el, 5).replace(",", ".")}0000`).join("\n")
```


## Hacking

Get with node.js 7.6 and yarn 0.2 or later

Start by installing all the deps from `package.json`

    make deps

Start backend server

    make server-watch

and Javascript client bundle server

    make js-watch

and open <http://localhost:8080/>

Server side-code is in `server/` and client code in `src/`.
