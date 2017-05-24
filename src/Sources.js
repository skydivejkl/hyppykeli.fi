import React from "react";
import simple from "react-simple";
import {last} from "lodash/fp";
import GithubIcon_ from "react-icons/lib/fa/github";
import {defaultProps} from "recompose";

import {gpsDistance} from "./utils";
import {View, Title, Sep} from "./core";
import {addWeatherData} from "./weather-data";
import * as colors from "./colors";

const GithubIcon = simple(GithubIcon_, {
    height: 50,
    width: 50,
});

const SourcesTitle = simple(Title, {
    color: "white",
    marginTop: 10,
    marginBottom: 20,
});

const SourcesContainer = simple(View, {
    backgroundColor: colors.darkBlue,
    paddingLeft: 25,
    paddingRight: 25,
    alignItems: "center",
});

const SourcesContent = simple(View, {
    maxWidth: 600,
    alignItems: "center",
});

const SourceText = simple("div", {
    textAlign: "center",
    color: "white",
    marginBottom: 20,
});

const Bold = simple("span", {
    fontWeight: "bold",
});

const createMapLink = ({lat, lon}) =>
    `https://www.google.fi/maps/place/${lat},${lon}`;

var Link = simple(Bold.create("a"), {
    color: colors.skyblue,
    textDecoration: "none",
    ":visited": {
        color: colors.skyblue,
    },
    ":active": {
        color: colors.skyblue,
    },
    ":hover": {
        textDecoration: "underline",
    },
});
Link = defaultProps({target: "_blank"})(Link);

const StationDesc = ({name, from, to}) => (
    <span>
        <Link href={createMapLink(from)}>
            {name}
        </Link>
        {" "}
        <Bold>
            {gpsDistance(from, to).toFixed(1)}
            {" "}
            km
        </Bold>{" "}
        päässä{" "}
        <Link href={createMapLink(to)}>
            laskeutumisalueesta
        </Link>
    </span>
);

const Metar = simple("div", {
    backgroundColor: "white",
    color: colors.darkBlue,
    padding: 5,
    borderRadius: 5,
    fontFamily: "monospace",
    fontWeight: "bold",
    // border: "1px solid ",
});

var Sources = ({
    dzProps,
    gusts,
    windAvg,
    windAvgForecasts,
    gustForecasts,
    metars,
}) => (
    <SourcesContainer>
        <Sep />
        <Sep />
        <SourcesContent>
            <SourcesTitle id="sources">Lähteet</SourcesTitle>

            <SourceText>
                Kaikki data on haettu Ilmatieteen laitoksen
                {" "}
                <Link href="https://ilmatieteenlaitos.fi/avoin-data">
                    avoimista rajapinnoista
                </Link>.
                Myös tuuliennustus tulee Ilmatieteenlaitokselta taulukkona
                jossa on suoraan kellonaika ja ennustettu tuulilukema.
                Hyppykeli.fi piirtää vain kuvaajan tästä tiedosta eikä sen
                enempää tulkitse sitä.
            </SourceText>

            {gusts &&
                <SourceText>
                    Puuskatiedot saatiin havaintoasemalta{" "}
                    <StationDesc
                        name={gusts.stationName}
                        from={gusts.stationCoordinates}
                        to={dzProps}
                    />
                </SourceText>}

            {windAvg &&
                <SourceText>
                    Keskituulitiedot saatiin havaintoasemalta{" "}
                    <StationDesc
                        name={windAvg.stationName}
                        from={windAvg.stationCoordinates}
                        to={dzProps}
                    />
                </SourceText>}

            {gustForecasts &&
                <SourceText>
                    Puuskaennustus on annettu alueelle
                    {" "}
                    <Bold>{gustForecasts.locationName}</Bold>
                </SourceText>}

            {windAvgForecasts &&
                <SourceText>
                    Keskituuliennustus on annettu alueelle
                    {" "}
                    <Bold>{windAvgForecasts.locationName}</Bold>
                </SourceText>}

            {Boolean(metars && metars.length > 0) &&
                <SourceText id="metar">
                    Pilvikerrokset parsittiin METAR-sanomasta:
                    <br />
                    <br />
                    <Metar>{last(metars).raw}</Metar>
                </SourceText>}

            <SourcesTitle>Tietoja</SourcesTitle>

            <SourceText>
                Tällä sivulla annettujen tietojen käyttö omalla vastuulla.
                Kukaan tai mikään ei takaa, että lähdetiedot tai niiden
                tulkinta olisi millään tapaan järjellistä. Muistetaan jatkossakin
                katsella sitä tuulipussia ja käyttää omia aivoja.
            </SourceText>

            <SourceText>
                Tämän tunkin rakensi
                {" "}
                <Link href="https://www.facebook.com/esamattisuuronen">
                    Esa-Matti Suuronen.
                </Link>
            </SourceText>

            <SourceText>
                <Link href="https://github.com/skydivejkl/hyppykeli.fi">
                    Lähdekoodit Githubista
                    <br />
                    <GithubIcon />
                </Link>
            </SourceText>

        </SourcesContent>
    </SourcesContainer>
);
Sources = addWeatherData(Sources);

export default Sources;
