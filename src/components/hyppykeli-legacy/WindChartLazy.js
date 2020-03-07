import React, { Suspense, useState } from "react";
import { debounce } from "lodash";
import { withProps, withPropsOnChange, compose, pure } from "recompose";
import OnVisible from "react-on-visible";

import { addWeatherData } from "./weather-data";
import { withBrowserEvent, getWindowOr } from "./utils";
import { View, simple } from "./core";
import Spinner from "./Spinner";

const WindChart = React.lazy(() =>
    import(/* webpackPrefetch: true */ "./WindChart"),
);

const getPoints = data => (data && data.points) || [];

const WindChartContainer = simple(View, {
    width: "100%",
    height: 420,
});

const SpinnerContainer = simple(View, {
    alignSelf: "center",
    width: 40,
    height: 40,
});

const combineObsFore = (obs, avg) =>
    getPoints(obs)
        .map(d => ({
            ...d,
            type: "observation",
        }))
        .concat(
            getPoints(avg)
                .slice(0, 6)
                .map(d => ({
                    ...d,
                    type: "forecast",
                })),
        );

const ScrollInfo = simple(View, {
    textAlign: "center",
    marginTop: 25,
});

var WindChartLazy = ({ instanceKey, hasSomeChartData, ...props }) => {
    const [show, setShow] = useState(false);

    const handleOnVisible = visible => {
        if (visible) {
            setShow(true);
        }
    };

    if (!hasSomeChartData) {
        return (
            <WindChartContainer>
                <SpinnerContainer>
                    <Spinner color="black" />
                </SpinnerContainer>
            </WindChartContainer>
        );
    }

    return (
        <OnVisible percent={80} onChange={handleOnVisible}>
            <WindChartContainer>
                {show ? (
                    <Suspense
                        fallback={
                            <SpinnerContainer>
                                <Spinner color="red" />
                            </SpinnerContainer>
                        }
                    >
                        <WindChart key={instanceKey} {...props} />
                    </Suspense>
                ) : (
                    <ScrollInfo>Skrollaa alemmaksi!</ScrollInfo>
                )}
            </WindChartContainer>
        </OnVisible>
    );
};
WindChartLazy = compose(
    addWeatherData,
    withPropsOnChange(
        ["gusts", "windAvg", "gustForecasts", "windAvgForecasts"],
        ({ gusts, windAvg, gustForecasts, windAvgForecasts }) => {
            // console.log("mapping data");
            const combinedGusts = combineObsFore(gusts, gustForecasts);
            const combinedAvg = combineObsFore(windAvg, windAvgForecasts);

            const hasSomeChartData = [
                combinedGusts.length > 0,
                combinedAvg.length > 0,
            ].some(Boolean);

            return { hasSomeChartData, gusts: combinedGusts, avg: combinedAvg };
        },
    ),
    withProps({ instanceKey: getWindowOr({ innerWidth: 0 }).innerWidth }),
    withBrowserEvent(
        getWindowOr(null),
        "resize",
        debounce(({ setProps }) => {
            return setProps({
                instanceKey: getWindowOr({ innerWidth: 0 }).innerWidth,
            });
        }, 100),
    ),
    pure,
)(WindChartLazy);

export default WindChartLazy;
