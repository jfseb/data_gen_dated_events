"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genUSERHierarchy = exports.genUSERHierarchyW = exports.genUser = exports.appendCleansing = exports.cleanseWSCommentsRepeatedHeaderInFile = exports.reIndexTime = exports.reIndexLine = exports.splitDateLine = exports.isDateLine = exports.isLineStartingWithDigit = exports.getMaxPrimes = exports.genPerson = exports.isHireChange = exports.getStringBuilder = exports.writeRecordMOVEIN = exports.writeRecordHIRE = exports.writeRecord0 = exports.writeRecord = exports.memorizeSOM = exports.toDec1 = exports.writeTripel = exports.writeAge = exports.getSOM = exports.writeTenure = exports.writeTENUREAGE = exports.diffMonth = exports.diffYears = exports.writeDay = exports.makeQuarter = exports.writeHeader = exports.daysInMonth = exports.EOMONTH = exports.asDate = exports.padSpaceQ = exports.padSpace = exports.padZeros = exports.isEOY = exports.isEOQ = exports.copyDate = exports.isOtherER = exports.isTermER = exports.isHireER = exports.Person = exports.GenParams = exports.OptsMONAG = exports.getWS = exports.WSWrap2 = exports.makeMap = exports.dateToDayIndex = exports.EXCELOFFSET = void 0;
var fs = require('fs');
const { exit } = require('process');
const _ = require("lodash");
const lineByLine = require("n-readlines");
// EXCEL
//     1 1900-01-01
// 25569 1970-01-01
//
exports.EXCELOFFSET = 25569;
const core_1 = require("@js-joda/core");
function dateToDayIndex(d) {
    return d.toEpochDay() + exports.EXCELOFFSET;
}
exports.dateToDayIndex = dateToDayIndex;
var d1 = core_1.LocalDate.of(2020, 1, 6);
var d1Idx = dateToDayIndex(d1);
var d2 = core_1.LocalDate.of(2024, 6, 1);
var d2Idx = dateToDayIndex(d2);
var deltaTime = d2Idx - d1Idx;
function makeMap(obj) {
    var idx = 0;
    var res = [];
    Object.getOwnPropertyNames(obj).forEach(function (a) {
        for (var i = 0; i < obj[a]; ++i) {
            res.push(a);
        }
    });
    return res;
}
exports.makeMap = makeMap;
class WSWrap2 {
    constructor(fn) {
        this.ws = this;
        this._log = fs.openSync(fn, 'w');
        this._onFinish = undefined;
    }
    on(s, fn) {
        this._onFinish = fn;
    }
    end() {
        fs.closeSync(this._log);
        this._log = undefined;
        if (this._onFinish) {
            this._onFinish();
        }
    }
    write(a) {
        fs.writeSync(this._log, '' + a);
        return this;
    }
}
exports.WSWrap2 = WSWrap2;
;
function getWS(filename) {
    return new WSWrap2(filename);
}
exports.getWS = getWS;
// 1 Simple range based  (no monthly interim data)
//  [xxx]-[yyy]  <attributes>
//
//  optional sprinkle in 0,0,0,0 <attributes> Mark  EOM/EOP numbers.
//
//to support different output flavours,
//
//
class OptsMONAG {
}
exports.OptsMONAG = OptsMONAG;
class GenParams {
}
exports.GenParams = GenParams;
class Person {
}
exports.Person = Person;
function getNext(pars) {
    return Math.floor(pars.random.random() * pars.AVG_NEXT) + 1;
}
function getLocation(pars) {
    return pars.LOCATIONs[Math.floor(pars.random.random() * pars.LOCATIONs.length)];
}
function getESTAT(pars, key) {
    return pars.ESTATs[Math.floor(pars.randomOD[key].random() * pars.ESTATs.length)];
}
function getGender(pars) {
    return (pars.random.otherRandom(2) < 0.5) ? "F" : "M";
}
function getHireEventReason(pars) {
    return "HI" + (Math.floor(pars.random.otherRandom(4) * 100) % 5);
}
function getTermEventReason(pars) {
    return "TR" + (Math.floor(pars.random.otherRandom(4) * 100) % 10);
}
function getLocationEventReason(pars) {
    return "L" + padZeros((Math.floor(pars.random.otherRandom(4) * 100) % 50), 2);
}
function getPlainEventReason(pars) {
    return "P" + padZeros((Math.floor(pars.random.otherRandom(4) * 100) % 10), 2);
}
function isHireER(er) {
    return (er.charAt(0) == "H") ? 1 : 0;
}
exports.isHireER = isHireER;
function isTermER(er) {
    return (er.charAt(0) == "T") ? 1 : 0;
}
exports.isTermER = isTermER;
function isOtherER(er) {
    return ((!isHireER(er) && !isTermER(er)) ? 1 : 0);
}
exports.isOtherER = isOtherER;
function getHireTermEventReason(pars, priorHired) {
    if (priorHired) {
        return getTermEventReason(pars);
    }
    else {
        return getHireEventReason(pars);
    }
}
function getOtherEventReason(pars, pers, nl) {
    if (pers.location != nl) {
        return getLocationEventReason(pars);
    }
    return getPlainEventReason(pars);
}
function nextLocation(pars, pers) {
    if (pars.random.random() < pars.LOCCHANGE) {
        return getLocation(pars);
    }
    return pers.location;
}
function nextFTE(pars, pers) {
    if (pars.random.random() < pars.FTECHANGE) {
        if (pers.fte == 1) {
            return 0.5;
        }
        return 1.0;
    }
    return pers.fte;
}
function getNextESTAT(pars, pers, key) {
    //  pars.randomOD[key]();
    if (pars.randomOD[key].random() < pars.ESTATCHANGE) {
        return getESTAT(pars, key);
    }
    return pers.ESTAT;
}
function isEvent(pars) {
    return pars.random.random() < pars.L_EVENT;
}
function isEOM(dateIdx) {
    var d = copyDate(dateIdx).plusDays(1);
    if (d.dayOfMonth() == 1)
        return true;
    return false;
}
function copyDate(d) {
    return core_1.LocalDate.ofEpochDay(d.toEpochDay());
}
exports.copyDate = copyDate;
function isEOQ(d) {
    d = copyDate(d).plusDays(1);
    if (d.dayOfMonth() == 1 && [1, 4, 7, 10].indexOf(d.monthValue()) >= 0)
        return true;
    return false;
}
exports.isEOQ = isEOQ;
function isEOY(d) {
    var d = copyDate(d).plusDays(1);
    if (d.dayOfMonth() == 1 && d.monthValue() == 1)
        return true;
    return false;
}
exports.isEOY = isEOY;
function padZeros(a, len) {
    var s = "" + a;
    return "0000000".substr(0, len - s.length) + s;
}
exports.padZeros = padZeros;
function padSpace(a, len) {
    var s = "" + a;
    return "                   ".substr(0, len - s.length) + s;
}
exports.padSpace = padSpace;
function padSpaceQ(a, len) {
    var s = "" + a;
    return '"' + s + '"' + "                   ".substr(0, len - s.length);
}
exports.padSpaceQ = padSpaceQ;
function asDate(dateIdx) {
    var d = dateIdx;
    return '' + d;
    //return d.year() + "-" + pad(d.monthValue(),2) + "-" + pad(d.dayOfMonth(),2);
}
exports.asDate = asDate;
function EOMONTH(d) {
    return copyDate(d).plusMonths(1).withDayOfMonth(1).minusDays(1);
}
exports.EOMONTH = EOMONTH;
function daysInMonth(dateIdx) {
    var dt = dateIdx;
    var deom = EOMONTH(dt);
    return dateToDayIndex(deom) - dateToDayIndex(copyDate(deom).withDayOfMonth(1)) + 1;
}
exports.daysInMonth = daysInMonth;
function writeHeader(ws) {
    ws.write("YEAR;QUART;CALMONTHIC;CALMONTHI;CALMONTH;CALMONTHS;START_DATE_IDX;END_DATE_IDX;ISEOM;ISEOQ;ISEOY;DAYSINMONTH;START_DATE;END_DATE;");
    ws.write("USER;LOCATION;ESTAT;HC;HC_SOM;HC_EOM;DAYSWORKED;FTE;FTE_SOM;FTE_EOM;FTEWORKED;TENURE;TENURE_SOM;TENURE_EOM;AGE;AGE_SOM;AGE_EOM;HC_EOMS;HIRE;TERM;MOVE_IN;MOVE_OUT;EVRS;GNDR;X\n");
}
exports.writeHeader = writeHeader;
function makeQuarter(d) {
    return d.year() + '' + '_Q' + (Math.floor((d.monthValue() - 1) / 3) + 1);
}
exports.makeQuarter = makeQuarter;
function writeDay(ws, prevDateEnd, dateIdx) {
    var startIdx = copyDate(prevDateEnd).plusDays(1);
    var d = dateIdx;
    var y = d.year();
    var m = d.monthValue();
    var cmi = y * 100 + m;
    var cmic = (y - 2000) * 12 + m;
    ws.write(y).write(';');
    ws.write(makeQuarter(d)).write(';');
    ws.write('' + cmic + ";" + cmi + ";" + cmi + ";" + cmi + ";"); // CALMONTH IC I ~ S
    ws.write(dateToDayIndex(startIdx) + ";" + dateToDayIndex(dateIdx) + ";");
    ws.write(isEOM(d) ? "1.0" : "0.0").write(";");
    ws.write(isEOQ(d) ? "1.0" : "0.0").write(";");
    ws.write(isEOY(d) ? "1.0" : "0.0").write(";");
    var dim = daysInMonth(d);
    ws.write(dim).write(";");
    ws.write(asDate(startIdx)).write(";");
    ws.write(asDate(d)).write(";");
    return dim;
}
exports.writeDay = writeDay;
function diffYears(dateLow, dateHigh) {
    return dateLow.until(dateHigh).years();
}
exports.diffYears = diffYears;
function diffMonth(dateLow, dateHigh) {
    var a = dateLow.until(dateHigh);
    return a.years() * 12 + a.months();
}
exports.diffMonth = diffMonth;
function writeTENUREAGE(pers) {
    return pers.hired > 0;
}
exports.writeTENUREAGE = writeTENUREAGE;
function writeTenure(ws, now, pers, eom) {
    if (!writeTENUREAGE(pers)) {
        ws.write(' 0; 0; 0;');
        return;
    }
    var tenureNow = diffMonth(pers.lastHired, now);
    ws.write(padSpace(tenureNow, 2)).write(';');
    if (isEOM(now)) {
        var dsom = getSOM(now);
        var tenureSOM = diffMonth(pers.lastHired, dsom);
        ws.write(padSpace(tenureSOM, 2)).write(';');
        ws.write(padSpace(tenureNow, 2)).write(';');
    }
    else {
        ws.write(' 0; 0;');
    }
}
exports.writeTenure = writeTenure;
function getSOM(dateIdx) {
    return dateIdx.withDayOfMonth(1);
}
exports.getSOM = getSOM;
function writeAge(ws, now, pers, eom) {
    if (!writeTENUREAGE(pers)) {
        ws.write(' 0; 0; 0;');
        return;
    }
    var ageNow = diffYears(pers.dob, now);
    ws.write(padSpace(ageNow, 2)).write(';');
    if (isEOM(now)) {
        var dsom = getSOM(now);
        var ageSOM = diffYears(pers.dob, dsom);
        ws.write(padSpace(ageSOM, 2)).write(';');
        ws.write(padSpace(ageNow, 2)).write(';');
    }
    else {
        ws.write(' 0; 0;');
    }
}
exports.writeAge = writeAge;
function writeTripel(ws, vsom, vnow, eom) {
    ws.write(padSpace(vnow, 3)).write(';');
    if (eom) {
        ws.write(padSpace(vsom, 3)).write(';');
        ws.write(padSpace(vnow, 3)).write(';');
    }
    else {
        ws.write('0.0;0.0;');
    }
}
exports.writeTripel = writeTripel;
function toDec1(n) {
    return (n || 0).toFixed(1);
}
exports.toDec1 = toDec1;
function memorizeSOM(dateIdx, pers) {
    var eom = isEOM(dateIdx);
    if (eom) {
        pers.fteSOM = pers.hired * pers.fte;
        pers.hiredSOM = pers.hired;
    }
}
exports.memorizeSOM = memorizeSOM;
function isAllZero(pers) {
    return (pers.hired == 0 && pers.hiredSOM == 0);
}
/**
 * This function does mutate pers, use a clone if not desired!
 * @param ws
 * @param dateIdx
 * @param pers
 * @param comment
 */
function writeRecord(ws, dateIdx, pers, pars, comment) {
    var startIdx = copyDate(pers.prevDateEnd).plusDays(1);
    var eom = isEOM(dateIdx);
    ws.write(padSpaceQ(pers.user, 5)).write(';');
    ws.write(padSpaceQ(pers.location, 20)).write(';');
    ws.write(padSpaceQ(pers.ESTAT, 1)).write(';'); // we always write this, needed for STOP records
    writeTripel(ws, pers.hiredSOM ? "1.0" : "0.0", pers.hired ? "1.0" : "0.0", isEOM(dateIdx));
    var daysInPeriod = startIdx.until(dateIdx).days() + 1;
    ws.write(padSpace(pers.hiredPrev * daysInPeriod, 2)).write(';'); //DAYSWORKED
    writeTripel(ws, toDec1(pers.fteSOM), toDec1(pers.hired * pers.fte), isEOM(dateIdx));
    ws.write(padSpace(pers.hiredPrev * pers.ftePrev * daysInPeriod, 4)).write(';'); // FTEWORKED
    writeTenure(ws, dateIdx, pers, eom);
    writeAge(ws, dateIdx, pers, eom);
    if (eom && pars.REOP_ESTATS && pars.REOP_ESTATS.indexOf(pers.ESTAT) >= 0) {
        ws.write(padSpace(pers.hired, 1)).write(';');
    }
    else {
        ws.write('0').write(';');
    }
    pers.hiredPrev = pers.hired;
    pers.ftePrev = pers.fte;
    // we can use this as MOVE_OUT or TERM
    var dateIdxP1 = copyDate(dateIdx).plusDays(1);
    if (dateIdxP1.toEpochDay() == (pers.lastEventDate && pers.lastEventDate.toEpochDay())) {
        var hasER = isTermER(pers.eventReason) || isOtherER(pers.eventReason);
        ws.write("0;" +
            isTermER(pers.eventReason) + ";0;" +
            isOtherER(pers.eventReason) + ";" +
            (hasER ? (pers.eventReason + ";") : ";  ") + "\"" + pers.gender + "\";" + comment + "\n");
    }
    else {
        ws.write("0;0;0;0;;  \"" + pers.gender + "\";" + comment + "\n");
    }
    pers.prevDateEnd = copyDate(dateIdx);
}
exports.writeRecord = writeRecord;
/**
 * This function does mutate pers, use a clone if not desired!
 * @param ws
 * @param dateIdx
 * @param pers
 * @param comment
 */
function writeRecord0(ws, dateIdx, pers, comment) {
    var startIdx = copyDate(dateIdx);
    var eom = isEOM(dateIdx);
    ws.write(padSpaceQ(pers.user, 5)).write(';');
    ws.write(padSpaceQ(pers.location, 20)).write(';');
    ws.write(padSpaceQ(pers.ESTAT, 1)).write(';'); // we always write this, needed for STOP records
    writeTripel(ws, "0.0", "0.0", false); // pers.hiredSOM ? "1.0": "0.0" ,pers.hired ? "1.0": "0.0",isEOM(dateIdx));
    var daysInPeriod = "0.0"; //startIdx.until(dateIdx).days() + 1;
    ws.write(padSpace(0, 2)).write(';'); //DAYSWORKED
    writeTripel(ws, toDec1(0), toDec1(0), isEOM(dateIdx));
    ws.write(padSpace(0, 4)).write(';'); // FTEWORKED
    ws.write(" 0; 0; 0;");
    //writeTenure(ws, dateIdx, pers, eom); // CHECK WHETHER MEASURE OR DIM
    ws.write(" 0; 0; 0;");
    //writeAge(ws, dateIdx, pers, eom);
    ws.write("0;");
    //if(eom && pars.REOP_ESTATS && pars.REOP_ESTATS.indexOf(pers.ESTAT) >= 0) {
    //    ws.write(padSpace(pers.hired,1)).write(';');
    //} else {
    //  ws.write('0').write(';');
    //}
    ws.write("0;0;0;0;;  \"" + pers.gender + "\";" + comment + "\n");
}
exports.writeRecord0 = writeRecord0;
/**
 * This function does mutate pers, use a clone if not desired!
 * @param ws
 * @param dateIdx
 * @param pers
 * @param comment
 */
function writeRecordHIRE(ws, dateIdx, pers, comment) {
    var startIdx = copyDate(dateIdx);
    var eom = isEOM(dateIdx);
    ws.write(padSpaceQ(pers.user, 5)).write(';');
    ws.write(padSpaceQ(pers.location, 20)).write(';');
    ws.write(padSpaceQ(pers.ESTAT, 1)).write(';'); // we always write this, needed for STOP records
    writeTripel(ws, "0.0", "0.0", false); // pers.hiredSOM ? "1.0": "0.0" ,pers.hired ? "1.0": "0.0",isEOM(dateIdx));
    var daysInPeriod = "0.0"; //startIdx.until(dateIdx).days() + 1;
    ws.write(padSpace(0, 2)).write(';'); //DAYSWORKED
    writeTripel(ws, toDec1(0), toDec1(0), isEOM(dateIdx));
    ws.write(padSpace(0, 4)).write(';'); // FTEWORKED
    ws.write(" 0; 0; 0;");
    //writeTenure(ws, dateIdx, pers, eom); // CHECK WHETHER MEASURE OR DIM
    ws.write(" 0; 0; 0;");
    //writeAge(ws, dateIdx, pers, eom);
    ws.write("0;");
    ws.write("1;0;0;0;" + pers.eventReason + ";\"" + pers.gender + "\";" + comment + "\n");
}
exports.writeRecordHIRE = writeRecordHIRE;
/**
 * This function does mutate pers, use a clone if not desired!
 * @param ws
 * @param dateIdx
 * @param pers
 * @param comment
 */
function writeRecordMOVEIN(ws, dateIdx, pers, comment) {
    var startIdx = copyDate(dateIdx);
    var eom = isEOM(dateIdx);
    ws.write(padSpaceQ(pers.user, 5)).write(';');
    ws.write(padSpaceQ(pers.location, 20)).write(';');
    ws.write(padSpaceQ(pers.ESTAT, 1)).write(';'); // we always write this, needed for STOP records
    writeTripel(ws, "0.0", "0.0", false); // pers.hiredSOM ? "1.0": "0.0" ,pers.hired ? "1.0": "0.0",isEOM(dateIdx));
    var daysInPeriod = "0.0"; //startIdx.until(dateIdx).days() + 1;
    ws.write(padSpace(0, 2)).write(';'); //DAYSWORKED
    writeTripel(ws, toDec1(0), toDec1(0), isEOM(dateIdx));
    ws.write(padSpace(0, 4)).write(';'); // FTEWORKED
    ws.write(" 0; 0; 0;");
    //writeTenure(ws, dateIdx, pers, eom); // CHECK WHETHER MEASURE OR DIM
    ws.write(" 0; 0; 0;");
    //writeAge(ws, dateIdx, pers, eom);
    ws.write("0;");
    ws.write("0;0;1;0;" + padSpaceQ(pers.eventReason, 5) + ";\"" + pers.gender + "\";" + comment + "\n");
}
exports.writeRecordMOVEIN = writeRecordMOVEIN;
function writeStateLineRANGE(ws, dateIdx, pers, nextHire, nextLoc, nextFTE, comment) {
    if (ws == undefined) {
        return;
    }
}
/**
 * Write a state line for Monthly aggregates, this is e.g. the End-of month record.
 * @param ws
 * @param dateIdx
 * @param pers
 * @param nextHire
 * @param nextLoc
 * @param nextFTE
 * @param comment
 */
function writeStateLineMONAG(ws, dateIdx, pers, nextHire, nextLoc, nextFTE, pars, comment) {
    writeDay(ws, pers.prevDateEnd, dateIdx);
    pers.location = nextLoc || pers.location;
    pers.fte = nextFTE || pers.fte;
    //pers.lastWritten = dateIdx;
    writeRecord(ws, dateIdx, pers, pars, "st" + comment);
    memorizeSOM(dateIdx, pers);
    if (nextHire != pers.hired) {
        ws.write("NEVER\n");
    }
}
function isUnhiredChange(pers, nextHire, nextLoc, nextFTE, nextESTAT) {
    return (nextHire != pers.hired)
        || (nextLoc != pers.location)
        || (nextFTE != pers.fte)
        || (nextESTAT != pers.ESTAT);
}
function isAChange(pers, nextHire, nextLoc, nextFTE, nextESTAT) {
    return (nextHire != pers.hired)
        || (pers.hired && nextLoc != pers.location)
        || (pers.hired && nextFTE != pers.fte)
        || (pers.hired && nextESTAT != pers.ESTAT);
}
function isHIRE(pers, nextHire) {
    return pers.hired == 0 && nextHire == 1;
}
function isTERM(pers, nextHire) {
    return pers.hired == 1 && nextHire == 0;
}
function closePreviousRange(ws, dateIdx, pers, pars, comment) {
    var dmin1 = copyDate(dateIdx).minusDays(1);
    writeDay(ws, pers.prevDateEnd, dmin1);
    writeRecord(ws, dmin1, pers, pars, comment);
}
function writeChangeLineRANGE(ws, dateIdx, pers, nextHire, nextLoc, nextFTE, nextESTAT, pars, comment) {
    if (ws == undefined) {
        return;
    }
    var isChange = isAChange(pers, nextHire, nextLoc, nextFTE, nextESTAT);
    if (!isChange && !isEOM(dateIdx)) {
        return;
    }
    // at dateIdx the person state changes to new state.
    // clone the object
    var nextPers = _.cloneDeep(pers);
    nextPers.prevDateEnd = copyDate(nextPers.prevRangeEnd); //!!!
    //pers = undefined;
    var isterm = isTERM(nextPers, nextHire);
    if (isterm) {
        // close previous record
        closePreviousRange(ws, dateIdx, nextPers, pars, "termclose-1@" + dateIdx + ' ' + comment);
        pers.prevRangeEnd = copyDate(dateIdx).minusDays(1);
    }
    else if (isHIRE(nextPers, nextHire)) {
        //nextPers.lastHired = dateIdx;
        pers.prevRangeEnd = copyDate(dateIdx).minusDays(1); // SET THIS!
        // do nothing, will be captured next
    }
    else {
        // close previous record, always
        var dmin1 = copyDate(dateIdx).minusDays(1);
        writeDay(ws, nextPers.prevDateEnd, dmin1);
        writeRecord(ws, dmin1, nextPers, pars, "perclose-1 from " + dateIdx + ' ' + comment);
        pers.prevRangeEnd = copyDate(dateIdx).minusDays(1);
    }
}
function isStopRecordsRequested(pars) {
    return (pars.optsMONAG && pars.optsMONAG.stopRecords);
}
function isNoZeroRequested(pars) {
    return (pars.optsMONAG && pars.optsMONAG.noZero);
}
// we write a record with all measures zero (or null?)
function writeSTOPRecordAfter(ws, pers, d, pars, comment) {
    writeDay(ws, d, d); // [d-d];
    writeRecord0(ws, d, pers, comment);
}
function getStringBuilder() {
    class Obj {
        constructor() {
            this.s = '';
        }
        write(a) {
            this.s += '' + a;
            return this;
        }
        toString() {
            return '' + this.s;
        }
    }
    ;
    return new Obj();
}
exports.getStringBuilder = getStringBuilder;
// there is a change @date , new values are to the right;
// this i called on a change in values.
function writeChangeLineMONAG(ws, dateIdx, pers, nextHire, nextLoc, nextFTE, nextESTAT, pars, comment) {
    var isChange = isAChange(pers, nextHire, nextLoc, nextFTE, nextESTAT);
    if (!isChange && !isEOM(dateIdx)) {
        pers.location = nextLoc;
        //pers.nextFTE = nextFTE;  /// TODO FIX!
        pers.ESTAT = nextESTAT;
        return;
    }
    var isterm = isTERM(pers, nextHire);
    if (isterm) {
        // close previous record
        if (dateIdx.dayOfMonth() != 1) { // unless we already closed it by a month record
            var dmin1 = copyDate(dateIdx).minusDays(1);
            writeDay(ws, pers.prevDateEnd, dmin1);
            writeRecord(ws, dmin1, pers, pars, "termclose-1@" + dateIdx + ' ' + comment);
            memorizeSOM(dmin1, pers);
        }
        // always write a stop record if required
        if (isStopRecordsRequested(pars)) {
            writeSTOPRecordAfter(ws, pers, dateIdx, pars, "stopAfterm@" + dateIdx + ' ' + comment);
        }
        pers.hired = 0;
        pers.hiredPrev = 0;
        //pers.lastTerm = dateIdx;
    }
    else if (isHIRE(pers, nextHire)) {
        // write HIRE event line ->
        pers.lastHired = dateIdx;
        pers.prevDateEnd = copyDate(dateIdx).minusDays(1);
        // added
        pers.ftePrev = pers.fte;
        pers.hiredPrev = 1;
        if (pars.optsMONAG.startRecords) {
            var dp1 = copyDate(dateIdx).plusDays(2);
            writeDay(ws, dp1, dateIdx);
            pers.hired = nextHire;
            pers.location = nextLoc;
            pers.fte = nextFTE;
            writeRecordHIRE(ws, dateIdx, pers, "hire@" + dateIdx + ' ' + comment);
        }
        // do nothing, will be captured next
    }
    else {
        // close previous record
        if (dateIdx.dayOfMonth() != 1) {
            // unless we already closed it by a month record
            var dmin1 = copyDate(dateIdx).minusDays(1);
            writeDay(ws, pers.prevDateEnd, dmin1);
            writeRecord(ws, dmin1, pers, pars, "prevclose from " + dateIdx + ' ' + comment);
            memorizeSOM(dmin1, pers);
        }
        // always write a stop record if reqested
        if (isStopRecordsRequested(pars)) {
            writeSTOPRecordAfter(ws, pers, dateIdx, pars, "stopAfteve@" + dateIdx + ' ' + comment);
        }
        if (pars.optsMONAG.startRecords && pers.hired) {
            var dp1 = copyDate(dateIdx).plusDays(2);
            writeDay(ws, dp1, dateIdx);
            pers.hired = nextHire;
            pers.location = nextLoc;
            pers.fte = nextFTE;
            writeRecordMOVEIN(ws, dateIdx, pers, "movein@" + dateIdx + ' ' + comment);
        }
    }
    pers.hired = nextHire;
    pers.location = nextLoc;
    pers.fte = nextFTE;
    if (isEOM(dateIdx)) {
        // later suppress unless lastTerm within range
        if (!isNoZeroRequested(pars) || !isAllZero(pers)) {
            writeStateLineMONAG(ws, dateIdx, pers, pers.hired, pers.location, pers.fte, pars, "WCL");
        }
    }
}
/////////////////// percentages
function isHireChange(pars) {
    return pars.random.random() < pars.L_HIRE;
}
exports.isHireChange = isHireChange;
function getDOB(pars) {
    var year = 1950 + Math.floor(pars.random.random() * 55);
    var month = Math.floor(pars.random.random() * 12);
    var daybase = Math.floor(pars.random.random() * 31);
    return core_1.LocalDate.of(year, 1 + month, 1).plusDays(daybase - 1);
}
function genPerson(p, pars) {
    var pers = {
        user: p,
        hired: 0,
        hiredPrev: 0,
        fte: 1,
        ftePrev: 0,
        dob: getDOB(pars),
        location: getLocation(pars),
        prevDateEnd: pars.firstDate,
        prevRangeEnd: pars.firstDate,
        hiredSOM: 0,
        lastHired: pars.firstDate,
        fteSOM: 0,
        ESTAT: "A",
        ESTATSOM: "A",
        eventReason: undefined,
        gender: getGender(pars)
    };
    var nextDate = getNext(pars) + pars.firstDate.toEpochDay();
    for (var i = pars.firstDate.toEpochDay(); i <= pars.lastDate.toEpochDay(); ++i) {
        var d = core_1.LocalDate.ofEpochDay(i);
        if (i == nextDate) {
            if (isHireChange(pars)) {
                // writeChangeLineMONAG(pars.wsMONAG, d,pers, pers.hired ? 0 : 1, nextLocation(pars,pers), nextFTE(pars,pers)  , "HC");
                //+
                // ORDER IS CRUCIAL!
                pers.eventReason = getHireTermEventReason(pars, pers.hired);
                pers.lastEventDate = d;
                var nl = nextLocation(pars, pers);
                var nf = nextFTE(pars, pers);
                var nESTAT = getNextESTAT(pars, pers, "ESTAT");
                writeChangeLineRANGE(pars.wsRANGE, d, pers, pers.hired ? 0 : 1, nl, nf, nESTAT, pars, "HC");
                writeChangeLineMONAG(pars.wsMONAG, d, pers, pers.hired ? 0 : 1, nl, nf, nESTAT, pars, "HC");
                nextDate += getNext(pars);
            }
            else if (isEvent(pars)) {
                var nl = nextLocation(pars, pers);
                // force
                var nf = nextFTE(pars, pers);
                var nESTAT = getNextESTAT(pars, pers, "ESTAT");
                while (!isUnhiredChange(pers, pers.hired, nl, nf, nESTAT)) {
                    nl = nextLocation(pars, pers);
                    // force
                    nf = nextFTE(pars, pers);
                }
                pers.lastEventDate = d;
                pers.eventReason = getOtherEventReason(pars, pers, nl);
                writeChangeLineRANGE(pars.wsRANGE, d, pers, pers.hired, nl, nf, nESTAT, pars, "LC");
                writeChangeLineMONAG(pars.wsMONAG, d, pers, pers.hired, nl, nf, nESTAT, pars, "LC");
                nextDate += getNext(pars);
            }
            else if (isEOM(d)) {
                writeStateLineMONAG(pars.wsMONAG, d, pers, pers.hired, pers.location, pers.fte, pars, "EOMe");
            }
        }
        else if (isEOM(d)) {
            //if( pers.hired > 0 ) {
            if (!isNoZeroRequested(pars) || !isAllZero(pers)) {
                writeStateLineMONAG(pars.wsMONAG, d, pers, pers.hired, pers.location, pers.fte, pars, "EOM");
            }
            //}
            // else {
            memorizeSOM(d, pers);
            //}
        }
    }
    ;
}
exports.genPerson = genPerson;
var primes = [];
function getMaxPrimes(nr) {
    var max = Math.floor(Math.sqrt(nr) + 3);
    var mp = 1;
    var remain = nr;
    for (var i = 1; i <= max; ++i) {
        if (remain == 1) {
            return mp;
        }
        while (i > 1 && (remain % i == 0)) {
            mp = Math.max(mp, i);
            remain = remain / i;
        }
    }
    return remain;
}
exports.getMaxPrimes = getMaxPrimes;
function isDigit(char) {
    return "0123456789".indexOf(char) >= 0;
}
function isLineStartingWithDigit(line) {
    var lines = '' + line;
    return lines.length > 0 && isDigit(lines.charAt(0));
}
exports.isLineStartingWithDigit = isLineStartingWithDigit;
const re = new RegExp(/^(.*);(\d{4}-\d{2}-\d{2});(\d{4}-\d{2}-\d{2});(.*)$/);
function isDateLine(line) {
    return !!re.exec(line);
}
exports.isDateLine = isDateLine;
function splitDateLine(line) {
    var res = re.exec(line);
    //console.log(res);
    return [res[1], res[2], res[3], res[4]];
}
exports.splitDateLine = splitDateLine;
function reIndexLine(line) {
    var isDateLn = line && isDateLine('' + line);
    if (isDateLn) {
        var line = '' + line;
        var tags = splitDateLine(line);
        var prevDateEnd = core_1.LocalDate.parse(tags[1]).minusDays(1);
        var dateIdx = core_1.LocalDate.parse(tags[2]);
        var sb = getStringBuilder();
        writeDay(sb, prevDateEnd, dateIdx);
        sb.write(tags[3]);
        return sb.toString();
    }
    else {
        return '' + line;
    }
}
exports.reIndexLine = reIndexLine;
/**
 * Also strips comments lines with #
 * @param filename1
 * @param filename2
 * @param done
 */
function reIndexTime(filename1, filename2, done) {
    var wsOut = getWS(filename2);
    const liner = new lineByLine(filename1);
    var line = "";
    while (line = liner.next()) {
        line = reIndexLine(line);
        wsOut.write(line + '\n');
    }
    wsOut.ws.on('finish', () => { done(); });
    wsOut.ws.end();
}
exports.reIndexTime = reIndexTime;
/**
 * Also strips comments lines with #
 * @param filename1
 * @param filename2
 * @param done
 */
function cleanseWSCommentsRepeatedHeaderInFile(filename1, addData, samples, filename2, done) {
    var wsOut = getWS(filename2);
    var first = true;
    if (addData) {
        samples.forEach(sn => {
            console.log(' appending ' + sn);
            appendCleansing(sn, first, wsOut, true);
            first = false;
        });
    }
    appendCleansing(filename1, first, wsOut, false);
    wsOut.ws.on('finish', () => { done(); });
    wsOut.ws.end();
}
exports.cleanseWSCommentsRepeatedHeaderInFile = cleanseWSCommentsRepeatedHeaderInFile;
function appendCleansing(filename1, isFirstFile, wsOut, reindex) {
    const liner = new lineByLine(filename1);
    var line = "";
    var nr = 0;
    while (line = liner.next()) {
        var isDataLine = line && isLineStartingWithDigit(line);
        var isCommentLine = line && ('' + line).startsWith('#');
        var isFirstHeaderLine = (nr < 1) && !isCommentLine && !isDataLine;
        if (isDataLine || (isFirstHeaderLine && isFirstFile)) {
            if (reindex) {
                line = reIndexLine(line);
            }
            wsOut.write(('' + line).replace(/;\s+/g, ";").replace(/\s+;/g, ";")).write('\n');
            ++nr;
        } /* else {
          console.log(' dropping ' + isDataLine + ' ' + isFirstHeaderLine + ' ' + isCommentLine + ' ' + line);
        }*/
    }
}
exports.appendCleansing = appendCleansing;
function genUser(i) {
    return 'P' + padZeros(i, 5);
}
exports.genUser = genUser;
function genUSERHierarchyW(ws, nrpers) {
    // we build a parent child hierarchy  using prime number decomposition,
    // we build a parent child hierarchy  using prime number decomposition,
    // with persons made children of the "lagest prime factor"
    // to not end up with too many roots we only make every n-th prime factor a root.
    var res = {};
    var nrPrimes = 0;
    // 13 - 5 - 2
    for (var i = 1; i <= nrpers; ++i) {
        var prim = getMaxPrimes(i);
        if (!res[prim]) {
            ++nrPrimes;
            if ((i > 10) && (nrPrimes % 20 != 15)) {
                var primPar = getMaxPrimes(Math.floor(i / 10));
                res[prim] = primPar;
            }
            else {
                res[prim] = -1; // a root
            }
        }
        if (i != prim) {
            res[i] = prim;
        }
    }
    //dump the list
    ws.write("USER;USER_PARENT\n");
    for (var i = 1; i <= nrpers; ++i) {
        ws.write(genUser(i)).write(';');
        if (res[i] > 0) {
            ws.write(genUser(res[i])).write('\n');
        }
        else {
            ws.write("\n"); //Null!
        }
    }
}
exports.genUSERHierarchyW = genUSERHierarchyW;
function genUSERHierarchy(nrpers) {
    var ws = getWS("DIM_USER_" + padZeros(nrpers, 6) + ".csv");
    genUSERHierarchyW(ws, nrpers);
    ws.ws.end();
}
exports.genUSERHierarchy = genUSERHierarchy;

//# sourceMappingURL=data:application/json;charset=utf8;base64,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LENBQUMsQ0FBQztJQUNqRCxFQUFFLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsZ0RBQWdEO0lBQzlGLFdBQVcsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFBLENBQUMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFBLENBQUMsQ0FBQyxLQUFLLEVBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDeEYsSUFBSSxZQUFZLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDdEQsRUFBRSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxZQUFZLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxZQUFZO0lBQzVFLFdBQVcsQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDbEYsRUFBRSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsT0FBTyxHQUFHLFlBQVksRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLFlBQVk7SUFDM0YsV0FBVyxDQUFDLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ3BDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxHQUFH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Q2hCLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3ZDO2FBQU07WUFDTCxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsT0FBTztTQUN4QjtLQUNGO0FBQ0gsQ0FBQztBQWpDRCw4Q0FpQ0M7QUFFRCxTQUFnQixnQkFBZ0IsQ0FBQyxNQUFlO0lBQzlDLElBQUksRUFBRSxHQUFHLEtBQUssQ0FBRSxXQUFXLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBQyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQztJQUMzRCxpQkFBaUIsQ0FBQyxFQUFFLEVBQUMsTUFBTSxDQUFDLENBQUM7SUFDN0IsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNkLENBQUM7QUFKRCw0Q0FJQyIsImZpbGUiOiJoZWxwZXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGZzID0gcmVxdWlyZSgnZnMnKTtcclxuY29uc3QgeyBleGl0IH0gPSByZXF1aXJlKCdwcm9jZXNzJyk7XHJcbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0ICogYXMgbGluZUJ5TGluZSBmcm9tICduLXJlYWRsaW5lcyc7XHJcbmltcG9ydCAqIGFzIHJlYWRsaW5lIGZyb20gJ3JlYWRsaW5lJztcclxuXHJcbi8vdmFyIHNlZWRyYW5kb20gPSByZXF1aXJlKCdzZWVkcmFuZG9tJyk7XHJcbmltcG9ydCAqIGFzIHNlZWRyYW5kb20gZnJvbSAnc2VlZHJhbmRvbSc7XHJcbi8vIEVYQ0VMXHJcbi8vICAgICAxIDE5MDAtMDEtMDFcclxuLy8gMjU1NjkgMTk3MC0wMS0wMVxyXG4vL1xyXG5leHBvcnQgY29uc3QgRVhDRUxPRkZTRVQgPSAyNTU2OTtcclxuXHJcbmltcG9ydCB7TG9jYWxEYXRlIH0gZnJvbSAgXCJAanMtam9kYS9jb3JlXCI7XHJcbmltcG9ydCB7IFNTTF9PUF9ET05UX0lOU0VSVF9FTVBUWV9GUkFHTUVOVFMsIFdTQUVEUVVPVCB9IGZyb20gJ2NvbnN0YW50cyc7XHJcbmltcG9ydCB7IHNhbXBsZVNpemUgfSBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgeyBDb25zb2xlIH0gZnJvbSAnY29uc29sZSc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZGF0ZVRvRGF5SW5kZXgoZCA6IExvY2FsRGF0ZSApIDogbnVtYmVyIHtcclxuICByZXR1cm4gIGQudG9FcG9jaERheSgpICsgRVhDRUxPRkZTRVQ7XHJcbn1cclxuXHJcbnZhciBkMSA9IExvY2FsRGF0ZS5vZigyMDIwLDEsNik7XHJcbnZhciBkMUlkeCA9IGRhdGVUb0RheUluZGV4KGQxKTtcclxudmFyIGQyID0gTG9jYWxEYXRlLm9mKDIwMjQsNiwxKTtcclxudmFyIGQySWR4ID0gZGF0ZVRvRGF5SW5kZXgoZDIpO1xyXG52YXIgZGVsdGFUaW1lID0gZDJJZHgtZDFJZHg7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbWFrZU1hcChvYmopIHtcclxuICB2YXIgaWR4ID0gMDtcclxuICB2YXIgcmVzID0gW107XHJcbiAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMob2JqKS5mb3JFYWNoKCBmdW5jdGlvbihhKSB7XHJcbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgb2JqW2FdOyArK2kpIHtcclxuICAgICAgcmVzLnB1c2goYSk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbiAgcmV0dXJuIHJlcztcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFdTV3JhcDIgIHtcclxuICB3czogYW55O1xyXG4gIF9sb2c6IGFueTtcclxuICBfb25GaW5pc2ggOiBhbnk7XHJcbiAgY29uc3RydWN0b3IoZm4gOiBzdHJpbmcpXHJcbiAge1xyXG4gICAgdGhpcy53cyA9IHRoaXM7XHJcbiAgICB0aGlzLl9sb2cgPSBmcy5vcGVuU3luYyhmbiwndycpO1xyXG4gICAgdGhpcy5fb25GaW5pc2ggPSB1bmRlZmluZWQ7XHJcbiAgfVxyXG4gIG9uKCBzIDogc3RyaW5nLCBmbiA6IGFueSkge1xyXG4gICAgdGhpcy5fb25GaW5pc2ggPSBmbjtcclxuICB9XHJcbiAgZW5kKCkge1xyXG4gICAgZnMuY2xvc2VTeW5jKHRoaXMuX2xvZyk7XHJcbiAgICB0aGlzLl9sb2cgPSB1bmRlZmluZWQ7XHJcbiAgICBpZiggdGhpcy5fb25GaW5pc2gpIHtcclxuICAgICAgdGhpcy5fb25GaW5pc2goKTtcclxuICAgIH1cclxuICB9XHJcbiAgd3JpdGUoYSA6IGFueSkge1xyXG4gICAgZnMud3JpdGVTeW5jKHRoaXMuX2xvZywgJycgKyBhKTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxufTtcclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0V1MoZmlsZW5hbWU6IHN0cmluZykgOiBXU1dyYXAyIHtcclxuXHJcbiAgcmV0dXJuIG5ldyBXU1dyYXAyKGZpbGVuYW1lKTtcclxufVxyXG5cclxuXHJcbi8vIDEgU2ltcGxlIHJhbmdlIGJhc2VkICAobm8gbW9udGhseSBpbnRlcmltIGRhdGEpXHJcbi8vICBbeHh4XS1beXl5XSAgPGF0dHJpYnV0ZXM+XHJcbi8vXHJcbi8vICBvcHRpb25hbCBzcHJpbmtsZSBpbiAwLDAsMCwwIDxhdHRyaWJ1dGVzPiBNYXJrICBFT00vRU9QIG51bWJlcnMuXHJcbi8vXHJcbi8vdG8gc3VwcG9ydCBkaWZmZXJlbnQgb3V0cHV0IGZsYXZvdXJzLFxyXG4vL1xyXG4vL1xyXG5cclxuZXhwb3J0IGNsYXNzIE9wdHNNT05BRyB7XHJcbiAgbm9aZXJvIDogYm9vbGVhbjtcclxuICBzdG9wUmVjb3JkcyA6IGJvb2xlYW47XHJcbiAgc3RhcnRSZWNvcmRzIDogYm9vbGVhbjtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEdlblBhcmFtcyB7XHJcbiAgTlJQRVJTIDogbnVtYmVyO1xyXG4gIEFWR19ORVhUIDogbnVtYmVyO1xyXG4gIExPQ0NIQU5HRSA6IG51bWJlcjtcclxuICBGVEVDSEFOR0U6IG51bWJlcjtcclxuICBFU1RBVENIQU5HRTpudW1iZXI7XHJcbiAgTF9ISVJFIDogbnVtYmVyO1xyXG4gIExfRVZFTlQgOiBudW1iZXI7XHJcbiAgTE9DQVRJT05zOiBzdHJpbmdbXTtcclxuICBFU1RBVHMgOiBzdHJpbmdbXTtcclxuICBmaXJzdERhdGUgOiBMb2NhbERhdGU7XHJcbiAgbGFzdERhdGUgOiBMb2NhbERhdGU7XHJcbiAgcmFuZG9tIDogYW55O1xyXG4gIHdzTU9OQUcgOiBhbnk7XHJcbiAgYWRkSW5wdXRTYW1wbGVzIDogYm9vbGVhbjtcclxuICBvcHRzTU9OQUc/IDogT3B0c01PTkFHO1xyXG4gIHdzUkFOR0UgOiBhbnk7XHJcbiAgb3B0c1JBTkdFIDogYW55O1xyXG4gIHJhbmRvbU9EIDogYW55OyAvLyB7IFwiRVNUQVRcIiA6IHNlZWRyYW5kb20oJ1haWScpIH0sXHJcbiAgUkVPUF9FU1RBVFMgOiBzdHJpbmdbXTsgLy8gRVNUQVRTIHdoaWNoIGNvbnRyaWJ1dGUgdG8gRU9QLCB0aGlzIGlzIGp1c3QgaGVhZCBjb3VudCBJRiBFU1RBVCBJTiBbXCJBXCIsXCJVXCIsXCJQXCJdIEVPUF9IQyA6IDBcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFBlcnNvbiB7XHJcbiAgLy8gaW1tdXRhYmxlXHJcbiAgdXNlcjogc3RyaW5nO1xyXG4gIGdlbmRlciA6IHN0cmluZztcclxuICBldmVudFJlYXNvbiA6IHN0cmluZztcclxuICAvLyBjaGFuZ2luZ1xyXG4gIGRvYjogTG9jYWxEYXRlO1xyXG4gIGxvY2F0aW9uIDogc3RyaW5nO1xyXG4gIGhpcmVkOiBudW1iZXI7XHJcbiAgaGlyZWRTT006IG51bWJlcjtcclxuICBoaXJlZFByZXYgOiBudW1iZXI7IC8vIHBlcnNvbiAgaGlyZSBzdGF0ZSBwcmV2aW91cyByYW5nZVxyXG4gIGZ0ZSA6IG51bWJlcjtcclxuICBmdGVQcmV2IDogbnVtYmVyOyAvLyBwZXJzb24gZnRlIHN0YXRlIHByZXZpb3VzIHJhbmdlXHJcbiAgZnRlU09NOiBudW1iZXI7XHJcbiAgRVNUQVQgOiBzdHJpbmc7XHJcbiAgRVNUQVRQcmV2IDogc3RyaW5nO1xyXG4gIEVTVEFUU09NIDogc3RyaW5nO1xyXG4gIC8vIGNoYW5naW5nXHJcbiAgbGFzdEhpcmVkOiBMb2NhbERhdGU7XHJcbiAgbGFzdEV2ZW50RGF0ZSA6IExvY2FsRGF0ZTtcclxuICBwcmV2RGF0ZUVuZCA6IExvY2FsRGF0ZTtcclxuICBwcmV2UmFuZ2VFbmQ6IExvY2FsRGF0ZTsgLy8gZW5kIG9mIGxhc3QgcmFuZ2VcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0TmV4dChwYXJzOkdlblBhcmFtcykge1xyXG4gIHJldHVybiBNYXRoLmZsb29yKHBhcnMucmFuZG9tLnJhbmRvbSgpICogcGFycy5BVkdfTkVYVCkgKyAxO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRMb2NhdGlvbihwYXJzOiBHZW5QYXJhbXMpIHtcclxuICByZXR1cm4gcGFycy5MT0NBVElPTnNbTWF0aC5mbG9vcihwYXJzLnJhbmRvbS5yYW5kb20oKSAqIHBhcnMuTE9DQVRJT05zLmxlbmd0aCldO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRFU1RBVChwYXJzOiBHZW5QYXJhbXMsIGtleSA6IHN0cmluZykge1xyXG4gIHJldHVybiBwYXJzLkVTVEFUc1tNYXRoLmZsb29yKHBhcnMucmFuZG9tT0Rba2V5XS5yYW5kb20oKSAqIHBhcnMuRVNUQVRzLmxlbmd0aCldO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRHZW5kZXIocGFyczogR2VuUGFyYW1zKSB7XHJcbiAgcmV0dXJuICggcGFycy5yYW5kb20ub3RoZXJSYW5kb20oMikgPCAwLjUgKSA/IFwiRlwiOiBcIk1cIjtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0SGlyZUV2ZW50UmVhc29uKHBhcnM6IEdlblBhcmFtcyk6IHN0cmluZyB7XHJcbiAgcmV0dXJuIFwiSElcIiArIChNYXRoLmZsb29yKHBhcnMucmFuZG9tLm90aGVyUmFuZG9tKDQpICogMTAwKSAlIDUpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRUZXJtRXZlbnRSZWFzb24ocGFyczogR2VuUGFyYW1zKSA6IHN0cmluZyB7XHJcbiAgcmV0dXJuIFwiVFJcIiArIChNYXRoLmZsb29yKHBhcnMucmFuZG9tLm90aGVyUmFuZG9tKDQpICogMTAwKSAlIDEwKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0TG9jYXRpb25FdmVudFJlYXNvbihwYXJzOiBHZW5QYXJhbXMpIDogc3RyaW5nIHtcclxuICByZXR1cm4gXCJMXCIgKyBwYWRaZXJvcygoTWF0aC5mbG9vcihwYXJzLnJhbmRvbS5vdGhlclJhbmRvbSg0KSAqIDEwMCkgJSA1MCksMik7XHJcbn1cclxuZnVuY3Rpb24gZ2V0UGxhaW5FdmVudFJlYXNvbihwYXJzOiBHZW5QYXJhbXMpIDogc3RyaW5nIHtcclxuICByZXR1cm4gXCJQXCIgKyBwYWRaZXJvcygoTWF0aC5mbG9vcihwYXJzLnJhbmRvbS5vdGhlclJhbmRvbSg0KSAqIDEwMCkgJSAxMCksMik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpc0hpcmVFUiggZXIgOiBzdHJpbmcgKSA6bnVtYmVyIHtcclxuICByZXR1cm4gKGVyLmNoYXJBdCgwKSA9PSBcIkhcIikgPyAxIDogMDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGlzVGVybUVSKCBlciA6IHN0cmluZyApIDogbnVtYmVyIHtcclxuICByZXR1cm4gKGVyLmNoYXJBdCgwKSA9PSBcIlRcIikgPyAxIDogMDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGlzT3RoZXJFUiggZXIgOiBzdHJpbmcgKSA6IG51bWJlciB7XHJcbiAgcmV0dXJuICgoIWlzSGlyZUVSKGVyKSAgJiYgIWlzVGVybUVSKGVyKSkgPyAxIDogMCk7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBnZXRIaXJlVGVybUV2ZW50UmVhc29uKCBwYXJzIDogR2VuUGFyYW1zLCBwcmlvckhpcmVkOiBudW1iZXIgKSB7XHJcbiAgaWYgKCBwcmlvckhpcmVkICkge1xyXG4gICAgcmV0dXJuIGdldFRlcm1FdmVudFJlYXNvbihwYXJzKTtcclxuICB9IGVsc2Uge1xyXG4gICAgcmV0dXJuIGdldEhpcmVFdmVudFJlYXNvbihwYXJzKTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldE90aGVyRXZlbnRSZWFzb24oIHBhcnM6IEdlblBhcmFtcywgcGVyczogUGVyc29uLCBubDogc3RyaW5nICkge1xyXG4gIGlmICggcGVycy5sb2NhdGlvbiAhPSBubCApIHtcclxuICAgIHJldHVybiBnZXRMb2NhdGlvbkV2ZW50UmVhc29uKHBhcnMpO1xyXG4gIH1cclxuICByZXR1cm4gZ2V0UGxhaW5FdmVudFJlYXNvbihwYXJzKTtcclxufVxyXG5cclxuZnVuY3Rpb24gbmV4dExvY2F0aW9uKCBwYXJzOiBHZW5QYXJhbXMsIHBlcnMgOiBQZXJzb24gKSB7XHJcbiAgaWYoIHBhcnMucmFuZG9tLnJhbmRvbSgpIDwgcGFycy5MT0NDSEFOR0UpIHtcclxuICAgIHJldHVybiBnZXRMb2NhdGlvbihwYXJzKTtcclxuICB9XHJcbiAgcmV0dXJuICBwZXJzLmxvY2F0aW9uO1xyXG59XHJcblxyXG5mdW5jdGlvbiBuZXh0RlRFKHBhcnM6IEdlblBhcmFtcywgcGVycyA6IFBlcnNvbikge1xyXG4gIGlmKCBwYXJzLnJhbmRvbS5yYW5kb20oKSA8IHBhcnMuRlRFQ0hBTkdFKSB7XHJcbiAgICBpZiggcGVycy5mdGUgPT0gMSkge1xyXG4gICAgICByZXR1cm4gMC41O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIDEuMDtcclxuICB9XHJcbiAgcmV0dXJuIHBlcnMuZnRlO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0TmV4dEVTVEFUKCBwYXJzOiBHZW5QYXJhbXMsIHBlcnMgOiBQZXJzb24sIGtleSA6IHN0cmluZyApIHtcclxuLy8gIHBhcnMucmFuZG9tT0Rba2V5XSgpO1xyXG4gIGlmKCBwYXJzLnJhbmRvbU9EW2tleV0ucmFuZG9tKCkgPCBwYXJzLkVTVEFUQ0hBTkdFKSB7XHJcbiAgICByZXR1cm4gZ2V0RVNUQVQocGFycywga2V5KTtcclxuICB9XHJcbiAgcmV0dXJuICBwZXJzLkVTVEFUO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gaXNFdmVudChwYXJzOkdlblBhcmFtcykge1xyXG4gIHJldHVybiBwYXJzLnJhbmRvbS5yYW5kb20oKSA8IHBhcnMuTF9FVkVOVDtcclxufVxyXG5cclxuZnVuY3Rpb24gaXNFT00oZGF0ZUlkeCA6IExvY2FsRGF0ZSkge1xyXG4gIHZhciBkID0gY29weURhdGUoZGF0ZUlkeCkucGx1c0RheXMoMSk7XHJcbiAgaWYoZC5kYXlPZk1vbnRoKCkgPT0gMSlcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNvcHlEYXRlKGQgOiBMb2NhbERhdGUpIHtcclxuICByZXR1cm4gTG9jYWxEYXRlLm9mRXBvY2hEYXkoZC50b0Vwb2NoRGF5KCkpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNFT1EoZDogTG9jYWxEYXRlKSB7XHJcbiAgZCA9IGNvcHlEYXRlKGQpLnBsdXNEYXlzKDEpO1xyXG4gIGlmKGQuZGF5T2ZNb250aCgpID09IDEgJiYgIFsxLDQsNywxMF0uaW5kZXhPZihkLm1vbnRoVmFsdWUoKSkgPj0gMClcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNFT1koZCA6IExvY2FsRGF0ZSkge1xyXG4gIHZhciBkID0gY29weURhdGUoZCkucGx1c0RheXMoMSk7XHJcbiAgaWYoZC5kYXlPZk1vbnRoKCkgPT0gMSAmJiBkLm1vbnRoVmFsdWUoKSA9PSAxKVxyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgcmV0dXJuIGZhbHNlO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcGFkWmVyb3MoYSA6IGFueSwgbGVuIDogbnVtYmVyKSB7XHJcbiAgdmFyIHMgPSBcIlwiICthO1xyXG4gIHJldHVybiBcIjAwMDAwMDBcIi5zdWJzdHIoMCwgbGVuIC0gcy5sZW5ndGgpICsgcztcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHBhZFNwYWNlKGEgOiBhbnksIGxlbiA6IG51bWJlcikge1xyXG4gIHZhciBzID0gXCJcIiArYTtcclxuICByZXR1cm4gXCIgICAgICAgICAgICAgICAgICAgXCIuc3Vic3RyKDAsIGxlbiAtIHMubGVuZ3RoKSArIHM7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBwYWRTcGFjZVEoYSA6IGFueSwgbGVuIDogbnVtYmVyKSB7XHJcbiAgdmFyIHMgPSBcIlwiICthO1xyXG4gIHJldHVybiAnXCInICsgcyArICdcIicgKyBcIiAgICAgICAgICAgICAgICAgICBcIi5zdWJzdHIoMCwgbGVuIC0gcy5sZW5ndGgpO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGFzRGF0ZShkYXRlSWR4IDogTG9jYWxEYXRlKTogc3RyaW5nIHtcclxuICB2YXIgZCA9ZGF0ZUlkeDtcclxuICByZXR1cm4gJycgKyBkO1xyXG4gIC8vcmV0dXJuIGQueWVhcigpICsgXCItXCIgKyBwYWQoZC5tb250aFZhbHVlKCksMikgKyBcIi1cIiArIHBhZChkLmRheU9mTW9udGgoKSwyKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEVPTU9OVEgoZCA6IExvY2FsRGF0ZSkgOiBMb2NhbERhdGUge1xyXG4gIHJldHVybiBjb3B5RGF0ZShkKS5wbHVzTW9udGhzKDEpLndpdGhEYXlPZk1vbnRoKDEpLm1pbnVzRGF5cygxKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRheXNJbk1vbnRoKGRhdGVJZHggOiBMb2NhbERhdGUpIHtcclxuICB2YXIgZHQgPWRhdGVJZHg7XHJcbiAgdmFyIGRlb20gPSBFT01PTlRIKGR0KTtcclxuICByZXR1cm4gZGF0ZVRvRGF5SW5kZXgoZGVvbSkgLSBkYXRlVG9EYXlJbmRleChjb3B5RGF0ZShkZW9tKS53aXRoRGF5T2ZNb250aCgxKSkgKyAxO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gd3JpdGVIZWFkZXIod3MpIHtcclxuICB3cy53cml0ZShcIllFQVI7UVVBUlQ7Q0FMTU9OVEhJQztDQUxNT05USEk7Q0FMTU9OVEg7Q0FMTU9OVEhTO1NUQVJUX0RBVEVfSURYO0VORF9EQVRFX0lEWDtJU0VPTTtJU0VPUTtJU0VPWTtEQVlTSU5NT05USDtTVEFSVF9EQVRFO0VORF9EQVRFO1wiKVxyXG4gIHdzLndyaXRlKFwiVVNFUjtMT0NBVElPTjtFU1RBVDtIQztIQ19TT007SENfRU9NO0RBWVNXT1JLRUQ7RlRFO0ZURV9TT007RlRFX0VPTTtGVEVXT1JLRUQ7VEVOVVJFO1RFTlVSRV9TT007VEVOVVJFX0VPTTtBR0U7QUdFX1NPTTtBR0VfRU9NO0hDX0VPTVM7SElSRTtURVJNO01PVkVfSU47TU9WRV9PVVQ7RVZSUztHTkRSO1hcXG5cIilcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG1ha2VRdWFydGVyKGQgOiBMb2NhbERhdGUpIHtcclxuICByZXR1cm4gZC55ZWFyKCkgKyAnJyArICdfUScgKyAgKE1hdGguZmxvb3IoKGQubW9udGhWYWx1ZSgpLTEpLzMpKzEpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gd3JpdGVEYXkod3MsIHByZXZEYXRlRW5kOkxvY2FsRGF0ZSwgZGF0ZUlkeCA6IExvY2FsRGF0ZSkge1xyXG4gIHZhciBzdGFydElkeCA9IGNvcHlEYXRlKHByZXZEYXRlRW5kKS5wbHVzRGF5cygxKTtcclxuICB2YXIgZCA9IGRhdGVJZHg7XHJcbiAgdmFyIHkgPSBkLnllYXIoKTtcclxuICB2YXIgbSA9IGQubW9udGhWYWx1ZSgpO1xyXG4gIHZhciBjbWkgPSB5KjEwMCArIG07XHJcbiAgdmFyIGNtaWMgPSAgKHktMjAwMCkqMTIgKyBtO1xyXG4gIHdzLndyaXRlKHkpLndyaXRlKCc7Jyk7XHJcbiAgd3Mud3JpdGUobWFrZVF1YXJ0ZXIoZCkpLndyaXRlKCc7Jyk7XHJcbiAgd3Mud3JpdGUoJycgKyBjbWljICsgXCI7XCIgKyBjbWkgKyBcIjtcIiArIGNtaSArIFwiO1wiICsgY21pKyBcIjtcIik7IC8vIENBTE1PTlRIIElDIEkgfiBTXHJcbiAgd3Mud3JpdGUoZGF0ZVRvRGF5SW5kZXgoc3RhcnRJZHgpKyBcIjtcIisgZGF0ZVRvRGF5SW5kZXgoZGF0ZUlkeCkgKyBcIjtcIik7XHJcbiAgd3Mud3JpdGUoaXNFT00oZCk/IFwiMS4wXCIgOiBcIjAuMFwiKS53cml0ZShcIjtcIik7XHJcbiAgd3Mud3JpdGUoaXNFT1EoZCk/IFwiMS4wXCIgOiBcIjAuMFwiKS53cml0ZShcIjtcIik7XHJcbiAgd3Mud3JpdGUoaXNFT1koZCk/IFwiMS4wXCIgOiBcIjAuMFwiKS53cml0ZShcIjtcIik7XHJcbiAgdmFyIGRpbSA9IGRheXNJbk1vbnRoKGQpO1xyXG4gIHdzLndyaXRlKGRpbSkud3JpdGUoXCI7XCIpO1xyXG4gIHdzLndyaXRlKGFzRGF0ZShzdGFydElkeCkpLndyaXRlKFwiO1wiKTtcclxuICB3cy53cml0ZShhc0RhdGUoZCkpLndyaXRlKFwiO1wiKTtcclxuICByZXR1cm4gZGltO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZGlmZlllYXJzKGRhdGVMb3c6IExvY2FsRGF0ZSwgZGF0ZUhpZ2g6IExvY2FsRGF0ZSkge1xyXG4gIHJldHVybiBkYXRlTG93LnVudGlsKGRhdGVIaWdoKS55ZWFycygpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZGlmZk1vbnRoKGRhdGVMb3cgOiBMb2NhbERhdGUsIGRhdGVIaWdoIDogTG9jYWxEYXRlKSB7XHJcbiAgdmFyIGEgPSBkYXRlTG93LnVudGlsKGRhdGVIaWdoKTtcclxuICByZXR1cm4gYS55ZWFycygpKjEyICsgYS5tb250aHMoKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHdyaXRlVEVOVVJFQUdFKHBlcnMgOlBlcnNvbikge1xyXG4gIHJldHVybiBwZXJzLmhpcmVkID4gMDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHdyaXRlVGVudXJlKHdzLCBub3c6IExvY2FsRGF0ZSwgcGVyczogUGVyc29uLCBlb20pIHtcclxuICBpZiAoICF3cml0ZVRFTlVSRUFHRShwZXJzKSApIHtcclxuICAgIHdzLndyaXRlKCcgMDsgMDsgMDsnKTtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgdmFyIHRlbnVyZU5vdyA9IGRpZmZNb250aChwZXJzLmxhc3RIaXJlZCxub3cpO1xyXG4gIHdzLndyaXRlKHBhZFNwYWNlKHRlbnVyZU5vdywyKSkud3JpdGUoJzsnKTtcclxuICBpZiggaXNFT00obm93KSkge1xyXG4gICAgdmFyIGRzb20gPSBnZXRTT00obm93KTtcclxuICAgIHZhciB0ZW51cmVTT00gPSBkaWZmTW9udGgocGVycy5sYXN0SGlyZWQsZHNvbSk7XHJcbiAgICB3cy53cml0ZShwYWRTcGFjZSh0ZW51cmVTT00sMikpLndyaXRlKCc7JylcclxuICAgIHdzLndyaXRlKHBhZFNwYWNlKHRlbnVyZU5vdywyKSkud3JpdGUoJzsnKTtcclxuICB9IGVsc2Uge1xyXG4gICAgd3Mud3JpdGUoJyAwOyAwOycpXHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0U09NKGRhdGVJZHggOiBMb2NhbERhdGUpICA6IExvY2FsRGF0ZSB7XHJcbiAgcmV0dXJuIGRhdGVJZHgud2l0aERheU9mTW9udGgoMSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB3cml0ZUFnZSh3cywgbm93IDogTG9jYWxEYXRlLCBwZXJzLCBlb206IGJvb2xlYW4pIHtcclxuICBpZiAoICF3cml0ZVRFTlVSRUFHRShwZXJzKSApIHtcclxuICAgIHdzLndyaXRlKCcgMDsgMDsgMDsnKTtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgdmFyIGFnZU5vdyA9IGRpZmZZZWFycyhwZXJzLmRvYixub3cpO1xyXG4gIHdzLndyaXRlKHBhZFNwYWNlKGFnZU5vdywyKSkud3JpdGUoJzsnKTtcclxuICBpZiggaXNFT00obm93KSApIHtcclxuICAgIHZhciBkc29tID0gZ2V0U09NKG5vdyk7XHJcbiAgICB2YXIgYWdlU09NID0gZGlmZlllYXJzKHBlcnMuZG9iLGRzb20pO1xyXG4gICAgd3Mud3JpdGUocGFkU3BhY2UoYWdlU09NLDIpKS53cml0ZSgnOycpXHJcbiAgICB3cy53cml0ZShwYWRTcGFjZShhZ2VOb3csMikpLndyaXRlKCc7Jyk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHdzLndyaXRlKCcgMDsgMDsnKVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHdyaXRlVHJpcGVsKHdzLCB2c29tIDogYW55LCB2bm93OiBhbnksIGVvbSA6IGJvb2xlYW4pIHtcclxuICB3cy53cml0ZShwYWRTcGFjZSh2bm93LDMpKS53cml0ZSgnOycpO1xyXG4gIGlmKCBlb20gKSB7XHJcbiAgICB3cy53cml0ZShwYWRTcGFjZSh2c29tLDMpKS53cml0ZSgnOycpXHJcbiAgICB3cy53cml0ZShwYWRTcGFjZSh2bm93LDMpKS53cml0ZSgnOycpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB3cy53cml0ZSgnMC4wOzAuMDsnKVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHRvRGVjMShuIDogbnVtYmVyKSB7XHJcbiAgcmV0dXJuIChuIHx8IDApLnRvRml4ZWQoMSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBtZW1vcml6ZVNPTShkYXRlSWR4IDogTG9jYWxEYXRlLCBwZXJzIDogUGVyc29uKSB7XHJcbiAgdmFyIGVvbSA9IGlzRU9NKGRhdGVJZHgpO1xyXG4gIGlmIChlb20pIHtcclxuICAgIHBlcnMuZnRlU09NID0gcGVycy5oaXJlZCAqIHBlcnMuZnRlO1xyXG4gICAgcGVycy5oaXJlZFNPTSA9IHBlcnMuaGlyZWQ7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBpc0FsbFplcm8ocGVycyA6IFBlcnNvbikge1xyXG4gIHJldHVybiAocGVycy5oaXJlZCA9PSAwICYmICBwZXJzLmhpcmVkU09NID09IDApO1xyXG59XHJcblxyXG4vKipcclxuICogVGhpcyBmdW5jdGlvbiBkb2VzIG11dGF0ZSBwZXJzLCB1c2UgYSBjbG9uZSBpZiBub3QgZGVzaXJlZCFcclxuICogQHBhcmFtIHdzXHJcbiAqIEBwYXJhbSBkYXRlSWR4XHJcbiAqIEBwYXJhbSBwZXJzXHJcbiAqIEBwYXJhbSBjb21tZW50XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gd3JpdGVSZWNvcmQod3MsIGRhdGVJZHggOiBMb2NhbERhdGUsIHBlcnMgOiBQZXJzb24sIHBhcnMgOiBHZW5QYXJhbXMsIGNvbW1lbnQ6IHN0cmluZyApXHJcbntcclxuICB2YXIgc3RhcnRJZHggPSBjb3B5RGF0ZShwZXJzLnByZXZEYXRlRW5kKS5wbHVzRGF5cygxKTtcclxuICB2YXIgZW9tID0gaXNFT00oZGF0ZUlkeCk7XHJcbiAgd3Mud3JpdGUocGFkU3BhY2VRKHBlcnMudXNlciw1KSkud3JpdGUoJzsnKTtcclxuICB3cy53cml0ZShwYWRTcGFjZVEocGVycy5sb2NhdGlvbiwyMCkpLndyaXRlKCc7Jyk7XHJcbiAgd3Mud3JpdGUocGFkU3BhY2VRKHBlcnMuRVNUQVQsMSkpLndyaXRlKCc7Jyk7IC8vIHdlIGFsd2F5cyB3cml0ZSB0aGlzLCBuZWVkZWQgZm9yIFNUT1AgcmVjb3Jkc1xyXG4gIHdyaXRlVHJpcGVsKHdzLCBwZXJzLmhpcmVkU09NID8gXCIxLjBcIjogXCIwLjBcIiwgcGVycy5oaXJlZCA/IFwiMS4wXCI6IFwiMC4wXCIsaXNFT00oZGF0ZUlkeCkpO1xyXG4gIHZhciBkYXlzSW5QZXJpb2QgPSBzdGFydElkeC51bnRpbChkYXRlSWR4KS5kYXlzKCkgKyAxO1xyXG4gIHdzLndyaXRlKHBhZFNwYWNlKHBlcnMuaGlyZWRQcmV2ICogZGF5c0luUGVyaW9kLDIpKS53cml0ZSgnOycpOyAvL0RBWVNXT1JLRURcclxuICB3cml0ZVRyaXBlbCh3cywgdG9EZWMxKHBlcnMuZnRlU09NKSx0b0RlYzEocGVycy5oaXJlZCAqIHBlcnMuZnRlKSxpc0VPTShkYXRlSWR4KSk7XHJcbiAgd3Mud3JpdGUocGFkU3BhY2UocGVycy5oaXJlZFByZXYgKiBwZXJzLmZ0ZVByZXYgKiBkYXlzSW5QZXJpb2QsNCkpLndyaXRlKCc7Jyk7IC8vIEZURVdPUktFRFxyXG4gIHdyaXRlVGVudXJlKHdzLCBkYXRlSWR4LCBwZXJzLCBlb20pO1xyXG4gIHdyaXRlQWdlKHdzLCBkYXRlSWR4LCBwZXJzLCBlb20pO1xyXG4gIGlmKGVvbSAmJiBwYXJzLlJFT1BfRVNUQVRTICYmIHBhcnMuUkVPUF9FU1RBVFMuaW5kZXhPZihwZXJzLkVTVEFUKSA+PSAwKSB7XHJcbiAgICB3cy53cml0ZShwYWRTcGFjZShwZXJzLmhpcmVkLDEpKS53cml0ZSgnOycpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB3cy53cml0ZSgnMCcpLndyaXRlKCc7Jyk7XHJcbiAgfVxyXG4gIHBlcnMuaGlyZWRQcmV2ID0gcGVycy5oaXJlZDtcclxuICBwZXJzLmZ0ZVByZXYgPSBwZXJzLmZ0ZTtcclxuXHJcbiAgLy8gd2UgY2FuIHVzZSB0aGlzIGFzIE1PVkVfT1VUIG9yIFRFUk1cclxuICB2YXIgZGF0ZUlkeFAxID0gY29weURhdGUoZGF0ZUlkeCkucGx1c0RheXMoMSk7XHJcbiAgaWYoIGRhdGVJZHhQMS50b0Vwb2NoRGF5KCkgPT0gKHBlcnMubGFzdEV2ZW50RGF0ZSAmJiBwZXJzLmxhc3RFdmVudERhdGUudG9FcG9jaERheSgpKSApIHtcclxuICAgIHZhciBoYXNFUiA9IGlzVGVybUVSKHBlcnMuZXZlbnRSZWFzb24pIHx8IGlzT3RoZXJFUihwZXJzLmV2ZW50UmVhc29uKTtcclxuICAgIHdzLndyaXRlKFwiMDtcIiArXHJcbiAgICAgICAgaXNUZXJtRVIocGVycy5ldmVudFJlYXNvbikgKyBcIjswO1wiICtcclxuICAgICAgICBpc090aGVyRVIocGVycy5ldmVudFJlYXNvbikgKyBcIjtcIiArXHJcbiAgICAgICAgKGhhc0VSID8gKHBlcnMuZXZlbnRSZWFzb24gKyBcIjtcIikgOiBcIjsgIFwiKSArIFwiXFxcIlwiICsgcGVycy5nZW5kZXIgKyBcIlxcXCI7XCIgKyBjb21tZW50ICsgXCJcXG5cIik7XHJcbiAgfSBlbHNlIHtcclxuICAgIHdzLndyaXRlKFwiMDswOzA7MDs7ICBcXFwiXCIgKyBwZXJzLmdlbmRlciArIFwiXFxcIjtcIiArIGNvbW1lbnQgKyBcIlxcblwiKTtcclxuICB9XHJcbiAgcGVycy5wcmV2RGF0ZUVuZCA9IGNvcHlEYXRlKGRhdGVJZHgpO1xyXG59XHJcblxyXG4vKipcclxuICogVGhpcyBmdW5jdGlvbiBkb2VzIG11dGF0ZSBwZXJzLCB1c2UgYSBjbG9uZSBpZiBub3QgZGVzaXJlZCFcclxuICogQHBhcmFtIHdzXHJcbiAqIEBwYXJhbSBkYXRlSWR4XHJcbiAqIEBwYXJhbSBwZXJzXHJcbiAqIEBwYXJhbSBjb21tZW50XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gd3JpdGVSZWNvcmQwKHdzLCBkYXRlSWR4IDogTG9jYWxEYXRlLCBwZXJzIDogUGVyc29uLCAgY29tbWVudDogc3RyaW5nIClcclxue1xyXG4gIHZhciBzdGFydElkeCA9IGNvcHlEYXRlKGRhdGVJZHgpO1xyXG4gIHZhciBlb20gPSBpc0VPTShkYXRlSWR4KTtcclxuICB3cy53cml0ZShwYWRTcGFjZVEocGVycy51c2VyLDUpKS53cml0ZSgnOycpO1xyXG4gIHdzLndyaXRlKHBhZFNwYWNlUShwZXJzLmxvY2F0aW9uLDIwKSkud3JpdGUoJzsnKTtcclxuICB3cy53cml0ZShwYWRTcGFjZVEocGVycy5FU1RBVCwxKSkud3JpdGUoJzsnKTsgLy8gd2UgYWx3YXlzIHdyaXRlIHRoaXMsIG5lZWRlZCBmb3IgU1RPUCByZWNvcmRzXHJcbiAgd3JpdGVUcmlwZWwod3MsIFwiMC4wXCIsIFwiMC4wXCIsIGZhbHNlKTsgLy8gcGVycy5oaXJlZFNPTSA/IFwiMS4wXCI6IFwiMC4wXCIgLHBlcnMuaGlyZWQgPyBcIjEuMFwiOiBcIjAuMFwiLGlzRU9NKGRhdGVJZHgpKTtcclxuICB2YXIgZGF5c0luUGVyaW9kID0gXCIwLjBcIjsgLy9zdGFydElkeC51bnRpbChkYXRlSWR4KS5kYXlzKCkgKyAxO1xyXG4gIHdzLndyaXRlKHBhZFNwYWNlKDAsMikpLndyaXRlKCc7Jyk7IC8vREFZU1dPUktFRFxyXG4gIHdyaXRlVHJpcGVsKHdzLCB0b0RlYzEoMCksdG9EZWMxKDApLGlzRU9NKGRhdGVJZHgpKTtcclxuICB3cy53cml0ZShwYWRTcGFjZSgwLDQpKS53cml0ZSgnOycpOyAvLyBGVEVXT1JLRURcclxuICB3cy53cml0ZShcIiAwOyAwOyAwO1wiKTtcclxuICAvL3dyaXRlVGVudXJlKHdzLCBkYXRlSWR4LCBwZXJzLCBlb20pOyAvLyBDSEVDSyBXSEVUSEVSIE1FQVNVUkUgT1IgRElNXHJcbiAgd3Mud3JpdGUoXCIgMDsgMDsgMDtcIilcclxuICAvL3dyaXRlQWdlKHdzLCBkYXRlSWR4LCBwZXJzLCBlb20pO1xyXG4gIHdzLndyaXRlKFwiMDtcIik7XHJcbiAgLy9pZihlb20gJiYgcGFycy5SRU9QX0VTVEFUUyAmJiBwYXJzLlJFT1BfRVNUQVRTLmluZGV4T2YocGVycy5FU1RBVCkgPj0gMCkge1xyXG4gIC8vICAgIHdzLndyaXRlKHBhZFNwYWNlKHBlcnMuaGlyZWQsMSkpLndyaXRlKCc7Jyk7XHJcbiAgLy99IGVsc2Uge1xyXG4gIC8vICB3cy53cml0ZSgnMCcpLndyaXRlKCc7Jyk7XHJcbiAgLy99XHJcbiAgd3Mud3JpdGUoXCIwOzA7MDswOzsgIFxcXCJcIiArIHBlcnMuZ2VuZGVyICsgXCJcXFwiO1wiICsgY29tbWVudCArIFwiXFxuXCIpO1xyXG59XHJcblxyXG5cclxuXHJcbi8qKlxyXG4gKiBUaGlzIGZ1bmN0aW9uIGRvZXMgbXV0YXRlIHBlcnMsIHVzZSBhIGNsb25lIGlmIG5vdCBkZXNpcmVkIVxyXG4gKiBAcGFyYW0gd3NcclxuICogQHBhcmFtIGRhdGVJZHhcclxuICogQHBhcmFtIHBlcnNcclxuICogQHBhcmFtIGNvbW1lbnRcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiB3cml0ZVJlY29yZEhJUkUod3MsIGRhdGVJZHggOiBMb2NhbERhdGUsIHBlcnMgOiBQZXJzb24sICBjb21tZW50OiBzdHJpbmcgKVxyXG57XHJcbiAgdmFyIHN0YXJ0SWR4ID0gY29weURhdGUoZGF0ZUlkeCk7XHJcbiAgdmFyIGVvbSA9IGlzRU9NKGRhdGVJZHgpO1xyXG4gIHdzLndyaXRlKHBhZFNwYWNlUShwZXJzLnVzZXIsNSkpLndyaXRlKCc7Jyk7XHJcbiAgd3Mud3JpdGUocGFkU3BhY2VRKHBlcnMubG9jYXRpb24sMjApKS53cml0ZSgnOycpO1xyXG4gIHdzLndyaXRlKHBhZFNwYWNlUShwZXJzLkVTVEFULDEpKS53cml0ZSgnOycpOyAvLyB3ZSBhbHdheXMgd3JpdGUgdGhpcywgbmVlZGVkIGZvciBTVE9QIHJlY29yZHNcclxuICB3cml0ZVRyaXBlbCh3cywgXCIwLjBcIiwgXCIwLjBcIiwgZmFsc2UpOyAvLyBwZXJzLmhpcmVkU09NID8gXCIxLjBcIjogXCIwLjBcIiAscGVycy5oaXJlZCA/IFwiMS4wXCI6IFwiMC4wXCIsaXNFT00oZGF0ZUlkeCkpO1xyXG4gIHZhciBkYXlzSW5QZXJpb2QgPSBcIjAuMFwiOyAvL3N0YXJ0SWR4LnVudGlsKGRhdGVJZHgpLmRheXMoKSArIDE7XHJcbiAgd3Mud3JpdGUocGFkU3BhY2UoMCwyKSkud3JpdGUoJzsnKTsgLy9EQVlTV09SS0VEXHJcbiAgd3JpdGVUcmlwZWwod3MsIHRvRGVjMSgwKSx0b0RlYzEoMCksaXNFT00oZGF0ZUlkeCkpO1xyXG4gIHdzLndyaXRlKHBhZFNwYWNlKDAsNCkpLndyaXRlKCc7Jyk7IC8vIEZURVdPUktFRFxyXG4gIHdzLndyaXRlKFwiIDA7IDA7IDA7XCIpO1xyXG4gIC8vd3JpdGVUZW51cmUod3MsIGRhdGVJZHgsIHBlcnMsIGVvbSk7IC8vIENIRUNLIFdIRVRIRVIgTUVBU1VSRSBPUiBESU1cclxuICB3cy53cml0ZShcIiAwOyAwOyAwO1wiKVxyXG4gIC8vd3JpdGVBZ2Uod3MsIGRhdGVJZHgsIHBlcnMsIGVvbSk7XHJcbiAgd3Mud3JpdGUoXCIwO1wiKTtcclxuICB3cy53cml0ZShcIjE7MDswOzA7XCIgKyBwZXJzLmV2ZW50UmVhc29uICtcIjtcXFwiXCIgKyBwZXJzLmdlbmRlciArIFwiXFxcIjtcIiArIGNvbW1lbnQgKyBcIlxcblwiKTtcclxufVxyXG5cclxuXHJcbi8qKlxyXG4gKiBUaGlzIGZ1bmN0aW9uIGRvZXMgbXV0YXRlIHBlcnMsIHVzZSBhIGNsb25lIGlmIG5vdCBkZXNpcmVkIVxyXG4gKiBAcGFyYW0gd3NcclxuICogQHBhcmFtIGRhdGVJZHhcclxuICogQHBhcmFtIHBlcnNcclxuICogQHBhcmFtIGNvbW1lbnRcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiB3cml0ZVJlY29yZE1PVkVJTih3cywgZGF0ZUlkeCA6IExvY2FsRGF0ZSwgcGVycyA6IFBlcnNvbiwgIGNvbW1lbnQ6IHN0cmluZyApXHJcbntcclxuICB2YXIgc3RhcnRJZHggPSBjb3B5RGF0ZShkYXRlSWR4KTtcclxuICB2YXIgZW9tID0gaXNFT00oZGF0ZUlkeCk7XHJcbiAgd3Mud3JpdGUocGFkU3BhY2VRKHBlcnMudXNlciw1KSkud3JpdGUoJzsnKTtcclxuICB3cy53cml0ZShwYWRTcGFjZVEocGVycy5sb2NhdGlvbiwyMCkpLndyaXRlKCc7Jyk7XHJcbiAgd3Mud3JpdGUocGFkU3BhY2VRKHBlcnMuRVNUQVQsMSkpLndyaXRlKCc7Jyk7IC8vIHdlIGFsd2F5cyB3cml0ZSB0aGlzLCBuZWVkZWQgZm9yIFNUT1AgcmVjb3Jkc1xyXG4gIHdyaXRlVHJpcGVsKHdzLCBcIjAuMFwiLCBcIjAuMFwiLCBmYWxzZSk7IC8vIHBlcnMuaGlyZWRTT00gPyBcIjEuMFwiOiBcIjAuMFwiICxwZXJzLmhpcmVkID8gXCIxLjBcIjogXCIwLjBcIixpc0VPTShkYXRlSWR4KSk7XHJcbiAgdmFyIGRheXNJblBlcmlvZCA9IFwiMC4wXCI7IC8vc3RhcnRJZHgudW50aWwoZGF0ZUlkeCkuZGF5cygpICsgMTtcclxuICB3cy53cml0ZShwYWRTcGFjZSgwLDIpKS53cml0ZSgnOycpOyAvL0RBWVNXT1JLRURcclxuICB3cml0ZVRyaXBlbCh3cywgdG9EZWMxKDApLHRvRGVjMSgwKSxpc0VPTShkYXRlSWR4KSk7XHJcbiAgd3Mud3JpdGUocGFkU3BhY2UoMCw0KSkud3JpdGUoJzsnKTsgLy8gRlRFV09SS0VEXHJcbiAgd3Mud3JpdGUoXCIgMDsgMDsgMDtcIik7XHJcbiAgLy93cml0ZVRlbnVyZSh3cywgZGF0ZUlkeCwgcGVycywgZW9tKTsgLy8gQ0hFQ0sgV0hFVEhFUiBNRUFTVVJFIE9SIERJTVxyXG4gIHdzLndyaXRlKFwiIDA7IDA7IDA7XCIpXHJcbiAgLy93cml0ZUFnZSh3cywgZGF0ZUlkeCwgcGVycywgZW9tKTtcclxuICB3cy53cml0ZShcIjA7XCIpO1xyXG4gIHdzLndyaXRlKFwiMDswOzE7MDtcIiArIHBhZFNwYWNlUShwZXJzLmV2ZW50UmVhc29uLDUpICtcIjtcXFwiXCIgKyBwZXJzLmdlbmRlciArIFwiXFxcIjtcIiArIGNvbW1lbnQgKyBcIlxcblwiKTtcclxufVxyXG5cclxuZnVuY3Rpb24gd3JpdGVTdGF0ZUxpbmVSQU5HRSh3cywgZGF0ZUlkeCA6IExvY2FsRGF0ZSwgcGVycyA6IFBlcnNvbiwgbmV4dEhpcmUsIG5leHRMb2MsIG5leHRGVEUsIGNvbW1lbnQ6c3RyaW5nKSB7XHJcbiAgaWYod3MgPT0gdW5kZWZpbmVkKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogV3JpdGUgYSBzdGF0ZSBsaW5lIGZvciBNb250aGx5IGFnZ3JlZ2F0ZXMsIHRoaXMgaXMgZS5nLiB0aGUgRW5kLW9mIG1vbnRoIHJlY29yZC5cclxuICogQHBhcmFtIHdzXHJcbiAqIEBwYXJhbSBkYXRlSWR4XHJcbiAqIEBwYXJhbSBwZXJzXHJcbiAqIEBwYXJhbSBuZXh0SGlyZVxyXG4gKiBAcGFyYW0gbmV4dExvY1xyXG4gKiBAcGFyYW0gbmV4dEZURVxyXG4gKiBAcGFyYW0gY29tbWVudFxyXG4gKi9cclxuZnVuY3Rpb24gd3JpdGVTdGF0ZUxpbmVNT05BRyh3cyxkYXRlSWR4IDogTG9jYWxEYXRlLCBwZXJzIDogUGVyc29uLCBuZXh0SGlyZSwgbmV4dExvYywgbmV4dEZURSwgcGFyczogR2VuUGFyYW1zLCBjb21tZW50OnN0cmluZykge1xyXG4gIHdyaXRlRGF5KHdzLCBwZXJzLnByZXZEYXRlRW5kLCBkYXRlSWR4KTtcclxuICBwZXJzLmxvY2F0aW9uID0gbmV4dExvYyB8fCBwZXJzLmxvY2F0aW9uO1xyXG4gIHBlcnMuZnRlID0gbmV4dEZURSB8fCBwZXJzLmZ0ZTtcclxuICAvL3BlcnMubGFzdFdyaXR0ZW4gPSBkYXRlSWR4O1xyXG4gIHdyaXRlUmVjb3JkKHdzLCBkYXRlSWR4LCBwZXJzLCBwYXJzLCBcInN0XCIgKyBjb21tZW50KTtcclxuICBtZW1vcml6ZVNPTShkYXRlSWR4LHBlcnMpO1xyXG4gIGlmKG5leHRIaXJlICE9IHBlcnMuaGlyZWQpIHtcclxuICAgIHdzLndyaXRlKFwiTkVWRVJcXG5cIilcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzVW5oaXJlZENoYW5nZShwZXJzOiBQZXJzb24sIG5leHRIaXJlLCBuZXh0TG9jLCBuZXh0RlRFLCBuZXh0RVNUQVQpIHtcclxuICByZXR1cm4gIChuZXh0SGlyZSAhPSBwZXJzLmhpcmVkKVxyXG4gICAgICAgfHwgKCBuZXh0TG9jICE9IHBlcnMubG9jYXRpb24gKVxyXG4gICAgICAgfHwgKCBuZXh0RlRFICE9IHBlcnMuZnRlIClcclxuICAgICAgIHx8ICggbmV4dEVTVEFUICE9IHBlcnMuRVNUQVQgKTtcclxufVxyXG5cclxuZnVuY3Rpb24gaXNBQ2hhbmdlKHBlcnM6IFBlcnNvbiwgbmV4dEhpcmUsIG5leHRMb2MsIG5leHRGVEUsIG5leHRFU1RBVCkge1xyXG4gIHJldHVybiAgKG5leHRIaXJlICE9IHBlcnMuaGlyZWQpXHJcbiAgICAgICB8fCAocGVycy5oaXJlZCAmJiBuZXh0TG9jICE9IHBlcnMubG9jYXRpb24gKVxyXG4gICAgICAgfHwgKHBlcnMuaGlyZWQgJiYgbmV4dEZURSAhPSBwZXJzLmZ0ZSApXHJcbiAgICAgICB8fCAocGVycy5oaXJlZCAmJiBuZXh0RVNUQVQgIT0gcGVycy5FU1RBVCApO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpc0hJUkUoIHBlcnM6IFBlcnNvbiAsIG5leHRIaXJlICkge1xyXG4gIHJldHVybiBwZXJzLmhpcmVkID09IDAgJiYgbmV4dEhpcmUgPT0gMTtcclxufVxyXG5mdW5jdGlvbiBpc1RFUk0oIHBlcnM6IFBlcnNvbiAsIG5leHRIaXJlICkge1xyXG4gIHJldHVybiBwZXJzLmhpcmVkID09IDEgJiYgbmV4dEhpcmUgPT0gMDtcclxufVxyXG5cclxuZnVuY3Rpb24gY2xvc2VQcmV2aW91c1JhbmdlKHdzLCBkYXRlSWR4OkxvY2FsRGF0ZSwgcGVyczogUGVyc29uLCBwYXJzIDogR2VuUGFyYW1zLCBjb21tZW50OiBzdHJpbmcpIHtcclxuICB2YXIgZG1pbjEgPSBjb3B5RGF0ZShkYXRlSWR4KS5taW51c0RheXMoMSk7XHJcbiAgd3JpdGVEYXkod3MsIHBlcnMucHJldkRhdGVFbmQsIGRtaW4xKTtcclxuICB3cml0ZVJlY29yZCh3cywgZG1pbjEsIHBlcnMsIHBhcnMsIGNvbW1lbnQpO1xyXG59XHJcblxyXG5mdW5jdGlvbiB3cml0ZUNoYW5nZUxpbmVSQU5HRSh3cywgZGF0ZUlkeCA6IExvY2FsRGF0ZSwgcGVyczogUGVyc29uLCBuZXh0SGlyZSwgbmV4dExvYywgbmV4dEZURSwgbmV4dEVTVEFULCBwYXJzIDogR2VuUGFyYW1zLCBjb21tZW50OnN0cmluZykge1xyXG4gIGlmKCB3cyA9PSB1bmRlZmluZWQpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgdmFyIGlzQ2hhbmdlID0gaXNBQ2hhbmdlKHBlcnMsbmV4dEhpcmUsbmV4dExvYyxuZXh0RlRFLG5leHRFU1RBVCk7XHJcbiAgaWYgKCAhaXNDaGFuZ2UgJiYgIWlzRU9NKGRhdGVJZHgpKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIC8vIGF0IGRhdGVJZHggdGhlIHBlcnNvbiBzdGF0ZSBjaGFuZ2VzIHRvIG5ldyBzdGF0ZS5cclxuICAvLyBjbG9uZSB0aGUgb2JqZWN0XHJcbiAgdmFyIG5leHRQZXJzID0gXy5jbG9uZURlZXAocGVycyk7XHJcbiAgbmV4dFBlcnMucHJldkRhdGVFbmQgPSBjb3B5RGF0ZShuZXh0UGVycy5wcmV2UmFuZ2VFbmQpOyAvLyEhIVxyXG4gIC8vcGVycyA9IHVuZGVmaW5lZDtcclxuICB2YXIgaXN0ZXJtID0gaXNURVJNKG5leHRQZXJzLCBuZXh0SGlyZSk7XHJcbiAgaWYgKCBpc3Rlcm0gKSB7XHJcbiAgICAvLyBjbG9zZSBwcmV2aW91cyByZWNvcmRcclxuICAgIGNsb3NlUHJldmlvdXNSYW5nZSh3cywgZGF0ZUlkeCwgbmV4dFBlcnMsIHBhcnMsICBcInRlcm1jbG9zZS0xQFwiICsgIGRhdGVJZHggKyAnICcgKyAgY29tbWVudCk7XHJcbiAgICBwZXJzLnByZXZSYW5nZUVuZCA9IGNvcHlEYXRlKGRhdGVJZHgpLm1pbnVzRGF5cygxKTtcclxuICB9IGVsc2UgaWYgKCBpc0hJUkUobmV4dFBlcnMsbmV4dEhpcmUpKSB7XHJcbiAgICAvL25leHRQZXJzLmxhc3RIaXJlZCA9IGRhdGVJZHg7XHJcbiAgICBwZXJzLnByZXZSYW5nZUVuZCA9IGNvcHlEYXRlKGRhdGVJZHgpLm1pbnVzRGF5cygxKTsgLy8gU0VUIFRISVMhXHJcbiAgICAvLyBkbyBub3RoaW5nLCB3aWxsIGJlIGNhcHR1cmVkIG5leHRcclxuICB9IGVsc2Uge1xyXG4gICAgLy8gY2xvc2UgcHJldmlvdXMgcmVjb3JkLCBhbHdheXNcclxuICAgIHZhciBkbWluMSA9IGNvcHlEYXRlKGRhdGVJZHgpLm1pbnVzRGF5cygxKTtcclxuICAgIHdyaXRlRGF5KHdzLCBuZXh0UGVycy5wcmV2RGF0ZUVuZCwgZG1pbjEpO1xyXG4gICAgd3JpdGVSZWNvcmQod3MsIGRtaW4xLCBuZXh0UGVycyAsIHBhcnMsIFwicGVyY2xvc2UtMSBmcm9tIFwiICsgZGF0ZUlkeCArICcgJyArICBjb21tZW50KTtcclxuICAgIHBlcnMucHJldlJhbmdlRW5kID0gY29weURhdGUoZGF0ZUlkeCkubWludXNEYXlzKDEpO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gaXNTdG9wUmVjb3Jkc1JlcXVlc3RlZChwYXJzOiBHZW5QYXJhbXMpIHtcclxuICByZXR1cm4gKCBwYXJzLm9wdHNNT05BRyAmJiBwYXJzLm9wdHNNT05BRy5zdG9wUmVjb3Jkcyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzTm9aZXJvUmVxdWVzdGVkKHBhcnM6IEdlblBhcmFtcykge1xyXG4gIHJldHVybiAoIHBhcnMub3B0c01PTkFHICYmIHBhcnMub3B0c01PTkFHLm5vWmVybyk7XHJcbn1cclxuXHJcbi8vIHdlIHdyaXRlIGEgcmVjb3JkIHdpdGggYWxsIG1lYXN1cmVzIHplcm8gKG9yIG51bGw/KVxyXG5mdW5jdGlvbiB3cml0ZVNUT1BSZWNvcmRBZnRlcih3cywgcGVycyA6IFBlcnNvbiwgZCA6IExvY2FsRGF0ZSwgcGFyczogR2VuUGFyYW1zLCBjb21tZW50IDogc3RyaW5nICkge1xyXG4gIHdyaXRlRGF5KHdzLCBkLCBkKTsgLy8gW2QtZF07XHJcbiAgd3JpdGVSZWNvcmQwKHdzLCBkLCBwZXJzLCBjb21tZW50KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFN0cmluZ0J1aWxkZXIoKSA6IGFueSB7XHJcbiAgY2xhc3MgT2JqICB7XHJcbiAgICBzOiBzdHJpbmc7XHJcbiAgICBjb25zdHJ1Y3RvcigpXHJcbiAgICB7XHJcbiAgICAgIHRoaXMucyA9ICcnO1xyXG4gICAgfVxyXG4gICAgd3JpdGUoYSkge1xyXG4gICAgICB0aGlzLnMgKz0gJycgKyBhO1xyXG4gICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICAgIHRvU3RyaW5nKCkge1xyXG4gICAgICByZXR1cm4gJycrIHRoaXMucztcclxuICAgIH1cclxuICB9O1xyXG4gIHJldHVybiBuZXcgT2JqKCk7XHJcbn1cclxuXHJcblxyXG4vLyB0aGVyZSBpcyBhIGNoYW5nZSBAZGF0ZSAsIG5ldyB2YWx1ZXMgYXJlIHRvIHRoZSByaWdodDtcclxuLy8gdGhpcyBpIGNhbGxlZCBvbiBhIGNoYW5nZSBpbiB2YWx1ZXMuXHJcbmZ1bmN0aW9uIHdyaXRlQ2hhbmdlTGluZU1PTkFHKHdzLCBkYXRlSWR4IDogTG9jYWxEYXRlLCBwZXJzIDpQZXJzb24sIG5leHRIaXJlLCBuZXh0TG9jLCBuZXh0RlRFLCBuZXh0RVNUQVQsIHBhcnMgOiBHZW5QYXJhbXMsIGNvbW1lbnQ6c3RyaW5nKSB7XHJcbiAgdmFyIGlzQ2hhbmdlID0gaXNBQ2hhbmdlKHBlcnMsIG5leHRIaXJlLCBuZXh0TG9jLCBuZXh0RlRFLCBuZXh0RVNUQVQpO1xyXG4gIGlmICggIWlzQ2hhbmdlICYmICFpc0VPTShkYXRlSWR4KSkge1xyXG4gICAgcGVycy5sb2NhdGlvbiA9IG5leHRMb2M7XHJcbiAgICAvL3BlcnMubmV4dEZURSA9IG5leHRGVEU7ICAvLy8gVE9ETyBGSVghXHJcbiAgICBwZXJzLkVTVEFUID0gbmV4dEVTVEFUO1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICB2YXIgaXN0ZXJtID0gaXNURVJNKHBlcnMsIG5leHRIaXJlKTtcclxuICBpZiAoIGlzdGVybSApIHtcclxuICAgIC8vIGNsb3NlIHByZXZpb3VzIHJlY29yZFxyXG4gICAgaWYgKGRhdGVJZHguZGF5T2ZNb250aCgpICE9IDEpIHsgLy8gdW5sZXNzIHdlIGFscmVhZHkgY2xvc2VkIGl0IGJ5IGEgbW9udGggcmVjb3JkXHJcbiAgICAgIHZhciBkbWluMSA9IGNvcHlEYXRlKGRhdGVJZHgpLm1pbnVzRGF5cygxKTtcclxuICAgICAgd3JpdGVEYXkod3MsIHBlcnMucHJldkRhdGVFbmQsIGRtaW4xKTtcclxuICAgICAgd3JpdGVSZWNvcmQod3MsIGRtaW4xLCBwZXJzLCBwYXJzLCBcInRlcm1jbG9zZS0xQFwiICsgIGRhdGVJZHggKyAnICcgKyBjb21tZW50KTtcclxuICAgICAgbWVtb3JpemVTT00oZG1pbjEscGVycyk7XHJcbiAgICB9XHJcbiAgICAvLyBhbHdheXMgd3JpdGUgYSBzdG9wIHJlY29yZCBpZiByZXF1aXJlZFxyXG4gICAgaWYgKCBpc1N0b3BSZWNvcmRzUmVxdWVzdGVkKHBhcnMpKSB7XHJcbiAgICAgIHdyaXRlU1RPUFJlY29yZEFmdGVyKHdzLHBlcnMsZGF0ZUlkeCwgcGFycywgIFwic3RvcEFmdGVybUBcIiArICBkYXRlSWR4ICsgJyAnICsgY29tbWVudCk7XHJcbiAgICB9XHJcbiAgICBwZXJzLmhpcmVkID0gMDtcclxuICAgIHBlcnMuaGlyZWRQcmV2ID0gMDtcclxuICAgIC8vcGVycy5sYXN0VGVybSA9IGRhdGVJZHg7XHJcbiAgfSBlbHNlIGlmICggaXNISVJFKHBlcnMsbmV4dEhpcmUpKSB7XHJcbiAgICAgICAvLyB3cml0ZSBISVJFIGV2ZW50IGxpbmUgLT5cclxuICAgICAgIHBlcnMubGFzdEhpcmVkID0gZGF0ZUlkeDtcclxuICAgICAgIHBlcnMucHJldkRhdGVFbmQgPSBjb3B5RGF0ZShkYXRlSWR4KS5taW51c0RheXMoMSk7XHJcbiAgICAgICAvLyBhZGRlZFxyXG4gICAgICAgcGVycy5mdGVQcmV2ID0gcGVycy5mdGU7XHJcbiAgICAgICBwZXJzLmhpcmVkUHJldiA9IDE7XHJcbiAgICBpZiAoIHBhcnMub3B0c01PTkFHLnN0YXJ0UmVjb3JkcyApIHtcclxuICAgICAgdmFyIGRwMSA9IGNvcHlEYXRlKGRhdGVJZHgpLnBsdXNEYXlzKDIpO1xyXG4gICAgICB3cml0ZURheSh3cywgZHAxLCBkYXRlSWR4ICk7XHJcbiAgICAgIHBlcnMuaGlyZWQgPSBuZXh0SGlyZTtcclxuICAgICAgcGVycy5sb2NhdGlvbiA9IG5leHRMb2M7XHJcbiAgICAgIHBlcnMuZnRlID0gbmV4dEZURTtcclxuICAgICAgd3JpdGVSZWNvcmRISVJFKHdzLCBkYXRlSWR4LCBwZXJzLCBcImhpcmVAXCIgKyBkYXRlSWR4ICsgJyAnICsgY29tbWVudCk7XHJcbiAgICB9XHJcbiAgICAvLyBkbyBub3RoaW5nLCB3aWxsIGJlIGNhcHR1cmVkIG5leHRcclxuICB9IGVsc2Uge1xyXG4gICAgLy8gY2xvc2UgcHJldmlvdXMgcmVjb3JkXHJcbiAgICBpZiAoIGRhdGVJZHguZGF5T2ZNb250aCgpICE9IDEpIHtcclxuICAgICAgLy8gdW5sZXNzIHdlIGFscmVhZHkgY2xvc2VkIGl0IGJ5IGEgbW9udGggcmVjb3JkXHJcbiAgICAgIHZhciBkbWluMSA9IGNvcHlEYXRlKGRhdGVJZHgpLm1pbnVzRGF5cygxKTtcclxuICAgICAgd3JpdGVEYXkod3MsIHBlcnMucHJldkRhdGVFbmQsIGRtaW4xKTtcclxuICAgICAgd3JpdGVSZWNvcmQod3MsIGRtaW4xLCBwZXJzLCBwYXJzLCBcInByZXZjbG9zZSBmcm9tIFwiICsgZGF0ZUlkeCArICcgJysgIGNvbW1lbnQpO1xyXG4gICAgICBtZW1vcml6ZVNPTShkbWluMSxwZXJzKTtcclxuICAgIH1cclxuICAgIC8vIGFsd2F5cyB3cml0ZSBhIHN0b3AgcmVjb3JkIGlmIHJlcWVzdGVkXHJcbiAgICBpZiAoIGlzU3RvcFJlY29yZHNSZXF1ZXN0ZWQocGFycykpIHtcclxuICAgICAgd3JpdGVTVE9QUmVjb3JkQWZ0ZXIod3MscGVycyxkYXRlSWR4LCBwYXJzLCAgXCJzdG9wQWZ0ZXZlQFwiICsgIGRhdGVJZHggKyAnICcgKyBjb21tZW50KTtcclxuICAgIH1cclxuICAgIGlmICggcGFycy5vcHRzTU9OQUcuc3RhcnRSZWNvcmRzICYmIHBlcnMuaGlyZWQpIHtcclxuICAgICAgdmFyIGRwMSA9IGNvcHlEYXRlKGRhdGVJZHgpLnBsdXNEYXlzKDIpO1xyXG4gICAgICB3cml0ZURheSh3cywgZHAxLCBkYXRlSWR4ICk7XHJcbiAgICAgIHBlcnMuaGlyZWQgPSBuZXh0SGlyZTtcclxuICAgICAgcGVycy5sb2NhdGlvbiA9IG5leHRMb2M7XHJcbiAgICAgIHBlcnMuZnRlID0gbmV4dEZURTtcclxuICAgICAgd3JpdGVSZWNvcmRNT1ZFSU4od3MsIGRhdGVJZHgsIHBlcnMsIFwibW92ZWluQFwiICsgZGF0ZUlkeCArICcgJyArIGNvbW1lbnQpO1xyXG4gICAgfVxyXG4gIH1cclxuICBwZXJzLmhpcmVkID0gbmV4dEhpcmU7XHJcbiAgcGVycy5sb2NhdGlvbiA9IG5leHRMb2M7XHJcbiAgcGVycy5mdGUgPSBuZXh0RlRFO1xyXG4gIGlmIChpc0VPTShkYXRlSWR4KSkge1xyXG4gICAgLy8gbGF0ZXIgc3VwcHJlc3MgdW5sZXNzIGxhc3RUZXJtIHdpdGhpbiByYW5nZVxyXG4gICAgaWYgKCAhaXNOb1plcm9SZXF1ZXN0ZWQocGFycykgfHwgIWlzQWxsWmVybyhwZXJzKSkge1xyXG4gICAgICB3cml0ZVN0YXRlTGluZU1PTkFHKHdzLGRhdGVJZHgscGVycywgcGVycy5oaXJlZCwgcGVycy5sb2NhdGlvbiwgcGVycy5mdGUsIHBhcnMsIFwiV0NMXCIpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLyBwZXJjZW50YWdlc1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGlzSGlyZUNoYW5nZShwYXJzIDogR2VuUGFyYW1zKSA6IGJvb2xlYW4ge1xyXG4gIHJldHVybiBwYXJzLnJhbmRvbS5yYW5kb20oKSA8IHBhcnMuTF9ISVJFO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRET0IocGFycyA6IEdlblBhcmFtcykgOiBMb2NhbERhdGUge1xyXG5cclxuICB2YXIgeWVhciA9IDE5NTAgKyBNYXRoLmZsb29yKHBhcnMucmFuZG9tLnJhbmRvbSgpKjU1KTtcclxuICB2YXIgbW9udGggPSBNYXRoLmZsb29yKHBhcnMucmFuZG9tLnJhbmRvbSgpKjEyKTtcclxuICB2YXIgZGF5YmFzZSA9IE1hdGguZmxvb3IocGFycy5yYW5kb20ucmFuZG9tKCkqMzEpO1xyXG4gIHJldHVybiBMb2NhbERhdGUub2YoeWVhciwxK21vbnRoLCAxKS5wbHVzRGF5cyhkYXliYXNlIC0gMSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZW5QZXJzb24ocCwgcGFyczogR2VuUGFyYW1zKSB7XHJcblx0dmFyIHBlcnMgPSB7XHJcbiAgICB1c2VyIDogcCxcclxuICAgIGhpcmVkOiAwLFxyXG4gICAgaGlyZWRQcmV2IDogMCxcclxuICAgIGZ0ZSA6IDEsXHJcbiAgICBmdGVQcmV2IDogMCxcclxuICAgIGRvYiA6IGdldERPQihwYXJzKSxcclxuICAgIGxvY2F0aW9uIDogZ2V0TG9jYXRpb24ocGFycyksXHJcbiAgICBwcmV2RGF0ZUVuZCA6IHBhcnMuZmlyc3REYXRlLFxyXG4gICAgcHJldlJhbmdlRW5kIDogcGFycy5maXJzdERhdGUsXHJcbiAgICBoaXJlZFNPTSA6IDAsXHJcbiAgICBsYXN0SGlyZWQgOiBwYXJzLmZpcnN0RGF0ZSxcclxuICAgIGZ0ZVNPTSA6IDAsXHJcbiAgICBFU1RBVCA6IFwiQVwiLFxyXG4gICAgRVNUQVRTT00gOiBcIkFcIixcclxuICAgIGV2ZW50UmVhc29uIDogdW5kZWZpbmVkLFxyXG4gICAgZ2VuZGVyIDogZ2V0R2VuZGVyKHBhcnMpXHJcbiAgfSBhcyBQZXJzb247XHJcbiAgdmFyIG5leHREYXRlID0gZ2V0TmV4dChwYXJzKSArIHBhcnMuZmlyc3REYXRlLnRvRXBvY2hEYXkoKTtcclxuICBmb3IodmFyIGkgPSBwYXJzLmZpcnN0RGF0ZS50b0Vwb2NoRGF5KCk7IGkgPD0gcGFycy5sYXN0RGF0ZS50b0Vwb2NoRGF5KCk7ICsraSkge1xyXG4gICAgdmFyIGQgPSBMb2NhbERhdGUub2ZFcG9jaERheShpKTtcclxuICAgIGlmICggaSA9PSBuZXh0RGF0ZSApIHtcclxuICAgICAgaWYoIGlzSGlyZUNoYW5nZShwYXJzKSkge1xyXG4gICAgICAgLy8gd3JpdGVDaGFuZ2VMaW5lTU9OQUcocGFycy53c01PTkFHLCBkLHBlcnMsIHBlcnMuaGlyZWQgPyAwIDogMSwgbmV4dExvY2F0aW9uKHBhcnMscGVycyksIG5leHRGVEUocGFycyxwZXJzKSAgLCBcIkhDXCIpO1xyXG4gICAgICAgIC8vK1xyXG4gICAgICAgIC8vIE9SREVSIElTIENSVUNJQUwhXHJcbiAgICAgICAgcGVycy5ldmVudFJlYXNvbiA9IGdldEhpcmVUZXJtRXZlbnRSZWFzb24ocGFycywgcGVycy5oaXJlZCk7XHJcbiAgICAgICAgcGVycy5sYXN0RXZlbnREYXRlID0gZDtcclxuICAgICAgICB2YXIgbmwgPSBuZXh0TG9jYXRpb24ocGFycyxwZXJzKTtcclxuICAgICAgICB2YXIgbmYgPSBuZXh0RlRFKHBhcnMscGVycyk7XHJcbiAgICAgICAgdmFyIG5FU1RBVCA9IGdldE5leHRFU1RBVChwYXJzLHBlcnMsXCJFU1RBVFwiKTtcclxuICAgICAgICB3cml0ZUNoYW5nZUxpbmVSQU5HRShwYXJzLndzUkFOR0UsIGQsIHBlcnMsIHBlcnMuaGlyZWQgPyAwIDogMSwgbmwsIG5mLCBuRVNUQVQsICBwYXJzLCBcIkhDXCIpO1xyXG4gICAgICAgIHdyaXRlQ2hhbmdlTGluZU1PTkFHKHBhcnMud3NNT05BRywgZCwgcGVycywgcGVycy5oaXJlZCA/IDAgOiAxLCBubCwgbmYsIG5FU1RBVCwgcGFycywgXCJIQ1wiKTtcclxuICAgICAgICBuZXh0RGF0ZSArPSBnZXROZXh0KHBhcnMpO1xyXG4gICAgICB9IGVsc2UgaWYgKGlzRXZlbnQocGFycykpIHtcclxuICAgICAgICB2YXIgbmwgPSBuZXh0TG9jYXRpb24ocGFycywgcGVycyk7XHJcbiAgICAgICAgLy8gZm9yY2VcclxuICAgICAgICB2YXIgbmYgPSBuZXh0RlRFKHBhcnMsIHBlcnMpO1xyXG4gICAgICAgIHZhciBuRVNUQVQgPSBnZXROZXh0RVNUQVQocGFycyxwZXJzLFwiRVNUQVRcIik7XHJcbiAgICAgICAgd2hpbGUoICFpc1VuaGlyZWRDaGFuZ2UocGVycyxwZXJzLmhpcmVkLCBubCxuZiwgbkVTVEFUKSkge1xyXG4gICAgICAgICAgbmwgPSBuZXh0TG9jYXRpb24ocGFycywgcGVycyk7XHJcbiAgICAgICAgICAvLyBmb3JjZVxyXG4gICAgICAgICAgbmYgPSBuZXh0RlRFKHBhcnMsIHBlcnMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwZXJzLmxhc3RFdmVudERhdGUgPSBkO1xyXG4gICAgICAgIHBlcnMuZXZlbnRSZWFzb24gPSBnZXRPdGhlckV2ZW50UmVhc29uKHBhcnMsIHBlcnMsIG5sKTtcclxuICAgICAgICB3cml0ZUNoYW5nZUxpbmVSQU5HRShwYXJzLndzUkFOR0UsIGQsIHBlcnMsIHBlcnMuaGlyZWQsIG5sLCBuZiwgbkVTVEFULCBwYXJzLCBcIkxDXCIpO1xyXG4gICAgICAgIHdyaXRlQ2hhbmdlTGluZU1PTkFHKHBhcnMud3NNT05BRywgZCwgcGVycywgcGVycy5oaXJlZCwgbmwsIG5mLCBuRVNUQVQsIHBhcnMsIFwiTENcIiApO1xyXG4gICAgICAgIG5leHREYXRlICs9IGdldE5leHQocGFycyk7XHJcbiAgICAgIH0gZWxzZSBpZiAoaXNFT00oZCkpIHtcclxuICAgICAgICAgIHdyaXRlU3RhdGVMaW5lTU9OQUcocGFycy53c01PTkFHLCBkLCBwZXJzLCBwZXJzLmhpcmVkLCBwZXJzLmxvY2F0aW9uLCBwZXJzLmZ0ZSwgcGFycywgXCJFT01lXCIpO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKGlzRU9NKGQpKSB7XHJcbiAgICAgIC8vaWYoIHBlcnMuaGlyZWQgPiAwICkge1xyXG4gICAgICAgIGlmICggIWlzTm9aZXJvUmVxdWVzdGVkKHBhcnMpIHx8ICFpc0FsbFplcm8ocGVycykpIHtcclxuICAgICAgICAgIHdyaXRlU3RhdGVMaW5lTU9OQUcocGFycy53c01PTkFHLCBkLCBwZXJzLCBwZXJzLmhpcmVkLCBwZXJzLmxvY2F0aW9uLCBwZXJzLmZ0ZSwgcGFycywgXCJFT01cIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAvL31cclxuICAgICAgLy8gZWxzZSB7XHJcbiAgICAgICAgbWVtb3JpemVTT00oZCxwZXJzKTtcclxuICAgICAgLy99XHJcbiAgICB9XHJcblx0fTtcclxufVxyXG5cclxuXHJcbnZhciBwcmltZXMgID0gW107XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWF4UHJpbWVzKG5yOiBudW1iZXIpIDogbnVtYmVyIHtcclxuICB2YXIgbWF4ID0gTWF0aC5mbG9vcihNYXRoLnNxcnQobnIpKzMpO1xyXG4gIHZhciBtcCA9IDE7XHJcbiAgdmFyIHJlbWFpbiA9IG5yO1xyXG4gIGZvcih2YXIgaSA9IDE7IGkgPD0gbWF4OyArK2kgKSB7XHJcbiAgICBpZiAocmVtYWluID09IDEpIHtcclxuICAgICAgcmV0dXJuIG1wO1xyXG4gICAgfVxyXG4gICAgd2hpbGUoaSA+IDEgJiYgIChyZW1haW4gJSBpID09IDApKSB7XHJcbiAgICAgIG1wID0gTWF0aC5tYXgobXAsaSk7XHJcbiAgICAgIHJlbWFpbiA9IHJlbWFpbi9pO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gcmVtYWluO1xyXG59XHJcblxyXG5cclxuXHJcbmZ1bmN0aW9uIGlzRGlnaXQoY2hhciA6IHN0cmluZykge1xyXG4gIHJldHVybiBcIjAxMjM0NTY3ODlcIi5pbmRleE9mKGNoYXIpID49IDA7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpc0xpbmVTdGFydGluZ1dpdGhEaWdpdChsaW5lIDogc3RyaW5nKSB7XHJcbiAgdmFyIGxpbmVzID0gJycrbGluZTtcclxuICByZXR1cm4gbGluZXMubGVuZ3RoID4gMCAmJiAgaXNEaWdpdChsaW5lcy5jaGFyQXQoMCkpO1xyXG59XHJcblxyXG5jb25zdCByZSA9IG5ldyBSZWdFeHAoIC9eKC4qKTsoXFxkezR9LVxcZHsyfS1cXGR7Mn0pOyhcXGR7NH0tXFxkezJ9LVxcZHsyfSk7KC4qKSQvKTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpc0RhdGVMaW5lKGxpbmUgOiBzdHJpbmcpIDogYm9vbGVhbiB7XHJcbiAgcmV0dXJuICEhcmUuZXhlYyhsaW5lKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHNwbGl0RGF0ZUxpbmUobGluZSA6IHN0cmluZykgOiBzdHJpbmdbXSB7XHJcbiAgdmFyIHJlcyA9IHJlLmV4ZWMobGluZSk7XHJcbiAgLy9jb25zb2xlLmxvZyhyZXMpO1xyXG4gIHJldHVybiBbcmVzWzFdLHJlc1syXSxyZXNbM10scmVzWzRdXTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJlSW5kZXhMaW5lKGxpbmUgOiBzdHJpbmcpIHtcclxuICB2YXIgaXNEYXRlTG4gPSBsaW5lICYmIGlzRGF0ZUxpbmUoJycgKyBsaW5lKTtcclxuICBpZiAoIGlzRGF0ZUxuICkge1xyXG4gICAgdmFyIGxpbmUgPSAnJytsaW5lO1xyXG4gICAgdmFyIHRhZ3MgPSBzcGxpdERhdGVMaW5lKGxpbmUpO1xyXG4gICAgdmFyIHByZXZEYXRlRW5kID0gTG9jYWxEYXRlLnBhcnNlKHRhZ3NbMV0pLm1pbnVzRGF5cygxKTtcclxuICAgIHZhciBkYXRlSWR4ID0gTG9jYWxEYXRlLnBhcnNlKHRhZ3NbMl0pO1xyXG4gICAgdmFyIHNiID0gZ2V0U3RyaW5nQnVpbGRlcigpO1xyXG4gICAgd3JpdGVEYXkoc2IsIHByZXZEYXRlRW5kLCBkYXRlSWR4KTtcclxuICAgIHNiLndyaXRlKHRhZ3NbM10pO1xyXG4gICAgcmV0dXJuIHNiLnRvU3RyaW5nKCk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiAnJyArIGxpbmU7XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogQWxzbyBzdHJpcHMgY29tbWVudHMgbGluZXMgd2l0aCAjXHJcbiAqIEBwYXJhbSBmaWxlbmFtZTFcclxuICogQHBhcmFtIGZpbGVuYW1lMlxyXG4gKiBAcGFyYW0gZG9uZVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHJlSW5kZXhUaW1lKGZpbGVuYW1lMTogc3RyaW5nLCBmaWxlbmFtZTIgOiBzdHJpbmcsIGRvbmUgOiBhbnkgKSA6IGFueSB7XHJcbiAgdmFyIHdzT3V0ID0gZ2V0V1MoZmlsZW5hbWUyKTtcclxuICBjb25zdCBsaW5lciA9IG5ldyBsaW5lQnlMaW5lKGZpbGVuYW1lMSk7XHJcbiAgdmFyIGxpbmUgPSBcIlwiO1xyXG4gIHdoaWxlKCBsaW5lID0gbGluZXIubmV4dCgpICkge1xyXG4gICAgbGluZSA9IHJlSW5kZXhMaW5lKGxpbmUpO1xyXG4gICAgd3NPdXQud3JpdGUobGluZSArICdcXG4nKTtcclxuICB9XHJcbiAgd3NPdXQud3Mub24oJ2ZpbmlzaCcsICgpID0+IHsgZG9uZSgpOyB9KTtcclxuICB3c091dC53cy5lbmQoKTtcclxufVxyXG5cclxuXHJcblxyXG4vKipcclxuICogQWxzbyBzdHJpcHMgY29tbWVudHMgbGluZXMgd2l0aCAjXHJcbiAqIEBwYXJhbSBmaWxlbmFtZTFcclxuICogQHBhcmFtIGZpbGVuYW1lMlxyXG4gKiBAcGFyYW0gZG9uZVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGNsZWFuc2VXU0NvbW1lbnRzUmVwZWF0ZWRIZWFkZXJJbkZpbGUoZmlsZW5hbWUxOiBzdHJpbmcsIGFkZERhdGE6IGJvb2xlYW4sIHNhbXBsZXMgOiBzdHJpbmdbXSwgZmlsZW5hbWUyIDogc3RyaW5nLCBkb25lIDogYW55ICkgOiBhbnkge1xyXG4gIHZhciB3c091dCA9IGdldFdTKGZpbGVuYW1lMik7XHJcbiAgdmFyIGZpcnN0ID0gdHJ1ZTtcclxuICBpZiAoIGFkZERhdGEgKSB7XHJcbiAgICBzYW1wbGVzLmZvckVhY2goIHNuID0+IHtcclxuICAgICAgY29uc29sZS5sb2coJyBhcHBlbmRpbmcgJyArIHNuKTtcclxuICAgICAgYXBwZW5kQ2xlYW5zaW5nKHNuLCBmaXJzdCwgd3NPdXQsIHRydWUpO1xyXG4gICAgICBmaXJzdCA9IGZhbHNlO1xyXG4gICAgfSk7XHJcbiAgfVxyXG4gIGFwcGVuZENsZWFuc2luZyhmaWxlbmFtZTEsIGZpcnN0LCB3c091dCwgZmFsc2UpO1xyXG4gIHdzT3V0LndzLm9uKCdmaW5pc2gnLCAoKSA9PiB7IGRvbmUoKTsgfSk7XHJcbiAgd3NPdXQud3MuZW5kKCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBhcHBlbmRDbGVhbnNpbmcoZmlsZW5hbWUxOiBzdHJpbmcsIGlzRmlyc3RGaWxlOiBib29sZWFuLCB3c091dDogYW55LCByZWluZGV4OiBib29sZWFuKSA6IGFueSB7XHJcbiAgY29uc3QgbGluZXIgPSBuZXcgbGluZUJ5TGluZShmaWxlbmFtZTEpO1xyXG4gIHZhciBsaW5lID0gXCJcIjtcclxuICB2YXIgbnIgPSAwO1xyXG4gIHdoaWxlKCBsaW5lID0gbGluZXIubmV4dCgpICl7XHJcbiAgICB2YXIgaXNEYXRhTGluZSA9IGxpbmUgJiYgaXNMaW5lU3RhcnRpbmdXaXRoRGlnaXQobGluZSk7XHJcbiAgICB2YXIgaXNDb21tZW50TGluZSA9IGxpbmUgJiYgKCcnK2xpbmUpLnN0YXJ0c1dpdGgoJyMnKTtcclxuICAgIHZhciBpc0ZpcnN0SGVhZGVyTGluZSA9ICggbnIgPCAxICkgJiYgIWlzQ29tbWVudExpbmUgJiYgIWlzRGF0YUxpbmU7XHJcbiAgICBpZiAoIGlzRGF0YUxpbmUgfHwgKGlzRmlyc3RIZWFkZXJMaW5lICYmIGlzRmlyc3RGaWxlKSkge1xyXG4gICAgICBpZiggcmVpbmRleCkge1xyXG4gICAgICAgIGxpbmUgPSByZUluZGV4TGluZShsaW5lKTtcclxuICAgICAgfVxyXG4gICAgICB3c091dC53cml0ZSggKCcnICsgbGluZSkucmVwbGFjZSgvO1xccysvZyxcIjtcIikucmVwbGFjZSgvXFxzKzsvZyxcIjtcIikgKS53cml0ZSgnXFxuJyk7XHJcbiAgICAgICsrbnI7XHJcbiAgICB9LyogZWxzZSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCcgZHJvcHBpbmcgJyArIGlzRGF0YUxpbmUgKyAnICcgKyBpc0ZpcnN0SGVhZGVyTGluZSArICcgJyArIGlzQ29tbWVudExpbmUgKyAnICcgKyBsaW5lKTtcclxuICAgIH0qL1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdlblVzZXIoaSA6IG51bWJlcikgOiBzdHJpbmcge1xyXG4gIHJldHVybiAnUCcgKyBwYWRaZXJvcyhpLDUpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2VuVVNFUkhpZXJhcmNoeVcod3MgOiBhbnksIG5ycGVycyA6IG51bWJlciApIHtcclxuICAvLyB3ZSBidWlsZCBhIHBhcmVudCBjaGlsZCBoaWVyYXJjaHkgIHVzaW5nIHByaW1lIG51bWJlciBkZWNvbXBvc2l0aW9uLFxyXG4gIC8vIHdlIGJ1aWxkIGEgcGFyZW50IGNoaWxkIGhpZXJhcmNoeSAgdXNpbmcgcHJpbWUgbnVtYmVyIGRlY29tcG9zaXRpb24sXHJcbiAgLy8gd2l0aCBwZXJzb25zIG1hZGUgY2hpbGRyZW4gb2YgdGhlIFwibGFnZXN0IHByaW1lIGZhY3RvclwiXHJcbiAgLy8gdG8gbm90IGVuZCB1cCB3aXRoIHRvbyBtYW55IHJvb3RzIHdlIG9ubHkgbWFrZSBldmVyeSBuLXRoIHByaW1lIGZhY3RvciBhIHJvb3QuXHJcbiAgdmFyIHJlcyA9IHt9O1xyXG4gIHZhciBuclByaW1lcyA9IDA7XHJcbiAgLy8gMTMgLSA1IC0gMlxyXG4gIGZvcih2YXIgaSA9IDE7IGkgPD0gbnJwZXJzOyArK2kgKSB7XHJcbiAgICB2YXIgcHJpbSA9IGdldE1heFByaW1lcyhpKTtcclxuICAgIGlmKCAhcmVzW3ByaW1dKSB7XHJcbiAgICAgICsrbnJQcmltZXM7XHJcbiAgICAgIGlmICggKGkgPiAxMCkgJiYgKG5yUHJpbWVzICUgMjAgIT0gMTUpICkge1xyXG4gICAgICAgIHZhciBwcmltUGFyID0gZ2V0TWF4UHJpbWVzKE1hdGguZmxvb3IoaS8xMCkpO1xyXG4gICAgICAgIHJlc1twcmltXSA9IHByaW1QYXI7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmVzW3ByaW1dID0gLTE7IC8vIGEgcm9vdFxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiggaSAhPSBwcmltICkge1xyXG4gICAgICByZXNbaV0gPSBwcmltO1xyXG4gICAgfVxyXG4gIH1cclxuICAvL2R1bXAgdGhlIGxpc3RcclxuICB3cy53cml0ZShcIlVTRVI7VVNFUl9QQVJFTlRcXG5cIik7XHJcbiAgZm9yKHZhciBpID0gMTsgaSA8PSBucnBlcnM7ICsraSkge1xyXG4gICAgd3Mud3JpdGUoZ2VuVXNlcihpKSkud3JpdGUoJzsnKTtcclxuICAgIGlmICggcmVzW2ldID4gMCApIHtcclxuICAgICAgd3Mud3JpdGUoZ2VuVXNlcihyZXNbaV0pKS53cml0ZSgnXFxuJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB3cy53cml0ZShcIlxcblwiKTsgLy9OdWxsIVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdlblVTRVJIaWVyYXJjaHkobnJwZXJzIDogbnVtYmVyICkge1xyXG4gIHZhciB3cyA9IGdldFdTKCBcIkRJTV9VU0VSX1wiICsgcGFkWmVyb3MobnJwZXJzLDYpICsgXCIuY3N2XCIpO1xyXG4gIGdlblVTRVJIaWVyYXJjaHlXKHdzLG5ycGVycyk7XHJcbiAgd3Mud3MuZW5kKCk7XHJcbn0iXX0=
