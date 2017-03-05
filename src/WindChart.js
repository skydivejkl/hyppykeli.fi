import React from "react";
import Chart from "chart.js";
import {connectLean} from "lean-redux";
import color from "color";

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

const defaultLineStyle = {
    pointBorderWidth: 0,
    fill: false,
    backgroundColor: "transparent",
    pointBorderColor: "transparent",
    pointBackgroundColor: "transparent",
    pointHoverBorderWidth: 1,
    pointHoverBorderColor: "black",
    pointHoverBackgroundColor: "rgba(0,0,255, 0.5)",
    pointHoverRadius: 10,
    pointStyle: "crossRot",
};

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
                    data: gusts.map(() => 8),
                    ...defaultLineStyle,
                    borderColor: "yellow",
                    pointHoverRadius: 0,
                },
                {
                    label: "Tuuliraja B+",
                    data: gusts.map(() => 11),
                    ...defaultLineStyle,
                    borderColor: "red",
                    pointHoverRadius: 0,
                },
            ],
        };
        var i = 0;
        var myLineChart = new Chart(this.canvas, {
            type: "line",
            data: data,
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
