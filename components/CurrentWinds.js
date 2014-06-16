/** @jsx React.DOM */
var React = require("react");
var moment= require("moment");

var DataBox = require("./DataBox");
var ZoomableGraph = require("./ZoomableGraph");


function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2-lat1);  // deg2rad below
  var dLon = deg2rad(lon2-lon1);
  var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180);
}

var Location = React.createClass({
    getDefaultProps: function() {
        return {
            location: {}
        };
    },

    getDistanceToStation: function() {
        var distance = getDistanceFromLatLonInKm(
            parseFloat(this.props.coordinates.lat, 10),
            parseFloat(this.props.coordinates.lon, 10),
            parseFloat(this.props.stationLocation.coordinates.lat, 10),
            parseFloat(this.props.stationLocation.coordinates.lon, 10)
        );

        return Math.round(distance * 100) / 100;
    },

    getTitle: function() {
        return [
            this.props.stationLocation.name + ",",
            "FMISID:",
            this.props.stationLocation.fmisid,
            "coordinates:",
            this.props.stationLocation.coordinates.lat + ",",
            this.props.stationLocation.coordinates.lon,
        ].join(" ");
    },

    render: function() {
        if (!this.props.stationLocation) return <script />;

        return (
            <li className="wind-data-source" title={this.getTitle()}>
                {this.props.name} {this.props.location.name} from a <span className="station">station</span> within {this.getDistanceToStation()} km
            </li>
        );
    }
});

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

        window.spinLogo(this.state.selectedPoints[0].value);

        return (
            <div className="wind-values">
                {this.state.selectedPoints.map(function(val) {
                    return <span className="item">{val.title} {val.value} m/s{" "}</span>;
                })}

                <span className="footer-text item">{this.fromNow()}</span>
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
                <DataBox
                    icon="Tornado"
                    title="Wind" >
                    {this.renderCurrent()}
                    <ZoomableGraph
                        onSlide={this.handleSlide}
                        lines={[
                            {
                                title: "Gust",
                                observations: this.props.gustObservations.data,
                                forecasts: this.props.gustForecasts.data
                            },
                            {
                                title: "Average",
                                observations: this.props.windObservations.data,
                                forecasts: this.props.windForecasts.data
                            }
                        ]}

                        selectedPoints={this.state.selectedPoints}
                        cursorPosition={this.state.cursorPosition}
                    />

                    <div className="footer-text">
                        Continuous line represents the observations and the dashed line is a forecast.
                    </div>

                    <div className="footer-text wind-data">
                        <a href="http://ilmatieteenlaitos.fi/havaintoasemat">Sources</a>:
                        <ul className="wind-sources">
                            <Location name="Wind average observations" stationLocation={this.props.windObservations.location} coordinates={this.props.coordinates} />
                            <Location name="Wind average forecasts" stationLocation={this.props.windForecasts.location} coordinates={this.props.coordinates} />
                            <Location name="Gust observations" stationLocation={this.props.gustObservations.location} coordinates={this.props.coordinates} />
                            <Location name="Gust forecasts" stationLocation={this.props.gustForecasts.location} coordinates={this.props.coordinates} />
                        </ul>
                    </div>

                </DataBox>
        );
    }
});

module.exports = CurrentWinds;
