import React from "react";
import {compose, lifecycle, withProps} from "recompose";
import {first, last} from "lodash/fp";
import {connectLean} from "lean-redux";
import qs from "querystring";
import u from "updeep";
import axios from "axios";
import moment from "moment";
import Chart from "chart.js";
import {View} from "./core";

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

class ChartView extends React.Component {
    componentDidMount() {
        var data = {
            labels: this.props.gusts.map(d => d.time),
            datasets: [
                {
                    label: "Keskituuli",
                    fill: false,
                    lineTension: 0.5,
                    backgroundColor: "rgba(75,192,192,0.4)",
                    borderColor: "rgba(75,192,192,1)",
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
                    data: this.props.avg.map(d => parseFloat(d.value, 10)),
                    spanGaps: false,
                },
                {
                    label: "Puuskat",
                    fill: false,
                    lineTension: 0.5,
                    backgroundColor: "rgba(75,192,192,0.4)",
                    borderColor: "rgba(75,192,192,1)",
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
                    data: this.props.gusts.map(
                        d => parseFloat(d.value, 10) + 5
                    ),
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
                    data: this.props.gusts.map(() => 8),
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
                    data: this.props.gusts.map(() => 11),
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
                            tick: {
                                autoSkip: true,
                                maxTicksLimit: 10,
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
                            console.log(b[0]._index);
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

var Dz = ({gusts, windAvg}) => {
    const g = gusts ? last(gusts.points) : "ladataan";
    const a = windAvg ? last(windAvg.points) : "ladataan";

    return (
        <View>
            dz näkymä3
            {Boolean(windAvg && gusts) &&
                <ChartView gusts={gusts.points} avg={windAvg.points} />}
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
            return state[props.fmisid];
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

        fetchAll() {
            this.fetchGusts();
            this.fetchWindAvg();
        },
    }),
    lifecycle({
        componentDidMount() {
            this.props.fetchAll();
        },
    })
)(Dz);

export default Dz;
