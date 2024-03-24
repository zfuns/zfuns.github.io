if (console) {
  var _console = {
    log: console.log,
    info: console.info,
    debug : console.debug,
    warn : console.warn,
    error : console.error,
  };
  console.log = function(data) {
    // do sth
    _console.log.apply(this, Array.prototype.slice.call(arguments, 0));
  };
  console.info = function(data) {
    // do sth
    _console.info.apply(this, Array.prototype.slice.call(arguments, 0));
  };
  console.debug = function(data) {
    // do sth
    _console.debug.apply(this, Array.prototype.slice.call(arguments, 0));
  };
  console.warn = function(a) {
    // do sth
    _console.warn.apply(this, Array.prototype.slice.call(arguments, 0));
  };
  console.error = function(a) {
    // do sth
    _console.error.apply(this, Array.prototype.slice.call(arguments, 0));
  };
}
