/** @jsx React.DOM */

var React = require('react');
var _ = require("lodash");

var WeatherGraph = require("./WeatherGraph");

var Main = React.createClass({

    getInitialState: function() {
        return {
            data: {},
            futureHours: 10,
            pastHours: 10
        };
    },

    slice: function() {
        this.setState({
            futureHours: this.state.futureHours - 1,
            pastHours: this.state.pastHours - 1
        });
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

        console.log("SLICING DATA");
        var data = _.clone(this.state.data, true);
        var self = this;

        _.forEach(data, function(value) {
            value.forecasts = self.futureSlice(value.forecasts);
            value.observations = self.pastSlice(value.observations);
        });

        return data;
    },

    render: function() {
        console.log("main render");
        return (
            <div>
                <WeatherGraph
                    data={ this.getSlicedData() }
                />
                <button onClick={this.slice} >slice</button>
            </div>
        );
    }

});

module.exports = Main;
