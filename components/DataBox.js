/** @jsx React.DOM */
var React = require("react");

var DataBox = React.createClass({

    render: function() {
        return (
            <div className="box-wrap">
                <div className="box">

                    <div className="icon">
                        <img src={"/climacons/"+this.props.icon+".svg"} />
                    </div>

                        <h1>{this.props.title}</h1>
                        <div className="value">{this.props.children}</div>
                </div>
            </div>
        );
    }

});

module.exports = DataBox;
