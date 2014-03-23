/** @jsx React.DOM */
var React = require("react");
var d3 = require("d3");


var GraphCursor = React.createClass({


    render: function() {
        return (
            <line
                x1={this.props.cursorPosition}
                y1={this.props.paddingTop}

                x2={this.props.cursorPosition}
                y2={this.props.height - this.props.padding}

                stroke="gray"
                strokeWidth="1"

            />
        );

    }

});

module.exports = GraphCursor;
