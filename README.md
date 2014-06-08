
# Skydiving weather

Skydiving weather app for info-tv and mobile phones.

## Hacking

Install node.js.

Get FMI apikey from <http://ilmatieteenlaitos.fi/latauspalvelun-pikaohje> and
save it to `config.json`:

```json
{
  "apikey": "<key>"
}
```

Install dependencies and build the app with

    make


Run the server with

    node server.js

Watch for SCSS stylesheet changes with

    make scss-watch

