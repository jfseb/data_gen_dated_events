"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genUSERHierarchyW = exports.genUser = exports.cleanseWSCommentsRepeatedHeaderInFile = exports.genUSERHierarchy = exports.getMaxPrimes = exports.genPerson = exports.isHireChange = exports.writeRecord0 = exports.writeRecord = exports.memorizeSOM = exports.toDec1 = exports.writeTripel = exports.writeAge = exports.getSOM = exports.writeTenure = exports.writeTENUREAGE = exports.diffMonth = exports.diffYears = exports.writeDay = exports.makeQuarter = exports.writeHeader = exports.daysInMonth = exports.EOMONTH = exports.asDate = exports.padSpaceQ = exports.padSpace = exports.padZeros = exports.isEOY = exports.isEOQ = exports.copyDate = exports.Person = exports.GenParams = exports.OptsMONAG = exports.getWS = exports.WSWrap2 = exports.makeMap = exports.dateToDayIndex = exports.EXCELOFFSET = void 0;
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
    return Math.floor(pars.random() * pars.AVG_NEXT) + 1;
}
function getLocation(pars) {
    return pars.LOCATIONs[Math.floor(pars.random() * pars.LOCATIONs.length)];
}
function getESTAT(pars, key) {
    return pars.ESTATs[Math.floor(pars.randomOD[key]() * pars.ESTATs.length)];
}
function nextLocation(pars, pers) {
    if (pars.random() < pars.LOCCHANGE) {
        return getLocation(pars);
    }
    return pers.location;
}
function nextFTE(pars, pers) {
    if (pars.random() < pars.FTECHANGE) {
        if (pers.fte == 1) {
            return 0.5;
        }
        return 1.0;
    }
    return pers.fte;
}
function getNextESTAT(pars, pers, key) {
    //  pars.randomOD[key]();
    if (pars.randomOD[key]() < pars.ESTATCHANGE) {
        return getESTAT(pars, key);
    }
    return pers.ESTAT;
}
function isEvent(pars) {
    return pars.random() < pars.L_EVENT;
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
    pers.prevDateEnd = copyDate(dateIdx);
    ws.write(comment + "\n");
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
    ws.write(comment + "\n");
}
exports.writeRecord0 = writeRecord0;
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
        closePreviousRange(ws, dateIdx, nextPers, pars, "termclose-1" + dateIdx + ' ' + comment);
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
        pers.lastHired = dateIdx;
        pers.prevDateEnd = copyDate(dateIdx).minusDays(1);
        // added
        pers.ftePrev = pers.fte;
        pers.hiredPrev = 1;
        // do nothing, will be captured next
    }
    else {
        // close previous record
        if (dateIdx.dayOfMonth() != 1) {
            // unless we already closed it by a month record
            var dmin1 = copyDate(dateIdx).minusDays(1);
            writeDay(ws, pers.prevDateEnd, dmin1);
            writeRecord(ws, dmin1, pers, pars, "perclose-1 from " + dateIdx + ' ' + comment);
            memorizeSOM(dmin1, pers);
        }
        // always write a stop record if reqested
        if (isStopRecordsRequested(pars)) {
            writeSTOPRecordAfter(ws, pers, dateIdx, pars, "stopAfteve@" + dateIdx + ' ' + comment);
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
    return pars.random() < pars.L_HIRE;
}
exports.isHireChange = isHireChange;
function getDOB(pars) {
    var year = 1950 + Math.floor(pars.random() * 55);
    var month = Math.floor(pars.random() * 12);
    var daybase = Math.floor(pars.random() * 31);
    return core_1.LocalDate.of(year, 1 + month, 1).plusDays(daybase - 1);
}
//LocalDate.of(1950+Math.floor(pars.random()*55),Math.floor(pars.random()*12),Math.floor(pars.random()*31)),
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
    };
    var nextDate = getNext(pars) + pars.firstDate.toEpochDay();
    for (var i = pars.firstDate.toEpochDay(); i <= pars.lastDate.toEpochDay(); ++i) {
        var d = core_1.LocalDate.ofEpochDay(i);
        if (i == nextDate) {
            if (isHireChange(pars)) {
                // writeChangeLineMONAG(pars.wsMONAG, d,pers, pers.hired ? 0 : 1, nextLocation(pars,pers), nextFTE(pars,pers)  , "HC");
                //+
                // ORDER IS CRUCIAL!
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
    return "0123456789".indexOf(char) > 0;
}
function isDigitStartLine(line) {
    var lines = '' + line;
    return lines.length > 0 && !isDigit(lines.charAt(0));
}
/**
 * Also strips comments lines with #
 * @param filename1
 * @param filename2
 * @param done
 */
function cleanseWSCommentsRepeatedHeaderInFile(filename1, filename2, done) {
    //var ln = fs.readFileSync(filename1, { encoding : 'utf-8'});
    var wsOut = getWS(filename2);
    const liner = new lineByLine(filename1);
    var line = "";
    var nr = 0;
    while (line = liner.next()) {
        if (line && !('' + line).startsWith('#') && (nr < 1 || isDigitStartLine(line))) {
            wsOut.write(('' + line).replace(/;\s+/g, ";")).write('\n');
            ++nr;
        }
    }
    wsOut.ws.on('finish', () => { done(); });
    wsOut.ws.end();
}
exports.cleanseWSCommentsRepeatedHeaderInFile = cleanseWSCommentsRepeatedHeaderInFile;
function genUser(i) {
    return 'P' + padZeros(i, 5);
}
exports.genUser = genUser;
function genUSERHierarchyW(ws, nrpers) {
    // we build a parent child hierarchy  using prime number decomposition,
    // we build a parent child hierarchy  using prime number decomposition,
    // with persons made children of the "lagest prime factor"
    // to not end up with too many roots we only make every n-th prime factor a root.
    //
    //
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,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QUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNqRCxFQUFFLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsZ0RBQWdEO0lBQzlGLFdBQVcsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFBLENBQUMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFBLENBQUMsQ0FBQyxLQUFLLEVBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDeEYsSUFBSSxZQUFZLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDdEQsRUFBRSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxZQUFZLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxZQUFZO0lBQzVFLFdBQVcsQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDbEYsRUFBRSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsT0FBTyxHQUFHLFlBQVksRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLFlBQVk7SUFDM0YsV0FBVyxDQUFDLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEdB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LE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUN2QzthQUFNO1lBQ0wsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU87U0FDeEI7S0FDRjtBQUNILENBQUM7QUFuQ0QsOENBbUNDIiwiZmlsZSI6ImhlbHBlcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgZnMgPSByZXF1aXJlKCdmcycpO1xyXG5jb25zdCB7IGV4aXQgfSA9IHJlcXVpcmUoJ3Byb2Nlc3MnKTtcclxuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgKiBhcyBsaW5lQnlMaW5lIGZyb20gJ24tcmVhZGxpbmVzJztcclxuaW1wb3J0ICogYXMgcmVhZGxpbmUgZnJvbSAncmVhZGxpbmUnO1xyXG5cclxuLy92YXIgc2VlZHJhbmRvbSA9IHJlcXVpcmUoJ3NlZWRyYW5kb20nKTtcclxuaW1wb3J0ICogYXMgc2VlZHJhbmRvbSBmcm9tICdzZWVkcmFuZG9tJztcclxuLy8gRVhDRUxcclxuLy8gICAgIDEgMTkwMC0wMS0wMVxyXG4vLyAyNTU2OSAxOTcwLTAxLTAxXHJcbi8vXHJcbmV4cG9ydCBjb25zdCBFWENFTE9GRlNFVCA9IDI1NTY5O1xyXG5cclxuaW1wb3J0IHtMb2NhbERhdGUgfSBmcm9tICBcIkBqcy1qb2RhL2NvcmVcIjtcclxuaW1wb3J0IHsgU1NMX09QX0RPTlRfSU5TRVJUX0VNUFRZX0ZSQUdNRU5UUyB9IGZyb20gJ2NvbnN0YW50cyc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZGF0ZVRvRGF5SW5kZXgoZCA6IExvY2FsRGF0ZSApIDogbnVtYmVyIHtcclxuICByZXR1cm4gIGQudG9FcG9jaERheSgpICsgRVhDRUxPRkZTRVQ7XHJcbn1cclxuXHJcbnZhciBkMSA9IExvY2FsRGF0ZS5vZigyMDIwLDEsNik7XHJcbnZhciBkMUlkeCA9IGRhdGVUb0RheUluZGV4KGQxKTtcclxudmFyIGQyID0gTG9jYWxEYXRlLm9mKDIwMjQsNiwxKTtcclxudmFyIGQySWR4ID0gZGF0ZVRvRGF5SW5kZXgoZDIpO1xyXG52YXIgZGVsdGFUaW1lID0gZDJJZHgtZDFJZHg7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbWFrZU1hcChvYmopIHtcclxuICB2YXIgaWR4ID0gMDtcclxuICB2YXIgcmVzID0gW107XHJcbiAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMob2JqKS5mb3JFYWNoKCBmdW5jdGlvbihhKSB7XHJcbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgb2JqW2FdOyArK2kpIHtcclxuICAgICAgcmVzLnB1c2goYSk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbiAgcmV0dXJuIHJlcztcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFdTV3JhcDIgIHtcclxuICB3czogYW55O1xyXG4gIF9sb2c6IGFueTtcclxuICBfb25GaW5pc2ggOiBhbnk7XHJcbiAgY29uc3RydWN0b3IoZm4gOiBzdHJpbmcpXHJcbiAge1xyXG4gICAgdGhpcy53cyA9IHRoaXM7XHJcbiAgICB0aGlzLl9sb2cgPSBmcy5vcGVuU3luYyhmbiwndycpO1xyXG4gICAgdGhpcy5fb25GaW5pc2ggPSB1bmRlZmluZWQ7XHJcbiAgfVxyXG4gIG9uKCBzIDogc3RyaW5nLCBmbiA6IGFueSkge1xyXG4gICAgdGhpcy5fb25GaW5pc2ggPSBmbjtcclxuICB9XHJcbiAgZW5kKCkge1xyXG4gICAgZnMuY2xvc2VTeW5jKHRoaXMuX2xvZyk7XHJcbiAgICB0aGlzLl9sb2cgPSB1bmRlZmluZWQ7XHJcbiAgICBpZiggdGhpcy5fb25GaW5pc2gpIHtcclxuICAgICAgdGhpcy5fb25GaW5pc2goKTtcclxuICAgIH1cclxuICB9XHJcbiAgd3JpdGUoYSA6IGFueSkge1xyXG4gICAgZnMud3JpdGVTeW5jKHRoaXMuX2xvZywgJycgKyBhKTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxufTtcclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0V1MoZmlsZW5hbWU6IHN0cmluZykgOiBXU1dyYXAyIHtcclxuXHJcbiAgcmV0dXJuIG5ldyBXU1dyYXAyKGZpbGVuYW1lKTtcclxufVxyXG5cclxuXHJcbi8vIDEgU2ltcGxlIHJhbmdlIGJhc2VkICAobm8gbW9udGhseSBpbnRlcmltIGRhdGEpXHJcbi8vICBbeHh4XS1beXl5XSAgPGF0dHJpYnV0ZXM+XHJcbi8vXHJcbi8vICBvcHRpb25hbCBzcHJpbmtsZSBpbiAwLDAsMCwwIDxhdHRyaWJ1dGVzPiBNYXJrICBFT00vRU9QIG51bWJlcnMuXHJcbi8vXHJcbi8vdG8gc3VwcG9ydCBkaWZmZXJlbnQgb3V0cHV0IGZsYXZvdXJzLFxyXG4vL1xyXG4vL1xyXG5cclxuZXhwb3J0IGNsYXNzIE9wdHNNT05BRyB7XHJcbiAgbm9aZXJvIDogYm9vbGVhbjtcclxuICBzdG9wUmVjb3JkcyA6IGJvb2xlYW47XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBHZW5QYXJhbXMge1xyXG4gIE5SUEVSUyA6IG51bWJlcjtcclxuICBBVkdfTkVYVCA6IG51bWJlcjtcclxuICBMT0NDSEFOR0UgOiBudW1iZXI7XHJcbiAgRlRFQ0hBTkdFOiBudW1iZXI7XHJcbiAgRVNUQVRDSEFOR0U6bnVtYmVyO1xyXG4gIExfSElSRSA6IG51bWJlcjtcclxuICBMX0VWRU5UIDogbnVtYmVyO1xyXG4gIExPQ0FUSU9Oczogc3RyaW5nW107XHJcbiAgRVNUQVRzIDogc3RyaW5nW107XHJcbiAgZmlyc3REYXRlIDogTG9jYWxEYXRlO1xyXG4gIGxhc3REYXRlIDogTG9jYWxEYXRlO1xyXG4gIHJhbmRvbSA6IGFueTtcclxuICB3c01PTkFHIDogYW55O1xyXG4gIG9wdHNNT05BRz8gOiBPcHRzTU9OQUc7XHJcbiAgd3NSQU5HRSA6IGFueTtcclxuICBvcHRzUkFOR0UgOiBhbnk7XHJcbiAgcmFuZG9tT0QgOiBhbnk7IC8vIHsgXCJFU1RBVFwiIDogc2VlZHJhbmRvbSgnWFpZJykgfSxcclxuICBSRU9QX0VTVEFUUyA6IHN0cmluZ1tdOyAvLyBFU1RBVFMgd2hpY2ggY29udHJpYnV0ZSB0byBFT1AsIHRoaXMgaXMganVzdCBoZWFkIGNvdW50IElGIEVTVEFUIElOIFtcIkFcIixcIlVcIixcIlBcIl0gRU9QX0hDIDogMFxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUGVyc29uIHtcclxuICAvLyBpbW11dGFibGVcclxuICB1c2VyOiBzdHJpbmc7XHJcbiAgLy8gY2hhbmdpbmdcclxuICBkb2I6IExvY2FsRGF0ZTtcclxuICBsb2NhdGlvbiA6IHN0cmluZztcclxuICBoaXJlZDogbnVtYmVyO1xyXG4gIGhpcmVkU09NOiBudW1iZXI7XHJcbiAgaGlyZWRQcmV2IDogbnVtYmVyOyAvLyBwZXJzb24gIGhpcmUgc3RhdGUgcHJldmlvdXMgcmFuZ2VcclxuICBmdGUgOiBudW1iZXI7XHJcbiAgZnRlUHJldiA6IG51bWJlcjsgLy8gcGVyc29uIGZ0ZSBzdGF0ZSBwcmV2aW91cyByYW5nZVxyXG4gIGZ0ZVNPTTogbnVtYmVyO1xyXG4gIEVTVEFUIDogc3RyaW5nO1xyXG4gIEVTVEFUUHJldiA6IHN0cmluZztcclxuICBFU1RBVFNPTSA6IHN0cmluZztcclxuICAvLyBjaGFuZ2luZ1xyXG4gIGxhc3RIaXJlZDogTG9jYWxEYXRlO1xyXG4gIHByZXZEYXRlRW5kIDogTG9jYWxEYXRlO1xyXG4gIHByZXZSYW5nZUVuZDogTG9jYWxEYXRlOyAvLyBlbmQgb2YgbGFzdCByYW5nZVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXROZXh0KHBhcnM6R2VuUGFyYW1zKSB7XHJcbiAgcmV0dXJuIE1hdGguZmxvb3IocGFycy5yYW5kb20oKSAqIHBhcnMuQVZHX05FWFQpICsgMTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0TG9jYXRpb24ocGFyczogR2VuUGFyYW1zKSB7XHJcbiAgcmV0dXJuIHBhcnMuTE9DQVRJT05zW01hdGguZmxvb3IocGFycy5yYW5kb20oKSAqIHBhcnMuTE9DQVRJT05zLmxlbmd0aCldO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRFU1RBVChwYXJzOiBHZW5QYXJhbXMsIGtleSA6IHN0cmluZykge1xyXG4gIHJldHVybiBwYXJzLkVTVEFUc1tNYXRoLmZsb29yKHBhcnMucmFuZG9tT0Rba2V5XSgpICogcGFycy5FU1RBVHMubGVuZ3RoKV07XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBuZXh0TG9jYXRpb24ocGFyczogR2VuUGFyYW1zLCBwZXJzIDogUGVyc29uKSB7XHJcbiAgaWYoIHBhcnMucmFuZG9tKCkgPCBwYXJzLkxPQ0NIQU5HRSkge1xyXG4gICAgcmV0dXJuIGdldExvY2F0aW9uKHBhcnMpO1xyXG4gIH1cclxuICByZXR1cm4gIHBlcnMubG9jYXRpb247XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG5leHRGVEUocGFyczogR2VuUGFyYW1zLCBwZXJzIDogUGVyc29uKSB7XHJcbiAgaWYoIHBhcnMucmFuZG9tKCkgPCBwYXJzLkZURUNIQU5HRSkge1xyXG4gICAgaWYoIHBlcnMuZnRlID09IDEpIHtcclxuICAgICAgcmV0dXJuIDAuNTtcclxuICAgIH1cclxuICAgIHJldHVybiAxLjA7XHJcbiAgfVxyXG4gIHJldHVybiBwZXJzLmZ0ZTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldE5leHRFU1RBVChwYXJzOiBHZW5QYXJhbXMsIHBlcnMgOiBQZXJzb24sIGtleSA6IHN0cmluZykge1xyXG4vLyAgcGFycy5yYW5kb21PRFtrZXldKCk7XHJcbiAgaWYoIHBhcnMucmFuZG9tT0Rba2V5XSgpIDwgcGFycy5FU1RBVENIQU5HRSkge1xyXG4gICAgcmV0dXJuIGdldEVTVEFUKHBhcnMsIGtleSk7XHJcbiAgfVxyXG4gIHJldHVybiAgcGVycy5FU1RBVDtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGlzRXZlbnQocGFyczpHZW5QYXJhbXMpIHtcclxuICByZXR1cm4gcGFycy5yYW5kb20oKSA8IHBhcnMuTF9FVkVOVDtcclxufVxyXG5cclxuZnVuY3Rpb24gaXNFT00oZGF0ZUlkeCA6IExvY2FsRGF0ZSkge1xyXG4gIHZhciBkID0gY29weURhdGUoZGF0ZUlkeCkucGx1c0RheXMoMSk7XHJcbiAgaWYoZC5kYXlPZk1vbnRoKCkgPT0gMSlcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNvcHlEYXRlKGQgOiBMb2NhbERhdGUpIHtcclxuICByZXR1cm4gTG9jYWxEYXRlLm9mRXBvY2hEYXkoZC50b0Vwb2NoRGF5KCkpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNFT1EoZDogTG9jYWxEYXRlKSB7XHJcbiAgZCA9IGNvcHlEYXRlKGQpLnBsdXNEYXlzKDEpO1xyXG4gIGlmKGQuZGF5T2ZNb250aCgpID09IDEgJiYgIFsxLDQsNywxMF0uaW5kZXhPZihkLm1vbnRoVmFsdWUoKSkgPj0gMClcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNFT1koZCA6IExvY2FsRGF0ZSkge1xyXG4gIHZhciBkID0gY29weURhdGUoZCkucGx1c0RheXMoMSk7XHJcbiAgaWYoZC5kYXlPZk1vbnRoKCkgPT0gMSAmJiBkLm1vbnRoVmFsdWUoKSA9PSAxKVxyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgcmV0dXJuIGZhbHNlO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcGFkWmVyb3MoYSA6IGFueSwgbGVuIDogbnVtYmVyKSB7XHJcbiAgdmFyIHMgPSBcIlwiICthO1xyXG4gIHJldHVybiBcIjAwMDAwMDBcIi5zdWJzdHIoMCwgbGVuIC0gcy5sZW5ndGgpICsgcztcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHBhZFNwYWNlKGEgOiBhbnksIGxlbiA6IG51bWJlcikge1xyXG4gIHZhciBzID0gXCJcIiArYTtcclxuICByZXR1cm4gXCIgICAgICAgICAgICAgICAgICAgXCIuc3Vic3RyKDAsIGxlbiAtIHMubGVuZ3RoKSArIHM7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBwYWRTcGFjZVEoYSA6IGFueSwgbGVuIDogbnVtYmVyKSB7XHJcbiAgdmFyIHMgPSBcIlwiICthO1xyXG4gIHJldHVybiAnXCInICsgcyArICdcIicgKyBcIiAgICAgICAgICAgICAgICAgICBcIi5zdWJzdHIoMCwgbGVuIC0gcy5sZW5ndGgpO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGFzRGF0ZShkYXRlSWR4IDogTG9jYWxEYXRlKTogc3RyaW5nIHtcclxuICB2YXIgZCA9ZGF0ZUlkeDtcclxuICByZXR1cm4gJycgKyBkO1xyXG4gIC8vcmV0dXJuIGQueWVhcigpICsgXCItXCIgKyBwYWQoZC5tb250aFZhbHVlKCksMikgKyBcIi1cIiArIHBhZChkLmRheU9mTW9udGgoKSwyKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEVPTU9OVEgoZCA6IExvY2FsRGF0ZSkgOiBMb2NhbERhdGUge1xyXG4gIHJldHVybiBjb3B5RGF0ZShkKS5wbHVzTW9udGhzKDEpLndpdGhEYXlPZk1vbnRoKDEpLm1pbnVzRGF5cygxKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRheXNJbk1vbnRoKGRhdGVJZHggOiBMb2NhbERhdGUpIHtcclxuICB2YXIgZHQgPWRhdGVJZHg7XHJcbiAgdmFyIGRlb20gPSBFT01PTlRIKGR0KTtcclxuICByZXR1cm4gZGF0ZVRvRGF5SW5kZXgoZGVvbSkgLSBkYXRlVG9EYXlJbmRleChjb3B5RGF0ZShkZW9tKS53aXRoRGF5T2ZNb250aCgxKSkgKyAxO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gd3JpdGVIZWFkZXIod3MpIHtcclxuICB3cy53cml0ZShcIllFQVI7UVVBUlQ7Q0FMTU9OVEhJQztDQUxNT05USEk7Q0FMTU9OVEg7Q0FMTU9OVEhTO1NUQVJUX0RBVEVfSURYO0VORF9EQVRFX0lEWDtJU0VPTTtJU0VPUTtJU0VPWTtEQVlTSU5NT05USDtTVEFSVF9EQVRFO0VORF9EQVRFO1wiKVxyXG4gIHdzLndyaXRlKFwiVVNFUjtMT0NBVElPTjtFU1RBVDtIQztIQ19TT007SENfRU9NO0RBWVNXT1JLRUQ7RlRFO0ZURV9TT007RlRFX0VPTTtGVEVXT1JLRUQ7VEVOVVJFO1RFTlVSRV9TT007VEVOVVJFX0VPTTtBR0U7QUdFX1NPTTtBR0VfRU9NO0hDX0VPTVM7SElSRTtURVJNO01PVkVfT1VUO01PVkVfSU47RVZSUztHTkRSO1hcXG5cIilcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG1ha2VRdWFydGVyKGQgOiBMb2NhbERhdGUpIHtcclxuICByZXR1cm4gZC55ZWFyKCkgKyAnJyArICdfUScgKyAgKE1hdGguZmxvb3IoKGQubW9udGhWYWx1ZSgpLTEpLzMpKzEpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gd3JpdGVEYXkod3MsIHByZXZEYXRlRW5kOkxvY2FsRGF0ZSwgZGF0ZUlkeCA6IExvY2FsRGF0ZSkge1xyXG4gIHZhciBzdGFydElkeCA9IGNvcHlEYXRlKHByZXZEYXRlRW5kKS5wbHVzRGF5cygxKTtcclxuICB2YXIgZCA9IGRhdGVJZHg7XHJcbiAgdmFyIHkgPSBkLnllYXIoKTtcclxuICB2YXIgbSA9IGQubW9udGhWYWx1ZSgpO1xyXG4gIHZhciBjbWkgPSB5KjEwMCArIG07XHJcbiAgdmFyIGNtaWMgPSAgKHktMjAwMCkqMTIgKyBtO1xyXG4gIHdzLndyaXRlKHkpLndyaXRlKCc7Jyk7XHJcbiAgd3Mud3JpdGUobWFrZVF1YXJ0ZXIoZCkpLndyaXRlKCc7Jyk7XHJcbiAgd3Mud3JpdGUoJycgKyBjbWljICsgXCI7XCIgKyBjbWkgKyBcIjtcIiArIGNtaSArIFwiO1wiICsgY21pKyBcIjtcIik7IC8vIENBTE1PTlRIIElDIEkgfiBTXHJcbiAgd3Mud3JpdGUoZGF0ZVRvRGF5SW5kZXgoc3RhcnRJZHgpKyBcIjtcIisgZGF0ZVRvRGF5SW5kZXgoZGF0ZUlkeCkgKyBcIjtcIik7XHJcbiAgd3Mud3JpdGUoaXNFT00oZCk/IFwiMS4wXCIgOiBcIjAuMFwiKS53cml0ZShcIjtcIik7XHJcbiAgd3Mud3JpdGUoaXNFT1EoZCk/IFwiMS4wXCIgOiBcIjAuMFwiKS53cml0ZShcIjtcIik7XHJcbiAgd3Mud3JpdGUoaXNFT1koZCk/IFwiMS4wXCIgOiBcIjAuMFwiKS53cml0ZShcIjtcIik7XHJcbiAgdmFyIGRpbSA9IGRheXNJbk1vbnRoKGQpO1xyXG4gIHdzLndyaXRlKGRpbSkud3JpdGUoXCI7XCIpO1xyXG4gIHdzLndyaXRlKGFzRGF0ZShzdGFydElkeCkpLndyaXRlKFwiO1wiKTtcclxuICB3cy53cml0ZShhc0RhdGUoZCkpLndyaXRlKFwiO1wiKTtcclxuICByZXR1cm4gZGltO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZGlmZlllYXJzKGRhdGVMb3c6IExvY2FsRGF0ZSwgZGF0ZUhpZ2g6IExvY2FsRGF0ZSkge1xyXG4gIHJldHVybiBkYXRlTG93LnVudGlsKGRhdGVIaWdoKS55ZWFycygpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZGlmZk1vbnRoKGRhdGVMb3cgOiBMb2NhbERhdGUsIGRhdGVIaWdoIDogTG9jYWxEYXRlKSB7XHJcbiAgdmFyIGEgPSBkYXRlTG93LnVudGlsKGRhdGVIaWdoKTtcclxuICByZXR1cm4gYS55ZWFycygpKjEyICsgYS5tb250aHMoKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHdyaXRlVEVOVVJFQUdFKHBlcnMgOlBlcnNvbikge1xyXG4gIHJldHVybiBwZXJzLmhpcmVkID4gMDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHdyaXRlVGVudXJlKHdzLCBub3c6IExvY2FsRGF0ZSwgcGVyczogUGVyc29uLCBlb20pIHtcclxuICBpZiAoICF3cml0ZVRFTlVSRUFHRShwZXJzKSApIHtcclxuICAgIHdzLndyaXRlKCcgMDsgMDsgMDsnKTtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgdmFyIHRlbnVyZU5vdyA9IGRpZmZNb250aChwZXJzLmxhc3RIaXJlZCxub3cpO1xyXG4gIHdzLndyaXRlKHBhZFNwYWNlKHRlbnVyZU5vdywyKSkud3JpdGUoJzsnKTtcclxuICBpZiggaXNFT00obm93KSkge1xyXG4gICAgdmFyIGRzb20gPSBnZXRTT00obm93KTtcclxuICAgIHZhciB0ZW51cmVTT00gPSBkaWZmTW9udGgocGVycy5sYXN0SGlyZWQsZHNvbSk7XHJcbiAgICB3cy53cml0ZShwYWRTcGFjZSh0ZW51cmVTT00sMikpLndyaXRlKCc7JylcclxuICAgIHdzLndyaXRlKHBhZFNwYWNlKHRlbnVyZU5vdywyKSkud3JpdGUoJzsnKTtcclxuICB9IGVsc2Uge1xyXG4gICAgd3Mud3JpdGUoJyAwOyAwOycpXHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0U09NKGRhdGVJZHggOiBMb2NhbERhdGUpICA6IExvY2FsRGF0ZSB7XHJcbiAgcmV0dXJuIGRhdGVJZHgud2l0aERheU9mTW9udGgoMSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB3cml0ZUFnZSh3cywgbm93IDogTG9jYWxEYXRlLCBwZXJzLCBlb206IGJvb2xlYW4pIHtcclxuICBpZiAoICF3cml0ZVRFTlVSRUFHRShwZXJzKSApIHtcclxuICAgIHdzLndyaXRlKCcgMDsgMDsgMDsnKTtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgdmFyIGFnZU5vdyA9IGRpZmZZZWFycyhwZXJzLmRvYixub3cpO1xyXG4gIHdzLndyaXRlKHBhZFNwYWNlKGFnZU5vdywyKSkud3JpdGUoJzsnKTtcclxuICBpZiggaXNFT00obm93KSApIHtcclxuICAgIHZhciBkc29tID0gZ2V0U09NKG5vdyk7XHJcbiAgICB2YXIgYWdlU09NID0gZGlmZlllYXJzKHBlcnMuZG9iLGRzb20pO1xyXG4gICAgd3Mud3JpdGUocGFkU3BhY2UoYWdlU09NLDIpKS53cml0ZSgnOycpXHJcbiAgICB3cy53cml0ZShwYWRTcGFjZShhZ2VOb3csMikpLndyaXRlKCc7Jyk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHdzLndyaXRlKCcgMDsgMDsnKVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHdyaXRlVHJpcGVsKHdzLCB2c29tIDogYW55LCB2bm93OiBhbnksIGVvbSA6IGJvb2xlYW4pIHtcclxuICB3cy53cml0ZShwYWRTcGFjZSh2bm93LDMpKS53cml0ZSgnOycpO1xyXG4gIGlmKCBlb20gKSB7XHJcbiAgICB3cy53cml0ZShwYWRTcGFjZSh2c29tLDMpKS53cml0ZSgnOycpXHJcbiAgICB3cy53cml0ZShwYWRTcGFjZSh2bm93LDMpKS53cml0ZSgnOycpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB3cy53cml0ZSgnMC4wOzAuMDsnKVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHRvRGVjMShuIDogbnVtYmVyKSB7XHJcbiAgcmV0dXJuIChuIHx8IDApLnRvRml4ZWQoMSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBtZW1vcml6ZVNPTShkYXRlSWR4IDogTG9jYWxEYXRlLCBwZXJzIDogUGVyc29uKSB7XHJcbiAgdmFyIGVvbSA9IGlzRU9NKGRhdGVJZHgpO1xyXG4gIGlmIChlb20pIHtcclxuICAgIHBlcnMuZnRlU09NID0gcGVycy5oaXJlZCAqIHBlcnMuZnRlO1xyXG4gICAgcGVycy5oaXJlZFNPTSA9IHBlcnMuaGlyZWQ7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBpc0FsbFplcm8ocGVycyA6IFBlcnNvbikge1xyXG4gIHJldHVybiAocGVycy5oaXJlZCA9PSAwICYmICBwZXJzLmhpcmVkU09NID09IDApO1xyXG59XHJcblxyXG4vKipcclxuICogVGhpcyBmdW5jdGlvbiBkb2VzIG11dGF0ZSBwZXJzLCB1c2UgYSBjbG9uZSBpZiBub3QgZGVzaXJlZCFcclxuICogQHBhcmFtIHdzXHJcbiAqIEBwYXJhbSBkYXRlSWR4XHJcbiAqIEBwYXJhbSBwZXJzXHJcbiAqIEBwYXJhbSBjb21tZW50XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gd3JpdGVSZWNvcmQod3MsIGRhdGVJZHggOiBMb2NhbERhdGUsIHBlcnMgOiBQZXJzb24sIHBhcnMgOiBHZW5QYXJhbXMsIGNvbW1lbnQ6IHN0cmluZyApXHJcbntcclxuICB2YXIgc3RhcnRJZHggPSBjb3B5RGF0ZShwZXJzLnByZXZEYXRlRW5kKS5wbHVzRGF5cygxKTtcclxuICB2YXIgZW9tID0gaXNFT00oZGF0ZUlkeCk7XHJcbiAgd3Mud3JpdGUocGFkU3BhY2VRKHBlcnMudXNlciw1KSkud3JpdGUoJzsnKTtcclxuICB3cy53cml0ZShwYWRTcGFjZVEocGVycy5sb2NhdGlvbiwyMCkpLndyaXRlKCc7Jyk7XHJcbiAgd3Mud3JpdGUocGFkU3BhY2VRKHBlcnMuRVNUQVQsMSkpLndyaXRlKCc7Jyk7IC8vIHdlIGFsd2F5cyB3cml0ZSB0aGlzLCBuZWVkZWQgZm9yIFNUT1AgcmVjb3Jkc1xyXG4gIHdyaXRlVHJpcGVsKHdzLCBwZXJzLmhpcmVkU09NID8gXCIxLjBcIjogXCIwLjBcIiAscGVycy5oaXJlZCA/IFwiMS4wXCI6IFwiMC4wXCIsaXNFT00oZGF0ZUlkeCkpO1xyXG4gIHZhciBkYXlzSW5QZXJpb2QgPSBzdGFydElkeC51bnRpbChkYXRlSWR4KS5kYXlzKCkgKyAxO1xyXG4gIHdzLndyaXRlKHBhZFNwYWNlKHBlcnMuaGlyZWRQcmV2ICogZGF5c0luUGVyaW9kLDIpKS53cml0ZSgnOycpOyAvL0RBWVNXT1JLRURcclxuICB3cml0ZVRyaXBlbCh3cywgdG9EZWMxKHBlcnMuZnRlU09NKSx0b0RlYzEocGVycy5oaXJlZCAqIHBlcnMuZnRlKSxpc0VPTShkYXRlSWR4KSk7XHJcbiAgd3Mud3JpdGUocGFkU3BhY2UocGVycy5oaXJlZFByZXYgKiBwZXJzLmZ0ZVByZXYgKiBkYXlzSW5QZXJpb2QsNCkpLndyaXRlKCc7Jyk7IC8vIEZURVdPUktFRFxyXG4gIHdyaXRlVGVudXJlKHdzLCBkYXRlSWR4LCBwZXJzLCBlb20pO1xyXG4gIHdyaXRlQWdlKHdzLCBkYXRlSWR4LCBwZXJzLCBlb20pO1xyXG4gIGlmKGVvbSAmJiBwYXJzLlJFT1BfRVNUQVRTICYmIHBhcnMuUkVPUF9FU1RBVFMuaW5kZXhPZihwZXJzLkVTVEFUKSA+PSAwKSB7XHJcbiAgICB3cy53cml0ZShwYWRTcGFjZShwZXJzLmhpcmVkLDEpKS53cml0ZSgnOycpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB3cy53cml0ZSgnMCcpLndyaXRlKCc7Jyk7XHJcbiAgfVxyXG4gIHBlcnMuaGlyZWRQcmV2ID0gcGVycy5oaXJlZDtcclxuICBwZXJzLmZ0ZVByZXYgPSBwZXJzLmZ0ZTtcclxuICBwZXJzLnByZXZEYXRlRW5kID0gY29weURhdGUoZGF0ZUlkeCk7XHJcblxyXG4gIHdzLndyaXRlKGNvbW1lbnQgKyBcIlxcblwiKTtcclxufVxyXG5cclxuLyoqXHJcbiAqIFRoaXMgZnVuY3Rpb24gZG9lcyBtdXRhdGUgcGVycywgdXNlIGEgY2xvbmUgaWYgbm90IGRlc2lyZWQhXHJcbiAqIEBwYXJhbSB3c1xyXG4gKiBAcGFyYW0gZGF0ZUlkeFxyXG4gKiBAcGFyYW0gcGVyc1xyXG4gKiBAcGFyYW0gY29tbWVudFxyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIHdyaXRlUmVjb3JkMCh3cywgZGF0ZUlkeCA6IExvY2FsRGF0ZSwgcGVycyA6IFBlcnNvbiwgIGNvbW1lbnQ6IHN0cmluZyApXHJcbntcclxuICB2YXIgc3RhcnRJZHggPSBjb3B5RGF0ZShkYXRlSWR4KTtcclxuICB2YXIgZW9tID0gaXNFT00oZGF0ZUlkeCk7XHJcbiAgd3Mud3JpdGUocGFkU3BhY2VRKHBlcnMudXNlciw1KSkud3JpdGUoJzsnKTtcclxuICB3cy53cml0ZShwYWRTcGFjZVEocGVycy5sb2NhdGlvbiwyMCkpLndyaXRlKCc7Jyk7XHJcbiAgd3Mud3JpdGUocGFkU3BhY2VRKHBlcnMuRVNUQVQsMSkpLndyaXRlKCc7Jyk7IC8vIHdlIGFsd2F5cyB3cml0ZSB0aGlzLCBuZWVkZWQgZm9yIFNUT1AgcmVjb3Jkc1xyXG4gIHdyaXRlVHJpcGVsKHdzLCBcIjAuMFwiLCBcIjAuMFwiLCBmYWxzZSk7IC8vIHBlcnMuaGlyZWRTT00gPyBcIjEuMFwiOiBcIjAuMFwiICxwZXJzLmhpcmVkID8gXCIxLjBcIjogXCIwLjBcIixpc0VPTShkYXRlSWR4KSk7XHJcbiAgdmFyIGRheXNJblBlcmlvZCA9IFwiMC4wXCI7IC8vc3RhcnRJZHgudW50aWwoZGF0ZUlkeCkuZGF5cygpICsgMTtcclxuICB3cy53cml0ZShwYWRTcGFjZSgwLDIpKS53cml0ZSgnOycpOyAvL0RBWVNXT1JLRURcclxuICB3cml0ZVRyaXBlbCh3cywgdG9EZWMxKDApLHRvRGVjMSgwKSxpc0VPTShkYXRlSWR4KSk7XHJcbiAgd3Mud3JpdGUocGFkU3BhY2UoMCw0KSkud3JpdGUoJzsnKTsgLy8gRlRFV09SS0VEXHJcbiAgd3Mud3JpdGUoXCIgMDsgMDsgMDtcIik7XHJcbiAgLy93cml0ZVRlbnVyZSh3cywgZGF0ZUlkeCwgcGVycywgZW9tKTsgLy8gQ0hFQ0sgV0hFVEhFUiBNRUFTVVJFIE9SIERJTVxyXG4gIHdzLndyaXRlKFwiIDA7IDA7IDA7XCIpXHJcbiAgLy93cml0ZUFnZSh3cywgZGF0ZUlkeCwgcGVycywgZW9tKTtcclxuICB3cy53cml0ZShcIjA7XCIpO1xyXG4gIC8vaWYoZW9tICYmIHBhcnMuUkVPUF9FU1RBVFMgJiYgcGFycy5SRU9QX0VTVEFUUy5pbmRleE9mKHBlcnMuRVNUQVQpID49IDApIHtcclxuICAvLyAgICB3cy53cml0ZShwYWRTcGFjZShwZXJzLmhpcmVkLDEpKS53cml0ZSgnOycpO1xyXG4gIC8vfSBlbHNlIHtcclxuICAvLyAgd3Mud3JpdGUoJzAnKS53cml0ZSgnOycpO1xyXG4gIC8vfVxyXG4gIHdzLndyaXRlKGNvbW1lbnQgKyBcIlxcblwiKTtcclxufVxyXG5cclxuZnVuY3Rpb24gd3JpdGVTdGF0ZUxpbmVSQU5HRSh3cyxkYXRlSWR4IDogTG9jYWxEYXRlLCBwZXJzIDogUGVyc29uLCBuZXh0SGlyZSwgbmV4dExvYywgbmV4dEZURSwgY29tbWVudDpzdHJpbmcpIHtcclxuICBpZih3cyA9PSB1bmRlZmluZWQpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBXcml0ZSBhIHN0YXRlIGxpbmUgZm9yIE1vbnRobHkgYWdncmVnYXRlcywgdGhpcyBpcyBlLmcuIHRoZSBFbmQtb2YgbW9udGggcmVjb3JkLlxyXG4gKiBAcGFyYW0gd3NcclxuICogQHBhcmFtIGRhdGVJZHhcclxuICogQHBhcmFtIHBlcnNcclxuICogQHBhcmFtIG5leHRIaXJlXHJcbiAqIEBwYXJhbSBuZXh0TG9jXHJcbiAqIEBwYXJhbSBuZXh0RlRFXHJcbiAqIEBwYXJhbSBjb21tZW50XHJcbiAqL1xyXG5mdW5jdGlvbiB3cml0ZVN0YXRlTGluZU1PTkFHKHdzLGRhdGVJZHggOiBMb2NhbERhdGUsIHBlcnMgOiBQZXJzb24sIG5leHRIaXJlLCBuZXh0TG9jLCBuZXh0RlRFLCBwYXJzOiBHZW5QYXJhbXMsIGNvbW1lbnQ6c3RyaW5nKSB7XHJcbiAgd3JpdGVEYXkod3MsIHBlcnMucHJldkRhdGVFbmQsIGRhdGVJZHgpO1xyXG4gIHBlcnMubG9jYXRpb24gPSBuZXh0TG9jIHx8IHBlcnMubG9jYXRpb247XHJcbiAgcGVycy5mdGUgPSBuZXh0RlRFIHx8IHBlcnMuZnRlO1xyXG4gIC8vcGVycy5sYXN0V3JpdHRlbiA9IGRhdGVJZHg7XHJcbiAgd3JpdGVSZWNvcmQod3MsIGRhdGVJZHgsIHBlcnMsIHBhcnMsIFwic3RcIiArIGNvbW1lbnQpO1xyXG4gIG1lbW9yaXplU09NKGRhdGVJZHgscGVycyk7XHJcbiAgaWYobmV4dEhpcmUgIT0gcGVycy5oaXJlZCkge1xyXG4gICAgd3Mud3JpdGUoXCJORVZFUlxcblwiKVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gaXNVbmhpcmVkQ2hhbmdlKHBlcnM6IFBlcnNvbiwgbmV4dEhpcmUsIG5leHRMb2MsIG5leHRGVEUsIG5leHRFU1RBVCkge1xyXG4gIHJldHVybiAgKG5leHRIaXJlICE9IHBlcnMuaGlyZWQpXHJcbiAgICAgICB8fCAoIG5leHRMb2MgIT0gcGVycy5sb2NhdGlvbiApXHJcbiAgICAgICB8fCAoIG5leHRGVEUgIT0gcGVycy5mdGUgKVxyXG4gICAgICAgfHwgKCBuZXh0RVNUQVQgIT0gcGVycy5FU1RBVCApO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpc0FDaGFuZ2UocGVyczogUGVyc29uLCBuZXh0SGlyZSwgbmV4dExvYywgbmV4dEZURSwgbmV4dEVTVEFUKSB7XHJcbiAgcmV0dXJuICAobmV4dEhpcmUgIT0gcGVycy5oaXJlZClcclxuICAgICAgIHx8IChwZXJzLmhpcmVkICYmIG5leHRMb2MgIT0gcGVycy5sb2NhdGlvbiApXHJcbiAgICAgICB8fCAocGVycy5oaXJlZCAmJiBuZXh0RlRFICE9IHBlcnMuZnRlIClcclxuICAgICAgIHx8IChwZXJzLmhpcmVkICYmIG5leHRFU1RBVCAhPSBwZXJzLkVTVEFUICk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzSElSRSggcGVyczogUGVyc29uICwgbmV4dEhpcmUgKSB7XHJcbiAgcmV0dXJuIHBlcnMuaGlyZWQgPT0gMCAmJiBuZXh0SGlyZSA9PSAxO1xyXG59XHJcbmZ1bmN0aW9uIGlzVEVSTSggcGVyczogUGVyc29uICwgbmV4dEhpcmUgKSB7XHJcbiAgcmV0dXJuIHBlcnMuaGlyZWQgPT0gMSAmJiBuZXh0SGlyZSA9PSAwO1xyXG59XHJcblxyXG5mdW5jdGlvbiBjbG9zZVByZXZpb3VzUmFuZ2Uod3MsIGRhdGVJZHg6TG9jYWxEYXRlLCBwZXJzOiBQZXJzb24sIHBhcnMgOiBHZW5QYXJhbXMsIGNvbW1lbnQ6IHN0cmluZykge1xyXG4gIHZhciBkbWluMSA9IGNvcHlEYXRlKGRhdGVJZHgpLm1pbnVzRGF5cygxKTtcclxuICB3cml0ZURheSh3cywgcGVycy5wcmV2RGF0ZUVuZCwgZG1pbjEpO1xyXG4gIHdyaXRlUmVjb3JkKHdzLCBkbWluMSwgcGVycywgcGFycywgY29tbWVudCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHdyaXRlQ2hhbmdlTGluZVJBTkdFKHdzLGRhdGVJZHggOiBMb2NhbERhdGUsIHBlcnM6IFBlcnNvbiwgbmV4dEhpcmUsIG5leHRMb2MsIG5leHRGVEUsIG5leHRFU1RBVCwgcGFycyA6IEdlblBhcmFtcywgY29tbWVudDpzdHJpbmcpIHtcclxuICBpZiggd3MgPT0gdW5kZWZpbmVkKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIHZhciBpc0NoYW5nZSA9IGlzQUNoYW5nZShwZXJzLG5leHRIaXJlLG5leHRMb2MsbmV4dEZURSxuZXh0RVNUQVQpO1xyXG4gIGlmICggIWlzQ2hhbmdlICYmICFpc0VPTShkYXRlSWR4KSkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICAvLyBhdCBkYXRlSWR4IHRoZSBwZXJzb24gc3RhdGUgY2hhbmdlcyB0byBuZXcgc3RhdGUuXHJcbiAgLy8gY2xvbmUgdGhlIG9iamVjdFxyXG4gIHZhciBuZXh0UGVycyA9IF8uY2xvbmVEZWVwKHBlcnMpO1xyXG4gIG5leHRQZXJzLnByZXZEYXRlRW5kID0gY29weURhdGUobmV4dFBlcnMucHJldlJhbmdlRW5kKTsgLy8hISFcclxuICAvL3BlcnMgPSB1bmRlZmluZWQ7XHJcbiAgdmFyIGlzdGVybSA9IGlzVEVSTShuZXh0UGVycywgbmV4dEhpcmUpO1xyXG4gIGlmICggaXN0ZXJtICkge1xyXG4gICAgLy8gY2xvc2UgcHJldmlvdXMgcmVjb3JkXHJcbiAgICBjbG9zZVByZXZpb3VzUmFuZ2Uod3MsIGRhdGVJZHgsIG5leHRQZXJzLCBwYXJzLCAgXCJ0ZXJtY2xvc2UtMVwiICsgIGRhdGVJZHggKyAnICcgKyAgY29tbWVudCk7XHJcbiAgICBwZXJzLnByZXZSYW5nZUVuZCA9IGNvcHlEYXRlKGRhdGVJZHgpLm1pbnVzRGF5cygxKTtcclxuICB9IGVsc2UgaWYgKCBpc0hJUkUobmV4dFBlcnMsbmV4dEhpcmUpKSB7XHJcbiAgICAvL25leHRQZXJzLmxhc3RIaXJlZCA9IGRhdGVJZHg7XHJcbiAgICBwZXJzLnByZXZSYW5nZUVuZCA9IGNvcHlEYXRlKGRhdGVJZHgpLm1pbnVzRGF5cygxKTsgLy8gU0VUIFRISVMhXHJcbiAgICAvLyBkbyBub3RoaW5nLCB3aWxsIGJlIGNhcHR1cmVkIG5leHRcclxuICB9IGVsc2Uge1xyXG4gICAgLy8gY2xvc2UgcHJldmlvdXMgcmVjb3JkLCBhbHdheXNcclxuICAgIHZhciBkbWluMSA9IGNvcHlEYXRlKGRhdGVJZHgpLm1pbnVzRGF5cygxKTtcclxuICAgIHdyaXRlRGF5KHdzLCBuZXh0UGVycy5wcmV2RGF0ZUVuZCwgZG1pbjEpO1xyXG4gICAgd3JpdGVSZWNvcmQod3MsIGRtaW4xLCBuZXh0UGVycyAsIHBhcnMsIFwicGVyY2xvc2UtMSBmcm9tIFwiICsgZGF0ZUlkeCArICcgJyArICBjb21tZW50KTtcclxuICAgIHBlcnMucHJldlJhbmdlRW5kID0gY29weURhdGUoZGF0ZUlkeCkubWludXNEYXlzKDEpO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gaXNTdG9wUmVjb3Jkc1JlcXVlc3RlZChwYXJzOiBHZW5QYXJhbXMpIHtcclxuICByZXR1cm4gKCBwYXJzLm9wdHNNT05BRyAmJiBwYXJzLm9wdHNNT05BRy5zdG9wUmVjb3Jkcyk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzTm9aZXJvUmVxdWVzdGVkKHBhcnM6IEdlblBhcmFtcykge1xyXG4gIHJldHVybiAoIHBhcnMub3B0c01PTkFHICYmIHBhcnMub3B0c01PTkFHLm5vWmVybyk7XHJcbn1cclxuXHJcblxyXG4vLyB3ZSB3cml0ZSBhIHJlY29yZCB3aXRoIGFsbCBtZWFzdXJlcyB6ZXJvIChvciBudWxsPylcclxuZnVuY3Rpb24gd3JpdGVTVE9QUmVjb3JkQWZ0ZXIod3MsIHBlcnMgOiBQZXJzb24sIGQgOiBMb2NhbERhdGUsIHBhcnM6IEdlblBhcmFtcywgY29tbWVudCA6IHN0cmluZyApIHtcclxuICB3cml0ZURheSh3cywgZCwgZCk7IC8vIFtkLWRdO1xyXG4gIHdyaXRlUmVjb3JkMCh3cywgZCwgcGVycywgY29tbWVudCk7XHJcbn1cclxuXHJcbi8vIHRoZXJlIGlzIGEgY2hhbmdlIEBkYXRlICwgbmV3IHZhbHVlcyBhcmUgdG8gdGhlIHJpZ2h0O1xyXG4vLyB0aGlzIGkgY2FsbGVkIG9uIGEgY2hhbmdlIGluIHZhbHVlcy5cclxuZnVuY3Rpb24gd3JpdGVDaGFuZ2VMaW5lTU9OQUcod3MsIGRhdGVJZHggOiBMb2NhbERhdGUsIHBlcnMgOlBlcnNvbiwgbmV4dEhpcmUsIG5leHRMb2MsIG5leHRGVEUsIG5leHRFU1RBVCwgcGFycyA6IEdlblBhcmFtcywgY29tbWVudDpzdHJpbmcpIHtcclxuICB2YXIgaXNDaGFuZ2UgPSBpc0FDaGFuZ2UocGVycywgbmV4dEhpcmUsIG5leHRMb2MsIG5leHRGVEUsIG5leHRFU1RBVCk7XHJcbiAgaWYgKCAhaXNDaGFuZ2UgJiYgIWlzRU9NKGRhdGVJZHgpKSB7XHJcbiAgICBwZXJzLmxvY2F0aW9uID0gbmV4dExvYztcclxuICAgIC8vcGVycy5uZXh0RlRFID0gbmV4dEZURTsgIC8vLyBUT0RPIEZJWCFcclxuICAgIHBlcnMuRVNUQVQgPSBuZXh0RVNUQVQ7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIHZhciBpc3Rlcm0gPSBpc1RFUk0ocGVycywgbmV4dEhpcmUpO1xyXG4gIGlmICggaXN0ZXJtICkge1xyXG4gICAgLy8gY2xvc2UgcHJldmlvdXMgcmVjb3JkXHJcbiAgICBpZiAoZGF0ZUlkeC5kYXlPZk1vbnRoKCkgIT0gMSkgeyAvLyB1bmxlc3Mgd2UgYWxyZWFkeSBjbG9zZWQgaXQgYnkgYSBtb250aCByZWNvcmRcclxuICAgICAgdmFyIGRtaW4xID0gY29weURhdGUoZGF0ZUlkeCkubWludXNEYXlzKDEpO1xyXG4gICAgICB3cml0ZURheSh3cywgcGVycy5wcmV2RGF0ZUVuZCwgZG1pbjEpO1xyXG4gICAgICB3cml0ZVJlY29yZCh3cywgZG1pbjEsIHBlcnMsIHBhcnMsIFwidGVybWNsb3NlLTFAXCIgKyAgZGF0ZUlkeCArICcgJyArIGNvbW1lbnQpO1xyXG4gICAgICBtZW1vcml6ZVNPTShkbWluMSxwZXJzKTtcclxuICAgIH1cclxuICAgIC8vIGFsd2F5cyB3cml0ZSBhIHN0b3AgcmVjb3JkIGlmIHJlcXVpcmVkXHJcbiAgICBpZiAoIGlzU3RvcFJlY29yZHNSZXF1ZXN0ZWQocGFycykpIHtcclxuICAgICAgd3JpdGVTVE9QUmVjb3JkQWZ0ZXIod3MscGVycyxkYXRlSWR4LCBwYXJzLCAgXCJzdG9wQWZ0ZXJtQFwiICsgIGRhdGVJZHggKyAnICcgKyBjb21tZW50KTtcclxuICAgIH1cclxuICAgIHBlcnMuaGlyZWQgPSAwO1xyXG4gICAgcGVycy5oaXJlZFByZXYgPSAwO1xyXG4gICAgLy9wZXJzLmxhc3RUZXJtID0gZGF0ZUlkeDtcclxuICB9IGVsc2UgaWYgKCBpc0hJUkUocGVycyxuZXh0SGlyZSkpIHtcclxuICAgIHBlcnMubGFzdEhpcmVkID0gZGF0ZUlkeDtcclxuICAgIHBlcnMucHJldkRhdGVFbmQgPSBjb3B5RGF0ZShkYXRlSWR4KS5taW51c0RheXMoMSk7XHJcbiAgICAvLyBhZGRlZFxyXG4gICAgcGVycy5mdGVQcmV2ID0gcGVycy5mdGU7XHJcbiAgICBwZXJzLmhpcmVkUHJldiA9IDE7XHJcbiAgICAvLyBkbyBub3RoaW5nLCB3aWxsIGJlIGNhcHR1cmVkIG5leHRcclxuICB9IGVsc2Uge1xyXG4gICAgLy8gY2xvc2UgcHJldmlvdXMgcmVjb3JkXHJcbiAgICBpZiAoIGRhdGVJZHguZGF5T2ZNb250aCgpICE9IDEpIHtcclxuICAgICAgLy8gdW5sZXNzIHdlIGFscmVhZHkgY2xvc2VkIGl0IGJ5IGEgbW9udGggcmVjb3JkXHJcbiAgICAgIHZhciBkbWluMSA9IGNvcHlEYXRlKGRhdGVJZHgpLm1pbnVzRGF5cygxKTtcclxuICAgICAgd3JpdGVEYXkod3MsIHBlcnMucHJldkRhdGVFbmQsIGRtaW4xKTtcclxuICAgICAgd3JpdGVSZWNvcmQod3MsIGRtaW4xLCBwZXJzLCBwYXJzLCBcInBlcmNsb3NlLTEgZnJvbSBcIiArIGRhdGVJZHggKyAnICcrICBjb21tZW50KTtcclxuICAgICAgbWVtb3JpemVTT00oZG1pbjEscGVycyk7XHJcbiAgICB9XHJcbiAgICAvLyBhbHdheXMgd3JpdGUgYSBzdG9wIHJlY29yZCBpZiByZXFlc3RlZFxyXG4gICAgaWYgKCBpc1N0b3BSZWNvcmRzUmVxdWVzdGVkKHBhcnMpKSB7XHJcbiAgICAgIHdyaXRlU1RPUFJlY29yZEFmdGVyKHdzLHBlcnMsZGF0ZUlkeCwgcGFycywgIFwic3RvcEFmdGV2ZUBcIiArICBkYXRlSWR4ICsgJyAnICsgY29tbWVudCk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHBlcnMuaGlyZWQgPSBuZXh0SGlyZTtcclxuICBwZXJzLmxvY2F0aW9uID0gbmV4dExvYztcclxuICBwZXJzLmZ0ZSA9IG5leHRGVEU7XHJcbiAgaWYgKGlzRU9NKGRhdGVJZHgpKSB7XHJcbiAgICAvLyBsYXRlciBzdXBwcmVzcyB1bmxlc3MgbGFzdFRlcm0gd2l0aGluIHJhbmdlXHJcbiAgICBpZiAoICFpc05vWmVyb1JlcXVlc3RlZChwYXJzKSB8fCAhaXNBbGxaZXJvKHBlcnMpKSB7XHJcbiAgICAgIHdyaXRlU3RhdGVMaW5lTU9OQUcod3MsZGF0ZUlkeCxwZXJzLCBwZXJzLmhpcmVkLCBwZXJzLmxvY2F0aW9uLCBwZXJzLmZ0ZSwgcGFycywgXCJXQ0xcIik7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG4vLy8vLy8vLy8vLy8vLy8vLy8vIHBlcmNlbnRhZ2VzXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNIaXJlQ2hhbmdlKHBhcnMgOiBHZW5QYXJhbXMpIDogYm9vbGVhbiB7XHJcbiAgcmV0dXJuIHBhcnMucmFuZG9tKCkgPCBwYXJzLkxfSElSRTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0RE9CKHBhcnMgOiBHZW5QYXJhbXMpIDogTG9jYWxEYXRlIHtcclxuXHJcbiAgdmFyIHllYXIgPSAxOTUwICsgTWF0aC5mbG9vcihwYXJzLnJhbmRvbSgpKjU1KTtcclxuICB2YXIgbW9udGggPSBNYXRoLmZsb29yKHBhcnMucmFuZG9tKCkqMTIpO1xyXG4gIHZhciBkYXliYXNlID0gTWF0aC5mbG9vcihwYXJzLnJhbmRvbSgpKjMxKTtcclxuICByZXR1cm4gTG9jYWxEYXRlLm9mKHllYXIsMSttb250aCwgMSkucGx1c0RheXMoZGF5YmFzZSAtIDEpO1xyXG59XHJcbi8vTG9jYWxEYXRlLm9mKDE5NTArTWF0aC5mbG9vcihwYXJzLnJhbmRvbSgpKjU1KSxNYXRoLmZsb29yKHBhcnMucmFuZG9tKCkqMTIpLE1hdGguZmxvb3IocGFycy5yYW5kb20oKSozMSkpLFxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdlblBlcnNvbihwLCBwYXJzOiBHZW5QYXJhbXMpIHtcclxuXHR2YXIgcGVycyA9IHtcclxuICAgIHVzZXIgOiBwLFxyXG4gICAgaGlyZWQ6IDAsXHJcbiAgICBoaXJlZFByZXYgOiAwLFxyXG4gICAgZnRlIDogMSxcclxuICAgIGZ0ZVByZXYgOiAwLFxyXG4gICAgZG9iIDogZ2V0RE9CKHBhcnMpLFxyXG4gICAgbG9jYXRpb24gOiBnZXRMb2NhdGlvbihwYXJzKSxcclxuICAgIHByZXZEYXRlRW5kIDogcGFycy5maXJzdERhdGUsXHJcbiAgICBwcmV2UmFuZ2VFbmQgOiBwYXJzLmZpcnN0RGF0ZSxcclxuICAgIGhpcmVkU09NIDogMCxcclxuICAgIGxhc3RIaXJlZCA6IHBhcnMuZmlyc3REYXRlLFxyXG4gICAgZnRlU09NIDogMCxcclxuICAgIEVTVEFUIDogXCJBXCIsXHJcbiAgICBFU1RBVFNPTSA6IFwiQVwiLFxyXG4gIH0gYXMgUGVyc29uO1xyXG4gIHZhciBuZXh0RGF0ZSA9IGdldE5leHQocGFycykgKyBwYXJzLmZpcnN0RGF0ZS50b0Vwb2NoRGF5KCk7XHJcbiAgZm9yKHZhciBpID0gcGFycy5maXJzdERhdGUudG9FcG9jaERheSgpOyBpIDw9IHBhcnMubGFzdERhdGUudG9FcG9jaERheSgpOyArK2kpIHtcclxuICAgIHZhciBkID0gTG9jYWxEYXRlLm9mRXBvY2hEYXkoaSk7XHJcbiAgICBpZiAoIGkgPT0gbmV4dERhdGUgKSB7XHJcbiAgICAgIGlmKCBpc0hpcmVDaGFuZ2UocGFycykpIHtcclxuICAgICAgIC8vIHdyaXRlQ2hhbmdlTGluZU1PTkFHKHBhcnMud3NNT05BRywgZCxwZXJzLCBwZXJzLmhpcmVkID8gMCA6IDEsIG5leHRMb2NhdGlvbihwYXJzLHBlcnMpLCBuZXh0RlRFKHBhcnMscGVycykgICwgXCJIQ1wiKTtcclxuICAgICAgICAvLytcclxuICAgICAgICAvLyBPUkRFUiBJUyBDUlVDSUFMIVxyXG4gICAgICAgIHZhciBubCA9IG5leHRMb2NhdGlvbihwYXJzLHBlcnMpO1xyXG4gICAgICAgIHZhciBuZiA9IG5leHRGVEUocGFycyxwZXJzKTtcclxuICAgICAgICB2YXIgbkVTVEFUID0gZ2V0TmV4dEVTVEFUKHBhcnMscGVycyxcIkVTVEFUXCIpO1xyXG4gICAgICAgIHdyaXRlQ2hhbmdlTGluZVJBTkdFKHBhcnMud3NSQU5HRSwgZCwgcGVycywgcGVycy5oaXJlZCA/IDAgOiAxLCBubCwgbmYsIG5FU1RBVCwgIHBhcnMsIFwiSENcIik7XHJcbiAgICAgICAgd3JpdGVDaGFuZ2VMaW5lTU9OQUcocGFycy53c01PTkFHLCBkLCBwZXJzLCBwZXJzLmhpcmVkID8gMCA6IDEsIG5sLCBuZiwgbkVTVEFULCBwYXJzLCBcIkhDXCIpO1xyXG4gICAgICAgIG5leHREYXRlICs9IGdldE5leHQocGFycyk7XHJcbiAgICAgIH0gZWxzZSBpZiAoaXNFdmVudChwYXJzKSkge1xyXG4gICAgICAgIHZhciBubCA9IG5leHRMb2NhdGlvbihwYXJzLCBwZXJzKTtcclxuICAgICAgICAvLyBmb3JjZVxyXG4gICAgICAgIHZhciBuZiA9IG5leHRGVEUocGFycywgcGVycyk7XHJcbiAgICAgICAgdmFyIG5FU1RBVCA9IGdldE5leHRFU1RBVChwYXJzLHBlcnMsXCJFU1RBVFwiKTtcclxuICAgICAgICB3aGlsZSggIWlzVW5oaXJlZENoYW5nZShwZXJzLHBlcnMuaGlyZWQsIG5sLG5mLCBuRVNUQVQpKSB7XHJcbiAgICAgICAgICBubCA9IG5leHRMb2NhdGlvbihwYXJzLCBwZXJzKTtcclxuICAgICAgICAgIC8vIGZvcmNlXHJcbiAgICAgICAgICBuZiA9IG5leHRGVEUocGFycywgcGVycyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHdyaXRlQ2hhbmdlTGluZVJBTkdFKHBhcnMud3NSQU5HRSwgZCwgcGVycywgcGVycy5oaXJlZCwgbmwsIG5mLCBuRVNUQVQsIHBhcnMsIFwiTENcIik7XHJcbiAgICAgICAgd3JpdGVDaGFuZ2VMaW5lTU9OQUcocGFycy53c01PTkFHLCBkLCBwZXJzLCBwZXJzLmhpcmVkLCBubCwgbmYsIG5FU1RBVCwgcGFycywgXCJMQ1wiICk7XHJcbiAgICAgICAgbmV4dERhdGUgKz0gZ2V0TmV4dChwYXJzKTtcclxuICAgICAgfSBlbHNlIGlmIChpc0VPTShkKSkge1xyXG4gICAgICAgICAgd3JpdGVTdGF0ZUxpbmVNT05BRyhwYXJzLndzTU9OQUcsIGQsIHBlcnMsIHBlcnMuaGlyZWQsIHBlcnMubG9jYXRpb24sIHBlcnMuZnRlLCBwYXJzLCBcIkVPTWVcIik7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAoaXNFT00oZCkpIHtcclxuICAgICAgLy9pZiggcGVycy5oaXJlZCA+IDAgKSB7XHJcbiAgICAgICAgaWYgKCAhaXNOb1plcm9SZXF1ZXN0ZWQocGFycykgfHwgIWlzQWxsWmVybyhwZXJzKSkge1xyXG4gICAgICAgICAgd3JpdGVTdGF0ZUxpbmVNT05BRyhwYXJzLndzTU9OQUcsIGQsIHBlcnMsIHBlcnMuaGlyZWQsIHBlcnMubG9jYXRpb24sIHBlcnMuZnRlLCBwYXJzLCBcIkVPTVwiKTtcclxuICAgICAgICB9XHJcbiAgICAgIC8vfVxyXG4gICAgICAvLyBlbHNlIHtcclxuICAgICAgICBtZW1vcml6ZVNPTShkLHBlcnMpO1xyXG4gICAgICAvL31cclxuICAgIH1cclxuXHR9O1xyXG59XHJcblxyXG5cclxudmFyIHByaW1lcyAgPSBbXTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRNYXhQcmltZXMobnI6IG51bWJlcikgOiBudW1iZXIge1xyXG4gIHZhciBtYXggPSBNYXRoLmZsb29yKE1hdGguc3FydChucikrMyk7XHJcbiAgdmFyIG1wID0gMTtcclxuICB2YXIgcmVtYWluID0gbnI7XHJcbiAgZm9yKHZhciBpID0gMTsgaSA8PSBtYXg7ICsraSApIHtcclxuICAgIGlmIChyZW1haW4gPT0gMSkge1xyXG4gICAgICByZXR1cm4gbXA7XHJcbiAgICB9XHJcbiAgICB3aGlsZShpID4gMSAmJiAgKHJlbWFpbiAlIGkgPT0gMCkpIHtcclxuICAgICAgbXAgPSBNYXRoLm1heChtcCxpKTtcclxuICAgICAgcmVtYWluID0gcmVtYWluL2k7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiByZW1haW47XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZW5VU0VSSGllcmFyY2h5KG5ycGVycyA6IG51bWJlciApIHtcclxuICB2YXIgd3MgPSBnZXRXUyggXCJESU1fVVNFUl9cIiArIHBhZFplcm9zKG5ycGVycyw2KSArIFwiLmNzdlwiKTtcclxuICBnZW5VU0VSSGllcmFyY2h5Vyh3cyxucnBlcnMpO1xyXG4gIHdzLndzLmVuZCgpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpc0RpZ2l0KGNoYXIgOiBzdHJpbmcpIHtcclxuICByZXR1cm4gXCIwMTIzNDU2Nzg5XCIuaW5kZXhPZihjaGFyKSA+IDA7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzRGlnaXRTdGFydExpbmUobGluZSA6IHN0cmluZykge1xyXG4gIHZhciBsaW5lcyA9ICcnK2xpbmU7XHJcbiAgcmV0dXJuIGxpbmVzLmxlbmd0aCA+IDAgJiYgICFpc0RpZ2l0KGxpbmVzLmNoYXJBdCgwKSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBBbHNvIHN0cmlwcyBjb21tZW50cyBsaW5lcyB3aXRoICNcclxuICogQHBhcmFtIGZpbGVuYW1lMVxyXG4gKiBAcGFyYW0gZmlsZW5hbWUyXHJcbiAqIEBwYXJhbSBkb25lXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gY2xlYW5zZVdTQ29tbWVudHNSZXBlYXRlZEhlYWRlckluRmlsZShmaWxlbmFtZTE6IHN0cmluZywgZmlsZW5hbWUyIDogc3RyaW5nLCBkb25lIDogYW55ICkgOiBhbnkge1xyXG4gIC8vdmFyIGxuID0gZnMucmVhZEZpbGVTeW5jKGZpbGVuYW1lMSwgeyBlbmNvZGluZyA6ICd1dGYtOCd9KTtcclxuICB2YXIgd3NPdXQgPSBnZXRXUyhmaWxlbmFtZTIpO1xyXG4gIGNvbnN0IGxpbmVyID0gbmV3IGxpbmVCeUxpbmUoZmlsZW5hbWUxKTtcclxuICB2YXIgbGluZSA9IFwiXCI7XHJcbiAgdmFyIG5yID0gMDtcclxuICB3aGlsZSggbGluZSA9IGxpbmVyLm5leHQoKSApe1xyXG4gICAgaWYgKCBsaW5lICYmICEoJycrbGluZSkuc3RhcnRzV2l0aCgnIycpICYmIChuciA8IDEgfHwgaXNEaWdpdFN0YXJ0TGluZShsaW5lKSkpIHtcclxuICAgICAgd3NPdXQud3JpdGUoICgnJyArIGxpbmUpLnJlcGxhY2UoLztcXHMrL2csXCI7XCIpICkud3JpdGUoJ1xcbicpO1xyXG4gICAgICArK25yO1xyXG4gICAgfVxyXG4gIH1cclxuICB3c091dC53cy5vbignZmluaXNoJywgKCkgPT4geyBkb25lKCk7IH0pO1xyXG4gIHdzT3V0LndzLmVuZCgpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2VuVXNlcihpIDogbnVtYmVyKSA6IHN0cmluZyB7XHJcbiAgcmV0dXJuICdQJyArIHBhZFplcm9zKGksNSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZW5VU0VSSGllcmFyY2h5Vyh3cyA6IGFueSwgbnJwZXJzIDogbnVtYmVyICkge1xyXG4gIC8vIHdlIGJ1aWxkIGEgcGFyZW50IGNoaWxkIGhpZXJhcmNoeSAgdXNpbmcgcHJpbWUgbnVtYmVyIGRlY29tcG9zaXRpb24sXHJcbiAgLy8gd2UgYnVpbGQgYSBwYXJlbnQgY2hpbGQgaGllcmFyY2h5ICB1c2luZyBwcmltZSBudW1iZXIgZGVjb21wb3NpdGlvbixcclxuICAvLyB3aXRoIHBlcnNvbnMgbWFkZSBjaGlsZHJlbiBvZiB0aGUgXCJsYWdlc3QgcHJpbWUgZmFjdG9yXCJcclxuICAvLyB0byBub3QgZW5kIHVwIHdpdGggdG9vIG1hbnkgcm9vdHMgd2Ugb25seSBtYWtlIGV2ZXJ5IG4tdGggcHJpbWUgZmFjdG9yIGEgcm9vdC5cclxuICAvL1xyXG4gIC8vXHJcbiAgdmFyIHJlcyA9IHt9O1xyXG4gIHZhciBuclByaW1lcyA9IDA7XHJcbiAgLy8gMTMgLSA1IC0gMlxyXG4gIGZvcih2YXIgaSA9IDE7IGkgPD0gbnJwZXJzOyArK2kgKSB7XHJcbiAgICB2YXIgcHJpbSA9IGdldE1heFByaW1lcyhpKTtcclxuICAgIGlmKCAhcmVzW3ByaW1dKSB7XHJcbiAgICAgICsrbnJQcmltZXM7XHJcbiAgICAgIGlmICggKGkgPiAxMCkgJiYgKG5yUHJpbWVzICUgMjAgIT0gMTUpICkge1xyXG4gICAgICAgIHZhciBwcmltUGFyID0gZ2V0TWF4UHJpbWVzKE1hdGguZmxvb3IoaS8xMCkpO1xyXG4gICAgICAgIHJlc1twcmltXSA9IHByaW1QYXI7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmVzW3ByaW1dID0gLTE7IC8vIGEgcm9vdFxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiggaSAhPSBwcmltICkge1xyXG4gICAgICByZXNbaV0gPSBwcmltO1xyXG4gICAgfVxyXG4gIH1cclxuICAvL2R1bXAgdGhlIGxpc3RcclxuICB3cy53cml0ZShcIlVTRVI7VVNFUl9QQVJFTlRcXG5cIik7XHJcbiAgZm9yKHZhciBpID0gMTsgaSA8PSBucnBlcnM7ICsraSkge1xyXG4gICAgd3Mud3JpdGUoZ2VuVXNlcihpKSkud3JpdGUoJzsnKTtcclxuICAgIGlmICggcmVzW2ldID4gMCApIHtcclxuICAgICAgd3Mud3JpdGUoZ2VuVXNlcihyZXNbaV0pKS53cml0ZSgnXFxuJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB3cy53cml0ZShcIlxcblwiKTsgLy9OdWxsIVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuIl19
