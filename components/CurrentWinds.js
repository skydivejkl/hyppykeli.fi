/** @jsx React.DOM */
var React = require("react");
var moment= require("moment");

var DataBox = require("./DataBox");

var CurrentWinds = React.createClass({

    componentDidMount: function() {
        setInterval(this.forceUpdate.bind(this), 1000 * 5);
    },

    hasData: function() {
        return !!this.props.gust;
    },

    fromNow: function() {
        if (this.hasData()) return moment(this.props.gust.time).fromNow();
    },

    render: function() {

        var content = (
            <div>
                <p>Loading...</p>
                <p> </p>
            </div>
        );

        if (this.hasData()) content = (
            <div>
                <p>Gust <b>{this.props.gust.value} m/s</b></p>
                <p>10 minute average <b>{this.props.avg.value} m/s</b></p>
            </div>
        );

        return (
            <DataBox
                icon="Tornado"
                title="Winds"
                time={this.fromNow()} >
                {content}
            </DataBox>
        );
    }
});

module.exports = CurrentWinds;
