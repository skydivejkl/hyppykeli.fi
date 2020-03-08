# Hyppykeli.fi

Skydiving weather for Finnish Dropzones. All data is obtained from the open data APIs of the [Finnish Meteorological Institute][fmi].
The application is free and open source under the GPLv3 license. It's live at https://hyppykeli.fi/. The application is currently available only in Finnish.

[fmi]: http://en.ilmatieteenlaitos.fi/

# Some devnotes

## Hacking

This app is currently a mess codewise and it needs a rewrite.

It was first created back in 2013 and it basically has been my personal "test
bench" for whatever new web tech I happened to be interested at any given
time. For example in early 2014 I re-wrote it with this new tech called
"Reactjs" which was released less than year ago at the time.

Surprisingly it's still written with React but uses very weird combination of
legacy React libs and coding styles:

-   Mix of classes and hooks
-   Uses weird Redux abstraction lib with too many HOCs
-   Uses two different css-in-js libs which is pretty awesome
-   Is only partly migrated to TypeScript

But at the time of writing (2020-03-08) it runs with the latest React and
Next.js so it's not too bad to get running. Get node.js 12 and type following

    git clone git@github.com:skydivejkl/hyppykeli.fi.git
    cd hyppykeli.fi
    npm ci
    npm run dev

## Havaintoasemat

<http://ilmatieteenlaitos.fi/havaintoasemat>

Kartalla: <https://drive.google.com/open?id=1N_DKKUhwuirVsGHV3R14VYfJH7o&usp=sharing>

CSV:n generointi

```js
c = (el, i) =>
    jQuery(jQuery("td", el).get(i))
        .text()
        .trim();
document.body.innerHTML =
    "<pre>" +
    jQuery(".stations tr")
        .toArray()
        .slice(1)
        .map(
            el =>
                `${c(el, 0)} (${c(el, 1)}),${c(el, 4).replace(
                    ",",
                    ".",
                )}0000,${c(el, 5).replace(",", ".")}0000`,
        )
        .join("\n");
```
