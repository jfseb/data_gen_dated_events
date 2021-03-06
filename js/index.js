"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ParseArgs = require("./parseArgs");
var args = ParseArgs.parseArguments(undefined);
var o = ParseArgs.getOutputParams(args);
var pars = ParseArgs.GetParams1(args);
ParseArgs.dumpUserHierarchyIfRequested(args);
ParseArgs.GeneratePersons(pars, o);

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHlDQUF5QztBQUV6QyxJQUFJLElBQUksR0FBRyxTQUFTLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQy9DLElBQUksQ0FBQyxHQUFHLFNBQVMsQ0FBQyxlQUFlLENBQUUsSUFBSSxDQUFFLENBQUM7QUFDMUMsSUFBSSxJQUFJLEdBQUksU0FBUyxDQUFDLFVBQVUsQ0FBRSxJQUFJLENBQUUsQ0FBQztBQUV6QyxTQUFTLENBQUMsNEJBQTRCLENBQUUsSUFBSSxDQUFFLENBQUM7QUFFL0MsU0FBUyxDQUFDLGVBQWUsQ0FBRSxJQUFJLEVBQUUsQ0FBQyxDQUFFLENBQUMiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBQYXJzZUFyZ3MgZnJvbSAnLi9wYXJzZUFyZ3MnO1xyXG5cclxudmFyIGFyZ3MgPSBQYXJzZUFyZ3MucGFyc2VBcmd1bWVudHModW5kZWZpbmVkKTtcclxudmFyIG8gPSBQYXJzZUFyZ3MuZ2V0T3V0cHV0UGFyYW1zKCBhcmdzICk7XHJcbnZhciBwYXJzICA9IFBhcnNlQXJncy5HZXRQYXJhbXMxKCBhcmdzICk7XHJcblxyXG5QYXJzZUFyZ3MuZHVtcFVzZXJIaWVyYXJjaHlJZlJlcXVlc3RlZCggYXJncyApO1xyXG5cclxuUGFyc2VBcmdzLkdlbmVyYXRlUGVyc29ucyggcGFycywgbyApO1xyXG4iXX0=
