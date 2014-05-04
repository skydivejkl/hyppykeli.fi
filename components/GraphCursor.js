/** @jsx React.DOM */
var React = require("react");
var d3 = require("d3");


var GraphCursor = React.createClass({


    render: function() {
        var pos = this.props.cursorPosition;

        if (pos - this.props.padding < 0) {
            pos = this.props.padding;
        }

        if (pos + this.props.padding > this.props.width) {
            pos = this.props.width - this.props.padding;
        }

        return (
            <line
                x1={pos}
                y1={this.props.paddingTop}

                x2={pos}
                y2={this.props.height - this.props.padding}

                stroke="darkgray"
                strokeWidth="1"

            />
        );

    }

});

module.exports = GraphCursor;
