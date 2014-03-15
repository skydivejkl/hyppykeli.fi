
var _ = require("underscore");

function fromDom(el) {
    var args;
    return {
        on: function(event, handler) {
            if (args) throw new Error("this is one off wrapper");
            el.addEventListener(event, handler, false);
            args = [event, handler];
        },
        off: function() {
            el.removeEventListener.apply(el, args);
        }

    };
}

function fromD3(selection) {
    var uid = _.uniqueId("bb_listener");

    return {
        on: function(event, handler) {
            selection.on(event + "." + uid, handler);
        },
        off: function() {
            selection.on(event + "." + uid, null);
        }

    };

}


module.exports = function(ob) {
    if (ob.on && ob.selectAll) return fromD3(ob);
    return fromDom(ob);

};
