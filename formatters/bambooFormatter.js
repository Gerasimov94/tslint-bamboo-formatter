"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Lint = require("tslint");
var chalk = require('chalk');
var IssueGroup = /** @class */ (function () {
    function IssueGroup(filename) {
        this.filename = filename;
        this.failures = [];
        this.failures = [];
    }
    IssueGroup.prototype.add = function (failure) {
        this.failures.push(failure);
    };
    Object.defineProperty(IssueGroup.prototype, "warningCount", {
        get: function () {
            return this.getIssueCount('warning');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IssueGroup.prototype, "errorCount", {
        get: function () {
            return this.getIssueCount('error');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IssueGroup.prototype, "fixCount", {
        get: function () {
            return this.failures.reduce(function (count, failure) { return (failure.hasFix() ? count + 1 : count); }, 0);
        },
        enumerable: true,
        configurable: true
    });
    IssueGroup.prototype.getIssueCount = function (severity) {
        return this.failures.reduce(function (count, failure) {
            return failure.getRuleSeverity() === severity ? count + 1 : count;
        }, 0);
    };
    return IssueGroup;
}());
var Formatter = /** @class */ (function (_super) {
    __extends(Formatter, _super);
    function Formatter() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.filesHash = {};
        return _this;
    }
    Formatter.prototype.format = function (failures) {
        chalk.blue(failures);
        var failuresJSON = failures.reduce(function (memo, failure) {
            var elemsByKey = memo[failure.getFileName()];
            debugger;
            chalk.blue(failure);
            if (elemsByKey) {
                elemsByKey = elemsByKey.concat(failure);
            }
            else {
                elemsByKey = [];
            }
            return memo;
        }, this.filesHash);
        return JSON.stringify(failuresJSON);
    };
    Formatter.prototype.writeFile = function () {
    };
    return Formatter;
}(Lint.Formatters.AbstractFormatter));
exports.Formatter = Formatter;
