// Generated by CoffeeScript 1.6.2
(function() {
  var Twix, hasModule, knownLanguages, moment,
    __slice = [].slice,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  hasModule = (typeof module !== "undefined" && module !== null) && (module.exports != null);

  if (hasModule) {
    moment = require('moment');
  } else {
    moment = this.moment;
  }

  if (moment == null) {
    throw "Can't find moment";
  }

  knownLanguages = ['en'];

  Twix = (function() {
    function Twix(start, end, allDay) {
      this.start = moment(start);
      this.end = moment(end);
      this.allDay = allDay || false;
    }

    Twix._extend = function() {
      var attr, first, other, others, _i, _len;

      first = arguments[0], others = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      for (_i = 0, _len = others.length; _i < _len; _i++) {
        other = others[_i];
        for (attr in other) {
          if (typeof other[attr] !== "undefined") {
            first[attr] = other[attr];
          }
        }
      }
      return first;
    };

    Twix.defaults = {
      twentyFourHour: false,
      allDaySimple: {
        fn: function(options) {
          return function() {
            return options.allDay;
          };
        },
        slot: 0,
        pre: " "
      },
      dayOfWeek: {
        fn: function(options) {
          return function(date) {
            return date.format(options.weekdayFormat);
          };
        },
        slot: 1,
        pre: " "
      },
      allDayMonth: {
        fn: function(options) {
          return function(date) {
            return date.format("" + options.monthFormat + " " + options.dayFormat);
          };
        },
        slot: 2,
        pre: " "
      },
      month: {
        fn: function(options) {
          return function(date) {
            return date.format(options.monthFormat);
          };
        },
        slot: 2,
        pre: " "
      },
      date: {
        fn: function(options) {
          return function(date) {
            return date.format(options.dayFormat);
          };
        },
        slot: 3,
        pre: " "
      },
      year: {
        fn: function(options) {
          return function(date) {
            return date.format(options.yearFormat);
          };
        },
        slot: 4,
        pre: ", "
      },
      time: {
        fn: function(options) {
          return function(date) {
            var str;

            str = date.minutes() === 0 && options.implicitMinutes && !options.twentyFourHour ? date.format(options.hourFormat) : date.format("" + options.hourFormat + ":" + options.minuteFormat);
            if (!options.groupMeridiems && !options.twentyFourHour) {
              if (options.spaceBeforeMeridiem) {
                str += " ";
              }
              str += date.format(options.meridiemFormat);
            }
            return str;
          };
        },
        slot: 5,
        pre: ", "
      },
      meridiem: {
        fn: function(options) {
          var _this = this;

          return function(t) {
            return t.format(options.meridiemFormat);
          };
        },
        slot: 6,
        pre: function(options) {
          if (options.spaceBeforeMeridiem) {
            return " ";
          } else {
            return "";
          }
        }
      }
    };

    Twix.prototype.isSame = function(period) {
      return this.start.isSame(this.end, period);
    };

    Twix.prototype.length = function(period) {
      return this._trueEnd().add(1, "millisecond").diff(this._trueStart(), period);
    };

    Twix.prototype.count = function(period) {
      var end, start;

      start = this.start.clone().startOf(period);
      end = this.end.clone().startOf(period);
      return end.diff(start, period) + 1;
    };

    Twix.prototype.countInner = function(period) {
      var end, start, _ref;

      _ref = this._inner(period), start = _ref[0], end = _ref[1];
      if (start >= end) {
        return 0;
      }
      return end.diff(start, period);
    };

    Twix.prototype.iterate = function(period, minHours) {
      var end, hasNext, start,
        _this = this;

      start = this.start.clone().startOf(period);
      end = this.end.clone().startOf(period);
      hasNext = function() {
        return start <= end && (!minHours || start.valueOf() !== end.valueOf() || _this.end.hours() > minHours || _this.allDay);
      };
      return this._iterateHelper(period, start, hasNext);
    };

    Twix.prototype.iterateInner = function(period) {
      var end, hasNext, start, _ref;

      _ref = this._inner(period), start = _ref[0], end = _ref[1];
      hasNext = function() {
        return start < end;
      };
      return this._iterateHelper(period, start, hasNext);
    };

    Twix.prototype.humanizeLength = function() {
      if (this.allDay) {
        if (this.isSame("day")) {
          return "all day";
        } else {
          return this.start.from(this.end.clone().add(1, "day"), true);
        }
      } else {
        return this.start.from(this.end, true);
      }
    };

    Twix.prototype.asDuration = function(units) {
      var diff;

      diff = this.end.diff(this.start);
      return moment.duration(diff);
    };

    Twix.prototype.isPast = function() {
      if (this.allDay) {
        return this.end.clone().endOf("day") < moment();
      } else {
        return this.end < moment();
      }
    };

    Twix.prototype.isFuture = function() {
      if (this.allDay) {
        return this.start.clone().startOf("day") > moment();
      } else {
        return this.start > moment();
      }
    };

    Twix.prototype.isCurrent = function() {
      return !this.isPast() && !this.isFuture();
    };

    Twix.prototype.contains = function(mom) {
      mom = moment(mom);
      return this._trueStart() <= mom && this._trueEnd() >= mom;
    };

    Twix.prototype.overlaps = function(other) {
      return this._trueEnd().isAfter(other._trueStart()) && this._trueStart().isBefore(other._trueEnd());
    };

    Twix.prototype.engulfs = function(other) {
      return this._trueStart() <= other._trueStart() && this._trueEnd() >= other._trueEnd();
    };

    Twix.prototype.union = function(other) {
      var allDay, newEnd, newStart;

      allDay = this.allDay && other.allDay;
      if (allDay) {
        newStart = this.start < other.start ? this.start : other.start;
        newEnd = this.end > other.end ? this.end : other.end;
      } else {
        newStart = this._trueStart() < other._trueStart() ? this._trueStart() : other._trueStart();
        newEnd = this._trueEnd() > other._trueEnd() ? this._trueEnd() : other._trueEnd();
      }
      return new Twix(newStart, newEnd, allDay);
    };

    Twix.prototype.intersection = function(other) {
      var allDay, end, newEnd, newStart;

      newStart = this.start > other.start ? this.start : other.start;
      if (this.allDay) {
        end = moment(this.end);
        end.add(1, "day");
        end.subtract(1, "millisecond");
        if (other.allDay) {
          newEnd = end < other.end ? this.end : other.end;
        } else {
          newEnd = end < other.end ? end : other.end;
        }
      } else {
        newEnd = this.end < other.end ? this.end : other.end;
      }
      allDay = this.allDay && other.allDay;
      return new Twix(newStart, newEnd, allDay);
    };

    Twix.prototype.isValid = function() {
      return this._trueStart() <= this._trueEnd();
    };

    Twix.prototype.equals = function(other) {
      return (other instanceof Twix) && this.allDay === other.allDay && this.start.valueOf() === other.start.valueOf() && this.end.valueOf() === other.end.valueOf();
    };

    Twix.prototype.toString = function() {
      var _ref;

      return "{start: " + (this.start.format()) + ", end: " + (this.end.format()) + ", allDay: " + ((_ref = this.allDay) != null ? _ref : {
        "true": "false"
      }) + "}";
    };

    Twix.prototype.simpleFormat = function(momentOpts, inopts) {
      var options, s;

      options = {
        allDay: "(all day)"
      };
      Twix._extend(options, inopts || {});
      s = "" + (this.start.format(momentOpts)) + " - " + (this.end.format(momentOpts));
      if (this.allDay && options.allDay) {
        s += " " + options.allDay;
      }
      return s;
    };

    Twix.prototype.format = function(inopts) {
      var common_bucket, end_bucket, fold, format, fs, global_first, goesIntoTheMorning, needDate, options, process, start_bucket, together, _i, _len,
        _this = this;

      this._lazyLang();
      options = {
        groupMeridiems: true,
        spaceBeforeMeridiem: true,
        showDate: true,
        showDayOfWeek: false,
        twentyFourHour: this.langData._twix.twentyFourHour,
        implicitMinutes: true,
        implicitYear: true,
        yearFormat: "YYYY",
        monthFormat: "MMM",
        weekdayFormat: "ddd",
        dayFormat: "D",
        meridiemFormat: "A",
        hourFormat: "h",
        minuteFormat: "mm",
        allDay: "all day",
        explicitAllDay: false,
        lastNightEndsAt: 0
      };
      Twix._extend(options, inopts || {});
      fs = [];
      if (options.twentyFourHour) {
        options.hourFormat = options.hourFormat.replace("h", "H");
      }
      goesIntoTheMorning = options.lastNightEndsAt > 0 && !this.allDay && this.end.clone().startOf("day").valueOf() === this.start.clone().add(1, "day").startOf("day").valueOf() && this.start.hours() > 12 && this.end.hours() < options.lastNightEndsAt;
      needDate = options.showDate || (!this.isSame("day") && !goesIntoTheMorning);
      if (this.allDay && this.isSame("day") && (!options.showDate || options.explicitAllDay)) {
        fs.push({
          name: "all day simple",
          fn: this._format_fn('allDaySimple', options),
          pre: this._format_pre('allDaySimple', options),
          slot: this._format_slot('allDaySimple')
        });
      }
      if (needDate && (!options.implicitYear || this.start.year() !== moment().year() || !this.isSame("year"))) {
        fs.push({
          name: "year",
          fn: this._format_fn('year', options),
          pre: this._format_pre('year', options),
          slot: this._format_slot('year')
        });
      }
      if (!this.allDay && needDate) {
        fs.push({
          name: "all day month",
          fn: this._format_fn('allDayMonth', options),
          ignoreEnd: function() {
            return goesIntoTheMorning;
          },
          pre: this._format_pre('allDayMonth', options),
          slot: this._format_slot('allDayMonth')
        });
      }
      if (this.allDay && needDate) {
        fs.push({
          name: "month",
          fn: this._format_fn('month', options),
          pre: this._format_pre('month', options),
          slot: this._format_slot('month')
        });
      }
      if (this.allDay && needDate) {
        fs.push({
          name: "date",
          fn: this._format_fn('date', options),
          pre: this._format_pre('date', options),
          slot: this._format_slot('date')
        });
      }
      if (needDate && options.showDayOfWeek) {
        fs.push({
          name: "day of week",
          fn: this._format_fn('dayOfWeek', options),
          pre: this._format_pre('dayOfWeek', options),
          slot: this._format_slot('dayOfWeek')
        });
      }
      if (options.groupMeridiems && !options.twentyFourHour && !this.allDay) {
        fs.push({
          name: "meridiem",
          fn: this._format_fn('meridiem', options),
          pre: this._format_pre('meridiem', options),
          slot: this._format_slot('meridiem')
        });
      }
      if (!this.allDay) {
        fs.push({
          name: "time",
          fn: this._format_fn('time', options),
          pre: this._format_pre('time', options),
          slot: this._format_slot('time')
        });
      }
      start_bucket = [];
      end_bucket = [];
      common_bucket = [];
      together = true;
      process = function(format) {
        var end_str, start_group, start_str;

        start_str = format.fn(_this.start);
        end_str = format.ignoreEnd && format.ignoreEnd() ? start_str : format.fn(_this.end);
        start_group = {
          format: format,
          value: function() {
            return start_str;
          }
        };
        if (end_str === start_str && together) {
          return common_bucket.push(start_group);
        } else {
          if (together) {
            together = false;
            common_bucket.push({
              format: {
                slot: format.slot,
                pre: ""
              },
              value: function() {
                return "" + (fold(start_bucket)) + " -" + (fold(end_bucket, true));
              }
            });
          }
          start_bucket.push(start_group);
          return end_bucket.push({
            format: format,
            value: function() {
              return end_str;
            }
          });
        }
      };
      for (_i = 0, _len = fs.length; _i < _len; _i++) {
        format = fs[_i];
        process(format);
      }
      global_first = true;
      fold = function(array, skip_pre) {
        var local_first, section, str, _j, _len1, _ref;

        local_first = true;
        str = "";
        _ref = array.sort(function(a, b) {
          return a.format.slot - b.format.slot;
        });
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          section = _ref[_j];
          if (!global_first) {
            if (local_first && skip_pre) {
              str += " ";
            } else {
              str += section.format.pre;
            }
          }
          str += section.value();
          global_first = false;
          local_first = false;
        }
        return str;
      };
      return fold(common_bucket);
    };

    Twix.prototype._trueStart = function() {
      if (this.allDay) {
        return this.start.clone().startOf("day");
      } else {
        return this.start;
      }
    };

    Twix.prototype._trueEnd = function() {
      if (this.allDay) {
        return this.end.clone().endOf("day");
      } else {
        return this.end;
      }
    };

    Twix.prototype._iterateHelper = function(period, iter, hasNext) {
      var _this = this;

      return {
        next: function() {
          var val;

          if (!hasNext()) {
            return null;
          } else {
            val = iter.clone();
            iter.add(1, period);
            return val;
          }
        },
        hasNext: hasNext
      };
    };

    Twix.prototype._inner = function(period) {
      var end, start;

      start = this.start.clone().startOf(period);
      end = this.end.clone().startOf(period);
      (this.allDay ? end : start).add(period, 1);
      return [start, end];
    };

    Twix.prototype._lazyLang = function() {
      var e, lang, langData, _ref;

      langData = this.start.lang();
      if (this.end.lang()._abbr !== langData._abbr) {
        this.end.lang(langData._abbr);
      }
      if ((this.langData != null) && this.langData._abbr === langData) {
        return;
      }
      if (hasModule && !(_ref = langData._abbr, __indexOf.call(knownLanguages, _ref) >= 0)) {
        try {
          lang = require("./lang/" + langData._abbr);
          lang(moment, Twix);
        } catch (_error) {
          e = _error;
          console.log("Can't find Twix language definition for " + langData._abbr + "; using en formatting.");
        }
        knownLanguages.push(langData._abbr);
      }
      return this.langData = langData;
    };

    Twix.prototype._format_fn = function(name, options) {
      return this.langData._twix[name].fn(options);
    };

    Twix.prototype._format_slot = function(name) {
      return this.langData._twix[name].slot;
    };

    Twix.prototype._format_pre = function(name, options) {
      if (typeof this.langData._twix[name].pre === "function") {
        return this.langData._twix[name].pre(options);
      } else {
        return this.langData._twix[name].pre;
      }
    };

    Twix.prototype._deprecate = function(name, instead, fn) {
      if (console && console.warn) {
        console.warn("#" + name + " is deprecated. Use #" + instead + " instead.");
      }
      return fn.apply(this);
    };

    Twix.prototype.sameDay = function() {
      return this._deprecate("sameDay", "isSame('day')", function() {
        return this.isSame("day");
      });
    };

    Twix.prototype.sameYear = function() {
      return this._deprecate("sameYear", "isSame('year')", function() {
        return this.isSame("year");
      });
    };

    Twix.prototype.countDays = function() {
      return this._deprecate("countDays", "countOuter('days')", function() {
        return this.countOuter("days");
      });
    };

    Twix.prototype.daysIn = function(minHours) {
      return this._deprecate("daysIn", "iterate('days' [,minHours])", function() {
        return this.iterate('days', minHours);
      });
    };

    Twix.prototype.past = function() {
      return this._deprecate("past", "isPast()", function() {
        return this.isPast();
      });
    };

    Twix.prototype.duration = function() {
      return this._deprecate("duration", "humanizeLength()", function() {
        return this.humanizeLength();
      });
    };

    Twix.prototype.merge = function(other) {
      return this._deprecate("merge", "union(other)", function() {
        return this.union(other);
      });
    };

    return Twix;

  })();

  Twix._extend(Object.getPrototypeOf(moment.fn._lang), {
    _twix: Twix.defaults
  });

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Twix;
  } else {
    this.Twix = Twix;
  }

  moment.twix = function() {
    return (function(func, args, ctor) {
      ctor.prototype = func.prototype;
      var child = new ctor, result = func.apply(child, args);
      return Object(result) === result ? result : child;
    })(Twix, arguments, function(){});
  };

  moment.fn.twix = function() {
    return (function(func, args, ctor) {
      ctor.prototype = func.prototype;
      var child = new ctor, result = func.apply(child, args);
      return Object(result) === result ? result : child;
    })(Twix, [this].concat(__slice.call(arguments)), function(){});
  };

  moment.fn.forDuration = function(duration, allDay) {
    return new Twix(this, this.clone().add(duration), allDay);
  };

  moment.duration.fn.afterMoment = function(startingTime, allDay) {
    return new Twix(startingTime, moment(startingTime).clone().add(this), allDay);
  };

  moment.duration.fn.beforeMoment = function(startingTime, allDay) {
    return new Twix(moment(startingTime).clone().subtract(this), startingTime, allDay);
  };

}).call(this);
