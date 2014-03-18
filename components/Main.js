/** @jsx React.DOM */

var React = require("react");
var _ = require("lodash");
var moment = require("moment");

var WeatherGraph = require("./WeatherGraph");
var Slider = require("./Slider");


var WeatherProp = React.createClass({

    render: function() {
        return (
            <div className="box-wrap">
                <div className="box">

                    <div className="icon">
                        <img src={"/climacons/"+this.props.icon+".svg"} />
                    </div>

                        <h1>{this.props.title}</h1>
                        <div className="value">{this.props.children}</div>
                        <div className="time">{this.props.time}</div>

                </div>
            </div>
        );
    }

});

var CurrentWinds = React.createClass({

    componentWillMount: function() {
        this.computeTimeAgo();
    },
    componentDidMount: function() {
        setInterval(this.computeTimeAgo.bind(this), 1000 * 5);
        this.computeTimeAgo();
    },

    computeTimeAgo: function() {
        this.setState({
            ago: moment(this.props.gust.time).fromNow()
        });
    },

    render: function() {

        return (
            <WeatherProp
                icon="Tornado"
                title="Winds"
                time={this.state.ago} >
                <p>Gust {this.props.gust.value} m/s</p>
                <p>10 minute average {this.props.avg.value} m/s</p>

            </WeatherProp>
        );
    }
});

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

                    {this.state.data.windGusts && <CurrentWinds
                        avg={_.last(this.state.data.windSpeeds.observations)}
                        gust={_.last(this.state.data.windGusts.observations)}
                    />}

                    <WeatherProp
                        icon="Cloud-Sun"
                        title="Clouds"
                        time="23 minutes 41 seconds ago" >

                        <p>Broken at 2000m</p>
                        <p>Scattered at 800m</p>
                        <p>Few at 300m</p>
                        <p>Few at 300m with ksdjf lsdajfl asda</p>

                    </WeatherProp>

                    <WeatherProp
                        icon="Sunset"
                        title="Sunset"
                        time="at 18:20" >

                        <p>in 1 hour 30 minutes</p>

                    </WeatherProp>

                </div>

                <h2>Wind gust/avg over time</h2>

                <WeatherGraph
                    data={ this.getSlicedData() }
                />

                <Slider
                    className="observations"
                    title="Show observations from the last "
                    onChange={this.handleObservationSlide}
                    value={this.state.pastHours}
                />
                <Slider
                    className="forecasts"
                    title="Show forecasts for the next "
                    onChange={this.handleForceastSlide}
                    value={this.state.futureHours}
                />
            </div>
        );
    }

});

module.exports = Main;
