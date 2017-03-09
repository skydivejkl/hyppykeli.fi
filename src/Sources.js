import React from "react";
import simple from "react-simple";
import gpsDistanceKm from "gps-distance";
import {last} from "lodash/fp";

import {View, Title, Sep} from "./core";
import {addWeatherData} from "./weather-data";

const SourcesContainer = simple(View, {
    backgroundColor: "white",
    alignItems: "center",
});

const SourcesContent = simple(View, {
    maxWidth: 600,
    alignItems: "center",
});

const SourceText = simple(View, {
    color: "gray",
    marginTop: 2,
    marginBottom: 2,
});

const parseFmiLatLon = s => {
    const [latS, lonS] = s.trim().split(" ");
    return {
        lat: parseFloat(latS, 10),
        lon: parseFloat(lonS, 10),
    };
};

const gpsDistanceM = (from, to) => {
    const km = gpsDistanceKm(
        ...[from.lat, from.lon, to.lat, to.lon].map(s => parseFloat(s, 10))
    );

    return Math.round(km * 1000);
};

const Bold = simple("span", {
    fontWeight: "bold",
});

const createMapLink = ({lat, lon}) =>
    `https://www.google.fi/maps/place/${lat},${lon}`;

const Link = simple(Bold.create("a"), {
    color: "skyblue",
    textDecoration: "none",
    ":visited": {
        color: "skyblue",
    },
    ":active": {
        color: "skyblue",
    },
});

const StationDesc = ({name, from, to}) => (
    <span>
        <Link href={createMapLink(from)}>
            {name}
        </Link>
        {" "}
        <Bold>
            {gpsDistanceM(from, to)}
            {" "}
            metrin
        </Bold>{" "}
        päässä{" "}
        <Link href={createMapLink(to)}>
            laskeutumisalueesta
        </Link>.
    </span>
);

const Metar = simple("span", {
    backgroundColor: "#DDD",
    padding: 5,
    borderRadius: 5,
    fontFamily: "monospace",
    border: "1px solid gray",
});

var Sources = (
    {dzProps, gusts, windAvg, windAvgForecasts, gustForecasts, metars}
) => (
    <SourcesContainer>
        <SourcesContent>
            <Title>Lähteet</Title>

            <Sep />

            <SourceText>
                <span>
                    Kaikki data on haettu Ilmatieteen laitoksen
                    {" "}
                    <Link href="https://ilmatieteenlaitos.fi/avoin-data">
                        avoimista rajapinnoista.
                    </Link>
                </span>
            </SourceText>

            {gusts &&
                <SourceText>
                    <center>
                        Puuskatiedot saatiin mittausasemalta{" "}
                        <StationDesc
                            name={gusts.stationName}
                            from={parseFmiLatLon(gusts.stationCoordinates)}
                            to={dzProps}
                        />
                    </center>
                </SourceText>}

            {windAvg &&
                <SourceText>
                    <center>
                        Keskituulitiedot saatiin mittausasemalta{" "}
                        <StationDesc
                            name={windAvg.stationName}
                            from={parseFmiLatLon(windAvg.stationCoordinates)}
                            to={dzProps}
                        />
                    </center>
                </SourceText>}

            {gustForecasts &&
                <SourceText>
                    <center>
                        Puuskaennustus on annettu alueelle
                        {" "}
                        <Bold>{gustForecasts.locationName}</Bold>
                    </center>
                </SourceText>}

            {windAvgForecasts &&
                <SourceText>
                    <center>
                        Keskituuliennustus on annettu alueelle
                        {" "}
                        <Bold>{windAvgForecasts.locationName}</Bold>
                    </center>
                </SourceText>}

            {Boolean(metars && metars.length > 0) &&
                <SourceText>
                    <center>
                        Pilvikerrokset parsittiin METAR-sanomasta:
                        <br />
                        <br />
                        <Metar>{last(metars).raw}</Metar>
                    </center>
                </SourceText>}

            <Sep />

        </SourcesContent>
    </SourcesContainer>
);
Sources = addWeatherData(Sources);

export default Sources;
