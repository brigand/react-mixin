// simple mixin exposes setTimeout and clearTimeout with automatic
// cleanup on unmount and binding of the provided function
module.exports = {
    componentWillMount: function(){
        this.__timers = {};
    },
    setTimeout: function(fn, duration){
        var timer = setTimeout(() => fn.call(this), duration);
        this.__timers[timer] = true;
        return timer;
    },
    clearTimeout: function(id){
        clearTimeout(id);
        delete this.__timers[id];
    },
    componentWillUnmount: function(){
        Object.keys(this.__timers).forEach(id => { clearTimeout(id) });                      
    }
};
