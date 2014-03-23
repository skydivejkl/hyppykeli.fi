/** @jsx React.DOM */
var React = require("react");
var d3 = require("d3");

var WeatherSvgPath = React.createClass({

    cleanedForecasts: function() {

        if (this.props.observations.length === 0) return this.props.forecasts;

        var latestsObservation = this.props.observations[this.props.observations.length-1];

        // We don't care about forecasts from the time we have actual
        // observations
        var forecasts = this.props.forecasts.filter(function(val) {
            return latestsObservation.time.getTime() < val.time.getTime();
        });

        // Start forecast drawing from the point we have the last observation
        forecasts.unshift(latestsObservation);

        return forecasts;
    },


    render: function() {
        var self = this;
        var lineFunction = d3.svg.line()
            .x(function(d) { return self.props.xScale(d.time.getTime()); })
            .y(function(d) { return self.props.yScale(d.value); })
            ;

        return (
            <g className={"weather-data-path " + this.props.key}>

                <path
                    className="observations"
                    d={ lineFunction(this.props.observations) }
                    strokeWidth="1"
                    fill="none"
                />

                <path
                    className="forecasts"
                    d={ lineFunction(this.cleanedForecasts()) }
                    strokeWidth="1"
                    fill="none"
                />


            </g>
        );

    }

});

module.exports = WeatherSvgPath;
