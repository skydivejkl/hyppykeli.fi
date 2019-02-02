import React from "react";
import Chart from "chart.js";
import dayjs from "dayjs";
import {throttle, debounce, maxBy} from "lodash-es";
import {connectLean} from "lean-redux";
import {connect} from "react-redux";
import simple from "react-simple";

import {fromNowWithClock} from "./utils";
import {GUST_LIMIT, GUST_LIMIT_B, View} from "./core";

const getLongestArray = arr => maxBy(arr, a => a.length);

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

const Flex = simple(View, {
    flex: 1,
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
        this.throttledSetWindPoint = throttle(this.props.setWindPoint, 200);
        this.debouncedChartUpdate = debounce(this.updateChart.bind(this), 400);

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
                                        return dayjs(
                                            values[index].value,
                                        ).format("HH:mm");
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
const WindChartConnected = connectLean({
    scope: () => "hoveredWindValues",

    setWindPoint(gust, avg) {
        this.setState({
            gust,
            avg,
        });
    },
})(WindChart);

export default WindChartConnected;
