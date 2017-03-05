import React from "react";
import Chart from "chart.js";
import {connectLean} from "lean-redux";

import {View} from "./core";

const asFloat = i => parseFloat(i, 10) + 5;

const getForecastPoints = data => data.map((d, i, array) => {
    if (d.type === "forecast") {
        return asFloat(d.value);
    } else if (array[i + 1] && array[i + 1].type === "forecast") {
        return asFloat(d.value);
    }

    return null;
});

const getObservations = data => data.map(d => {
    if (d.type === "observation") {
        return asFloat(d.value);
    }
    return null;
});

class WindChart extends React.Component {
    componentDidMount() {
        const gusts = this.props.gusts;
        const avg = this.props.avg;

        const gustObservations = getObservations(gusts);
        const gustForecasts = getForecastPoints(gusts);

        const avgObservations = getObservations(avg);
        const avgForecasts = getForecastPoints(avg);

        var data = {
            labels: gusts.map(d => d.time),
            datasets: [
                {
                    label: "Puuskahavainnoit",
                    data: gustObservations,
                    fill: false,
                    lineTension: 0.5,
                    // backgroundColor: "rgba(75,192,192,0.4)",
                    borderColor: "blue",
                    borderCapStyle: "butt",
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: "miter",
                    pointBorderColor: "rgba(75,192,192,1)",
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgba(75,192,192,1)",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    spanGaps: false,
                },
                {
                    label: "Puuskaennuste",
                    data: gustForecasts,
                    fill: false,
                    lineTension: 0.5,
                    // backgroundColor: "rgba(75,192,192,0.4)",
                    borderColor: "blue",
                    borderCapStyle: "butt",
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: "miter",
                    pointBorderColor: "rgba(75,192,192,1)",
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgba(75,192,192,1)",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    spanGaps: false,
                },
                {
                    label: "Keskituulihavainnot",
                    data: avgObservations,
                    fill: false,
                    lineTension: 0.5,
                    // backgroundColor: "rgba(75,192,192,0.4)",
                    borderColor: "blue",
                    borderCapStyle: "butt",
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: "miter",
                    pointBorderColor: "rgba(75,192,192,1)",
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgba(75,192,192,1)",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    spanGaps: false,
                },
                {
                    label: "Keskituuliennuste",
                    data: avgForecasts,
                    fill: false,
                    lineTension: 0.5,
                    // backgroundColor: "rgba(75,192,192,0.4)",
                    borderColor: "blue",
                    borderDashOffset: 0.0,
                    borderJoinStyle: "none",
                    pointBorderColor: "rgba(75,192,192,1)",
                    pointBackgroundColor: "rgba(75,192,192,1)",
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgba(75,192,192,1)",
                    pointHoverBorderWidth: 10,
                    // pointRadius: 5,
                    // pointHitRadius: 10,
                    spanGaps: false,
                },
            ],
        };
        var i = 0;
        var myLineChart = new Chart(this.canvas, {
            type: "line",
            data: data,
            options: {
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
                            this.props.setWindPoint(gusts[index], avg[index]);
                        }
                    },
                },
            },
        });
    }

    render() {
        return (
            <View>
                <canvas ref={el => this.canvas = el} />
            </View>
        );
    }
}
WindChart = connectLean({
    scope: "windPoint",

    setWindPoint(gust, avg) {
        this.setState({
            gust,
            avg,
        });
    },
})(WindChart);

export default WindChart;
