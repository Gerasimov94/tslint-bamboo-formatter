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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Lint = require("tslint");
var fs = require("fs");
var path = require("path");
var outputFileName = 'tslint-results.json';
var IssueGroup = /** @class */ (function () {
    function IssueGroup(issue) {
        this.issue = issue;
        this.failures = [];
        this.failures = [issue];
    }
    Object.defineProperty(IssueGroup.prototype, "add", {
        set: function (failure) {
            this.failures.push(failure);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IssueGroup.prototype, "getFaltures", {
        get: function () {
            return this.failures;
        },
        enumerable: true,
        configurable: true
    });
    return IssueGroup;
}());
var Formatter = /** @class */ (function (_super) {
    __extends(Formatter, _super);
    function Formatter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Formatter.prototype.format = function (failures) {
        var errors = failures.filter(function (falture) { return falture.getRuleSeverity() === 'error'; });
        var output = {
            stats: {
                tests: 0,
                passes: 0,
                failures: errors.length,
                duration: 0,
                start: new global.Date(),
                end: new global.Date(),
            },
            failures: [],
            passes: [],
            skipped: [],
        };
        var failuresJSON = errors.reduce(function (memo, failure) {
            var _a;
            var issueGroup = memo[failure.getFileName()];
            if (issueGroup) {
                issueGroup.add = failure;
            }
            else {
                memo = __assign(__assign({}, memo), (_a = {}, _a[failure.getFileName()] = new IssueGroup(failure), _a));
            }
            return memo;
        }, {});
        output.failures = Object.values(failuresJSON).reduce(function (memo, item) { return memo = (__spreadArrays(memo, item.getFaltures.map(function (failure) {
            var fileName = (failure.getFileName() || '').match('(?<=/)[^/]+$');
            return ({
                title: fileName ? fileName[0] : '',
                fullTitle: path.resolve(failure.getFileName()),
                duration: 0,
                errorCount: 1,
                error: failure.getFailure(),
            });
        }))); }, []);
        var stringifiedOutput = JSON.stringify(output);
        this.writeFile(stringifiedOutput);
        return stringifiedOutput;
    };
    Formatter.prototype.writeFile = function (file) {
        if (fs.existsSync(outputFileName))
            fs.unlinkSync(outputFileName);
        fs.appendFileSync(outputFileName, file);
        process.exit(0);
    };
    Formatter.metadata = {
        formatterName: 'tslint-bamboo-formatter',
        description: 'Formats errors as bamboo compatible JSON.',
        sample: '',
        consumer: 'human',
    };
    return Formatter;
}(Lint.Formatters.AbstractFormatter));
exports.Formatter = Formatter;
