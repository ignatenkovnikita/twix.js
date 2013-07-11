// Generated by CoffeeScript 1.6.2
(function() {
  var lang;

  lang = function(moment, Twix) {
    return moment.lang('fr', {
      twix: Twix._extend({}, Twix.defaults, {
        twentyFourHour: true,
        allDayMonth: {
          fn: function(options) {
            return function(date) {
              return date.format("" + options.dayFormat + " " + options.monthFormat);
            };
          },
          slot: 3
        },
        month: {
          slot: 3
        },
        date: {
          slot: 2
        }
      })
    });
  };

  if ((typeof module !== "undefined" && module !== null) && (module.exports != null)) {
    module.exports = lang;
  } else {
    lang(moment, Twix);
  }

}).call(this);
