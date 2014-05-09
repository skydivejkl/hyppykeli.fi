/** @jsx React.DOM */
var React = require("react");
var moment= require("moment");

var DataBox = require("./DataBox");

var CurrentWinds = React.createClass({

    componentDidMount: function() {
        var self = this;
        (function updater() {
            self.forceUpdate.bind(self);
            setTimeout(updater, 1000 * 5);    
        }());
    },

    hasData: function() {
        return !!this.props.gust;
    },

    fromNow: function() {
        if (this.hasData()) {
            return moment(this.props.gust.time).fromNow();
        }
    },

    render: function() {

        var content = (
            <div>
                <p>Loading...</p>
            </div>
        );

        if (this.hasData()) content = (
            <div>
                <p>Gust {this.props.gust.value} m/s</p>
                <p>Average {this.props.avg.value} m/s</p>
            </div>
        );

        return (
            <DataBox
                icon="Tornado"
                title="Wind"
                time={this.fromNow()} >
                {content}
            </DataBox>
        );
    }
});

module.exports = CurrentWinds;
