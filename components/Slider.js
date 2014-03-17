/** @jsx React.DOM */
var React = require('react');

var $ = require("../vendor/jquery.nouislider.shim");

var Slider = React.createClass({

    getDefaultProps: function() {
        return {
            range: [0, 12],
            connect: "lower",
            initialValue: 6,
            onChange: function(val) {
                console.log("No handler for slider value", val);
            }
        };
    },

    getInitialState: function() {
        return {
            value: this.props.initialValue
        };
    },

    componentDidMount: function() {
        var self = this;
        console.log("rendering slider");

        var $el = $(this.refs.el.getDOMNode());

        $el.noUiSlider({
             range: this.props.range,
             start: this.props.initialValue,
             direction: this.props.direction,
             slide: function() {
                 self.setState({ value: $el.val() });
             },
             set: function() {
                 self.props.onChange($el.val());
             },
             handles: 1,
             connect: this.props.connect
        });
    },

    render: function() {

        return (
            <div className={"slider-wrap " + this.props.className}>
                <div className="slider">
                    <div className="name">{this.props.title} {this.state.value} hours</div>
                    <div ref="el"></div>
                </div>
            </div>
        );
    }

});

module.exports = Slider;
