import React from "react";
import {compose, lifecycle, withProps} from "recompose";
import {first, last, getOr, isEmpty} from "lodash/fp";
import {connectLean} from "lean-redux";
import qs from "querystring";
import u from "updeep";
import axios from "axios";
import moment from "moment";
import Chart from "chart.js";
import {View} from "./core";

const asLatLonPair = ({lat, lon}) => `${lat},${lon}`;
const getPoints = getOr([], ["points"]);

Chart.plugins.register({
    beforeDraw: function(chart, easing) {
        if (
            chart.config.options.chartArea &&
            chart.config.options.chartArea.backgroundColor
        ) {
            var helpers = Chart.helpers;
            var ctx = chart.chart.ctx;
            var chartArea = chart.chartArea;

            ctx.save();
            ctx.fillStyle = chart.config.options.chartArea.backgroundColor;
            ctx.fillRect(
                chartArea.left,
                chartArea.top,
                chartArea.right - chartArea.left,
                chartArea.bottom - chartArea.top
            );
            ctx.restore();
        }
    },
});

const getForecastPoints = data => data.map((d, i, array) => {
    if (d.type === "forecast") {
        return parseFloat(d.value, 10);
    } else if (array[i + 1] && array[i + 1].type === "forecast") {
        return parseFloat(d.value, 10);
    }

    return null;
});

const getObservations = data => data.map(d => {
    if (d.type === "observation") {
        return parseFloat(d.value, 10);
    }
    return null;
});

class ChartView extends React.Component {
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
                    fill: false,
                    lineTension: 0.5,
                    // backgroundColor: "rgba(75,192,192,0.4)",
                    borderColor: "rgba(75,192,192,0.4)",
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
                    data: gustObservations,
                    spanGaps: false,
                },
                {
                    label: "Puuskaennuste",
                    fill: false,
                    lineTension: 0.5,
                    // backgroundColor: "rgba(75,192,192,0.4)",
                    borderColor: "rgba(255,192,192,1)",
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
                    data: gustForecasts,
                    spanGaps: false,
                },
                {
                    label: "Keskituulihavainnot",
                    fill: false,
                    lineTension: 0.5,
                    // backgroundColor: "rgba(75,192,192,0.4)",
                    borderColor: "rgba(75,192,192,0.4)",
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
                    data: avgObservations,
                    spanGaps: false,
                },
                {
                    label: "Keskituuliennuste",
                    fill: false,
                    lineTension: 0.5,
                    // backgroundColor: "rgba(75,192,192,0.4)",
                    borderColor: "rgba(255,192,192,1)",
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
                    data: avgForecasts,
                    spanGaps: false,
                },
                {
                    label: "Oppilasraja",
                    fill: true,
                    // lineWidth: 0,
                    lineTension: 0.1,
                    backgroundColor: "green",
                    borderColor: "rgba(75,192,192,0)",
                    borderCapStyle: "none",
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: "miter",
                    pointBorderColor: "rgba(75,192,192,1)",
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 0,
                    pointHoverRadius: 0,
                    pointHoverBorderWidth: 0,
                    pointRadius: 0,
                    pointHitRadius: 0,
                    data: gusts.map(() => 8),
                },
                {
                    label: "B+",
                    fill: true,
                    // lineWidth: 0,
                    lineTension: 0.1,
                    backgroundColor: "orange",
                    borderColor: "rgba(75,192,192,0)",
                    borderCapStyle: "none",
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: "miter",
                    pointBorderColor: "rgba(75,192,192,1)",
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 0,
                    pointHoverRadius: 0,
                    pointHoverBorderWidth: 0,
                    pointRadius: 0,
                    pointHitRadius: 0,
                    data: gusts.map(() => 11),
                },
            ],
        };
        var i = 0;
        var myLineChart = new Chart(this.canvas, {
            type: "line",
            data: data,
            options: {
                chartArea: {
                    backgroundColor: "red",
                },
                scales: {
                    xAxes: [
                        {
                            type: "time",
                            ticks: {
                                maxTicksLimit: 10,
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
                    onHover: (a, b, c) => {
                        if (b[0]) {
                            // console.log(b[0]._index);
                            // i++;
                            // if (i > 100) {
                            //     debugger;
                            // }
                            // console.log(myLineChart.getElementsAtEvent(a));
                            // console.log(b[0]._datasetIndex);
                        }
                        // console.log("hover", a, b, c);
                        // debugger;
                    },
                },
            },
            // tooltips: {
            //     x: true,
            //     mode: "index",
            //     intersect: true,
            // },
            // options: options,
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

const combineObsFore = (obs, avg) => getPoints(obs)
    .map(d => ({
        ...d,
        type: "observation",
    }))
    .concat(
        getPoints(avg).slice(0, 6).map(d => ({
            ...d,
            type: "forecast",
        }))
    );

var Dz = ({gusts, windAvg, gustForecasts, windAvgForecasts}) => {
    const g = gusts ? last(gusts.points) : "ladataan";

    const a = windAvg ? last(windAvg.points) : "ladataan";

    const dataMissing = [
        isEmpty(getPoints(gusts)),
        isEmpty(getPoints(windAvg)),
        isEmpty(getPoints(gustForecasts)),
        isEmpty(getPoints(windAvgForecasts)),
    ].some(Boolean);

    const combinedGusts = combineObsFore(gusts, gustForecasts);
    const combinedAvg = combineObsFore(windAvg, windAvgForecasts);

    return (
        <View>
            dz näkymä3
            {!dataMissing &&
                <ChartView gusts={combinedGusts} avg={combinedAvg} />}
            <View>
                {JSON.stringify(g)}
            </View>
            <View>
                {JSON.stringify(a)}
            </View>
        </View>
    );
};
Dz = compose(
    withProps(props => {
        return qs.parse(props.location.search.slice(1));
    }),
    connectLean({
        scope: "weatherData",

        mapState(state, props) {
            return {
                ...state[props.fmisid],
                ...state[asLatLonPair(props)],
            };
        },

        fetchGusts() {
            if (this.props.fmisid) {
                axios(
                    `/api/observations/${this.props.fmisid}/fi-1-1-windgust`
                ).then(res => {
                    this.setState(
                        u({
                            [this.props.fmisid]: {
                                gusts: res.data,
                            },
                        })
                    );
                });
            }
        },

        fetchWindAvg() {
            if (this.props.fmisid) {
                axios(
                    `/api/observations/${this.props.fmisid}/fi-1-1-windspeedms`
                ).then(res => {
                    this.setState(
                        u({
                            [this.props.fmisid]: {
                                windAvg: res.data,
                            },
                        })
                    );
                });
            }
        },

        fetchGustForecasts() {
            if (this.props.lat && this.props.lon) {
                axios(
                    `/api/forecasts/${asLatLonPair(this.props)}/enn-s-1-1-windgust`
                ).then(res => {
                    this.setState(
                        u({
                            [asLatLonPair(this.props)]: {
                                gustForecasts: res.data,
                            },
                        })
                    );
                });
            }
        },

        fetchWindAvgForecasts() {
            if (this.props.lat && this.props.lon) {
                axios(
                    `/api/forecasts/${asLatLonPair(this.props)}/enn-s-1-1-windspeedms`
                ).then(res => {
                    this.setState(
                        u({
                            [asLatLonPair(this.props)]: {
                                windAvgForecasts: res.data,
                            },
                        })
                    );
                });
            }
        },

        fetchAll() {
            this.fetchGusts();
            this.fetchWindAvg();
            this.fetchGustForecasts();
            this.fetchWindAvgForecasts();
        },
    }),
    lifecycle({
        componentDidMount() {
            this.props.fetchAll();
        },
    })
)(Dz);

export default Dz;
