import React from "react";
import Chart from "chart.js";
import {throttle, debounce, getOr, maxBy} from "lodash/fp";
import {connectLean} from "lean-redux";
import {connect} from "react-redux";
import {withProps, withPropsOnChange, compose, pure} from "recompose";
import simple from "react-simple";

import {addWeatherData} from "./weather-data";
import {fromNowWithClock, withBrowserEvent, getWindowOr} from "./utils";
import {GUST_LIMIT, GUST_LIMIT_B, View} from "./core";
import Spinner from "./Spinner";

const getLongestArray = maxBy(a => a.length);

const Row = simple(View, {
    marginTop: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingLeft: 10,
    paddingRight: 10,
});

const Bold = simple(View, {
    fontWeight: "bold",
    paddingLeft: 3,
    paddingRight: 3,
});

const SpinnerContainer = simple(View, {
    alignSelf: "center",
    width: 40,
    height: 40,
});

const Flex = simple(View, {
    flex: 1,
});

const WindChartContainer = simple(View, {
    width: "100%",
    height: 420,
});

const PointValue = simple(
    View,
    {
        color: "black",
        flexDirection: "row",
        paddingLeft: 10,
        paddingRight: 10,
    },
    {
        transparent: {
            color: "transparent",
        },
    },
);

const asFloat = i => parseFloat(i, 10);

const getForecastPoints = data =>
    data.map((d, i, array) => {
        if (d.type === "forecast") {
            return asFloat(d.value);
        } else if (array[i + 1] && array[i + 1].type === "forecast") {
            return asFloat(d.value);
        }

        return null;
    });

const getObservations = data =>
    data.map(d => {
        if (d.type === "observation") {
            return asFloat(d.value);
        }
        return null;
    });

var HoveredValues = ({gust, avg}) => (
    <Row>
        {!gust && <PointValue transparent>|</PointValue>}
        {gust && (
            <PointValue>
                Puuska <Bold>{gust.value} m/s</Bold>
                {` ${fromNowWithClock(gust.time)}`}
            </PointValue>
        )}

        {avg && (
            <PointValue>
                Keskituuli <Bold>{avg.value} m/s</Bold>
                {` ${fromNowWithClock(avg.time)}`}
            </PointValue>
        )}
    </Row>
);
HoveredValues = connect(state => state.hoveredWindValues || {})(HoveredValues);

const defaultLineStyle = {
    pointBorderWidth: 0,
    fill: false,
    backgroundColor: "transparent",
    pointBorderColor: "transparent",
    pointBackgroundColor: "transparent",
    pointHoverBorderWidth: 0,
    pointHoverBorderColor: "black",
    pointHoverBackgroundColor: "black",
    pointHoverRadius: 5,
};

class WindChart extends React.Component {
    getChartData(props) {
        const gusts = props.gusts;
        const avg = props.avg;

        const gustObservations = getObservations(gusts);
        const gustForecasts = getForecastPoints(gusts);

        const avgObservations = getObservations(avg);
        const avgForecasts = getForecastPoints(avg);

        const createLabels = fn => getLongestArray([gusts, avg]).map(fn);

        return {
            labels: createLabels(d => d.time),
            datasets: [
                {
                    label: "Puuskahavainnoit",
                    data: gustObservations,
                    ...defaultLineStyle,
                    borderColor: "#00b5ff",
                },
                {
                    label: "Puuskaennuste",
                    data: gustForecasts,
                    ...defaultLineStyle,
                    borderColor: "#00b5ff",
                    borderDash: [5, 10],
                },
                {
                    label: "Keskituulihavainnot",
                    data: avgObservations,
                    ...defaultLineStyle,
                    borderColor: "#b6eaff",
                },
                {
                    label: "Keskituuliennuste",
                    data: avgForecasts,
                    ...defaultLineStyle,
                    borderDash: [5, 10],
                    borderColor: "#b6eaff",
                },
                {
                    label: "Tuuliraja",
                    data: createLabels(() => GUST_LIMIT),
                    ...defaultLineStyle,
                    borderColor: "orange",
                    pointHoverRadius: 0,
                },
                {
                    label: "Tuuliraja B+",
                    data: createLabels(() => GUST_LIMIT_B),
                    ...defaultLineStyle,
                    borderColor: "red",
                    pointHoverRadius: 0,
                },
            ],
        };
    }

    componentDidMount() {
        this.throttledSetWindPoint = throttle(200, this.props.setWindPoint);
        this.debouncedChartUpdate = debounce(400, this.updateChart.bind(this));

        console.log("Creating Chart.js instance");
        this.chart = new Chart(this.canvas, {
            type: "line",
            data: this.getChartData(this.props),
            options: {
                tooltips: {
                    enabled: false,
                },

                scales: {
                    xAxes: [
                        {
                            type: "time",
                            unit: "hour",
                            unitStepSize: 1,
                            ticks: {
                                callback: (value, index, values) => {
                                    if (values[index]) {
                                        return values[index].format("HH:mm");
                                    }
                                    return value;
                                },
                            },
                        },
                    ],
                },
                hover: {
                    mode: "index",
                    intersect: false,
                    x: true,
                    onHover: (event, chartElement) => {
                        if (chartElement[0]) {
                            const index = chartElement[0]._index;
                            this.throttledSetWindPoint(
                                this.props.gusts[index],
                                this.props.avg[index],
                            );
                        }
                    },
                },
            },
        });
    }

    updateChart(props) {
        console.log("Updating WindChart canvas");
        this.chart.config.data = this.getChartData(props);
        this.chart.update(0);
    }

    componentWillReceiveProps(nextProps) {
        // TODO: actual check whether the data changed
        if (this.chart) {
            this.debouncedChartUpdate(nextProps);
        }
    }

    render() {
        return (
            <Flex>
                <HoveredValues />
                <canvas height="400" ref={el => (this.canvas = el)} />
            </Flex>
        );
    }
}
WindChart = connectLean({
    scope: () => "hoveredWindValues",

    setWindPoint(gust, avg) {
        this.setState({
            gust,
            avg,
        });
    },
})(WindChart);

const getPoints = getOr([], ["points"]);

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

var WindChartWrap = ({instanceKey, hasSomeChartData, ...props}) => (
    <WindChartContainer>
        {hasSomeChartData ? (
            <WindChart key={instanceKey} {...props} />
        ) : (
            <SpinnerContainer>
                <Spinner color="black" />
            </SpinnerContainer>
        )}
        }
    </WindChartContainer>
);
WindChartWrap = compose(
    addWeatherData,
    withPropsOnChange(
        ["gusts", "windAvg", "gustForecasts", "windAvgForecasts"],
        ({gusts, windAvg, gustForecasts, windAvgForecasts}) => {
            // console.log("mapping data");
            const combinedGusts = combineObsFore(gusts, gustForecasts);
            const combinedAvg = combineObsFore(windAvg, windAvgForecasts);

            const hasSomeChartData = [
                combinedGusts.length > 0,
                combinedAvg.length > 0,
            ].some(Boolean);

            return {hasSomeChartData, gusts: combinedGusts, avg: combinedAvg};
        },
    ),
    withProps({instanceKey: getWindowOr({innerWidth: 0}).innerWidth}),
    withBrowserEvent(
        getWindowOr(null),
        "resize",
        debounce(100, ({setProps}) =>
            setProps({
                instanceKey: getWindowOr({innerWidth: 0}).innerWidth,
            }),
        ),
    ),
    pure,
)(WindChartWrap);

export default WindChartWrap;
