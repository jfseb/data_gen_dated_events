"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ParseArgs = require("./parseArgs");
var args = ParseArgs.parseArguments(undefined);
var o = ParseArgs.getOutputParams(args);
var pars = ParseArgs.GetParams1(args);
ParseArgs.dumpUserHierarchyIfRequested(args);
ParseArgs.GeneratePersons(pars, o);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5Q0FBeUM7QUFFekMsSUFBSSxJQUFJLEdBQUcsU0FBUyxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUMvQyxJQUFJLENBQUMsR0FBRyxTQUFTLENBQUMsZUFBZSxDQUFFLElBQUksQ0FBRSxDQUFDO0FBQzFDLElBQUksSUFBSSxHQUFJLFNBQVMsQ0FBQyxVQUFVLENBQUUsSUFBSSxDQUFFLENBQUM7QUFFekMsU0FBUyxDQUFDLDRCQUE0QixDQUFFLElBQUksQ0FBRSxDQUFDO0FBRS9DLFNBQVMsQ0FBQyxlQUFlLENBQUUsSUFBSSxFQUFFLENBQUMsQ0FBRSxDQUFDIn0=