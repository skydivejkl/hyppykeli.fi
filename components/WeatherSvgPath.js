/** @jsx React.DOM */
var React = require("react");
var d3 = require("d3");

function cmp(a, b) {
    return b.time.getTime() - a.time.getTime();
}

// TODO: this is a sorted array. We could binary search it...
function findClosest(value, arr, start) {
    return arr.reduce(function(best, current) {
        if (Math.abs(cmp(value, current)) < Math.abs(cmp(value, best))) {
            return current;
        } else {
            return best;
        }
    }, start || arr[0]);
}


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

    getDefaultProps: function() {
        return {
            mousePosition: 0
        };
    },

    render: function() {
        var self = this;
        var circle;
        var forecasts = this.cleanedForecasts();

        var lineFunction = d3.svg.line()
            .x(function(d) { return self.props.xScale(d.time.getTime()); })
            .y(function(d) { return self.props.yScale(d.value); })
            ;

        var timeInMousePos = {
            time: new Date(this.props.xScale.invert(this.props.mousePosition))
        };

        var pos = findClosest(timeInMousePos, this.props.observations);
        pos = findClosest(timeInMousePos, forecasts, pos);


        if (pos) {
            var cx = this.props.xScale(pos.time.getTime());
            var cy = this.props.yScale(pos.value);
            circle = <circle cx={cx} cy={cy} r="5" fill="none" stroke="red" />;
        }

        return (
            <g className={"weather-data-path " + this.props.key}>

                {circle}

                <path
                    className="observations"
                    d={ lineFunction(this.props.observations) }
                    strokeWidth="1"
                    fill="none"
                />

                <path
                    className="forecasts"
                    d={ lineFunction(forecasts) }
                    strokeWidth="2"
                    // strokeDasharray="5,5"
                    fill="none"
                />


            </g>
        );

    }

});

module.exports = WeatherSvgPath;
