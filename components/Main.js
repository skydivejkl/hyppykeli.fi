/** @jsx React.DOM */

var React = require('react');
var _ = require("lodash");

var WeatherGraph = require("./WeatherGraph");
var Slider = require("./Slider");

var Main = React.createClass({

    getInitialState: function() {
        return {
            data: {},
            futureHours: 6,
            pastHours: 6
        };
    },

    futureSlice: function(arr) {
        var max = Date.now() + 1000 * 60 * 60 * this.state.futureHours;
        return arr.filter(function(d) {
            return d.time.getTime() < max;
        });
    },

    pastSlice: function(arr) {
        var min = Date.now() - 1000 * 60 * 60 * this.state.pastHours;
        return arr.filter(function(d) {
            return d.time.getTime() > min;
        });
    },

    getSlicedData: function() {

        var data = _.clone(this.state.data, true);
        var self = this;

        _.forEach(data, function(value) {
            value.forecasts = self.futureSlice(value.forecasts);
            value.observations = self.pastSlice(value.observations);
        });

        return data;
    },

    handleObservationSlide: function(val) {
        this.setState({
            pastHours: Math.max(val, 1)
        });
    },

    handleForceastSlide: function(val) {
        this.setState({
            futureHours: Math.max(val, 1)
        });
    },

    render: function() {
        return (
            <div>
                <div className="cf weather-boxes">
                    <div className="box-wrap">
                        <div className="box">
                            <h1>Gusts<img src="/climacons/Wind.svg" /></h1>
                            <p className="value">5 m/s</p>
                            <p className="time">2 min 45 sec ago</p>
                        </div>
                    </div>

                    <div className="box-wrap">
                        <div className="box">
                            <h1>Windspeed</h1>
                            <p className="value">2 m/s</p>
                            <p className="time">2 min 45 sec ago</p>
                        </div>
                    </div>

                    <div className="box-wrap">
                        <div className="box">
                            <h1>Windspeed</h1>
                            <p className="value">2 m/s</p>
                            <p className="time">2 min 45 sec ago</p>
                        </div>
                    </div>
                </div>

                <h2>Wind gust/avg over time</h2>

                <WeatherGraph
                    data={ this.getSlicedData() }
                />

                <Slider
                    className="observations"
                    name={"Show observations from the last " + this.state.pastHours.toFixed(1) + " hours"}
                    onChange={_.debounce(this.handleObservationSlide, 200)}
                    value={this.state.pastHours}
                />
                <Slider
                    className="forecasts"
                    name={"Show forecasts for the next " + this.state.futureHours.toFixed(1) + " hours"}
                    onChange={_.debounce(this.handleForceastSlide, 200)}
                    value={this.state.futureHours}
                />
            </div>
        );
    }

});

module.exports = Main;
