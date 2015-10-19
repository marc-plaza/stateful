(function() {
    "use strict";
    window.Stateful = function Stateful(target) {
        for (var property in target) {
            this[property] = target[property];
        }
        this._handlers = {
            watch: {},
            bind: {},
            set: {},
            get: {}
        };
    };
    Stateful.prototype.set = function set(name, value) {
        var i;
        if (typeof name === "object") {
            var newValues = name;
            var oldValues = {};
            for (var property in this) {
                if (this.hasOwnProperty(property)) {
                    oldValues[property] = this[property];
                }
            }
            for (property in newValues) {
                if (newValues.hasOwnProperty(property) && oldValues[property] !== newValues[property]) {
                    if (typeof this._handlers.set[property] === "function") {
                        this[property] = this._handlers.set[property].call(this, newValues[property]);
                    } else {
                        this[property] = newValues[property];
                    }
                }
            }
            for (property in newValues) {
                if (newValues.hasOwnProperty(property) && oldValues[property] !== newValues[property]) {
                    if (Array.isArray(this._handlers.watch[property])) {
                        for (i = 0; i < this._handlers.watch[property].length; i++) {
                            this._handlers.watch[property][i].callback.call(this, oldValues[property], newValues[property]);
                        }
                    }
                    if (Array.isArray(this._handlers.watch["*"])) {
                        for (i = 0; i < this._handlers.watch["*"].length; i++) {
                            this._handlers.watch["*"][i].callback.call(this, property, oldValues[property], newValues[property]);
                        }
                    }
                }
            }
        } else if (this[name] !== value) {
            var oldValue = this[name];
            if (typeof this._handlers.set[name] === "function") {
                this[name] = this._handlers.set[name].call(this, value);
            } else {
                this[name] = value;
            }
            if (Array.isArray(this._handlers.watch[name])) {
                for (i = 0; i < this._handlers.watch[name].length; i++) {
                    this._handlers.watch[name][i].callback.call(this, oldValue, value);
                }
            }
            if (Array.isArray(this._handlers.watch["*"])) {
                for (i = 0; i < this._handlers.watch["*"].length; i++) {
                    this._handlers.watch["*"][i].callback.call(this, name, oldValue, value);
                }
            }
        }
        return this;
    };
    Stateful.prototype.get = function get(name) {
        if (typeof this._handlers.get[name] !== "undefined") {
            return this._handlers.get[name].call(this, this[name]);
        }
        return this[name];
    };
    Stateful.prototype.watch = function watch(name, callback) {
        if (typeof name === "function") {
            callback = name;
            name = "*";
        }
        if (!Array.isArray(this._handlers.watch[name])) {
            this._handlers.watch[name] = [];
        }
        var self = this;
        var handler = {
            callback: callback,
            remove: function remove() {
                for (var i = 0; i < self._handlers.watch[name].length; i++) {
                    if (self._handlers.watch[name][i] === handler) {
                        self._handlers.watch[name].splice(i, 1);
                    }
                }
            }
        };
        this._handlers.watch[name].push(handler);
        return handler;
    };
    Stateful.prototype.createSetHandler = function createSetHandler(name, handler) {
        this._handlers.set[name] = handler;
        return true;
    };
    Stateful.prototype.removeSetHandler = function removeSetHandlder(name) {
        delete this._handlers.set[name];
        return true;
    };
    Stateful.prototype.createGetHandler = function createSetHandler(name, handler) {
        this._handlers.get[name] = handler;
        return true;
    };
    Stateful.prototype.removeGetHandler = function removeGetHandlder(name) {
        delete this._handlers.get[name];
        return true;
    };
    Stateful.prototype.bind = function bind(thisProperty, toTarget, toProperty, direction) {
        direction = direction || "both";
        var handler = {};
        var self = this;
        var name = thisProperty;
        if (!Array.isArray(this._handlers.bind[name])) {
            this._handlers.bind[name] = [];
        }
        if (direction === "from" || direction === "both") {
            var fromHandler = this.watch(thisProperty, function(oldVal, newVal) {
                toTarget.set(toProperty, newVal);
            });
        }
        if (direction === "to" || direction === "both") {
            var toHandler = toTarget.watch(toProperty, function(oldVal, newVal) {
                self.set(thisProperty, newVal);
            });
        }
        handler.remove = function remove() {
            if (fromHandler !== undefined) {
                fromHandler.remove();
            }
            if (toHandler !== undefined) {
                toHandler.remove();
            }
            for (var i = 0; i < self._handlers.bind[name].length; i++) {
                if (self._handlers.bind[name][i] === handler) {
                    self._handlers.bind[name].splice(i, 1);
                }
            }
        };
        this._handlers.bind[name].push(handler);
        return handler;
    };
    Stateful.prototype.unbind = function unbind(name) {
        for (var i = 0; i < this._handlers.bind[name].length; i++) {
            this._handlers.bind[name][i].remove();
        }
    };
})();