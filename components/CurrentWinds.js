/** @jsx React.DOM */
var React = require("react");
var moment= require("moment");
var _ = require("lodash");

var DataBox = require("./DataBox");
var ZoomableGraph = require("./ZoomableGraph");

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
            <div>
                {this.state.selectedPoints.map(function(val) {
                    return <p>{val.title} {val.value} m/s</p>;
                })}
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
            <div className="winds">
                <DataBox
                    icon="Tornado"
                    title="Wind"
                    time={this.fromNow()} >
                    {this.renderCurrent()}
                </DataBox>
                <ZoomableGraph
                    windObservations={this.props.windObservations}
                    windForecasts={this.props.windForecasts}
                    gustObservations={this.props.gustObservations}
                    gustForecasts={this.props.gustForecasts}
                    onSlide={this.handleSlide}

                    selectedPoints={this.state.selectedPoints}
                    cursorPosition={this.state.cursorPosition}
                />
            </div>
        );
    }
});

module.exports = CurrentWinds;
