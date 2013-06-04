
var $ = require("./vendor/jquery");
require("./vendor/Chart");


var data = {
    labels : ["January","February","March","April","May","June","July"],
    datasets : [
        {
            fillColor : "rgba(220,220,220,0.5)",
            strokeColor : "rgba(220,220,220,1)",
            pointColor : "rgba(220,220,220,1)",
            pointStrokeColor : "#fff",
            data : [65,59,90,81,56,55,40]
        },
        {
            fillColor : "rgba(151,187,205,0.5)",
            strokeColor : "rgba(151,187,205,1)",
            pointColor : "rgba(151,187,205,1)",
            pointStrokeColor : "#fff",
            data : [28,48,40,19,96,27,100]
        }
    ]
};

$.get("/api/Tikkakoski/observations", function(res) {
    var canvas = $("canvas").get(0);
    canvas.width = 800;
    canvas.height = 300;
    new Chart(canvas.getContext("2d")).Line(data);
});
