/** @jsx React.DOM */
var React = require("react");
var moment= require("moment");
var _ = require("lodash");

var DataBox = require("./DataBox");
var ZoomableGraph = require("./ZoomableGraph");
var WeatherGraph = require("./WeatherGraph");


var Location = React.createClass({
    getDefaultProps: function() {
        return {
            location: {}
        };
    },
    render: function() {
        return (
            <span className="wind-data-source">
                {this.props.name}: {this.props.location.name} ({this.props.location.fmisid})
            </span>
        );
    }
});
var CurrentWinds = React.createClass({

    componentDidMount: function() {
        setInterval(this.forceUpdate.bind(this), 1000 * 5);
    },

    hasData: function() {
        return !!this.state.selectedPoints.length;
    },

    fromNow: function() {
        if (this.hasData()) {
            return moment(this.state.selectedPoints[0].time).fromNow();
        }
    },

    getInitialState: function() {
        return {
            selectedPoints: []
        };
    },

    renderCurrent: function( ) {
        if (!this.hasData()) {
            return (
                <div>
                    <p>Loading...</p>
                </div>
            );
        }

        return (
            <div className="wind-values">
                {this.state.selectedPoints.map(function(val) {
                    return <span className="item">{val.title} {val.value} m/s{" "}</span>;
                })}

                <span className="footer-text item">{this.fromNow()}</span>
            </div>
        );
    },

    handleSlide: function(selected) {
        this.setState({
            selectedPoints: selected.selectedPoints,
            cursorPosition: selected.cursorPosition,
        });
    },

    render: function() {

        return (
                <DataBox
                    icon="Tornado"
                    title="Wind" >
                    {this.renderCurrent()}
                    <ZoomableGraph
                        onSlide={this.handleSlide}
                        lines={[
                            {
                                title: "Gust",
                                observations: this.props.gustObservations.data,
                                forecasts: this.props.gustForecasts.data
                            },
                            {
                                title: "Average",
                                observations: this.props.windObservations.data,
                                forecasts: this.props.windForecasts.data
                            }
                        ]}

                        selectedPoints={this.state.selectedPoints}
                        cursorPosition={this.state.cursorPosition}
                    />

                    <div className="footer-text">
                        Continuous line represents the observations and the dotted line is a forecast.
                    </div>

                    <div className="footer-text wind-data">
                        <a href="http://ilmatieteenlaitos.fi/havaintoasemat">Sources</a>:
                        <Location name="Wind average observations" location={this.props.windObservations.location} />
                        <Location name="Wind average forecasts" location={this.props.windForecasts.location} />
                        <Location name="Gust observations" location={this.props.gustObservations.location} />
                        <Location name="Gust forecasts" location={this.props.gustForecasts.location} />
                    </div>

                </DataBox>
        );
    }
});

module.exports = CurrentWinds;
