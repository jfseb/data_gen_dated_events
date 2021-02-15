"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genUSERHierarchyW = exports.genUser = exports.appendCleansing = exports.cleanseWSCommentsRepeatedHeaderInFile = exports.genUSERHierarchy = exports.getMaxPrimes = exports.genPerson = exports.isHireChange = exports.writeRecordMOVEIN = exports.writeRecordHIRE = exports.writeRecord0 = exports.writeRecord = exports.memorizeSOM = exports.toDec1 = exports.writeTripel = exports.writeAge = exports.getSOM = exports.writeTenure = exports.writeTENUREAGE = exports.diffMonth = exports.diffYears = exports.writeDay = exports.makeQuarter = exports.writeHeader = exports.daysInMonth = exports.EOMONTH = exports.asDate = exports.padSpaceQ = exports.padSpace = exports.padZeros = exports.isEOY = exports.isEOQ = exports.copyDate = exports.isOtherER = exports.isTermER = exports.isHireER = exports.Person = exports.GenParams = exports.OptsMONAG = exports.getWS = exports.WSWrap2 = exports.makeMap = exports.dateToDayIndex = exports.EXCELOFFSET = void 0;
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
    ws.write("USER;LOCATION;ESTAT;HC;HC_SOM;HC_EOM;DAYSWORKED;FTE;FTE_SOM;FTE_EOM;FTEWORKED;TENURE;TENURE_SOM;TENURE_EOM;AGE;AGE_SOM;AGE_EOM;HC_EOMS;HIRE;TERM;MOVE_OUT;MOVE_IN;EVRS;GNDR;X\n");
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
function genUSERHierarchy(nrpers) {
    var ws = getWS("DIM_USER_" + padZeros(nrpers, 6) + ".csv");
    genUSERHierarchyW(ws, nrpers);
    ws.ws.end();
}
exports.genUSERHierarchy = genUSERHierarchy;
function isDigit(char) {
    return "0123456789".indexOf(char) >= 0;
}
function isLineStartingWithDigit(line) {
    var lines = '' + line;
    return lines.length > 0 && isDigit(lines.charAt(0));
}
/**
 * Also strips comments lines with #
 * @param filename1
 * @param filename2
 * @param done
 */
function cleanseWSCommentsRepeatedHeaderInFile(filename1, addData, samples, filename2, done) {
    //var ln = fs.readFileSync(filename1, { encoding : 'utf-8'});
    var wsOut = getWS(filename2);
    var first = true;
    if (addData) {
        samples.forEach(sn => {
            console.log(' appending ' + sn);
            appendCleansing(sn, first, wsOut);
            first = false;
        });
    }
    appendCleansing(filename1, first, wsOut);
    wsOut.ws.on('finish', () => { done(); });
    wsOut.ws.end();
}
exports.cleanseWSCommentsRepeatedHeaderInFile = cleanseWSCommentsRepeatedHeaderInFile;
function appendCleansing(filename1, isFirstFile, wsOut) {
    const liner = new lineByLine(filename1);
    var line = "";
    var nr = 0;
    while (line = liner.next()) {
        var isDataLine = line && isLineStartingWithDigit(line);
        var isCommentLine = line && ('' + line).startsWith('#');
        var isFirstHeaderLine = (nr < 1) && !isCommentLine && !isDataLine;
        if (isDataLine || (isFirstHeaderLine && isFirstFile)) {
            wsOut.write(('' + line).replace(/;\s+/g, ";")).write('\n');
            ++nr;
        }
        else {
            console.log(' dropping ' + isDataLine + ' ' + isFirstHeaderLine + ' ' + isCommentLine + ' ' + line);
        }
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,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LENBQUMsQ0FBQztJQUNqRCxFQUFFLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsZ0RBQWdEO0lBQzlGLFdBQVcsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFBLENBQUMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFBLENBQUMsQ0FBQyxLQUFLLEVBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDeEYsSUFBSSxZQUFZLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDdEQsRUFBRSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxZQUFZLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxZQUFZO0lBQzVFLFdBQVcsQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDbEYsRUFBRSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsT0FBTyxHQUFHLFlBQVksRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLFlBQVk7SUFDM0YsV0FBVyxDQUFDLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ3BDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxHQUFH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SSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRTtRQUMvQixFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNoQyxJQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUc7WUFDaEIsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDdkM7YUFBTTtZQUNMLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPO1NBQ3hCO0tBQ0Y7QUFDSCxDQUFDO0FBakNELDhDQWlDQyIsImZpbGUiOiJoZWxwZXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGZzID0gcmVxdWlyZSgnZnMnKTtcclxuY29uc3QgeyBleGl0IH0gPSByZXF1aXJlKCdwcm9jZXNzJyk7XHJcbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0ICogYXMgbGluZUJ5TGluZSBmcm9tICduLXJlYWRsaW5lcyc7XHJcbmltcG9ydCAqIGFzIHJlYWRsaW5lIGZyb20gJ3JlYWRsaW5lJztcclxuXHJcbi8vdmFyIHNlZWRyYW5kb20gPSByZXF1aXJlKCdzZWVkcmFuZG9tJyk7XHJcbmltcG9ydCAqIGFzIHNlZWRyYW5kb20gZnJvbSAnc2VlZHJhbmRvbSc7XHJcbi8vIEVYQ0VMXHJcbi8vICAgICAxIDE5MDAtMDEtMDFcclxuLy8gMjU1NjkgMTk3MC0wMS0wMVxyXG4vL1xyXG5leHBvcnQgY29uc3QgRVhDRUxPRkZTRVQgPSAyNTU2OTtcclxuXHJcbmltcG9ydCB7TG9jYWxEYXRlIH0gZnJvbSAgXCJAanMtam9kYS9jb3JlXCI7XHJcbmltcG9ydCB7IFNTTF9PUF9ET05UX0lOU0VSVF9FTVBUWV9GUkFHTUVOVFMgfSBmcm9tICdjb25zdGFudHMnO1xyXG5pbXBvcnQgeyBzYW1wbGVTaXplIH0gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0IHsgQ29uc29sZSB9IGZyb20gJ2NvbnNvbGUnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRhdGVUb0RheUluZGV4KGQgOiBMb2NhbERhdGUgKSA6IG51bWJlciB7XHJcbiAgcmV0dXJuICBkLnRvRXBvY2hEYXkoKSArIEVYQ0VMT0ZGU0VUO1xyXG59XHJcblxyXG52YXIgZDEgPSBMb2NhbERhdGUub2YoMjAyMCwxLDYpO1xyXG52YXIgZDFJZHggPSBkYXRlVG9EYXlJbmRleChkMSk7XHJcbnZhciBkMiA9IExvY2FsRGF0ZS5vZigyMDI0LDYsMSk7XHJcbnZhciBkMklkeCA9IGRhdGVUb0RheUluZGV4KGQyKTtcclxudmFyIGRlbHRhVGltZSA9IGQySWR4LWQxSWR4O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG1ha2VNYXAob2JqKSB7XHJcbiAgdmFyIGlkeCA9IDA7XHJcbiAgdmFyIHJlcyA9IFtdO1xyXG4gIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKG9iaikuZm9yRWFjaCggZnVuY3Rpb24oYSkge1xyXG4gICAgZm9yKHZhciBpID0gMDsgaSA8IG9ialthXTsgKytpKSB7XHJcbiAgICAgIHJlcy5wdXNoKGEpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG4gIHJldHVybiByZXM7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBXU1dyYXAyICB7XHJcbiAgd3M6IGFueTtcclxuICBfbG9nOiBhbnk7XHJcbiAgX29uRmluaXNoIDogYW55O1xyXG4gIGNvbnN0cnVjdG9yKGZuIDogc3RyaW5nKVxyXG4gIHtcclxuICAgIHRoaXMud3MgPSB0aGlzO1xyXG4gICAgdGhpcy5fbG9nID0gZnMub3BlblN5bmMoZm4sJ3cnKTtcclxuICAgIHRoaXMuX29uRmluaXNoID0gdW5kZWZpbmVkO1xyXG4gIH1cclxuICBvbiggcyA6IHN0cmluZywgZm4gOiBhbnkpIHtcclxuICAgIHRoaXMuX29uRmluaXNoID0gZm47XHJcbiAgfVxyXG4gIGVuZCgpIHtcclxuICAgIGZzLmNsb3NlU3luYyh0aGlzLl9sb2cpO1xyXG4gICAgdGhpcy5fbG9nID0gdW5kZWZpbmVkO1xyXG4gICAgaWYoIHRoaXMuX29uRmluaXNoKSB7XHJcbiAgICAgIHRoaXMuX29uRmluaXNoKCk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHdyaXRlKGEgOiBhbnkpIHtcclxuICAgIGZzLndyaXRlU3luYyh0aGlzLl9sb2csICcnICsgYSk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcbn07XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFdTKGZpbGVuYW1lOiBzdHJpbmcpIDogV1NXcmFwMiB7XHJcblxyXG4gIHJldHVybiBuZXcgV1NXcmFwMihmaWxlbmFtZSk7XHJcbn1cclxuXHJcblxyXG4vLyAxIFNpbXBsZSByYW5nZSBiYXNlZCAgKG5vIG1vbnRobHkgaW50ZXJpbSBkYXRhKVxyXG4vLyAgW3h4eF0tW3l5eV0gIDxhdHRyaWJ1dGVzPlxyXG4vL1xyXG4vLyAgb3B0aW9uYWwgc3ByaW5rbGUgaW4gMCwwLDAsMCA8YXR0cmlidXRlcz4gTWFyayAgRU9NL0VPUCBudW1iZXJzLlxyXG4vL1xyXG4vL3RvIHN1cHBvcnQgZGlmZmVyZW50IG91dHB1dCBmbGF2b3VycyxcclxuLy9cclxuLy9cclxuXHJcbmV4cG9ydCBjbGFzcyBPcHRzTU9OQUcge1xyXG4gIG5vWmVybyA6IGJvb2xlYW47XHJcbiAgc3RvcFJlY29yZHMgOiBib29sZWFuO1xyXG4gIHN0YXJ0UmVjb3JkcyA6IGJvb2xlYW47XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBHZW5QYXJhbXMge1xyXG4gIE5SUEVSUyA6IG51bWJlcjtcclxuICBBVkdfTkVYVCA6IG51bWJlcjtcclxuICBMT0NDSEFOR0UgOiBudW1iZXI7XHJcbiAgRlRFQ0hBTkdFOiBudW1iZXI7XHJcbiAgRVNUQVRDSEFOR0U6bnVtYmVyO1xyXG4gIExfSElSRSA6IG51bWJlcjtcclxuICBMX0VWRU5UIDogbnVtYmVyO1xyXG4gIExPQ0FUSU9Oczogc3RyaW5nW107XHJcbiAgRVNUQVRzIDogc3RyaW5nW107XHJcbiAgZmlyc3REYXRlIDogTG9jYWxEYXRlO1xyXG4gIGxhc3REYXRlIDogTG9jYWxEYXRlO1xyXG4gIHJhbmRvbSA6IGFueTtcclxuICB3c01PTkFHIDogYW55O1xyXG4gIGFkZElucHV0U2FtcGxlcyA6IGJvb2xlYW47XHJcbiAgb3B0c01PTkFHPyA6IE9wdHNNT05BRztcclxuICB3c1JBTkdFIDogYW55O1xyXG4gIG9wdHNSQU5HRSA6IGFueTtcclxuICByYW5kb21PRCA6IGFueTsgLy8geyBcIkVTVEFUXCIgOiBzZWVkcmFuZG9tKCdYWlknKSB9LFxyXG4gIFJFT1BfRVNUQVRTIDogc3RyaW5nW107IC8vIEVTVEFUUyB3aGljaCBjb250cmlidXRlIHRvIEVPUCwgdGhpcyBpcyBqdXN0IGhlYWQgY291bnQgSUYgRVNUQVQgSU4gW1wiQVwiLFwiVVwiLFwiUFwiXSBFT1BfSEMgOiAwXHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBQZXJzb24ge1xyXG4gIC8vIGltbXV0YWJsZVxyXG4gIHVzZXI6IHN0cmluZztcclxuICBnZW5kZXIgOiBzdHJpbmc7XHJcbiAgZXZlbnRSZWFzb24gOiBzdHJpbmc7XHJcbiAgLy8gY2hhbmdpbmdcclxuICBkb2I6IExvY2FsRGF0ZTtcclxuICBsb2NhdGlvbiA6IHN0cmluZztcclxuICBoaXJlZDogbnVtYmVyO1xyXG4gIGhpcmVkU09NOiBudW1iZXI7XHJcbiAgaGlyZWRQcmV2IDogbnVtYmVyOyAvLyBwZXJzb24gIGhpcmUgc3RhdGUgcHJldmlvdXMgcmFuZ2VcclxuICBmdGUgOiBudW1iZXI7XHJcbiAgZnRlUHJldiA6IG51bWJlcjsgLy8gcGVyc29uIGZ0ZSBzdGF0ZSBwcmV2aW91cyByYW5nZVxyXG4gIGZ0ZVNPTTogbnVtYmVyO1xyXG4gIEVTVEFUIDogc3RyaW5nO1xyXG4gIEVTVEFUUHJldiA6IHN0cmluZztcclxuICBFU1RBVFNPTSA6IHN0cmluZztcclxuICAvLyBjaGFuZ2luZ1xyXG4gIGxhc3RIaXJlZDogTG9jYWxEYXRlO1xyXG4gIGxhc3RFdmVudERhdGUgOiBMb2NhbERhdGU7XHJcbiAgcHJldkRhdGVFbmQgOiBMb2NhbERhdGU7XHJcbiAgcHJldlJhbmdlRW5kOiBMb2NhbERhdGU7IC8vIGVuZCBvZiBsYXN0IHJhbmdlXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldE5leHQocGFyczpHZW5QYXJhbXMpIHtcclxuICByZXR1cm4gTWF0aC5mbG9vcihwYXJzLnJhbmRvbS5yYW5kb20oKSAqIHBhcnMuQVZHX05FWFQpICsgMTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0TG9jYXRpb24ocGFyczogR2VuUGFyYW1zKSB7XHJcbiAgcmV0dXJuIHBhcnMuTE9DQVRJT05zW01hdGguZmxvb3IocGFycy5yYW5kb20ucmFuZG9tKCkgKiBwYXJzLkxPQ0FUSU9Ocy5sZW5ndGgpXTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0RVNUQVQocGFyczogR2VuUGFyYW1zLCBrZXkgOiBzdHJpbmcpIHtcclxuICByZXR1cm4gcGFycy5FU1RBVHNbTWF0aC5mbG9vcihwYXJzLnJhbmRvbU9EW2tleV0ucmFuZG9tKCkgKiBwYXJzLkVTVEFUcy5sZW5ndGgpXTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0R2VuZGVyKHBhcnM6IEdlblBhcmFtcykge1xyXG4gIHJldHVybiAoIHBhcnMucmFuZG9tLm90aGVyUmFuZG9tKDIpIDwgMC41ICkgPyBcIkZcIjogXCJNXCI7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEhpcmVFdmVudFJlYXNvbihwYXJzOiBHZW5QYXJhbXMpOiBzdHJpbmcge1xyXG4gIHJldHVybiBcIkhJXCIgKyAoTWF0aC5mbG9vcihwYXJzLnJhbmRvbS5vdGhlclJhbmRvbSg0KSAqIDEwMCkgJSA1KTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0VGVybUV2ZW50UmVhc29uKHBhcnM6IEdlblBhcmFtcykgOiBzdHJpbmcge1xyXG4gIHJldHVybiBcIlRSXCIgKyAoTWF0aC5mbG9vcihwYXJzLnJhbmRvbS5vdGhlclJhbmRvbSg0KSAqIDEwMCkgJSAxMCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldExvY2F0aW9uRXZlbnRSZWFzb24ocGFyczogR2VuUGFyYW1zKSA6IHN0cmluZyB7XHJcbiAgcmV0dXJuIFwiTFwiICsgcGFkWmVyb3MoKE1hdGguZmxvb3IocGFycy5yYW5kb20ub3RoZXJSYW5kb20oNCkgKiAxMDApICUgNTApLDIpO1xyXG59XHJcbmZ1bmN0aW9uIGdldFBsYWluRXZlbnRSZWFzb24ocGFyczogR2VuUGFyYW1zKSA6IHN0cmluZyB7XHJcbiAgcmV0dXJuIFwiUFwiICsgcGFkWmVyb3MoKE1hdGguZmxvb3IocGFycy5yYW5kb20ub3RoZXJSYW5kb20oNCkgKiAxMDApICUgMTApLDIpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNIaXJlRVIoIGVyIDogc3RyaW5nICkgOm51bWJlciB7XHJcbiAgcmV0dXJuIChlci5jaGFyQXQoMCkgPT0gXCJIXCIpID8gMSA6IDA7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpc1Rlcm1FUiggZXIgOiBzdHJpbmcgKSA6IG51bWJlciB7XHJcbiAgcmV0dXJuIChlci5jaGFyQXQoMCkgPT0gXCJUXCIpID8gMSA6IDA7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpc090aGVyRVIoIGVyIDogc3RyaW5nICkgOiBudW1iZXIge1xyXG4gIHJldHVybiAoKCFpc0hpcmVFUihlcikgICYmICFpc1Rlcm1FUihlcikpID8gMSA6IDApO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gZ2V0SGlyZVRlcm1FdmVudFJlYXNvbiggcGFycyA6IEdlblBhcmFtcywgcHJpb3JIaXJlZDogbnVtYmVyICkge1xyXG4gIGlmICggcHJpb3JIaXJlZCApIHtcclxuICAgIHJldHVybiBnZXRUZXJtRXZlbnRSZWFzb24ocGFycyk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiBnZXRIaXJlRXZlbnRSZWFzb24ocGFycyk7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRPdGhlckV2ZW50UmVhc29uKCBwYXJzOiBHZW5QYXJhbXMsIHBlcnM6IFBlcnNvbiwgbmw6IHN0cmluZyApIHtcclxuICBpZiAoIHBlcnMubG9jYXRpb24gIT0gbmwgKSB7XHJcbiAgICByZXR1cm4gZ2V0TG9jYXRpb25FdmVudFJlYXNvbihwYXJzKTtcclxuICB9XHJcbiAgcmV0dXJuIGdldFBsYWluRXZlbnRSZWFzb24ocGFycyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG5leHRMb2NhdGlvbiggcGFyczogR2VuUGFyYW1zLCBwZXJzIDogUGVyc29uICkge1xyXG4gIGlmKCBwYXJzLnJhbmRvbS5yYW5kb20oKSA8IHBhcnMuTE9DQ0hBTkdFKSB7XHJcbiAgICByZXR1cm4gZ2V0TG9jYXRpb24ocGFycyk7XHJcbiAgfVxyXG4gIHJldHVybiAgcGVycy5sb2NhdGlvbjtcclxufVxyXG5cclxuZnVuY3Rpb24gbmV4dEZURShwYXJzOiBHZW5QYXJhbXMsIHBlcnMgOiBQZXJzb24pIHtcclxuICBpZiggcGFycy5yYW5kb20ucmFuZG9tKCkgPCBwYXJzLkZURUNIQU5HRSkge1xyXG4gICAgaWYoIHBlcnMuZnRlID09IDEpIHtcclxuICAgICAgcmV0dXJuIDAuNTtcclxuICAgIH1cclxuICAgIHJldHVybiAxLjA7XHJcbiAgfVxyXG4gIHJldHVybiBwZXJzLmZ0ZTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldE5leHRFU1RBVCggcGFyczogR2VuUGFyYW1zLCBwZXJzIDogUGVyc29uLCBrZXkgOiBzdHJpbmcgKSB7XHJcbi8vICBwYXJzLnJhbmRvbU9EW2tleV0oKTtcclxuICBpZiggcGFycy5yYW5kb21PRFtrZXldLnJhbmRvbSgpIDwgcGFycy5FU1RBVENIQU5HRSkge1xyXG4gICAgcmV0dXJuIGdldEVTVEFUKHBhcnMsIGtleSk7XHJcbiAgfVxyXG4gIHJldHVybiAgcGVycy5FU1RBVDtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGlzRXZlbnQocGFyczpHZW5QYXJhbXMpIHtcclxuICByZXR1cm4gcGFycy5yYW5kb20ucmFuZG9tKCkgPCBwYXJzLkxfRVZFTlQ7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzRU9NKGRhdGVJZHggOiBMb2NhbERhdGUpIHtcclxuICB2YXIgZCA9IGNvcHlEYXRlKGRhdGVJZHgpLnBsdXNEYXlzKDEpO1xyXG4gIGlmKGQuZGF5T2ZNb250aCgpID09IDEpXHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICByZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjb3B5RGF0ZShkIDogTG9jYWxEYXRlKSB7XHJcbiAgcmV0dXJuIExvY2FsRGF0ZS5vZkVwb2NoRGF5KGQudG9FcG9jaERheSgpKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGlzRU9RKGQ6IExvY2FsRGF0ZSkge1xyXG4gIGQgPSBjb3B5RGF0ZShkKS5wbHVzRGF5cygxKTtcclxuICBpZihkLmRheU9mTW9udGgoKSA9PSAxICYmICBbMSw0LDcsMTBdLmluZGV4T2YoZC5tb250aFZhbHVlKCkpID49IDApXHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICByZXR1cm4gZmFsc2U7XHJcbn1cclxuXHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGlzRU9ZKGQgOiBMb2NhbERhdGUpIHtcclxuICB2YXIgZCA9IGNvcHlEYXRlKGQpLnBsdXNEYXlzKDEpO1xyXG4gIGlmKGQuZGF5T2ZNb250aCgpID09IDEgJiYgZC5tb250aFZhbHVlKCkgPT0gMSlcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHBhZFplcm9zKGEgOiBhbnksIGxlbiA6IG51bWJlcikge1xyXG4gIHZhciBzID0gXCJcIiArYTtcclxuICByZXR1cm4gXCIwMDAwMDAwXCIuc3Vic3RyKDAsIGxlbiAtIHMubGVuZ3RoKSArIHM7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBwYWRTcGFjZShhIDogYW55LCBsZW4gOiBudW1iZXIpIHtcclxuICB2YXIgcyA9IFwiXCIgK2E7XHJcbiAgcmV0dXJuIFwiICAgICAgICAgICAgICAgICAgIFwiLnN1YnN0cigwLCBsZW4gLSBzLmxlbmd0aCkgKyBzO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcGFkU3BhY2VRKGEgOiBhbnksIGxlbiA6IG51bWJlcikge1xyXG4gIHZhciBzID0gXCJcIiArYTtcclxuICByZXR1cm4gJ1wiJyArIHMgKyAnXCInICsgXCIgICAgICAgICAgICAgICAgICAgXCIuc3Vic3RyKDAsIGxlbiAtIHMubGVuZ3RoKTtcclxufVxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBhc0RhdGUoZGF0ZUlkeCA6IExvY2FsRGF0ZSk6IHN0cmluZyB7XHJcbiAgdmFyIGQgPWRhdGVJZHg7XHJcbiAgcmV0dXJuICcnICsgZDtcclxuICAvL3JldHVybiBkLnllYXIoKSArIFwiLVwiICsgcGFkKGQubW9udGhWYWx1ZSgpLDIpICsgXCItXCIgKyBwYWQoZC5kYXlPZk1vbnRoKCksMik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBFT01PTlRIKGQgOiBMb2NhbERhdGUpIDogTG9jYWxEYXRlIHtcclxuICByZXR1cm4gY29weURhdGUoZCkucGx1c01vbnRocygxKS53aXRoRGF5T2ZNb250aCgxKS5taW51c0RheXMoMSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkYXlzSW5Nb250aChkYXRlSWR4IDogTG9jYWxEYXRlKSB7XHJcbiAgdmFyIGR0ID1kYXRlSWR4O1xyXG4gIHZhciBkZW9tID0gRU9NT05USChkdCk7XHJcbiAgcmV0dXJuIGRhdGVUb0RheUluZGV4KGRlb20pIC0gZGF0ZVRvRGF5SW5kZXgoY29weURhdGUoZGVvbSkud2l0aERheU9mTW9udGgoMSkpICsgMTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHdyaXRlSGVhZGVyKHdzKSB7XHJcbiAgd3Mud3JpdGUoXCJZRUFSO1FVQVJUO0NBTE1PTlRISUM7Q0FMTU9OVEhJO0NBTE1PTlRIO0NBTE1PTlRIUztTVEFSVF9EQVRFX0lEWDtFTkRfREFURV9JRFg7SVNFT007SVNFT1E7SVNFT1k7REFZU0lOTU9OVEg7U1RBUlRfREFURTtFTkRfREFURTtcIilcclxuICB3cy53cml0ZShcIlVTRVI7TE9DQVRJT047RVNUQVQ7SEM7SENfU09NO0hDX0VPTTtEQVlTV09SS0VEO0ZURTtGVEVfU09NO0ZURV9FT007RlRFV09SS0VEO1RFTlVSRTtURU5VUkVfU09NO1RFTlVSRV9FT007QUdFO0FHRV9TT007QUdFX0VPTTtIQ19FT01TO0hJUkU7VEVSTTtNT1ZFX09VVDtNT1ZFX0lOO0VWUlM7R05EUjtYXFxuXCIpXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBtYWtlUXVhcnRlcihkIDogTG9jYWxEYXRlKSB7XHJcbiAgcmV0dXJuIGQueWVhcigpICsgJycgKyAnX1EnICsgIChNYXRoLmZsb29yKChkLm1vbnRoVmFsdWUoKS0xKS8zKSsxKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHdyaXRlRGF5KHdzLCBwcmV2RGF0ZUVuZDpMb2NhbERhdGUsIGRhdGVJZHggOiBMb2NhbERhdGUpIHtcclxuICB2YXIgc3RhcnRJZHggPSBjb3B5RGF0ZShwcmV2RGF0ZUVuZCkucGx1c0RheXMoMSk7XHJcbiAgdmFyIGQgPSBkYXRlSWR4O1xyXG4gIHZhciB5ID0gZC55ZWFyKCk7XHJcbiAgdmFyIG0gPSBkLm1vbnRoVmFsdWUoKTtcclxuICB2YXIgY21pID0geSoxMDAgKyBtO1xyXG4gIHZhciBjbWljID0gICh5LTIwMDApKjEyICsgbTtcclxuICB3cy53cml0ZSh5KS53cml0ZSgnOycpO1xyXG4gIHdzLndyaXRlKG1ha2VRdWFydGVyKGQpKS53cml0ZSgnOycpO1xyXG4gIHdzLndyaXRlKCcnICsgY21pYyArIFwiO1wiICsgY21pICsgXCI7XCIgKyBjbWkgKyBcIjtcIiArIGNtaSsgXCI7XCIpOyAvLyBDQUxNT05USCBJQyBJIH4gU1xyXG4gIHdzLndyaXRlKGRhdGVUb0RheUluZGV4KHN0YXJ0SWR4KSsgXCI7XCIrIGRhdGVUb0RheUluZGV4KGRhdGVJZHgpICsgXCI7XCIpO1xyXG4gIHdzLndyaXRlKGlzRU9NKGQpPyBcIjEuMFwiIDogXCIwLjBcIikud3JpdGUoXCI7XCIpO1xyXG4gIHdzLndyaXRlKGlzRU9RKGQpPyBcIjEuMFwiIDogXCIwLjBcIikud3JpdGUoXCI7XCIpO1xyXG4gIHdzLndyaXRlKGlzRU9ZKGQpPyBcIjEuMFwiIDogXCIwLjBcIikud3JpdGUoXCI7XCIpO1xyXG4gIHZhciBkaW0gPSBkYXlzSW5Nb250aChkKTtcclxuICB3cy53cml0ZShkaW0pLndyaXRlKFwiO1wiKTtcclxuICB3cy53cml0ZShhc0RhdGUoc3RhcnRJZHgpKS53cml0ZShcIjtcIik7XHJcbiAgd3Mud3JpdGUoYXNEYXRlKGQpKS53cml0ZShcIjtcIik7XHJcbiAgcmV0dXJuIGRpbTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRpZmZZZWFycyhkYXRlTG93OiBMb2NhbERhdGUsIGRhdGVIaWdoOiBMb2NhbERhdGUpIHtcclxuICByZXR1cm4gZGF0ZUxvdy51bnRpbChkYXRlSGlnaCkueWVhcnMoKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRpZmZNb250aChkYXRlTG93IDogTG9jYWxEYXRlLCBkYXRlSGlnaCA6IExvY2FsRGF0ZSkge1xyXG4gIHZhciBhID0gZGF0ZUxvdy51bnRpbChkYXRlSGlnaCk7XHJcbiAgcmV0dXJuIGEueWVhcnMoKSoxMiArIGEubW9udGhzKCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB3cml0ZVRFTlVSRUFHRShwZXJzIDpQZXJzb24pIHtcclxuICByZXR1cm4gcGVycy5oaXJlZCA+IDA7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB3cml0ZVRlbnVyZSh3cywgbm93OiBMb2NhbERhdGUsIHBlcnM6IFBlcnNvbiwgZW9tKSB7XHJcbiAgaWYgKCAhd3JpdGVURU5VUkVBR0UocGVycykgKSB7XHJcbiAgICB3cy53cml0ZSgnIDA7IDA7IDA7Jyk7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIHZhciB0ZW51cmVOb3cgPSBkaWZmTW9udGgocGVycy5sYXN0SGlyZWQsbm93KTtcclxuICB3cy53cml0ZShwYWRTcGFjZSh0ZW51cmVOb3csMikpLndyaXRlKCc7Jyk7XHJcbiAgaWYoIGlzRU9NKG5vdykpIHtcclxuICAgIHZhciBkc29tID0gZ2V0U09NKG5vdyk7XHJcbiAgICB2YXIgdGVudXJlU09NID0gZGlmZk1vbnRoKHBlcnMubGFzdEhpcmVkLGRzb20pO1xyXG4gICAgd3Mud3JpdGUocGFkU3BhY2UodGVudXJlU09NLDIpKS53cml0ZSgnOycpXHJcbiAgICB3cy53cml0ZShwYWRTcGFjZSh0ZW51cmVOb3csMikpLndyaXRlKCc7Jyk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHdzLndyaXRlKCcgMDsgMDsnKVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFNPTShkYXRlSWR4IDogTG9jYWxEYXRlKSAgOiBMb2NhbERhdGUge1xyXG4gIHJldHVybiBkYXRlSWR4LndpdGhEYXlPZk1vbnRoKDEpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gd3JpdGVBZ2Uod3MsIG5vdyA6IExvY2FsRGF0ZSwgcGVycywgZW9tOiBib29sZWFuKSB7XHJcbiAgaWYgKCAhd3JpdGVURU5VUkVBR0UocGVycykgKSB7XHJcbiAgICB3cy53cml0ZSgnIDA7IDA7IDA7Jyk7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIHZhciBhZ2VOb3cgPSBkaWZmWWVhcnMocGVycy5kb2Isbm93KTtcclxuICB3cy53cml0ZShwYWRTcGFjZShhZ2VOb3csMikpLndyaXRlKCc7Jyk7XHJcbiAgaWYoIGlzRU9NKG5vdykgKSB7XHJcbiAgICB2YXIgZHNvbSA9IGdldFNPTShub3cpO1xyXG4gICAgdmFyIGFnZVNPTSA9IGRpZmZZZWFycyhwZXJzLmRvYixkc29tKTtcclxuICAgIHdzLndyaXRlKHBhZFNwYWNlKGFnZVNPTSwyKSkud3JpdGUoJzsnKVxyXG4gICAgd3Mud3JpdGUocGFkU3BhY2UoYWdlTm93LDIpKS53cml0ZSgnOycpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB3cy53cml0ZSgnIDA7IDA7JylcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB3cml0ZVRyaXBlbCh3cywgdnNvbSA6IGFueSwgdm5vdzogYW55LCBlb20gOiBib29sZWFuKSB7XHJcbiAgd3Mud3JpdGUocGFkU3BhY2Uodm5vdywzKSkud3JpdGUoJzsnKTtcclxuICBpZiggZW9tICkge1xyXG4gICAgd3Mud3JpdGUocGFkU3BhY2UodnNvbSwzKSkud3JpdGUoJzsnKVxyXG4gICAgd3Mud3JpdGUocGFkU3BhY2Uodm5vdywzKSkud3JpdGUoJzsnKTtcclxuICB9IGVsc2Uge1xyXG4gICAgd3Mud3JpdGUoJzAuMDswLjA7JylcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB0b0RlYzEobiA6IG51bWJlcikge1xyXG4gIHJldHVybiAobiB8fCAwKS50b0ZpeGVkKDEpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbWVtb3JpemVTT00oZGF0ZUlkeCA6IExvY2FsRGF0ZSwgcGVycyA6IFBlcnNvbikge1xyXG4gIHZhciBlb20gPSBpc0VPTShkYXRlSWR4KTtcclxuICBpZiAoZW9tKSB7XHJcbiAgICBwZXJzLmZ0ZVNPTSA9IHBlcnMuaGlyZWQgKiBwZXJzLmZ0ZTtcclxuICAgIHBlcnMuaGlyZWRTT00gPSBwZXJzLmhpcmVkO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gaXNBbGxaZXJvKHBlcnMgOiBQZXJzb24pIHtcclxuICByZXR1cm4gKHBlcnMuaGlyZWQgPT0gMCAmJiAgcGVycy5oaXJlZFNPTSA9PSAwKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFRoaXMgZnVuY3Rpb24gZG9lcyBtdXRhdGUgcGVycywgdXNlIGEgY2xvbmUgaWYgbm90IGRlc2lyZWQhXHJcbiAqIEBwYXJhbSB3c1xyXG4gKiBAcGFyYW0gZGF0ZUlkeFxyXG4gKiBAcGFyYW0gcGVyc1xyXG4gKiBAcGFyYW0gY29tbWVudFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHdyaXRlUmVjb3JkKHdzLCBkYXRlSWR4IDogTG9jYWxEYXRlLCBwZXJzIDogUGVyc29uLCBwYXJzIDogR2VuUGFyYW1zLCBjb21tZW50OiBzdHJpbmcgKVxyXG57XHJcbiAgdmFyIHN0YXJ0SWR4ID0gY29weURhdGUocGVycy5wcmV2RGF0ZUVuZCkucGx1c0RheXMoMSk7XHJcbiAgdmFyIGVvbSA9IGlzRU9NKGRhdGVJZHgpO1xyXG4gIHdzLndyaXRlKHBhZFNwYWNlUShwZXJzLnVzZXIsNSkpLndyaXRlKCc7Jyk7XHJcbiAgd3Mud3JpdGUocGFkU3BhY2VRKHBlcnMubG9jYXRpb24sMjApKS53cml0ZSgnOycpO1xyXG4gIHdzLndyaXRlKHBhZFNwYWNlUShwZXJzLkVTVEFULDEpKS53cml0ZSgnOycpOyAvLyB3ZSBhbHdheXMgd3JpdGUgdGhpcywgbmVlZGVkIGZvciBTVE9QIHJlY29yZHNcclxuICB3cml0ZVRyaXBlbCh3cywgcGVycy5oaXJlZFNPTSA/IFwiMS4wXCI6IFwiMC4wXCIsIHBlcnMuaGlyZWQgPyBcIjEuMFwiOiBcIjAuMFwiLGlzRU9NKGRhdGVJZHgpKTtcclxuICB2YXIgZGF5c0luUGVyaW9kID0gc3RhcnRJZHgudW50aWwoZGF0ZUlkeCkuZGF5cygpICsgMTtcclxuICB3cy53cml0ZShwYWRTcGFjZShwZXJzLmhpcmVkUHJldiAqIGRheXNJblBlcmlvZCwyKSkud3JpdGUoJzsnKTsgLy9EQVlTV09SS0VEXHJcbiAgd3JpdGVUcmlwZWwod3MsIHRvRGVjMShwZXJzLmZ0ZVNPTSksdG9EZWMxKHBlcnMuaGlyZWQgKiBwZXJzLmZ0ZSksaXNFT00oZGF0ZUlkeCkpO1xyXG4gIHdzLndyaXRlKHBhZFNwYWNlKHBlcnMuaGlyZWRQcmV2ICogcGVycy5mdGVQcmV2ICogZGF5c0luUGVyaW9kLDQpKS53cml0ZSgnOycpOyAvLyBGVEVXT1JLRURcclxuICB3cml0ZVRlbnVyZSh3cywgZGF0ZUlkeCwgcGVycywgZW9tKTtcclxuICB3cml0ZUFnZSh3cywgZGF0ZUlkeCwgcGVycywgZW9tKTtcclxuICBpZihlb20gJiYgcGFycy5SRU9QX0VTVEFUUyAmJiBwYXJzLlJFT1BfRVNUQVRTLmluZGV4T2YocGVycy5FU1RBVCkgPj0gMCkge1xyXG4gICAgd3Mud3JpdGUocGFkU3BhY2UocGVycy5oaXJlZCwxKSkud3JpdGUoJzsnKTtcclxuICB9IGVsc2Uge1xyXG4gICAgd3Mud3JpdGUoJzAnKS53cml0ZSgnOycpO1xyXG4gIH1cclxuICBwZXJzLmhpcmVkUHJldiA9IHBlcnMuaGlyZWQ7XHJcbiAgcGVycy5mdGVQcmV2ID0gcGVycy5mdGU7XHJcblxyXG4gIC8vIHdlIGNhbiB1c2UgdGhpcyBhcyBNT1ZFX09VVCBvciBURVJNXHJcbiAgdmFyIGRhdGVJZHhQMSA9IGNvcHlEYXRlKGRhdGVJZHgpLnBsdXNEYXlzKDEpO1xyXG4gIGlmKCBkYXRlSWR4UDEudG9FcG9jaERheSgpID09IChwZXJzLmxhc3RFdmVudERhdGUgJiYgcGVycy5sYXN0RXZlbnREYXRlLnRvRXBvY2hEYXkoKSkgKSB7XHJcbiAgICB2YXIgaGFzRVIgPSBpc1Rlcm1FUihwZXJzLmV2ZW50UmVhc29uKSB8fCBpc090aGVyRVIocGVycy5ldmVudFJlYXNvbik7XHJcbiAgICB3cy53cml0ZShcIjA7XCIgK1xyXG4gICAgICAgIGlzVGVybUVSKHBlcnMuZXZlbnRSZWFzb24pICsgXCI7MDtcIiArXHJcbiAgICAgICAgaXNPdGhlckVSKHBlcnMuZXZlbnRSZWFzb24pICsgXCI7XCIgK1xyXG4gICAgICAgIChoYXNFUiA/IChwZXJzLmV2ZW50UmVhc29uICsgXCI7XCIpIDogXCI7ICBcIikgKyBcIlxcXCJcIiArIHBlcnMuZ2VuZGVyICsgXCJcXFwiO1wiICsgY29tbWVudCArIFwiXFxuXCIpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB3cy53cml0ZShcIjA7MDswOzA7OyAgXFxcIlwiICsgcGVycy5nZW5kZXIgKyBcIlxcXCI7XCIgKyBjb21tZW50ICsgXCJcXG5cIik7XHJcbiAgfVxyXG4gIHBlcnMucHJldkRhdGVFbmQgPSBjb3B5RGF0ZShkYXRlSWR4KTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFRoaXMgZnVuY3Rpb24gZG9lcyBtdXRhdGUgcGVycywgdXNlIGEgY2xvbmUgaWYgbm90IGRlc2lyZWQhXHJcbiAqIEBwYXJhbSB3c1xyXG4gKiBAcGFyYW0gZGF0ZUlkeFxyXG4gKiBAcGFyYW0gcGVyc1xyXG4gKiBAcGFyYW0gY29tbWVudFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHdyaXRlUmVjb3JkMCh3cywgZGF0ZUlkeCA6IExvY2FsRGF0ZSwgcGVycyA6IFBlcnNvbiwgIGNvbW1lbnQ6IHN0cmluZyApXHJcbntcclxuICB2YXIgc3RhcnRJZHggPSBjb3B5RGF0ZShkYXRlSWR4KTtcclxuICB2YXIgZW9tID0gaXNFT00oZGF0ZUlkeCk7XHJcbiAgd3Mud3JpdGUocGFkU3BhY2VRKHBlcnMudXNlciw1KSkud3JpdGUoJzsnKTtcclxuICB3cy53cml0ZShwYWRTcGFjZVEocGVycy5sb2NhdGlvbiwyMCkpLndyaXRlKCc7Jyk7XHJcbiAgd3Mud3JpdGUocGFkU3BhY2VRKHBlcnMuRVNUQVQsMSkpLndyaXRlKCc7Jyk7IC8vIHdlIGFsd2F5cyB3cml0ZSB0aGlzLCBuZWVkZWQgZm9yIFNUT1AgcmVjb3Jkc1xyXG4gIHdyaXRlVHJpcGVsKHdzLCBcIjAuMFwiLCBcIjAuMFwiLCBmYWxzZSk7IC8vIHBlcnMuaGlyZWRTT00gPyBcIjEuMFwiOiBcIjAuMFwiICxwZXJzLmhpcmVkID8gXCIxLjBcIjogXCIwLjBcIixpc0VPTShkYXRlSWR4KSk7XHJcbiAgdmFyIGRheXNJblBlcmlvZCA9IFwiMC4wXCI7IC8vc3RhcnRJZHgudW50aWwoZGF0ZUlkeCkuZGF5cygpICsgMTtcclxuICB3cy53cml0ZShwYWRTcGFjZSgwLDIpKS53cml0ZSgnOycpOyAvL0RBWVNXT1JLRURcclxuICB3cml0ZVRyaXBlbCh3cywgdG9EZWMxKDApLHRvRGVjMSgwKSxpc0VPTShkYXRlSWR4KSk7XHJcbiAgd3Mud3JpdGUocGFkU3BhY2UoMCw0KSkud3JpdGUoJzsnKTsgLy8gRlRFV09SS0VEXHJcbiAgd3Mud3JpdGUoXCIgMDsgMDsgMDtcIik7XHJcbiAgLy93cml0ZVRlbnVyZSh3cywgZGF0ZUlkeCwgcGVycywgZW9tKTsgLy8gQ0hFQ0sgV0hFVEhFUiBNRUFTVVJFIE9SIERJTVxyXG4gIHdzLndyaXRlKFwiIDA7IDA7IDA7XCIpXHJcbiAgLy93cml0ZUFnZSh3cywgZGF0ZUlkeCwgcGVycywgZW9tKTtcclxuICB3cy53cml0ZShcIjA7XCIpO1xyXG4gIC8vaWYoZW9tICYmIHBhcnMuUkVPUF9FU1RBVFMgJiYgcGFycy5SRU9QX0VTVEFUUy5pbmRleE9mKHBlcnMuRVNUQVQpID49IDApIHtcclxuICAvLyAgICB3cy53cml0ZShwYWRTcGFjZShwZXJzLmhpcmVkLDEpKS53cml0ZSgnOycpO1xyXG4gIC8vfSBlbHNlIHtcclxuICAvLyAgd3Mud3JpdGUoJzAnKS53cml0ZSgnOycpO1xyXG4gIC8vfVxyXG4gIHdzLndyaXRlKFwiMDswOzA7MDs7ICBcXFwiXCIgKyBwZXJzLmdlbmRlciArIFwiXFxcIjtcIiArIGNvbW1lbnQgKyBcIlxcblwiKTtcclxufVxyXG5cclxuXHJcblxyXG4vKipcclxuICogVGhpcyBmdW5jdGlvbiBkb2VzIG11dGF0ZSBwZXJzLCB1c2UgYSBjbG9uZSBpZiBub3QgZGVzaXJlZCFcclxuICogQHBhcmFtIHdzXHJcbiAqIEBwYXJhbSBkYXRlSWR4XHJcbiAqIEBwYXJhbSBwZXJzXHJcbiAqIEBwYXJhbSBjb21tZW50XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gd3JpdGVSZWNvcmRISVJFKHdzLCBkYXRlSWR4IDogTG9jYWxEYXRlLCBwZXJzIDogUGVyc29uLCAgY29tbWVudDogc3RyaW5nIClcclxue1xyXG4gIHZhciBzdGFydElkeCA9IGNvcHlEYXRlKGRhdGVJZHgpO1xyXG4gIHZhciBlb20gPSBpc0VPTShkYXRlSWR4KTtcclxuICB3cy53cml0ZShwYWRTcGFjZVEocGVycy51c2VyLDUpKS53cml0ZSgnOycpO1xyXG4gIHdzLndyaXRlKHBhZFNwYWNlUShwZXJzLmxvY2F0aW9uLDIwKSkud3JpdGUoJzsnKTtcclxuICB3cy53cml0ZShwYWRTcGFjZVEocGVycy5FU1RBVCwxKSkud3JpdGUoJzsnKTsgLy8gd2UgYWx3YXlzIHdyaXRlIHRoaXMsIG5lZWRlZCBmb3IgU1RPUCByZWNvcmRzXHJcbiAgd3JpdGVUcmlwZWwod3MsIFwiMC4wXCIsIFwiMC4wXCIsIGZhbHNlKTsgLy8gcGVycy5oaXJlZFNPTSA/IFwiMS4wXCI6IFwiMC4wXCIgLHBlcnMuaGlyZWQgPyBcIjEuMFwiOiBcIjAuMFwiLGlzRU9NKGRhdGVJZHgpKTtcclxuICB2YXIgZGF5c0luUGVyaW9kID0gXCIwLjBcIjsgLy9zdGFydElkeC51bnRpbChkYXRlSWR4KS5kYXlzKCkgKyAxO1xyXG4gIHdzLndyaXRlKHBhZFNwYWNlKDAsMikpLndyaXRlKCc7Jyk7IC8vREFZU1dPUktFRFxyXG4gIHdyaXRlVHJpcGVsKHdzLCB0b0RlYzEoMCksdG9EZWMxKDApLGlzRU9NKGRhdGVJZHgpKTtcclxuICB3cy53cml0ZShwYWRTcGFjZSgwLDQpKS53cml0ZSgnOycpOyAvLyBGVEVXT1JLRURcclxuICB3cy53cml0ZShcIiAwOyAwOyAwO1wiKTtcclxuICAvL3dyaXRlVGVudXJlKHdzLCBkYXRlSWR4LCBwZXJzLCBlb20pOyAvLyBDSEVDSyBXSEVUSEVSIE1FQVNVUkUgT1IgRElNXHJcbiAgd3Mud3JpdGUoXCIgMDsgMDsgMDtcIilcclxuICAvL3dyaXRlQWdlKHdzLCBkYXRlSWR4LCBwZXJzLCBlb20pO1xyXG4gIHdzLndyaXRlKFwiMDtcIik7XHJcbiAgd3Mud3JpdGUoXCIxOzA7MDswO1wiICsgcGVycy5ldmVudFJlYXNvbiArXCI7XFxcIlwiICsgcGVycy5nZW5kZXIgKyBcIlxcXCI7XCIgKyBjb21tZW50ICsgXCJcXG5cIik7XHJcbn1cclxuXHJcblxyXG4vKipcclxuICogVGhpcyBmdW5jdGlvbiBkb2VzIG11dGF0ZSBwZXJzLCB1c2UgYSBjbG9uZSBpZiBub3QgZGVzaXJlZCFcclxuICogQHBhcmFtIHdzXHJcbiAqIEBwYXJhbSBkYXRlSWR4XHJcbiAqIEBwYXJhbSBwZXJzXHJcbiAqIEBwYXJhbSBjb21tZW50XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gd3JpdGVSZWNvcmRNT1ZFSU4od3MsIGRhdGVJZHggOiBMb2NhbERhdGUsIHBlcnMgOiBQZXJzb24sICBjb21tZW50OiBzdHJpbmcgKVxyXG57XHJcbiAgdmFyIHN0YXJ0SWR4ID0gY29weURhdGUoZGF0ZUlkeCk7XHJcbiAgdmFyIGVvbSA9IGlzRU9NKGRhdGVJZHgpO1xyXG4gIHdzLndyaXRlKHBhZFNwYWNlUShwZXJzLnVzZXIsNSkpLndyaXRlKCc7Jyk7XHJcbiAgd3Mud3JpdGUocGFkU3BhY2VRKHBlcnMubG9jYXRpb24sMjApKS53cml0ZSgnOycpO1xyXG4gIHdzLndyaXRlKHBhZFNwYWNlUShwZXJzLkVTVEFULDEpKS53cml0ZSgnOycpOyAvLyB3ZSBhbHdheXMgd3JpdGUgdGhpcywgbmVlZGVkIGZvciBTVE9QIHJlY29yZHNcclxuICB3cml0ZVRyaXBlbCh3cywgXCIwLjBcIiwgXCIwLjBcIiwgZmFsc2UpOyAvLyBwZXJzLmhpcmVkU09NID8gXCIxLjBcIjogXCIwLjBcIiAscGVycy5oaXJlZCA/IFwiMS4wXCI6IFwiMC4wXCIsaXNFT00oZGF0ZUlkeCkpO1xyXG4gIHZhciBkYXlzSW5QZXJpb2QgPSBcIjAuMFwiOyAvL3N0YXJ0SWR4LnVudGlsKGRhdGVJZHgpLmRheXMoKSArIDE7XHJcbiAgd3Mud3JpdGUocGFkU3BhY2UoMCwyKSkud3JpdGUoJzsnKTsgLy9EQVlTV09SS0VEXHJcbiAgd3JpdGVUcmlwZWwod3MsIHRvRGVjMSgwKSx0b0RlYzEoMCksaXNFT00oZGF0ZUlkeCkpO1xyXG4gIHdzLndyaXRlKHBhZFNwYWNlKDAsNCkpLndyaXRlKCc7Jyk7IC8vIEZURVdPUktFRFxyXG4gIHdzLndyaXRlKFwiIDA7IDA7IDA7XCIpO1xyXG4gIC8vd3JpdGVUZW51cmUod3MsIGRhdGVJZHgsIHBlcnMsIGVvbSk7IC8vIENIRUNLIFdIRVRIRVIgTUVBU1VSRSBPUiBESU1cclxuICB3cy53cml0ZShcIiAwOyAwOyAwO1wiKVxyXG4gIC8vd3JpdGVBZ2Uod3MsIGRhdGVJZHgsIHBlcnMsIGVvbSk7XHJcbiAgd3Mud3JpdGUoXCIwO1wiKTtcclxuICB3cy53cml0ZShcIjA7MDsxOzA7XCIgKyBwYWRTcGFjZVEocGVycy5ldmVudFJlYXNvbiw1KSArXCI7XFxcIlwiICsgcGVycy5nZW5kZXIgKyBcIlxcXCI7XCIgKyBjb21tZW50ICsgXCJcXG5cIik7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHdyaXRlU3RhdGVMaW5lUkFOR0Uod3MsIGRhdGVJZHggOiBMb2NhbERhdGUsIHBlcnMgOiBQZXJzb24sIG5leHRIaXJlLCBuZXh0TG9jLCBuZXh0RlRFLCBjb21tZW50OnN0cmluZykge1xyXG4gIGlmKHdzID09IHVuZGVmaW5lZCkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIFdyaXRlIGEgc3RhdGUgbGluZSBmb3IgTW9udGhseSBhZ2dyZWdhdGVzLCB0aGlzIGlzIGUuZy4gdGhlIEVuZC1vZiBtb250aCByZWNvcmQuXHJcbiAqIEBwYXJhbSB3c1xyXG4gKiBAcGFyYW0gZGF0ZUlkeFxyXG4gKiBAcGFyYW0gcGVyc1xyXG4gKiBAcGFyYW0gbmV4dEhpcmVcclxuICogQHBhcmFtIG5leHRMb2NcclxuICogQHBhcmFtIG5leHRGVEVcclxuICogQHBhcmFtIGNvbW1lbnRcclxuICovXHJcbmZ1bmN0aW9uIHdyaXRlU3RhdGVMaW5lTU9OQUcod3MsZGF0ZUlkeCA6IExvY2FsRGF0ZSwgcGVycyA6IFBlcnNvbiwgbmV4dEhpcmUsIG5leHRMb2MsIG5leHRGVEUsIHBhcnM6IEdlblBhcmFtcywgY29tbWVudDpzdHJpbmcpIHtcclxuICB3cml0ZURheSh3cywgcGVycy5wcmV2RGF0ZUVuZCwgZGF0ZUlkeCk7XHJcbiAgcGVycy5sb2NhdGlvbiA9IG5leHRMb2MgfHwgcGVycy5sb2NhdGlvbjtcclxuICBwZXJzLmZ0ZSA9IG5leHRGVEUgfHwgcGVycy5mdGU7XHJcbiAgLy9wZXJzLmxhc3RXcml0dGVuID0gZGF0ZUlkeDtcclxuICB3cml0ZVJlY29yZCh3cywgZGF0ZUlkeCwgcGVycywgcGFycywgXCJzdFwiICsgY29tbWVudCk7XHJcbiAgbWVtb3JpemVTT00oZGF0ZUlkeCxwZXJzKTtcclxuICBpZihuZXh0SGlyZSAhPSBwZXJzLmhpcmVkKSB7XHJcbiAgICB3cy53cml0ZShcIk5FVkVSXFxuXCIpXHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBpc1VuaGlyZWRDaGFuZ2UocGVyczogUGVyc29uLCBuZXh0SGlyZSwgbmV4dExvYywgbmV4dEZURSwgbmV4dEVTVEFUKSB7XHJcbiAgcmV0dXJuICAobmV4dEhpcmUgIT0gcGVycy5oaXJlZClcclxuICAgICAgIHx8ICggbmV4dExvYyAhPSBwZXJzLmxvY2F0aW9uIClcclxuICAgICAgIHx8ICggbmV4dEZURSAhPSBwZXJzLmZ0ZSApXHJcbiAgICAgICB8fCAoIG5leHRFU1RBVCAhPSBwZXJzLkVTVEFUICk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzQUNoYW5nZShwZXJzOiBQZXJzb24sIG5leHRIaXJlLCBuZXh0TG9jLCBuZXh0RlRFLCBuZXh0RVNUQVQpIHtcclxuICByZXR1cm4gIChuZXh0SGlyZSAhPSBwZXJzLmhpcmVkKVxyXG4gICAgICAgfHwgKHBlcnMuaGlyZWQgJiYgbmV4dExvYyAhPSBwZXJzLmxvY2F0aW9uIClcclxuICAgICAgIHx8IChwZXJzLmhpcmVkICYmIG5leHRGVEUgIT0gcGVycy5mdGUgKVxyXG4gICAgICAgfHwgKHBlcnMuaGlyZWQgJiYgbmV4dEVTVEFUICE9IHBlcnMuRVNUQVQgKTtcclxufVxyXG5cclxuZnVuY3Rpb24gaXNISVJFKCBwZXJzOiBQZXJzb24gLCBuZXh0SGlyZSApIHtcclxuICByZXR1cm4gcGVycy5oaXJlZCA9PSAwICYmIG5leHRIaXJlID09IDE7XHJcbn1cclxuZnVuY3Rpb24gaXNURVJNKCBwZXJzOiBQZXJzb24gLCBuZXh0SGlyZSApIHtcclxuICByZXR1cm4gcGVycy5oaXJlZCA9PSAxICYmIG5leHRIaXJlID09IDA7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNsb3NlUHJldmlvdXNSYW5nZSh3cywgZGF0ZUlkeDpMb2NhbERhdGUsIHBlcnM6IFBlcnNvbiwgcGFycyA6IEdlblBhcmFtcywgY29tbWVudDogc3RyaW5nKSB7XHJcbiAgdmFyIGRtaW4xID0gY29weURhdGUoZGF0ZUlkeCkubWludXNEYXlzKDEpO1xyXG4gIHdyaXRlRGF5KHdzLCBwZXJzLnByZXZEYXRlRW5kLCBkbWluMSk7XHJcbiAgd3JpdGVSZWNvcmQod3MsIGRtaW4xLCBwZXJzLCBwYXJzLCBjb21tZW50KTtcclxufVxyXG5cclxuZnVuY3Rpb24gd3JpdGVDaGFuZ2VMaW5lUkFOR0Uod3MsIGRhdGVJZHggOiBMb2NhbERhdGUsIHBlcnM6IFBlcnNvbiwgbmV4dEhpcmUsIG5leHRMb2MsIG5leHRGVEUsIG5leHRFU1RBVCwgcGFycyA6IEdlblBhcmFtcywgY29tbWVudDpzdHJpbmcpIHtcclxuICBpZiggd3MgPT0gdW5kZWZpbmVkKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIHZhciBpc0NoYW5nZSA9IGlzQUNoYW5nZShwZXJzLG5leHRIaXJlLG5leHRMb2MsbmV4dEZURSxuZXh0RVNUQVQpO1xyXG4gIGlmICggIWlzQ2hhbmdlICYmICFpc0VPTShkYXRlSWR4KSkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICAvLyBhdCBkYXRlSWR4IHRoZSBwZXJzb24gc3RhdGUgY2hhbmdlcyB0byBuZXcgc3RhdGUuXHJcbiAgLy8gY2xvbmUgdGhlIG9iamVjdFxyXG4gIHZhciBuZXh0UGVycyA9IF8uY2xvbmVEZWVwKHBlcnMpO1xyXG4gIG5leHRQZXJzLnByZXZEYXRlRW5kID0gY29weURhdGUobmV4dFBlcnMucHJldlJhbmdlRW5kKTsgLy8hISFcclxuICAvL3BlcnMgPSB1bmRlZmluZWQ7XHJcbiAgdmFyIGlzdGVybSA9IGlzVEVSTShuZXh0UGVycywgbmV4dEhpcmUpO1xyXG4gIGlmICggaXN0ZXJtICkge1xyXG4gICAgLy8gY2xvc2UgcHJldmlvdXMgcmVjb3JkXHJcbiAgICBjbG9zZVByZXZpb3VzUmFuZ2Uod3MsIGRhdGVJZHgsIG5leHRQZXJzLCBwYXJzLCAgXCJ0ZXJtY2xvc2UtMUBcIiArICBkYXRlSWR4ICsgJyAnICsgIGNvbW1lbnQpO1xyXG4gICAgcGVycy5wcmV2UmFuZ2VFbmQgPSBjb3B5RGF0ZShkYXRlSWR4KS5taW51c0RheXMoMSk7XHJcbiAgfSBlbHNlIGlmICggaXNISVJFKG5leHRQZXJzLG5leHRIaXJlKSkge1xyXG4gICAgLy9uZXh0UGVycy5sYXN0SGlyZWQgPSBkYXRlSWR4O1xyXG4gICAgcGVycy5wcmV2UmFuZ2VFbmQgPSBjb3B5RGF0ZShkYXRlSWR4KS5taW51c0RheXMoMSk7IC8vIFNFVCBUSElTIVxyXG4gICAgLy8gZG8gbm90aGluZywgd2lsbCBiZSBjYXB0dXJlZCBuZXh0XHJcbiAgfSBlbHNlIHtcclxuICAgIC8vIGNsb3NlIHByZXZpb3VzIHJlY29yZCwgYWx3YXlzXHJcbiAgICB2YXIgZG1pbjEgPSBjb3B5RGF0ZShkYXRlSWR4KS5taW51c0RheXMoMSk7XHJcbiAgICB3cml0ZURheSh3cywgbmV4dFBlcnMucHJldkRhdGVFbmQsIGRtaW4xKTtcclxuICAgIHdyaXRlUmVjb3JkKHdzLCBkbWluMSwgbmV4dFBlcnMgLCBwYXJzLCBcInBlcmNsb3NlLTEgZnJvbSBcIiArIGRhdGVJZHggKyAnICcgKyAgY29tbWVudCk7XHJcbiAgICBwZXJzLnByZXZSYW5nZUVuZCA9IGNvcHlEYXRlKGRhdGVJZHgpLm1pbnVzRGF5cygxKTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzU3RvcFJlY29yZHNSZXF1ZXN0ZWQocGFyczogR2VuUGFyYW1zKSB7XHJcbiAgcmV0dXJuICggcGFycy5vcHRzTU9OQUcgJiYgcGFycy5vcHRzTU9OQUcuc3RvcFJlY29yZHMpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpc05vWmVyb1JlcXVlc3RlZChwYXJzOiBHZW5QYXJhbXMpIHtcclxuICByZXR1cm4gKCBwYXJzLm9wdHNNT05BRyAmJiBwYXJzLm9wdHNNT05BRy5ub1plcm8pO1xyXG59XHJcblxyXG4vLyB3ZSB3cml0ZSBhIHJlY29yZCB3aXRoIGFsbCBtZWFzdXJlcyB6ZXJvIChvciBudWxsPylcclxuZnVuY3Rpb24gd3JpdGVTVE9QUmVjb3JkQWZ0ZXIod3MsIHBlcnMgOiBQZXJzb24sIGQgOiBMb2NhbERhdGUsIHBhcnM6IEdlblBhcmFtcywgY29tbWVudCA6IHN0cmluZyApIHtcclxuICB3cml0ZURheSh3cywgZCwgZCk7IC8vIFtkLWRdO1xyXG4gIHdyaXRlUmVjb3JkMCh3cywgZCwgcGVycywgY29tbWVudCk7XHJcbn1cclxuXHJcbi8vIHRoZXJlIGlzIGEgY2hhbmdlIEBkYXRlICwgbmV3IHZhbHVlcyBhcmUgdG8gdGhlIHJpZ2h0O1xyXG4vLyB0aGlzIGkgY2FsbGVkIG9uIGEgY2hhbmdlIGluIHZhbHVlcy5cclxuZnVuY3Rpb24gd3JpdGVDaGFuZ2VMaW5lTU9OQUcod3MsIGRhdGVJZHggOiBMb2NhbERhdGUsIHBlcnMgOlBlcnNvbiwgbmV4dEhpcmUsIG5leHRMb2MsIG5leHRGVEUsIG5leHRFU1RBVCwgcGFycyA6IEdlblBhcmFtcywgY29tbWVudDpzdHJpbmcpIHtcclxuICB2YXIgaXNDaGFuZ2UgPSBpc0FDaGFuZ2UocGVycywgbmV4dEhpcmUsIG5leHRMb2MsIG5leHRGVEUsIG5leHRFU1RBVCk7XHJcbiAgaWYgKCAhaXNDaGFuZ2UgJiYgIWlzRU9NKGRhdGVJZHgpKSB7XHJcbiAgICBwZXJzLmxvY2F0aW9uID0gbmV4dExvYztcclxuICAgIC8vcGVycy5uZXh0RlRFID0gbmV4dEZURTsgIC8vLyBUT0RPIEZJWCFcclxuICAgIHBlcnMuRVNUQVQgPSBuZXh0RVNUQVQ7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIHZhciBpc3Rlcm0gPSBpc1RFUk0ocGVycywgbmV4dEhpcmUpO1xyXG4gIGlmICggaXN0ZXJtICkge1xyXG4gICAgLy8gY2xvc2UgcHJldmlvdXMgcmVjb3JkXHJcbiAgICBpZiAoZGF0ZUlkeC5kYXlPZk1vbnRoKCkgIT0gMSkgeyAvLyB1bmxlc3Mgd2UgYWxyZWFkeSBjbG9zZWQgaXQgYnkgYSBtb250aCByZWNvcmRcclxuICAgICAgdmFyIGRtaW4xID0gY29weURhdGUoZGF0ZUlkeCkubWludXNEYXlzKDEpO1xyXG4gICAgICB3cml0ZURheSh3cywgcGVycy5wcmV2RGF0ZUVuZCwgZG1pbjEpO1xyXG4gICAgICB3cml0ZVJlY29yZCh3cywgZG1pbjEsIHBlcnMsIHBhcnMsIFwidGVybWNsb3NlLTFAXCIgKyAgZGF0ZUlkeCArICcgJyArIGNvbW1lbnQpO1xyXG4gICAgICBtZW1vcml6ZVNPTShkbWluMSxwZXJzKTtcclxuICAgIH1cclxuICAgIC8vIGFsd2F5cyB3cml0ZSBhIHN0b3AgcmVjb3JkIGlmIHJlcXVpcmVkXHJcbiAgICBpZiAoIGlzU3RvcFJlY29yZHNSZXF1ZXN0ZWQocGFycykpIHtcclxuICAgICAgd3JpdGVTVE9QUmVjb3JkQWZ0ZXIod3MscGVycyxkYXRlSWR4LCBwYXJzLCAgXCJzdG9wQWZ0ZXJtQFwiICsgIGRhdGVJZHggKyAnICcgKyBjb21tZW50KTtcclxuICAgIH1cclxuICAgIHBlcnMuaGlyZWQgPSAwO1xyXG4gICAgcGVycy5oaXJlZFByZXYgPSAwO1xyXG4gICAgLy9wZXJzLmxhc3RUZXJtID0gZGF0ZUlkeDtcclxuICB9IGVsc2UgaWYgKCBpc0hJUkUocGVycyxuZXh0SGlyZSkpIHtcclxuICAgICAgIC8vIHdyaXRlIEhJUkUgZXZlbnQgbGluZSAtPlxyXG4gICAgICAgcGVycy5sYXN0SGlyZWQgPSBkYXRlSWR4O1xyXG4gICAgICAgcGVycy5wcmV2RGF0ZUVuZCA9IGNvcHlEYXRlKGRhdGVJZHgpLm1pbnVzRGF5cygxKTtcclxuICAgICAgIC8vIGFkZGVkXHJcbiAgICAgICBwZXJzLmZ0ZVByZXYgPSBwZXJzLmZ0ZTtcclxuICAgICAgIHBlcnMuaGlyZWRQcmV2ID0gMTtcclxuICAgIGlmICggcGFycy5vcHRzTU9OQUcuc3RhcnRSZWNvcmRzICkge1xyXG4gICAgICB2YXIgZHAxID0gY29weURhdGUoZGF0ZUlkeCkucGx1c0RheXMoMik7XHJcbiAgICAgIHdyaXRlRGF5KHdzLCBkcDEsIGRhdGVJZHggKTtcclxuICAgICAgcGVycy5oaXJlZCA9IG5leHRIaXJlO1xyXG4gICAgICBwZXJzLmxvY2F0aW9uID0gbmV4dExvYztcclxuICAgICAgcGVycy5mdGUgPSBuZXh0RlRFO1xyXG4gICAgICB3cml0ZVJlY29yZEhJUkUod3MsIGRhdGVJZHgsIHBlcnMsIFwiaGlyZUBcIiArIGRhdGVJZHggKyAnICcgKyBjb21tZW50KTtcclxuICAgIH1cclxuICAgIC8vIGRvIG5vdGhpbmcsIHdpbGwgYmUgY2FwdHVyZWQgbmV4dFxyXG4gIH0gZWxzZSB7XHJcbiAgICAvLyBjbG9zZSBwcmV2aW91cyByZWNvcmRcclxuICAgIGlmICggZGF0ZUlkeC5kYXlPZk1vbnRoKCkgIT0gMSkge1xyXG4gICAgICAvLyB1bmxlc3Mgd2UgYWxyZWFkeSBjbG9zZWQgaXQgYnkgYSBtb250aCByZWNvcmRcclxuICAgICAgdmFyIGRtaW4xID0gY29weURhdGUoZGF0ZUlkeCkubWludXNEYXlzKDEpO1xyXG4gICAgICB3cml0ZURheSh3cywgcGVycy5wcmV2RGF0ZUVuZCwgZG1pbjEpO1xyXG4gICAgICB3cml0ZVJlY29yZCh3cywgZG1pbjEsIHBlcnMsIHBhcnMsIFwicHJldmNsb3NlIGZyb20gXCIgKyBkYXRlSWR4ICsgJyAnKyAgY29tbWVudCk7XHJcbiAgICAgIG1lbW9yaXplU09NKGRtaW4xLHBlcnMpO1xyXG4gICAgfVxyXG4gICAgLy8gYWx3YXlzIHdyaXRlIGEgc3RvcCByZWNvcmQgaWYgcmVxZXN0ZWRcclxuICAgIGlmICggaXNTdG9wUmVjb3Jkc1JlcXVlc3RlZChwYXJzKSkge1xyXG4gICAgICB3cml0ZVNUT1BSZWNvcmRBZnRlcih3cyxwZXJzLGRhdGVJZHgsIHBhcnMsICBcInN0b3BBZnRldmVAXCIgKyAgZGF0ZUlkeCArICcgJyArIGNvbW1lbnQpO1xyXG4gICAgfVxyXG4gICAgaWYgKCBwYXJzLm9wdHNNT05BRy5zdGFydFJlY29yZHMgJiYgcGVycy5oaXJlZCkge1xyXG4gICAgICB2YXIgZHAxID0gY29weURhdGUoZGF0ZUlkeCkucGx1c0RheXMoMik7XHJcbiAgICAgIHdyaXRlRGF5KHdzLCBkcDEsIGRhdGVJZHggKTtcclxuICAgICAgcGVycy5oaXJlZCA9IG5leHRIaXJlO1xyXG4gICAgICBwZXJzLmxvY2F0aW9uID0gbmV4dExvYztcclxuICAgICAgcGVycy5mdGUgPSBuZXh0RlRFO1xyXG4gICAgICB3cml0ZVJlY29yZE1PVkVJTih3cywgZGF0ZUlkeCwgcGVycywgXCJtb3ZlaW5AXCIgKyBkYXRlSWR4ICsgJyAnICsgY29tbWVudCk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHBlcnMuaGlyZWQgPSBuZXh0SGlyZTtcclxuICBwZXJzLmxvY2F0aW9uID0gbmV4dExvYztcclxuICBwZXJzLmZ0ZSA9IG5leHRGVEU7XHJcbiAgaWYgKGlzRU9NKGRhdGVJZHgpKSB7XHJcbiAgICAvLyBsYXRlciBzdXBwcmVzcyB1bmxlc3MgbGFzdFRlcm0gd2l0aGluIHJhbmdlXHJcbiAgICBpZiAoICFpc05vWmVyb1JlcXVlc3RlZChwYXJzKSB8fCAhaXNBbGxaZXJvKHBlcnMpKSB7XHJcbiAgICAgIHdyaXRlU3RhdGVMaW5lTU9OQUcod3MsZGF0ZUlkeCxwZXJzLCBwZXJzLmhpcmVkLCBwZXJzLmxvY2F0aW9uLCBwZXJzLmZ0ZSwgcGFycywgXCJXQ0xcIik7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vIHBlcmNlbnRhZ2VzXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNIaXJlQ2hhbmdlKHBhcnMgOiBHZW5QYXJhbXMpIDogYm9vbGVhbiB7XHJcbiAgcmV0dXJuIHBhcnMucmFuZG9tLnJhbmRvbSgpIDwgcGFycy5MX0hJUkU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldERPQihwYXJzIDogR2VuUGFyYW1zKSA6IExvY2FsRGF0ZSB7XHJcblxyXG4gIHZhciB5ZWFyID0gMTk1MCArIE1hdGguZmxvb3IocGFycy5yYW5kb20ucmFuZG9tKCkqNTUpO1xyXG4gIHZhciBtb250aCA9IE1hdGguZmxvb3IocGFycy5yYW5kb20ucmFuZG9tKCkqMTIpO1xyXG4gIHZhciBkYXliYXNlID0gTWF0aC5mbG9vcihwYXJzLnJhbmRvbS5yYW5kb20oKSozMSk7XHJcbiAgcmV0dXJuIExvY2FsRGF0ZS5vZih5ZWFyLDErbW9udGgsIDEpLnBsdXNEYXlzKGRheWJhc2UgLSAxKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdlblBlcnNvbihwLCBwYXJzOiBHZW5QYXJhbXMpIHtcclxuXHR2YXIgcGVycyA9IHtcclxuICAgIHVzZXIgOiBwLFxyXG4gICAgaGlyZWQ6IDAsXHJcbiAgICBoaXJlZFByZXYgOiAwLFxyXG4gICAgZnRlIDogMSxcclxuICAgIGZ0ZVByZXYgOiAwLFxyXG4gICAgZG9iIDogZ2V0RE9CKHBhcnMpLFxyXG4gICAgbG9jYXRpb24gOiBnZXRMb2NhdGlvbihwYXJzKSxcclxuICAgIHByZXZEYXRlRW5kIDogcGFycy5maXJzdERhdGUsXHJcbiAgICBwcmV2UmFuZ2VFbmQgOiBwYXJzLmZpcnN0RGF0ZSxcclxuICAgIGhpcmVkU09NIDogMCxcclxuICAgIGxhc3RIaXJlZCA6IHBhcnMuZmlyc3REYXRlLFxyXG4gICAgZnRlU09NIDogMCxcclxuICAgIEVTVEFUIDogXCJBXCIsXHJcbiAgICBFU1RBVFNPTSA6IFwiQVwiLFxyXG4gICAgZXZlbnRSZWFzb24gOiB1bmRlZmluZWQsXHJcbiAgICBnZW5kZXIgOiBnZXRHZW5kZXIocGFycylcclxuICB9IGFzIFBlcnNvbjtcclxuICB2YXIgbmV4dERhdGUgPSBnZXROZXh0KHBhcnMpICsgcGFycy5maXJzdERhdGUudG9FcG9jaERheSgpO1xyXG4gIGZvcih2YXIgaSA9IHBhcnMuZmlyc3REYXRlLnRvRXBvY2hEYXkoKTsgaSA8PSBwYXJzLmxhc3REYXRlLnRvRXBvY2hEYXkoKTsgKytpKSB7XHJcbiAgICB2YXIgZCA9IExvY2FsRGF0ZS5vZkVwb2NoRGF5KGkpO1xyXG4gICAgaWYgKCBpID09IG5leHREYXRlICkge1xyXG4gICAgICBpZiggaXNIaXJlQ2hhbmdlKHBhcnMpKSB7XHJcbiAgICAgICAvLyB3cml0ZUNoYW5nZUxpbmVNT05BRyhwYXJzLndzTU9OQUcsIGQscGVycywgcGVycy5oaXJlZCA/IDAgOiAxLCBuZXh0TG9jYXRpb24ocGFycyxwZXJzKSwgbmV4dEZURShwYXJzLHBlcnMpICAsIFwiSENcIik7XHJcbiAgICAgICAgLy8rXHJcbiAgICAgICAgLy8gT1JERVIgSVMgQ1JVQ0lBTCFcclxuICAgICAgICBwZXJzLmV2ZW50UmVhc29uID0gZ2V0SGlyZVRlcm1FdmVudFJlYXNvbihwYXJzLCBwZXJzLmhpcmVkKTtcclxuICAgICAgICBwZXJzLmxhc3RFdmVudERhdGUgPSBkO1xyXG4gICAgICAgIHZhciBubCA9IG5leHRMb2NhdGlvbihwYXJzLHBlcnMpO1xyXG4gICAgICAgIHZhciBuZiA9IG5leHRGVEUocGFycyxwZXJzKTtcclxuICAgICAgICB2YXIgbkVTVEFUID0gZ2V0TmV4dEVTVEFUKHBhcnMscGVycyxcIkVTVEFUXCIpO1xyXG4gICAgICAgIHdyaXRlQ2hhbmdlTGluZVJBTkdFKHBhcnMud3NSQU5HRSwgZCwgcGVycywgcGVycy5oaXJlZCA/IDAgOiAxLCBubCwgbmYsIG5FU1RBVCwgIHBhcnMsIFwiSENcIik7XHJcbiAgICAgICAgd3JpdGVDaGFuZ2VMaW5lTU9OQUcocGFycy53c01PTkFHLCBkLCBwZXJzLCBwZXJzLmhpcmVkID8gMCA6IDEsIG5sLCBuZiwgbkVTVEFULCBwYXJzLCBcIkhDXCIpO1xyXG4gICAgICAgIG5leHREYXRlICs9IGdldE5leHQocGFycyk7XHJcbiAgICAgIH0gZWxzZSBpZiAoaXNFdmVudChwYXJzKSkge1xyXG4gICAgICAgIHZhciBubCA9IG5leHRMb2NhdGlvbihwYXJzLCBwZXJzKTtcclxuICAgICAgICAvLyBmb3JjZVxyXG4gICAgICAgIHZhciBuZiA9IG5leHRGVEUocGFycywgcGVycyk7XHJcbiAgICAgICAgdmFyIG5FU1RBVCA9IGdldE5leHRFU1RBVChwYXJzLHBlcnMsXCJFU1RBVFwiKTtcclxuICAgICAgICB3aGlsZSggIWlzVW5oaXJlZENoYW5nZShwZXJzLHBlcnMuaGlyZWQsIG5sLG5mLCBuRVNUQVQpKSB7XHJcbiAgICAgICAgICBubCA9IG5leHRMb2NhdGlvbihwYXJzLCBwZXJzKTtcclxuICAgICAgICAgIC8vIGZvcmNlXHJcbiAgICAgICAgICBuZiA9IG5leHRGVEUocGFycywgcGVycyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHBlcnMubGFzdEV2ZW50RGF0ZSA9IGQ7XHJcbiAgICAgICAgcGVycy5ldmVudFJlYXNvbiA9IGdldE90aGVyRXZlbnRSZWFzb24ocGFycywgcGVycywgbmwpO1xyXG4gICAgICAgIHdyaXRlQ2hhbmdlTGluZVJBTkdFKHBhcnMud3NSQU5HRSwgZCwgcGVycywgcGVycy5oaXJlZCwgbmwsIG5mLCBuRVNUQVQsIHBhcnMsIFwiTENcIik7XHJcbiAgICAgICAgd3JpdGVDaGFuZ2VMaW5lTU9OQUcocGFycy53c01PTkFHLCBkLCBwZXJzLCBwZXJzLmhpcmVkLCBubCwgbmYsIG5FU1RBVCwgcGFycywgXCJMQ1wiICk7XHJcbiAgICAgICAgbmV4dERhdGUgKz0gZ2V0TmV4dChwYXJzKTtcclxuICAgICAgfSBlbHNlIGlmIChpc0VPTShkKSkge1xyXG4gICAgICAgICAgd3JpdGVTdGF0ZUxpbmVNT05BRyhwYXJzLndzTU9OQUcsIGQsIHBlcnMsIHBlcnMuaGlyZWQsIHBlcnMubG9jYXRpb24sIHBlcnMuZnRlLCBwYXJzLCBcIkVPTWVcIik7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAoaXNFT00oZCkpIHtcclxuICAgICAgLy9pZiggcGVycy5oaXJlZCA+IDAgKSB7XHJcbiAgICAgICAgaWYgKCAhaXNOb1plcm9SZXF1ZXN0ZWQocGFycykgfHwgIWlzQWxsWmVybyhwZXJzKSkge1xyXG4gICAgICAgICAgd3JpdGVTdGF0ZUxpbmVNT05BRyhwYXJzLndzTU9OQUcsIGQsIHBlcnMsIHBlcnMuaGlyZWQsIHBlcnMubG9jYXRpb24sIHBlcnMuZnRlLCBwYXJzLCBcIkVPTVwiKTtcclxuICAgICAgICB9XHJcbiAgICAgIC8vfVxyXG4gICAgICAvLyBlbHNlIHtcclxuICAgICAgICBtZW1vcml6ZVNPTShkLHBlcnMpO1xyXG4gICAgICAvL31cclxuICAgIH1cclxuXHR9O1xyXG59XHJcblxyXG5cclxudmFyIHByaW1lcyAgPSBbXTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRNYXhQcmltZXMobnI6IG51bWJlcikgOiBudW1iZXIge1xyXG4gIHZhciBtYXggPSBNYXRoLmZsb29yKE1hdGguc3FydChucikrMyk7XHJcbiAgdmFyIG1wID0gMTtcclxuICB2YXIgcmVtYWluID0gbnI7XHJcbiAgZm9yKHZhciBpID0gMTsgaSA8PSBtYXg7ICsraSApIHtcclxuICAgIGlmIChyZW1haW4gPT0gMSkge1xyXG4gICAgICByZXR1cm4gbXA7XHJcbiAgICB9XHJcbiAgICB3aGlsZShpID4gMSAmJiAgKHJlbWFpbiAlIGkgPT0gMCkpIHtcclxuICAgICAgbXAgPSBNYXRoLm1heChtcCxpKTtcclxuICAgICAgcmVtYWluID0gcmVtYWluL2k7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiByZW1haW47XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZW5VU0VSSGllcmFyY2h5KG5ycGVycyA6IG51bWJlciApIHtcclxuICB2YXIgd3MgPSBnZXRXUyggXCJESU1fVVNFUl9cIiArIHBhZFplcm9zKG5ycGVycyw2KSArIFwiLmNzdlwiKTtcclxuICBnZW5VU0VSSGllcmFyY2h5Vyh3cyxucnBlcnMpO1xyXG4gIHdzLndzLmVuZCgpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpc0RpZ2l0KGNoYXIgOiBzdHJpbmcpIHtcclxuICByZXR1cm4gXCIwMTIzNDU2Nzg5XCIuaW5kZXhPZihjaGFyKSA+PSAwO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpc0xpbmVTdGFydGluZ1dpdGhEaWdpdChsaW5lIDogc3RyaW5nKSB7XHJcbiAgdmFyIGxpbmVzID0gJycrbGluZTtcclxuICByZXR1cm4gbGluZXMubGVuZ3RoID4gMCAmJiAgaXNEaWdpdChsaW5lcy5jaGFyQXQoMCkpO1xyXG59XHJcblxyXG4vKipcclxuICogQWxzbyBzdHJpcHMgY29tbWVudHMgbGluZXMgd2l0aCAjXHJcbiAqIEBwYXJhbSBmaWxlbmFtZTFcclxuICogQHBhcmFtIGZpbGVuYW1lMlxyXG4gKiBAcGFyYW0gZG9uZVxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGNsZWFuc2VXU0NvbW1lbnRzUmVwZWF0ZWRIZWFkZXJJbkZpbGUoZmlsZW5hbWUxOiBzdHJpbmcsIGFkZERhdGE6IGJvb2xlYW4sIHNhbXBsZXMgOiBzdHJpbmdbXSwgZmlsZW5hbWUyIDogc3RyaW5nLCBkb25lIDogYW55ICkgOiBhbnkge1xyXG4gIC8vdmFyIGxuID0gZnMucmVhZEZpbGVTeW5jKGZpbGVuYW1lMSwgeyBlbmNvZGluZyA6ICd1dGYtOCd9KTtcclxuICB2YXIgd3NPdXQgPSBnZXRXUyhmaWxlbmFtZTIpO1xyXG4gIHZhciBmaXJzdCA9IHRydWU7XHJcbiAgaWYgKCBhZGREYXRhICkge1xyXG4gICAgc2FtcGxlcy5mb3JFYWNoKCBzbiA9PiB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCcgYXBwZW5kaW5nICcgKyBzbik7XHJcbiAgICAgIGFwcGVuZENsZWFuc2luZyhzbiwgZmlyc3QsIHdzT3V0KTtcclxuICAgICAgZmlyc3QgPSBmYWxzZTtcclxuICAgIH0pO1xyXG4gIH1cclxuICBhcHBlbmRDbGVhbnNpbmcoZmlsZW5hbWUxLCBmaXJzdCwgd3NPdXQpO1xyXG4gIHdzT3V0LndzLm9uKCdmaW5pc2gnLCAoKSA9PiB7IGRvbmUoKTsgfSk7XHJcbiAgd3NPdXQud3MuZW5kKCk7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIGFwcGVuZENsZWFuc2luZyhmaWxlbmFtZTE6IHN0cmluZywgaXNGaXJzdEZpbGU6IGJvb2xlYW4sIHdzT3V0OiBhbnkpIDogYW55IHtcclxuICBjb25zdCBsaW5lciA9IG5ldyBsaW5lQnlMaW5lKGZpbGVuYW1lMSk7XHJcbiAgdmFyIGxpbmUgPSBcIlwiO1xyXG4gIHZhciBuciA9IDA7XHJcbiAgd2hpbGUoIGxpbmUgPSBsaW5lci5uZXh0KCkgKXtcclxuICAgIHZhciBpc0RhdGFMaW5lID0gbGluZSAmJiBpc0xpbmVTdGFydGluZ1dpdGhEaWdpdChsaW5lKTtcclxuICAgIHZhciBpc0NvbW1lbnRMaW5lID0gbGluZSAmJiAoJycrbGluZSkuc3RhcnRzV2l0aCgnIycpO1xyXG4gICAgdmFyIGlzRmlyc3RIZWFkZXJMaW5lID0gKCBuciA8IDEgKSAmJiAhaXNDb21tZW50TGluZSAmJiAhaXNEYXRhTGluZTtcclxuXHJcbiAgICBpZiAoIGlzRGF0YUxpbmUgfHwgKGlzRmlyc3RIZWFkZXJMaW5lICYmIGlzRmlyc3RGaWxlKSkge1xyXG4gICAgICB3c091dC53cml0ZSggKCcnICsgbGluZSkucmVwbGFjZSgvO1xccysvZyxcIjtcIikgKS53cml0ZSgnXFxuJyk7XHJcbiAgICAgICsrbnI7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25zb2xlLmxvZygnIGRyb3BwaW5nICcgKyBpc0RhdGFMaW5lICsgJyAnICsgaXNGaXJzdEhlYWRlckxpbmUgKyAnICcgKyBpc0NvbW1lbnRMaW5lICsgJyAnICsgbGluZSk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2VuVXNlcihpIDogbnVtYmVyKSA6IHN0cmluZyB7XHJcbiAgcmV0dXJuICdQJyArIHBhZFplcm9zKGksNSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZW5VU0VSSGllcmFyY2h5Vyh3cyA6IGFueSwgbnJwZXJzIDogbnVtYmVyICkge1xyXG4gIC8vIHdlIGJ1aWxkIGEgcGFyZW50IGNoaWxkIGhpZXJhcmNoeSAgdXNpbmcgcHJpbWUgbnVtYmVyIGRlY29tcG9zaXRpb24sXHJcbiAgLy8gd2UgYnVpbGQgYSBwYXJlbnQgY2hpbGQgaGllcmFyY2h5ICB1c2luZyBwcmltZSBudW1iZXIgZGVjb21wb3NpdGlvbixcclxuICAvLyB3aXRoIHBlcnNvbnMgbWFkZSBjaGlsZHJlbiBvZiB0aGUgXCJsYWdlc3QgcHJpbWUgZmFjdG9yXCJcclxuICAvLyB0byBub3QgZW5kIHVwIHdpdGggdG9vIG1hbnkgcm9vdHMgd2Ugb25seSBtYWtlIGV2ZXJ5IG4tdGggcHJpbWUgZmFjdG9yIGEgcm9vdC5cclxuICB2YXIgcmVzID0ge307XHJcbiAgdmFyIG5yUHJpbWVzID0gMDtcclxuICAvLyAxMyAtIDUgLSAyXHJcbiAgZm9yKHZhciBpID0gMTsgaSA8PSBucnBlcnM7ICsraSApIHtcclxuICAgIHZhciBwcmltID0gZ2V0TWF4UHJpbWVzKGkpO1xyXG4gICAgaWYoICFyZXNbcHJpbV0pIHtcclxuICAgICAgKytuclByaW1lcztcclxuICAgICAgaWYgKCAoaSA+IDEwKSAmJiAobnJQcmltZXMgJSAyMCAhPSAxNSkgKSB7XHJcbiAgICAgICAgdmFyIHByaW1QYXIgPSBnZXRNYXhQcmltZXMoTWF0aC5mbG9vcihpLzEwKSk7XHJcbiAgICAgICAgcmVzW3ByaW1dID0gcHJpbVBhcjtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXNbcHJpbV0gPSAtMTsgLy8gYSByb290XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmKCBpICE9IHByaW0gKSB7XHJcbiAgICAgIHJlc1tpXSA9IHByaW07XHJcbiAgICB9XHJcbiAgfVxyXG4gIC8vZHVtcCB0aGUgbGlzdFxyXG4gIHdzLndyaXRlKFwiVVNFUjtVU0VSX1BBUkVOVFxcblwiKTtcclxuICBmb3IodmFyIGkgPSAxOyBpIDw9IG5ycGVyczsgKytpKSB7XHJcbiAgICB3cy53cml0ZShnZW5Vc2VyKGkpKS53cml0ZSgnOycpO1xyXG4gICAgaWYgKCByZXNbaV0gPiAwICkge1xyXG4gICAgICB3cy53cml0ZShnZW5Vc2VyKHJlc1tpXSkpLndyaXRlKCdcXG4nKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHdzLndyaXRlKFwiXFxuXCIpOyAvL051bGwhXHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG4iXX0=
