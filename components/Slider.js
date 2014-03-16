/** @jsx React.DOM */
var React = require('react');

var $ = require("../vendor/jquery.nouislider.shim");

var Slider = React.createClass({

    getDefaultProps: function() {
        return {
            range: [0, 12],
            connect: "lower",
            onChange: function(val) {
                console.log("No handler for slider value", val);
            }
        };
    },

    componentDidMount: function() {
        var self = this;
        console.log("rendering slider");

        var $el = $(this.refs.el.getDOMNode());

        $el.noUiSlider({
             range: this.props.range,
             start: this.props.value,
             direction: this.props.direction,
             slide: function() {
                 var val = $el.val();
                 self.props.onChange(val);
             },
             handles: 1,
             connect: this.props.connect
            //  serialization: {
            //     resolution: 1
            // }
        });
    },

    render: function() {

        return (
            <div className={"slider-wrap " + this.props.className}>
                <div className="slider">
                    <div className="name">{this.props.name}</div>
                    <div ref="el"></div>
                </div>
            </div>
        );
    }

});

module.exports = Slider;
