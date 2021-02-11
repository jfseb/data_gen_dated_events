"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genUSERHierarchyW = exports.genUser = exports.cleanseWSInFile = exports.genUSERHierarchy = exports.getMaxPrimes = exports.genPerson = exports.isHireChange = exports.writeRecord0 = exports.writeRecord = exports.memorizeSOM = exports.toDec1 = exports.writeTripel = exports.writeAge = exports.getSOM = exports.writeTenure = exports.writeTENUREAGE = exports.diffMonth = exports.diffYears = exports.writeDay = exports.makeQuarter = exports.writeHeader = exports.daysInMonth = exports.EOMONTH = exports.asDate = exports.padSpaceQ = exports.padSpace = exports.padZeros = exports.isEOY = exports.isEOQ = exports.copyDate = exports.Person = exports.GenParams = exports.OptsMONAG = exports.getWS = exports.WSWrap2 = exports.makeMap = exports.dateToDayIndex = exports.EXCELOFFSET = void 0;
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
    ws.write("USER;LOCATION;ESTAT;HC;HC_SOM;HC_EOM;DAYSWORKED;FTE;FTE_SOM;FTE_EOM;FTEWORKED;TENURE;TENURE_SOM;TENURE_EOM;AGE;AGE_SOM;AGE_EOM;HC_EOMS;X\n");
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
//export function cleanseWSInFile(filename1: string, filename2 : string ) {
//  var ln = fs.readFileSync(filename1, { encoding : 'utf-8'});
//  var lnc = ln.replace(/;\s+/g,";");
//  fs.writeFileSync(filename2, lnc)
//}
function cleanseWSInFile(filename1, filename2, done) {
    //var ln = fs.readFileSync(filename1, { encoding : 'utf-8'});
    var wsOut = getWS(filename2);
    const liner = new lineByLine(filename1);
    var line = "";
    while (line = liner.next()) {
        if (line) {
            wsOut.write(('' + line).replace(/;\s+/g, ";")).write('\n');
        }
    }
    wsOut.ws.on('finish', () => { done(); });
    wsOut.ws.end();
}
exports.cleanseWSInFile = cleanseWSInFile;
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,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QUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNqRCxFQUFFLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsZ0RBQWdEO0lBQzlGLFdBQVcsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFBLENBQUMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFBLENBQUMsQ0FBQyxLQUFLLEVBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDeEYsSUFBSSxZQUFZLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDdEQsRUFBRSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxZQUFZLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxZQUFZO0lBQzVFLFdBQVcsQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDbEYsRUFBRSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsT0FBTyxHQUFHLFlBQVksRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLFlBQVk7SUFDM0YsV0FBVyxDQUFDLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEdB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Q0FBQyxDQUFDLEdBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDN0MsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLE9BQU8sQ0FBQzthQUNyQjtpQkFBTTtnQkFDTCxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTO2FBQzFCO1NBQ0Y7UUFDRCxJQUFJLENBQUMsSUFBSSxJQUFJLEVBQUc7WUFDZCxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1NBQ2Y7S0FDRjtJQUNELGVBQWU7SUFDZixFQUFFLENBQUMsS0FBSyxDQUFDLG9CQUFvQixDQUFDLENBQUM7SUFDL0IsS0FBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRTtRQUMvQixFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNoQyxJQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUc7WUFDaEIsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDdkM7YUFBTTtZQUNMLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxPQUFPO1NBQ3hCO0tBQ0Y7QUFDSCxDQUFDO0FBbkNELDhDQW1DQyIsImZpbGUiOiJoZWxwZXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGZzID0gcmVxdWlyZSgnZnMnKTtcclxuY29uc3QgeyBleGl0IH0gPSByZXF1aXJlKCdwcm9jZXNzJyk7XHJcbmltcG9ydCAqIGFzIF8gZnJvbSAnbG9kYXNoJztcclxuaW1wb3J0ICogYXMgbGluZUJ5TGluZSBmcm9tICduLXJlYWRsaW5lcyc7XHJcbmltcG9ydCAqIGFzIHJlYWRsaW5lIGZyb20gJ3JlYWRsaW5lJztcclxuXHJcbi8vdmFyIHNlZWRyYW5kb20gPSByZXF1aXJlKCdzZWVkcmFuZG9tJyk7XHJcbmltcG9ydCAqIGFzIHNlZWRyYW5kb20gZnJvbSAnc2VlZHJhbmRvbSc7XHJcbi8vIEVYQ0VMXHJcbi8vICAgICAxIDE5MDAtMDEtMDFcclxuLy8gMjU1NjkgMTk3MC0wMS0wMVxyXG4vL1xyXG5leHBvcnQgY29uc3QgRVhDRUxPRkZTRVQgPSAyNTU2OTtcclxuXHJcbmltcG9ydCB7TG9jYWxEYXRlIH0gZnJvbSAgXCJAanMtam9kYS9jb3JlXCI7XHJcbmltcG9ydCB7IFNTTF9PUF9ET05UX0lOU0VSVF9FTVBUWV9GUkFHTUVOVFMgfSBmcm9tICdjb25zdGFudHMnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRhdGVUb0RheUluZGV4KGQgOiBMb2NhbERhdGUgKSA6IG51bWJlciB7XHJcbiAgcmV0dXJuICBkLnRvRXBvY2hEYXkoKSArIEVYQ0VMT0ZGU0VUO1xyXG59XHJcblxyXG52YXIgZDEgPSBMb2NhbERhdGUub2YoMjAyMCwxLDYpO1xyXG52YXIgZDFJZHggPSBkYXRlVG9EYXlJbmRleChkMSk7XHJcbnZhciBkMiA9IExvY2FsRGF0ZS5vZigyMDI0LDYsMSk7XHJcbnZhciBkMklkeCA9IGRhdGVUb0RheUluZGV4KGQyKTtcclxudmFyIGRlbHRhVGltZSA9IGQySWR4LWQxSWR4O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG1ha2VNYXAob2JqKSB7XHJcbiAgdmFyIGlkeCA9IDA7XHJcbiAgdmFyIHJlcyA9IFtdO1xyXG4gIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKG9iaikuZm9yRWFjaCggZnVuY3Rpb24oYSkge1xyXG4gICAgZm9yKHZhciBpID0gMDsgaSA8IG9ialthXTsgKytpKSB7XHJcbiAgICAgIHJlcy5wdXNoKGEpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG4gIHJldHVybiByZXM7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBXU1dyYXAyICB7XHJcbiAgd3M6IGFueTtcclxuICBfbG9nOiBhbnk7XHJcbiAgX29uRmluaXNoIDogYW55O1xyXG4gIGNvbnN0cnVjdG9yKGZuIDogc3RyaW5nKVxyXG4gIHtcclxuICAgIHRoaXMud3MgPSB0aGlzO1xyXG4gICAgdGhpcy5fbG9nID0gZnMub3BlblN5bmMoZm4sJ3cnKTtcclxuICAgIHRoaXMuX29uRmluaXNoID0gdW5kZWZpbmVkO1xyXG4gIH1cclxuICBvbiggcyA6IHN0cmluZywgZm4gOiBhbnkpIHtcclxuICAgIHRoaXMuX29uRmluaXNoID0gZm47XHJcbiAgfVxyXG4gIGVuZCgpIHtcclxuICAgIGZzLmNsb3NlU3luYyh0aGlzLl9sb2cpO1xyXG4gICAgdGhpcy5fbG9nID0gdW5kZWZpbmVkO1xyXG4gICAgaWYoIHRoaXMuX29uRmluaXNoKSB7XHJcbiAgICAgIHRoaXMuX29uRmluaXNoKCk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHdyaXRlKGEgOiBhbnkpIHtcclxuICAgIGZzLndyaXRlU3luYyh0aGlzLl9sb2csICcnICsgYSk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcbn07XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFdTKGZpbGVuYW1lOiBzdHJpbmcpIDogV1NXcmFwMiB7XHJcblxyXG4gIHJldHVybiBuZXcgV1NXcmFwMihmaWxlbmFtZSk7XHJcbn1cclxuXHJcblxyXG4vLyAxIFNpbXBsZSByYW5nZSBiYXNlZCAgKG5vIG1vbnRobHkgaW50ZXJpbSBkYXRhKVxyXG4vLyAgW3h4eF0tW3l5eV0gIDxhdHRyaWJ1dGVzPlxyXG4vL1xyXG4vLyAgb3B0aW9uYWwgc3ByaW5rbGUgaW4gMCwwLDAsMCA8YXR0cmlidXRlcz4gTWFyayAgRU9NL0VPUCBudW1iZXJzLlxyXG4vL1xyXG4vL3RvIHN1cHBvcnQgZGlmZmVyZW50IG91dHB1dCBmbGF2b3VycyxcclxuLy9cclxuLy9cclxuXHJcbmV4cG9ydCBjbGFzcyBPcHRzTU9OQUcge1xyXG4gIG5vWmVybyA6IGJvb2xlYW47XHJcbiAgc3RvcFJlY29yZHMgOiBib29sZWFuO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgR2VuUGFyYW1zIHtcclxuICBBVkdfTkVYVCA6IG51bWJlcjtcclxuICBMT0NDSEFOR0UgOiBudW1iZXI7XHJcbiAgRlRFQ0hBTkdFOiBudW1iZXI7XHJcbiAgRVNUQVRDSEFOR0U6bnVtYmVyO1xyXG4gIExfSElSRSA6IG51bWJlcjtcclxuICBMX0VWRU5UIDogbnVtYmVyO1xyXG4gIExPQ0FUSU9Oczogc3RyaW5nW107XHJcbiAgRVNUQVRzIDogc3RyaW5nW107XHJcbiAgZmlyc3REYXRlIDogTG9jYWxEYXRlO1xyXG4gIGxhc3REYXRlIDogTG9jYWxEYXRlO1xyXG4gIHJhbmRvbSA6IGFueTtcclxuICB3c01PTkFHIDogYW55O1xyXG4gIG9wdHNNT05BRz8gOiBPcHRzTU9OQUc7XHJcbiAgd3NSQU5HRSA6IGFueTtcclxuICBvcHRzUkFOR0UgOiBhbnk7XHJcbiAgcmFuZG9tT0QgOiBhbnk7IC8vIHsgXCJFU1RBVFwiIDogc2VlZHJhbmRvbSgnWFpZJykgfSxcclxuICBSRU9QX0VTVEFUUyA6IHN0cmluZ1tdOyAvLyBFU1RBVFMgd2hpY2ggY29udHJpYnV0ZSB0byBFT1AsIHRoaXMgaXMganVzdCBoZWFkIGNvdW50IElGIEVTVEFUIElOIFtcIkFcIixcIlVcIixcIlBcIl0gRU9QX0hDIDogMFxyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUGVyc29uIHtcclxuICAvLyBpbW11dGFibGVcclxuICB1c2VyOiBzdHJpbmc7XHJcbiAgLy8gY2hhbmdpbmdcclxuICBkb2I6IExvY2FsRGF0ZTtcclxuICBsb2NhdGlvbiA6IHN0cmluZztcclxuICBoaXJlZDogbnVtYmVyO1xyXG4gIGhpcmVkU09NOiBudW1iZXI7XHJcbiAgaGlyZWRQcmV2IDogbnVtYmVyOyAvLyBwZXJzb24gIGhpcmUgc3RhdGUgcHJldmlvdXMgcmFuZ2VcclxuICBmdGUgOiBudW1iZXI7XHJcbiAgZnRlUHJldiA6IG51bWJlcjsgLy8gcGVyc29uIGZ0ZSBzdGF0ZSBwcmV2aW91cyByYW5nZVxyXG4gIGZ0ZVNPTTogbnVtYmVyO1xyXG4gIEVTVEFUIDogc3RyaW5nO1xyXG4gIEVTVEFUUHJldiA6IHN0cmluZztcclxuICBFU1RBVFNPTSA6IHN0cmluZztcclxuICAvLyBjaGFuZ2luZ1xyXG4gIGxhc3RIaXJlZDogTG9jYWxEYXRlO1xyXG4gIHByZXZEYXRlRW5kIDogTG9jYWxEYXRlO1xyXG4gIHByZXZSYW5nZUVuZDogTG9jYWxEYXRlOyAvLyBlbmQgb2YgbGFzdCByYW5nZVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXROZXh0KHBhcnM6R2VuUGFyYW1zKSB7XHJcbiAgcmV0dXJuIE1hdGguZmxvb3IocGFycy5yYW5kb20oKSAqIHBhcnMuQVZHX05FWFQpICsgMTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0TG9jYXRpb24ocGFyczogR2VuUGFyYW1zKSB7XHJcbiAgcmV0dXJuIHBhcnMuTE9DQVRJT05zW01hdGguZmxvb3IocGFycy5yYW5kb20oKSAqIHBhcnMuTE9DQVRJT05zLmxlbmd0aCldO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRFU1RBVChwYXJzOiBHZW5QYXJhbXMsIGtleSA6IHN0cmluZykge1xyXG4gIHJldHVybiBwYXJzLkVTVEFUc1tNYXRoLmZsb29yKHBhcnMucmFuZG9tT0Rba2V5XSgpICogcGFycy5FU1RBVHMubGVuZ3RoKV07XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBuZXh0TG9jYXRpb24ocGFyczogR2VuUGFyYW1zLCBwZXJzIDogUGVyc29uKSB7XHJcbiAgaWYoIHBhcnMucmFuZG9tKCkgPCBwYXJzLkxPQ0NIQU5HRSkge1xyXG4gICAgcmV0dXJuIGdldExvY2F0aW9uKHBhcnMpO1xyXG4gIH1cclxuICByZXR1cm4gIHBlcnMubG9jYXRpb247XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG5leHRGVEUocGFyczogR2VuUGFyYW1zLCBwZXJzIDogUGVyc29uKSB7XHJcbiAgaWYoIHBhcnMucmFuZG9tKCkgPCBwYXJzLkZURUNIQU5HRSkge1xyXG4gICAgaWYoIHBlcnMuZnRlID09IDEpIHtcclxuICAgICAgcmV0dXJuIDAuNTtcclxuICAgIH1cclxuICAgIHJldHVybiAxLjA7XHJcbiAgfVxyXG4gIHJldHVybiBwZXJzLmZ0ZTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGdldE5leHRFU1RBVChwYXJzOiBHZW5QYXJhbXMsIHBlcnMgOiBQZXJzb24sIGtleSA6IHN0cmluZykge1xyXG4vLyAgcGFycy5yYW5kb21PRFtrZXldKCk7XHJcbiAgaWYoIHBhcnMucmFuZG9tT0Rba2V5XSgpIDwgcGFycy5FU1RBVENIQU5HRSkge1xyXG4gICAgcmV0dXJuIGdldEVTVEFUKHBhcnMsIGtleSk7XHJcbiAgfVxyXG4gIHJldHVybiAgcGVycy5FU1RBVDtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIGlzRXZlbnQocGFyczpHZW5QYXJhbXMpIHtcclxuICByZXR1cm4gcGFycy5yYW5kb20oKSA8IHBhcnMuTF9FVkVOVDtcclxufVxyXG5cclxuZnVuY3Rpb24gaXNFT00oZGF0ZUlkeCA6IExvY2FsRGF0ZSkge1xyXG4gIHZhciBkID0gY29weURhdGUoZGF0ZUlkeCkucGx1c0RheXMoMSk7XHJcbiAgaWYoZC5kYXlPZk1vbnRoKCkgPT0gMSlcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNvcHlEYXRlKGQgOiBMb2NhbERhdGUpIHtcclxuICByZXR1cm4gTG9jYWxEYXRlLm9mRXBvY2hEYXkoZC50b0Vwb2NoRGF5KCkpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNFT1EoZDogTG9jYWxEYXRlKSB7XHJcbiAgZCA9IGNvcHlEYXRlKGQpLnBsdXNEYXlzKDEpO1xyXG4gIGlmKGQuZGF5T2ZNb250aCgpID09IDEgJiYgIFsxLDQsNywxMF0uaW5kZXhPZihkLm1vbnRoVmFsdWUoKSkgPj0gMClcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNFT1koZCA6IExvY2FsRGF0ZSkge1xyXG4gIHZhciBkID0gY29weURhdGUoZCkucGx1c0RheXMoMSk7XHJcbiAgaWYoZC5kYXlPZk1vbnRoKCkgPT0gMSAmJiBkLm1vbnRoVmFsdWUoKSA9PSAxKVxyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgcmV0dXJuIGZhbHNlO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcGFkWmVyb3MoYSA6IGFueSwgbGVuIDogbnVtYmVyKSB7XHJcbiAgdmFyIHMgPSBcIlwiICthO1xyXG4gIHJldHVybiBcIjAwMDAwMDBcIi5zdWJzdHIoMCwgbGVuIC0gcy5sZW5ndGgpICsgcztcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHBhZFNwYWNlKGEgOiBhbnksIGxlbiA6IG51bWJlcikge1xyXG4gIHZhciBzID0gXCJcIiArYTtcclxuICByZXR1cm4gXCIgICAgICAgICAgICAgICAgICAgXCIuc3Vic3RyKDAsIGxlbiAtIHMubGVuZ3RoKSArIHM7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBwYWRTcGFjZVEoYSA6IGFueSwgbGVuIDogbnVtYmVyKSB7XHJcbiAgdmFyIHMgPSBcIlwiICthO1xyXG4gIHJldHVybiAnXCInICsgcyArICdcIicgKyBcIiAgICAgICAgICAgICAgICAgICBcIi5zdWJzdHIoMCwgbGVuIC0gcy5sZW5ndGgpO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGFzRGF0ZShkYXRlSWR4IDogTG9jYWxEYXRlKTogc3RyaW5nIHtcclxuICB2YXIgZCA9ZGF0ZUlkeDtcclxuICByZXR1cm4gJycgKyBkO1xyXG4gIC8vcmV0dXJuIGQueWVhcigpICsgXCItXCIgKyBwYWQoZC5tb250aFZhbHVlKCksMikgKyBcIi1cIiArIHBhZChkLmRheU9mTW9udGgoKSwyKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEVPTU9OVEgoZCA6IExvY2FsRGF0ZSkgOiBMb2NhbERhdGUge1xyXG4gIHJldHVybiBjb3B5RGF0ZShkKS5wbHVzTW9udGhzKDEpLndpdGhEYXlPZk1vbnRoKDEpLm1pbnVzRGF5cygxKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRheXNJbk1vbnRoKGRhdGVJZHggOiBMb2NhbERhdGUpIHtcclxuICB2YXIgZHQgPWRhdGVJZHg7XHJcbiAgdmFyIGRlb20gPSBFT01PTlRIKGR0KTtcclxuICByZXR1cm4gZGF0ZVRvRGF5SW5kZXgoZGVvbSkgLSBkYXRlVG9EYXlJbmRleChjb3B5RGF0ZShkZW9tKS53aXRoRGF5T2ZNb250aCgxKSkgKyAxO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gd3JpdGVIZWFkZXIod3MpIHtcclxuICB3cy53cml0ZShcIllFQVI7UVVBUlQ7Q0FMTU9OVEhJQztDQUxNT05USEk7Q0FMTU9OVEg7Q0FMTU9OVEhTO1NUQVJUX0RBVEVfSURYO0VORF9EQVRFX0lEWDtJU0VPTTtJU0VPUTtJU0VPWTtEQVlTSU5NT05USDtTVEFSVF9EQVRFO0VORF9EQVRFO1wiKVxyXG4gIHdzLndyaXRlKFwiVVNFUjtMT0NBVElPTjtFU1RBVDtIQztIQ19TT007SENfRU9NO0RBWVNXT1JLRUQ7RlRFO0ZURV9TT007RlRFX0VPTTtGVEVXT1JLRUQ7VEVOVVJFO1RFTlVSRV9TT007VEVOVVJFX0VPTTtBR0U7QUdFX1NPTTtBR0VfRU9NO0hDX0VPTVM7WFxcblwiKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbWFrZVF1YXJ0ZXIoZCA6IExvY2FsRGF0ZSkge1xyXG4gIHJldHVybiBkLnllYXIoKSArICcnICsgJ19RJyArICAoTWF0aC5mbG9vcigoZC5tb250aFZhbHVlKCktMSkvMykrMSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB3cml0ZURheSh3cywgcHJldkRhdGVFbmQ6TG9jYWxEYXRlLCBkYXRlSWR4IDogTG9jYWxEYXRlKSB7XHJcbiAgdmFyIHN0YXJ0SWR4ID0gY29weURhdGUocHJldkRhdGVFbmQpLnBsdXNEYXlzKDEpO1xyXG4gIHZhciBkID0gZGF0ZUlkeDtcclxuICB2YXIgeSA9IGQueWVhcigpO1xyXG4gIHZhciBtID0gZC5tb250aFZhbHVlKCk7XHJcbiAgdmFyIGNtaSA9IHkqMTAwICsgbTtcclxuICB2YXIgY21pYyA9ICAoeS0yMDAwKSoxMiArIG07XHJcbiAgd3Mud3JpdGUoeSkud3JpdGUoJzsnKTtcclxuICB3cy53cml0ZShtYWtlUXVhcnRlcihkKSkud3JpdGUoJzsnKTtcclxuICB3cy53cml0ZSgnJyArIGNtaWMgKyBcIjtcIiArIGNtaSArIFwiO1wiICsgY21pICsgXCI7XCIgKyBjbWkrIFwiO1wiKTsgLy8gQ0FMTU9OVEggSUMgSSB+IFNcclxuICB3cy53cml0ZShkYXRlVG9EYXlJbmRleChzdGFydElkeCkrIFwiO1wiKyBkYXRlVG9EYXlJbmRleChkYXRlSWR4KSArIFwiO1wiKTtcclxuICB3cy53cml0ZShpc0VPTShkKT8gXCIxLjBcIiA6IFwiMC4wXCIpLndyaXRlKFwiO1wiKTtcclxuICB3cy53cml0ZShpc0VPUShkKT8gXCIxLjBcIiA6IFwiMC4wXCIpLndyaXRlKFwiO1wiKTtcclxuICB3cy53cml0ZShpc0VPWShkKT8gXCIxLjBcIiA6IFwiMC4wXCIpLndyaXRlKFwiO1wiKTtcclxuICB2YXIgZGltID0gZGF5c0luTW9udGgoZCk7XHJcbiAgd3Mud3JpdGUoZGltKS53cml0ZShcIjtcIik7XHJcbiAgd3Mud3JpdGUoYXNEYXRlKHN0YXJ0SWR4KSkud3JpdGUoXCI7XCIpO1xyXG4gIHdzLndyaXRlKGFzRGF0ZShkKSkud3JpdGUoXCI7XCIpO1xyXG4gIHJldHVybiBkaW07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkaWZmWWVhcnMoZGF0ZUxvdzogTG9jYWxEYXRlLCBkYXRlSGlnaDogTG9jYWxEYXRlKSB7XHJcbiAgcmV0dXJuIGRhdGVMb3cudW50aWwoZGF0ZUhpZ2gpLnllYXJzKCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkaWZmTW9udGgoZGF0ZUxvdyA6IExvY2FsRGF0ZSwgZGF0ZUhpZ2ggOiBMb2NhbERhdGUpIHtcclxuICB2YXIgYSA9IGRhdGVMb3cudW50aWwoZGF0ZUhpZ2gpO1xyXG4gIHJldHVybiBhLnllYXJzKCkqMTIgKyBhLm1vbnRocygpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gd3JpdGVURU5VUkVBR0UocGVycyA6UGVyc29uKSB7XHJcbiAgcmV0dXJuIHBlcnMuaGlyZWQgPiAwO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gd3JpdGVUZW51cmUod3MsIG5vdzogTG9jYWxEYXRlLCBwZXJzOiBQZXJzb24sIGVvbSkge1xyXG4gIGlmICggIXdyaXRlVEVOVVJFQUdFKHBlcnMpICkge1xyXG4gICAgd3Mud3JpdGUoJyAwOyAwOyAwOycpO1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICB2YXIgdGVudXJlTm93ID0gZGlmZk1vbnRoKHBlcnMubGFzdEhpcmVkLG5vdyk7XHJcbiAgd3Mud3JpdGUocGFkU3BhY2UodGVudXJlTm93LDIpKS53cml0ZSgnOycpO1xyXG4gIGlmKCBpc0VPTShub3cpKSB7XHJcbiAgICB2YXIgZHNvbSA9IGdldFNPTShub3cpO1xyXG4gICAgdmFyIHRlbnVyZVNPTSA9IGRpZmZNb250aChwZXJzLmxhc3RIaXJlZCxkc29tKTtcclxuICAgIHdzLndyaXRlKHBhZFNwYWNlKHRlbnVyZVNPTSwyKSkud3JpdGUoJzsnKVxyXG4gICAgd3Mud3JpdGUocGFkU3BhY2UodGVudXJlTm93LDIpKS53cml0ZSgnOycpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB3cy53cml0ZSgnIDA7IDA7JylcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRTT00oZGF0ZUlkeCA6IExvY2FsRGF0ZSkgIDogTG9jYWxEYXRlIHtcclxuICByZXR1cm4gZGF0ZUlkeC53aXRoRGF5T2ZNb250aCgxKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHdyaXRlQWdlKHdzLCBub3cgOiBMb2NhbERhdGUsIHBlcnMsIGVvbTogYm9vbGVhbikge1xyXG4gIGlmICggIXdyaXRlVEVOVVJFQUdFKHBlcnMpICkge1xyXG4gICAgd3Mud3JpdGUoJyAwOyAwOyAwOycpO1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICB2YXIgYWdlTm93ID0gZGlmZlllYXJzKHBlcnMuZG9iLG5vdyk7XHJcbiAgd3Mud3JpdGUocGFkU3BhY2UoYWdlTm93LDIpKS53cml0ZSgnOycpO1xyXG4gIGlmKCBpc0VPTShub3cpICkge1xyXG4gICAgdmFyIGRzb20gPSBnZXRTT00obm93KTtcclxuICAgIHZhciBhZ2VTT00gPSBkaWZmWWVhcnMocGVycy5kb2IsZHNvbSk7XHJcbiAgICB3cy53cml0ZShwYWRTcGFjZShhZ2VTT00sMikpLndyaXRlKCc7JylcclxuICAgIHdzLndyaXRlKHBhZFNwYWNlKGFnZU5vdywyKSkud3JpdGUoJzsnKTtcclxuICB9IGVsc2Uge1xyXG4gICAgd3Mud3JpdGUoJyAwOyAwOycpXHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gd3JpdGVUcmlwZWwod3MsIHZzb20gOiBhbnksIHZub3c6IGFueSwgZW9tIDogYm9vbGVhbikge1xyXG4gIHdzLndyaXRlKHBhZFNwYWNlKHZub3csMykpLndyaXRlKCc7Jyk7XHJcbiAgaWYoIGVvbSApIHtcclxuICAgIHdzLndyaXRlKHBhZFNwYWNlKHZzb20sMykpLndyaXRlKCc7JylcclxuICAgIHdzLndyaXRlKHBhZFNwYWNlKHZub3csMykpLndyaXRlKCc7Jyk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHdzLndyaXRlKCcwLjA7MC4wOycpXHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdG9EZWMxKG4gOiBudW1iZXIpIHtcclxuICByZXR1cm4gKG4gfHwgMCkudG9GaXhlZCgxKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG1lbW9yaXplU09NKGRhdGVJZHggOiBMb2NhbERhdGUsIHBlcnMgOiBQZXJzb24pIHtcclxuICB2YXIgZW9tID0gaXNFT00oZGF0ZUlkeCk7XHJcbiAgaWYgKGVvbSkge1xyXG4gICAgcGVycy5mdGVTT00gPSBwZXJzLmhpcmVkICogcGVycy5mdGU7XHJcbiAgICBwZXJzLmhpcmVkU09NID0gcGVycy5oaXJlZDtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzQWxsWmVybyhwZXJzIDogUGVyc29uKSB7XHJcbiAgcmV0dXJuIChwZXJzLmhpcmVkID09IDAgJiYgIHBlcnMuaGlyZWRTT00gPT0gMCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBUaGlzIGZ1bmN0aW9uIGRvZXMgbXV0YXRlIHBlcnMsIHVzZSBhIGNsb25lIGlmIG5vdCBkZXNpcmVkIVxyXG4gKiBAcGFyYW0gd3NcclxuICogQHBhcmFtIGRhdGVJZHhcclxuICogQHBhcmFtIHBlcnNcclxuICogQHBhcmFtIGNvbW1lbnRcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiB3cml0ZVJlY29yZCh3cywgZGF0ZUlkeCA6IExvY2FsRGF0ZSwgcGVycyA6IFBlcnNvbiwgcGFycyA6IEdlblBhcmFtcywgY29tbWVudDogc3RyaW5nIClcclxue1xyXG4gIHZhciBzdGFydElkeCA9IGNvcHlEYXRlKHBlcnMucHJldkRhdGVFbmQpLnBsdXNEYXlzKDEpO1xyXG4gIHZhciBlb20gPSBpc0VPTShkYXRlSWR4KTtcclxuICB3cy53cml0ZShwYWRTcGFjZVEocGVycy51c2VyLDUpKS53cml0ZSgnOycpO1xyXG4gIHdzLndyaXRlKHBhZFNwYWNlUShwZXJzLmxvY2F0aW9uLDIwKSkud3JpdGUoJzsnKTtcclxuICB3cy53cml0ZShwYWRTcGFjZVEocGVycy5FU1RBVCwxKSkud3JpdGUoJzsnKTsgLy8gd2UgYWx3YXlzIHdyaXRlIHRoaXMsIG5lZWRlZCBmb3IgU1RPUCByZWNvcmRzXHJcbiAgd3JpdGVUcmlwZWwod3MsIHBlcnMuaGlyZWRTT00gPyBcIjEuMFwiOiBcIjAuMFwiICxwZXJzLmhpcmVkID8gXCIxLjBcIjogXCIwLjBcIixpc0VPTShkYXRlSWR4KSk7XHJcbiAgdmFyIGRheXNJblBlcmlvZCA9IHN0YXJ0SWR4LnVudGlsKGRhdGVJZHgpLmRheXMoKSArIDE7XHJcbiAgd3Mud3JpdGUocGFkU3BhY2UocGVycy5oaXJlZFByZXYgKiBkYXlzSW5QZXJpb2QsMikpLndyaXRlKCc7Jyk7IC8vREFZU1dPUktFRFxyXG4gIHdyaXRlVHJpcGVsKHdzLCB0b0RlYzEocGVycy5mdGVTT00pLHRvRGVjMShwZXJzLmhpcmVkICogcGVycy5mdGUpLGlzRU9NKGRhdGVJZHgpKTtcclxuICB3cy53cml0ZShwYWRTcGFjZShwZXJzLmhpcmVkUHJldiAqIHBlcnMuZnRlUHJldiAqIGRheXNJblBlcmlvZCw0KSkud3JpdGUoJzsnKTsgLy8gRlRFV09SS0VEXHJcbiAgd3JpdGVUZW51cmUod3MsIGRhdGVJZHgsIHBlcnMsIGVvbSk7XHJcbiAgd3JpdGVBZ2Uod3MsIGRhdGVJZHgsIHBlcnMsIGVvbSk7XHJcbiAgaWYoZW9tICYmIHBhcnMuUkVPUF9FU1RBVFMgJiYgcGFycy5SRU9QX0VTVEFUUy5pbmRleE9mKHBlcnMuRVNUQVQpID49IDApIHtcclxuICAgIHdzLndyaXRlKHBhZFNwYWNlKHBlcnMuaGlyZWQsMSkpLndyaXRlKCc7Jyk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHdzLndyaXRlKCcwJykud3JpdGUoJzsnKTtcclxuICB9XHJcbiAgcGVycy5oaXJlZFByZXYgPSBwZXJzLmhpcmVkO1xyXG4gIHBlcnMuZnRlUHJldiA9IHBlcnMuZnRlO1xyXG4gIHBlcnMucHJldkRhdGVFbmQgPSBjb3B5RGF0ZShkYXRlSWR4KTtcclxuXHJcbiAgd3Mud3JpdGUoY29tbWVudCArIFwiXFxuXCIpO1xyXG59XHJcblxyXG4vKipcclxuICogVGhpcyBmdW5jdGlvbiBkb2VzIG11dGF0ZSBwZXJzLCB1c2UgYSBjbG9uZSBpZiBub3QgZGVzaXJlZCFcclxuICogQHBhcmFtIHdzXHJcbiAqIEBwYXJhbSBkYXRlSWR4XHJcbiAqIEBwYXJhbSBwZXJzXHJcbiAqIEBwYXJhbSBjb21tZW50XHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gd3JpdGVSZWNvcmQwKHdzLCBkYXRlSWR4IDogTG9jYWxEYXRlLCBwZXJzIDogUGVyc29uLCAgY29tbWVudDogc3RyaW5nIClcclxue1xyXG4gIHZhciBzdGFydElkeCA9IGNvcHlEYXRlKGRhdGVJZHgpO1xyXG4gIHZhciBlb20gPSBpc0VPTShkYXRlSWR4KTtcclxuICB3cy53cml0ZShwYWRTcGFjZVEocGVycy51c2VyLDUpKS53cml0ZSgnOycpO1xyXG4gIHdzLndyaXRlKHBhZFNwYWNlUShwZXJzLmxvY2F0aW9uLDIwKSkud3JpdGUoJzsnKTtcclxuICB3cy53cml0ZShwYWRTcGFjZVEocGVycy5FU1RBVCwxKSkud3JpdGUoJzsnKTsgLy8gd2UgYWx3YXlzIHdyaXRlIHRoaXMsIG5lZWRlZCBmb3IgU1RPUCByZWNvcmRzXHJcbiAgd3JpdGVUcmlwZWwod3MsIFwiMC4wXCIsIFwiMC4wXCIsIGZhbHNlKTsgLy8gcGVycy5oaXJlZFNPTSA/IFwiMS4wXCI6IFwiMC4wXCIgLHBlcnMuaGlyZWQgPyBcIjEuMFwiOiBcIjAuMFwiLGlzRU9NKGRhdGVJZHgpKTtcclxuICB2YXIgZGF5c0luUGVyaW9kID0gXCIwLjBcIjsgLy9zdGFydElkeC51bnRpbChkYXRlSWR4KS5kYXlzKCkgKyAxO1xyXG4gIHdzLndyaXRlKHBhZFNwYWNlKDAsMikpLndyaXRlKCc7Jyk7IC8vREFZU1dPUktFRFxyXG4gIHdyaXRlVHJpcGVsKHdzLCB0b0RlYzEoMCksdG9EZWMxKDApLGlzRU9NKGRhdGVJZHgpKTtcclxuICB3cy53cml0ZShwYWRTcGFjZSgwLDQpKS53cml0ZSgnOycpOyAvLyBGVEVXT1JLRURcclxuICB3cy53cml0ZShcIiAwOyAwOyAwO1wiKTtcclxuICAvL3dyaXRlVGVudXJlKHdzLCBkYXRlSWR4LCBwZXJzLCBlb20pOyAvLyBDSEVDSyBXSEVUSEVSIE1FQVNVUkUgT1IgRElNXHJcbiAgd3Mud3JpdGUoXCIgMDsgMDsgMDtcIilcclxuICAvL3dyaXRlQWdlKHdzLCBkYXRlSWR4LCBwZXJzLCBlb20pO1xyXG4gIHdzLndyaXRlKFwiMDtcIik7XHJcbiAgLy9pZihlb20gJiYgcGFycy5SRU9QX0VTVEFUUyAmJiBwYXJzLlJFT1BfRVNUQVRTLmluZGV4T2YocGVycy5FU1RBVCkgPj0gMCkge1xyXG4gIC8vICAgIHdzLndyaXRlKHBhZFNwYWNlKHBlcnMuaGlyZWQsMSkpLndyaXRlKCc7Jyk7XHJcbiAgLy99IGVsc2Uge1xyXG4gIC8vICB3cy53cml0ZSgnMCcpLndyaXRlKCc7Jyk7XHJcbiAgLy99XHJcbiAgd3Mud3JpdGUoY29tbWVudCArIFwiXFxuXCIpO1xyXG59XHJcblxyXG5mdW5jdGlvbiB3cml0ZVN0YXRlTGluZVJBTkdFKHdzLGRhdGVJZHggOiBMb2NhbERhdGUsIHBlcnMgOiBQZXJzb24sIG5leHRIaXJlLCBuZXh0TG9jLCBuZXh0RlRFLCBjb21tZW50OnN0cmluZykge1xyXG4gIGlmKHdzID09IHVuZGVmaW5lZCkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIFdyaXRlIGEgc3RhdGUgbGluZSBmb3IgTW9udGhseSBhZ2dyZWdhdGVzLCB0aGlzIGlzIGUuZy4gdGhlIEVuZC1vZiBtb250aCByZWNvcmQuXHJcbiAqIEBwYXJhbSB3c1xyXG4gKiBAcGFyYW0gZGF0ZUlkeFxyXG4gKiBAcGFyYW0gcGVyc1xyXG4gKiBAcGFyYW0gbmV4dEhpcmVcclxuICogQHBhcmFtIG5leHRMb2NcclxuICogQHBhcmFtIG5leHRGVEVcclxuICogQHBhcmFtIGNvbW1lbnRcclxuICovXHJcbmZ1bmN0aW9uIHdyaXRlU3RhdGVMaW5lTU9OQUcod3MsZGF0ZUlkeCA6IExvY2FsRGF0ZSwgcGVycyA6IFBlcnNvbiwgbmV4dEhpcmUsIG5leHRMb2MsIG5leHRGVEUsIHBhcnM6IEdlblBhcmFtcywgY29tbWVudDpzdHJpbmcpIHtcclxuICB3cml0ZURheSh3cywgcGVycy5wcmV2RGF0ZUVuZCwgZGF0ZUlkeCk7XHJcbiAgcGVycy5sb2NhdGlvbiA9IG5leHRMb2MgfHwgcGVycy5sb2NhdGlvbjtcclxuICBwZXJzLmZ0ZSA9IG5leHRGVEUgfHwgcGVycy5mdGU7XHJcbiAgLy9wZXJzLmxhc3RXcml0dGVuID0gZGF0ZUlkeDtcclxuICB3cml0ZVJlY29yZCh3cywgZGF0ZUlkeCwgcGVycywgcGFycywgXCJzdFwiICsgY29tbWVudCk7XHJcbiAgbWVtb3JpemVTT00oZGF0ZUlkeCxwZXJzKTtcclxuICBpZihuZXh0SGlyZSAhPSBwZXJzLmhpcmVkKSB7XHJcbiAgICB3cy53cml0ZShcIk5FVkVSXFxuXCIpXHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBpc1VuaGlyZWRDaGFuZ2UocGVyczogUGVyc29uLCBuZXh0SGlyZSwgbmV4dExvYywgbmV4dEZURSwgbmV4dEVTVEFUKSB7XHJcbiAgcmV0dXJuICAobmV4dEhpcmUgIT0gcGVycy5oaXJlZClcclxuICAgICAgIHx8ICggbmV4dExvYyAhPSBwZXJzLmxvY2F0aW9uIClcclxuICAgICAgIHx8ICggbmV4dEZURSAhPSBwZXJzLmZ0ZSApXHJcbiAgICAgICB8fCAoIG5leHRFU1RBVCAhPSBwZXJzLkVTVEFUICk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzQUNoYW5nZShwZXJzOiBQZXJzb24sIG5leHRIaXJlLCBuZXh0TG9jLCBuZXh0RlRFLCBuZXh0RVNUQVQpIHtcclxuICByZXR1cm4gIChuZXh0SGlyZSAhPSBwZXJzLmhpcmVkKVxyXG4gICAgICAgfHwgKHBlcnMuaGlyZWQgJiYgbmV4dExvYyAhPSBwZXJzLmxvY2F0aW9uIClcclxuICAgICAgIHx8IChwZXJzLmhpcmVkICYmIG5leHRGVEUgIT0gcGVycy5mdGUgKVxyXG4gICAgICAgfHwgKHBlcnMuaGlyZWQgJiYgbmV4dEVTVEFUICE9IHBlcnMuRVNUQVQgKTtcclxufVxyXG5cclxuZnVuY3Rpb24gaXNISVJFKCBwZXJzOiBQZXJzb24gLCBuZXh0SGlyZSApIHtcclxuICByZXR1cm4gcGVycy5oaXJlZCA9PSAwICYmIG5leHRIaXJlID09IDE7XHJcbn1cclxuZnVuY3Rpb24gaXNURVJNKCBwZXJzOiBQZXJzb24gLCBuZXh0SGlyZSApIHtcclxuICByZXR1cm4gcGVycy5oaXJlZCA9PSAxICYmIG5leHRIaXJlID09IDA7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNsb3NlUHJldmlvdXNSYW5nZSh3cywgZGF0ZUlkeDpMb2NhbERhdGUsIHBlcnM6IFBlcnNvbiwgcGFycyA6IEdlblBhcmFtcywgY29tbWVudDogc3RyaW5nKSB7XHJcbiAgdmFyIGRtaW4xID0gY29weURhdGUoZGF0ZUlkeCkubWludXNEYXlzKDEpO1xyXG4gIHdyaXRlRGF5KHdzLCBwZXJzLnByZXZEYXRlRW5kLCBkbWluMSk7XHJcbiAgd3JpdGVSZWNvcmQod3MsIGRtaW4xLCBwZXJzLCBwYXJzLCBjb21tZW50KTtcclxufVxyXG5cclxuZnVuY3Rpb24gd3JpdGVDaGFuZ2VMaW5lUkFOR0Uod3MsZGF0ZUlkeCA6IExvY2FsRGF0ZSwgcGVyczogUGVyc29uLCBuZXh0SGlyZSwgbmV4dExvYywgbmV4dEZURSwgbmV4dEVTVEFULCBwYXJzIDogR2VuUGFyYW1zLCBjb21tZW50OnN0cmluZykge1xyXG4gIGlmKCB3cyA9PSB1bmRlZmluZWQpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgdmFyIGlzQ2hhbmdlID0gaXNBQ2hhbmdlKHBlcnMsbmV4dEhpcmUsbmV4dExvYyxuZXh0RlRFLG5leHRFU1RBVCk7XHJcbiAgaWYgKCAhaXNDaGFuZ2UgJiYgIWlzRU9NKGRhdGVJZHgpKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIC8vIGF0IGRhdGVJZHggdGhlIHBlcnNvbiBzdGF0ZSBjaGFuZ2VzIHRvIG5ldyBzdGF0ZS5cclxuICAvLyBjbG9uZSB0aGUgb2JqZWN0XHJcbiAgdmFyIG5leHRQZXJzID0gXy5jbG9uZURlZXAocGVycyk7XHJcbiAgbmV4dFBlcnMucHJldkRhdGVFbmQgPSBjb3B5RGF0ZShuZXh0UGVycy5wcmV2UmFuZ2VFbmQpOyAvLyEhIVxyXG4gIC8vcGVycyA9IHVuZGVmaW5lZDtcclxuICB2YXIgaXN0ZXJtID0gaXNURVJNKG5leHRQZXJzLCBuZXh0SGlyZSk7XHJcbiAgaWYgKCBpc3Rlcm0gKSB7XHJcbiAgICAvLyBjbG9zZSBwcmV2aW91cyByZWNvcmRcclxuICAgIGNsb3NlUHJldmlvdXNSYW5nZSh3cywgZGF0ZUlkeCwgbmV4dFBlcnMsIHBhcnMsICBcInRlcm1jbG9zZS0xXCIgKyAgZGF0ZUlkeCArICcgJyArICBjb21tZW50KTtcclxuICAgIHBlcnMucHJldlJhbmdlRW5kID0gY29weURhdGUoZGF0ZUlkeCkubWludXNEYXlzKDEpO1xyXG4gIH0gZWxzZSBpZiAoIGlzSElSRShuZXh0UGVycyxuZXh0SGlyZSkpIHtcclxuICAgIC8vbmV4dFBlcnMubGFzdEhpcmVkID0gZGF0ZUlkeDtcclxuICAgIHBlcnMucHJldlJhbmdlRW5kID0gY29weURhdGUoZGF0ZUlkeCkubWludXNEYXlzKDEpOyAvLyBTRVQgVEhJUyFcclxuICAgIC8vIGRvIG5vdGhpbmcsIHdpbGwgYmUgY2FwdHVyZWQgbmV4dFxyXG4gIH0gZWxzZSB7XHJcbiAgICAvLyBjbG9zZSBwcmV2aW91cyByZWNvcmQsIGFsd2F5c1xyXG4gICAgdmFyIGRtaW4xID0gY29weURhdGUoZGF0ZUlkeCkubWludXNEYXlzKDEpO1xyXG4gICAgd3JpdGVEYXkod3MsIG5leHRQZXJzLnByZXZEYXRlRW5kLCBkbWluMSk7XHJcbiAgICB3cml0ZVJlY29yZCh3cywgZG1pbjEsIG5leHRQZXJzICwgcGFycywgXCJwZXJjbG9zZS0xIGZyb20gXCIgKyBkYXRlSWR4ICsgJyAnICsgIGNvbW1lbnQpO1xyXG4gICAgcGVycy5wcmV2UmFuZ2VFbmQgPSBjb3B5RGF0ZShkYXRlSWR4KS5taW51c0RheXMoMSk7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBpc1N0b3BSZWNvcmRzUmVxdWVzdGVkKHBhcnM6IEdlblBhcmFtcykge1xyXG4gIHJldHVybiAoIHBhcnMub3B0c01PTkFHICYmIHBhcnMub3B0c01PTkFHLnN0b3BSZWNvcmRzKTtcclxufVxyXG5cclxuZnVuY3Rpb24gaXNOb1plcm9SZXF1ZXN0ZWQocGFyczogR2VuUGFyYW1zKSB7XHJcbiAgcmV0dXJuICggcGFycy5vcHRzTU9OQUcgJiYgcGFycy5vcHRzTU9OQUcubm9aZXJvKTtcclxufVxyXG5cclxuXHJcbi8vIHdlIHdyaXRlIGEgcmVjb3JkIHdpdGggYWxsIG1lYXN1cmVzIHplcm8gKG9yIG51bGw/KVxyXG5mdW5jdGlvbiB3cml0ZVNUT1BSZWNvcmRBZnRlcih3cywgcGVycyA6IFBlcnNvbiwgZCA6IExvY2FsRGF0ZSwgcGFyczogR2VuUGFyYW1zLCBjb21tZW50IDogc3RyaW5nICkge1xyXG4gIHdyaXRlRGF5KHdzLCBkLCBkKTsgLy8gW2QtZF07XHJcbiAgd3JpdGVSZWNvcmQwKHdzLCBkLCBwZXJzLCBjb21tZW50KTtcclxufVxyXG5cclxuLy8gdGhlcmUgaXMgYSBjaGFuZ2UgQGRhdGUgLCBuZXcgdmFsdWVzIGFyZSB0byB0aGUgcmlnaHQ7XHJcbi8vIHRoaXMgaSBjYWxsZWQgb24gYSBjaGFuZ2UgaW4gdmFsdWVzLlxyXG5mdW5jdGlvbiB3cml0ZUNoYW5nZUxpbmVNT05BRyh3cywgZGF0ZUlkeCA6IExvY2FsRGF0ZSwgcGVycyA6UGVyc29uLCBuZXh0SGlyZSwgbmV4dExvYywgbmV4dEZURSwgbmV4dEVTVEFULCBwYXJzIDogR2VuUGFyYW1zLCBjb21tZW50OnN0cmluZykge1xyXG4gIHZhciBpc0NoYW5nZSA9IGlzQUNoYW5nZShwZXJzLCBuZXh0SGlyZSwgbmV4dExvYywgbmV4dEZURSwgbmV4dEVTVEFUKTtcclxuICBpZiAoICFpc0NoYW5nZSAmJiAhaXNFT00oZGF0ZUlkeCkpIHtcclxuICAgIHBlcnMubG9jYXRpb24gPSBuZXh0TG9jO1xyXG4gICAgLy9wZXJzLm5leHRGVEUgPSBuZXh0RlRFOyAgLy8vIFRPRE8gRklYIVxyXG4gICAgcGVycy5FU1RBVCA9IG5leHRFU1RBVDtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgdmFyIGlzdGVybSA9IGlzVEVSTShwZXJzLCBuZXh0SGlyZSk7XHJcbiAgaWYgKCBpc3Rlcm0gKSB7XHJcbiAgICAvLyBjbG9zZSBwcmV2aW91cyByZWNvcmRcclxuICAgIGlmIChkYXRlSWR4LmRheU9mTW9udGgoKSAhPSAxKSB7IC8vIHVubGVzcyB3ZSBhbHJlYWR5IGNsb3NlZCBpdCBieSBhIG1vbnRoIHJlY29yZFxyXG4gICAgICB2YXIgZG1pbjEgPSBjb3B5RGF0ZShkYXRlSWR4KS5taW51c0RheXMoMSk7XHJcbiAgICAgIHdyaXRlRGF5KHdzLCBwZXJzLnByZXZEYXRlRW5kLCBkbWluMSk7XHJcbiAgICAgIHdyaXRlUmVjb3JkKHdzLCBkbWluMSwgcGVycywgcGFycywgXCJ0ZXJtY2xvc2UtMUBcIiArICBkYXRlSWR4ICsgJyAnICsgY29tbWVudCk7XHJcbiAgICAgIG1lbW9yaXplU09NKGRtaW4xLHBlcnMpO1xyXG4gICAgfVxyXG4gICAgLy8gYWx3YXlzIHdyaXRlIGEgc3RvcCByZWNvcmQgaWYgcmVxdWlyZWRcclxuICAgIGlmICggaXNTdG9wUmVjb3Jkc1JlcXVlc3RlZChwYXJzKSkge1xyXG4gICAgICB3cml0ZVNUT1BSZWNvcmRBZnRlcih3cyxwZXJzLGRhdGVJZHgsIHBhcnMsICBcInN0b3BBZnRlcm1AXCIgKyAgZGF0ZUlkeCArICcgJyArIGNvbW1lbnQpO1xyXG4gICAgfVxyXG4gICAgcGVycy5oaXJlZCA9IDA7XHJcbiAgICBwZXJzLmhpcmVkUHJldiA9IDA7XHJcbiAgICAvL3BlcnMubGFzdFRlcm0gPSBkYXRlSWR4O1xyXG4gIH0gZWxzZSBpZiAoIGlzSElSRShwZXJzLG5leHRIaXJlKSkge1xyXG4gICAgcGVycy5sYXN0SGlyZWQgPSBkYXRlSWR4O1xyXG4gICAgcGVycy5wcmV2RGF0ZUVuZCA9IGNvcHlEYXRlKGRhdGVJZHgpLm1pbnVzRGF5cygxKTtcclxuICAgIC8vIGFkZGVkXHJcbiAgICBwZXJzLmZ0ZVByZXYgPSBwZXJzLmZ0ZTtcclxuICAgIHBlcnMuaGlyZWRQcmV2ID0gMTtcclxuICAgIC8vIGRvIG5vdGhpbmcsIHdpbGwgYmUgY2FwdHVyZWQgbmV4dFxyXG4gIH0gZWxzZSB7XHJcbiAgICAvLyBjbG9zZSBwcmV2aW91cyByZWNvcmRcclxuICAgIGlmICggZGF0ZUlkeC5kYXlPZk1vbnRoKCkgIT0gMSkge1xyXG4gICAgICAvLyB1bmxlc3Mgd2UgYWxyZWFkeSBjbG9zZWQgaXQgYnkgYSBtb250aCByZWNvcmRcclxuICAgICAgdmFyIGRtaW4xID0gY29weURhdGUoZGF0ZUlkeCkubWludXNEYXlzKDEpO1xyXG4gICAgICB3cml0ZURheSh3cywgcGVycy5wcmV2RGF0ZUVuZCwgZG1pbjEpO1xyXG4gICAgICB3cml0ZVJlY29yZCh3cywgZG1pbjEsIHBlcnMsIHBhcnMsIFwicGVyY2xvc2UtMSBmcm9tIFwiICsgZGF0ZUlkeCArICcgJysgIGNvbW1lbnQpO1xyXG4gICAgICBtZW1vcml6ZVNPTShkbWluMSxwZXJzKTtcclxuICAgIH1cclxuICAgIC8vIGFsd2F5cyB3cml0ZSBhIHN0b3AgcmVjb3JkIGlmIHJlcWVzdGVkXHJcbiAgICBpZiAoIGlzU3RvcFJlY29yZHNSZXF1ZXN0ZWQocGFycykpIHtcclxuICAgICAgd3JpdGVTVE9QUmVjb3JkQWZ0ZXIod3MscGVycyxkYXRlSWR4LCBwYXJzLCAgXCJzdG9wQWZ0ZXZlQFwiICsgIGRhdGVJZHggKyAnICcgKyBjb21tZW50KTtcclxuICAgIH1cclxuICB9XHJcbiAgcGVycy5oaXJlZCA9IG5leHRIaXJlO1xyXG4gIHBlcnMubG9jYXRpb24gPSBuZXh0TG9jO1xyXG4gIHBlcnMuZnRlID0gbmV4dEZURTtcclxuICBpZiAoaXNFT00oZGF0ZUlkeCkpIHtcclxuICAgIC8vIGxhdGVyIHN1cHByZXNzIHVubGVzcyBsYXN0VGVybSB3aXRoaW4gcmFuZ2VcclxuICAgIGlmICggIWlzTm9aZXJvUmVxdWVzdGVkKHBhcnMpIHx8ICFpc0FsbFplcm8ocGVycykpIHtcclxuICAgICAgd3JpdGVTdGF0ZUxpbmVNT05BRyh3cyxkYXRlSWR4LHBlcnMsIHBlcnMuaGlyZWQsIHBlcnMubG9jYXRpb24sIHBlcnMuZnRlLCBwYXJzLCBcIldDTFwiKTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbi8vLy8vLy8vLy8vLy8vLy8vLy8gcGVyY2VudGFnZXNcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBpc0hpcmVDaGFuZ2UocGFycyA6IEdlblBhcmFtcykgOiBib29sZWFuIHtcclxuICByZXR1cm4gcGFycy5yYW5kb20oKSA8IHBhcnMuTF9ISVJFO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRET0IocGFycyA6IEdlblBhcmFtcykgOiBMb2NhbERhdGUge1xyXG5cclxuICB2YXIgeWVhciA9IDE5NTAgKyBNYXRoLmZsb29yKHBhcnMucmFuZG9tKCkqNTUpO1xyXG4gIHZhciBtb250aCA9IE1hdGguZmxvb3IocGFycy5yYW5kb20oKSoxMik7XHJcbiAgdmFyIGRheWJhc2UgPSBNYXRoLmZsb29yKHBhcnMucmFuZG9tKCkqMzEpO1xyXG4gIHJldHVybiBMb2NhbERhdGUub2YoeWVhciwxK21vbnRoLCAxKS5wbHVzRGF5cyhkYXliYXNlIC0gMSk7XHJcbn1cclxuLy9Mb2NhbERhdGUub2YoMTk1MCtNYXRoLmZsb29yKHBhcnMucmFuZG9tKCkqNTUpLE1hdGguZmxvb3IocGFycy5yYW5kb20oKSoxMiksTWF0aC5mbG9vcihwYXJzLnJhbmRvbSgpKjMxKSksXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2VuUGVyc29uKHAsIHBhcnM6IEdlblBhcmFtcykge1xyXG5cdHZhciBwZXJzID0ge1xyXG4gICAgdXNlciA6IHAsXHJcbiAgICBoaXJlZDogMCxcclxuICAgIGhpcmVkUHJldiA6IDAsXHJcbiAgICBmdGUgOiAxLFxyXG4gICAgZnRlUHJldiA6IDAsXHJcbiAgICBkb2IgOiBnZXRET0IocGFycyksXHJcbiAgICBsb2NhdGlvbiA6IGdldExvY2F0aW9uKHBhcnMpLFxyXG4gICAgcHJldkRhdGVFbmQgOiBwYXJzLmZpcnN0RGF0ZSxcclxuICAgIHByZXZSYW5nZUVuZCA6IHBhcnMuZmlyc3REYXRlLFxyXG4gICAgaGlyZWRTT00gOiAwLFxyXG4gICAgbGFzdEhpcmVkIDogcGFycy5maXJzdERhdGUsXHJcbiAgICBmdGVTT00gOiAwLFxyXG4gICAgRVNUQVQgOiBcIkFcIixcclxuICAgIEVTVEFUU09NIDogXCJBXCIsXHJcbiAgfSBhcyBQZXJzb247XHJcbiAgdmFyIG5leHREYXRlID0gZ2V0TmV4dChwYXJzKSArIHBhcnMuZmlyc3REYXRlLnRvRXBvY2hEYXkoKTtcclxuICBmb3IodmFyIGkgPSBwYXJzLmZpcnN0RGF0ZS50b0Vwb2NoRGF5KCk7IGkgPD0gcGFycy5sYXN0RGF0ZS50b0Vwb2NoRGF5KCk7ICsraSkge1xyXG4gICAgdmFyIGQgPSBMb2NhbERhdGUub2ZFcG9jaERheShpKTtcclxuICAgIGlmICggaSA9PSBuZXh0RGF0ZSApIHtcclxuICAgICAgaWYoIGlzSGlyZUNoYW5nZShwYXJzKSkge1xyXG4gICAgICAgLy8gd3JpdGVDaGFuZ2VMaW5lTU9OQUcocGFycy53c01PTkFHLCBkLHBlcnMsIHBlcnMuaGlyZWQgPyAwIDogMSwgbmV4dExvY2F0aW9uKHBhcnMscGVycyksIG5leHRGVEUocGFycyxwZXJzKSAgLCBcIkhDXCIpO1xyXG4gICAgICAgIC8vK1xyXG4gICAgICAgIC8vIE9SREVSIElTIENSVUNJQUwhXHJcbiAgICAgICAgdmFyIG5sID0gbmV4dExvY2F0aW9uKHBhcnMscGVycyk7XHJcbiAgICAgICAgdmFyIG5mID0gbmV4dEZURShwYXJzLHBlcnMpO1xyXG4gICAgICAgIHZhciBuRVNUQVQgPSBnZXROZXh0RVNUQVQocGFycyxwZXJzLFwiRVNUQVRcIik7XHJcbiAgICAgICAgd3JpdGVDaGFuZ2VMaW5lUkFOR0UocGFycy53c1JBTkdFLCBkLCBwZXJzLCBwZXJzLmhpcmVkID8gMCA6IDEsIG5sLCBuZiwgbkVTVEFULCAgcGFycywgXCJIQ1wiKTtcclxuICAgICAgICB3cml0ZUNoYW5nZUxpbmVNT05BRyhwYXJzLndzTU9OQUcsIGQsIHBlcnMsIHBlcnMuaGlyZWQgPyAwIDogMSwgbmwsIG5mLCBuRVNUQVQsIHBhcnMsIFwiSENcIik7XHJcbiAgICAgICAgbmV4dERhdGUgKz0gZ2V0TmV4dChwYXJzKTtcclxuICAgICAgfSBlbHNlIGlmIChpc0V2ZW50KHBhcnMpKSB7XHJcbiAgICAgICAgdmFyIG5sID0gbmV4dExvY2F0aW9uKHBhcnMsIHBlcnMpO1xyXG4gICAgICAgIC8vIGZvcmNlXHJcbiAgICAgICAgdmFyIG5mID0gbmV4dEZURShwYXJzLCBwZXJzKTtcclxuICAgICAgICB2YXIgbkVTVEFUID0gZ2V0TmV4dEVTVEFUKHBhcnMscGVycyxcIkVTVEFUXCIpO1xyXG4gICAgICAgIHdoaWxlKCAhaXNVbmhpcmVkQ2hhbmdlKHBlcnMscGVycy5oaXJlZCwgbmwsbmYsIG5FU1RBVCkpIHtcclxuICAgICAgICAgIG5sID0gbmV4dExvY2F0aW9uKHBhcnMsIHBlcnMpO1xyXG4gICAgICAgICAgLy8gZm9yY2VcclxuICAgICAgICAgIG5mID0gbmV4dEZURShwYXJzLCBwZXJzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgd3JpdGVDaGFuZ2VMaW5lUkFOR0UocGFycy53c1JBTkdFLCBkLCBwZXJzLCBwZXJzLmhpcmVkLCBubCwgbmYsIG5FU1RBVCwgcGFycywgXCJMQ1wiKTtcclxuICAgICAgICB3cml0ZUNoYW5nZUxpbmVNT05BRyhwYXJzLndzTU9OQUcsIGQsIHBlcnMsIHBlcnMuaGlyZWQsIG5sLCBuZiwgbkVTVEFULCBwYXJzLCBcIkxDXCIgKTtcclxuICAgICAgICBuZXh0RGF0ZSArPSBnZXROZXh0KHBhcnMpO1xyXG4gICAgICB9IGVsc2UgaWYgKGlzRU9NKGQpKSB7XHJcbiAgICAgICAgICB3cml0ZVN0YXRlTGluZU1PTkFHKHBhcnMud3NNT05BRywgZCwgcGVycywgcGVycy5oaXJlZCwgcGVycy5sb2NhdGlvbiwgcGVycy5mdGUsIHBhcnMsIFwiRU9NZVwiKTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmIChpc0VPTShkKSkge1xyXG4gICAgICAvL2lmKCBwZXJzLmhpcmVkID4gMCApIHtcclxuICAgICAgICBpZiAoICFpc05vWmVyb1JlcXVlc3RlZChwYXJzKSB8fCAhaXNBbGxaZXJvKHBlcnMpKSB7XHJcbiAgICAgICAgICB3cml0ZVN0YXRlTGluZU1PTkFHKHBhcnMud3NNT05BRywgZCwgcGVycywgcGVycy5oaXJlZCwgcGVycy5sb2NhdGlvbiwgcGVycy5mdGUsIHBhcnMsIFwiRU9NXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgLy99XHJcbiAgICAgIC8vIGVsc2Uge1xyXG4gICAgICAgIG1lbW9yaXplU09NKGQscGVycyk7XHJcbiAgICAgIC8vfVxyXG4gICAgfVxyXG5cdH07XHJcbn1cclxuXHJcblxyXG52YXIgcHJpbWVzICA9IFtdO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldE1heFByaW1lcyhucjogbnVtYmVyKSA6IG51bWJlciB7XHJcbiAgdmFyIG1heCA9IE1hdGguZmxvb3IoTWF0aC5zcXJ0KG5yKSszKTtcclxuICB2YXIgbXAgPSAxO1xyXG4gIHZhciByZW1haW4gPSBucjtcclxuICBmb3IodmFyIGkgPSAxOyBpIDw9IG1heDsgKytpICkge1xyXG4gICAgaWYgKHJlbWFpbiA9PSAxKSB7XHJcbiAgICAgIHJldHVybiBtcDtcclxuICAgIH1cclxuICAgIHdoaWxlKGkgPiAxICYmICAocmVtYWluICUgaSA9PSAwKSkge1xyXG4gICAgICBtcCA9IE1hdGgubWF4KG1wLGkpO1xyXG4gICAgICByZW1haW4gPSByZW1haW4vaTtcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIHJlbWFpbjtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdlblVTRVJIaWVyYXJjaHkobnJwZXJzIDogbnVtYmVyICkge1xyXG4gIHZhciB3cyA9IGdldFdTKCBcIkRJTV9VU0VSX1wiICsgcGFkWmVyb3MobnJwZXJzLDYpICsgXCIuY3N2XCIpO1xyXG4gIGdlblVTRVJIaWVyYXJjaHlXKHdzLG5ycGVycyk7XHJcbiAgd3Mud3MuZW5kKCk7XHJcbn1cclxuXHJcblxyXG4vL2V4cG9ydCBmdW5jdGlvbiBjbGVhbnNlV1NJbkZpbGUoZmlsZW5hbWUxOiBzdHJpbmcsIGZpbGVuYW1lMiA6IHN0cmluZyApIHtcclxuLy8gIHZhciBsbiA9IGZzLnJlYWRGaWxlU3luYyhmaWxlbmFtZTEsIHsgZW5jb2RpbmcgOiAndXRmLTgnfSk7XHJcbi8vICB2YXIgbG5jID0gbG4ucmVwbGFjZSgvO1xccysvZyxcIjtcIik7XHJcbi8vICBmcy53cml0ZUZpbGVTeW5jKGZpbGVuYW1lMiwgbG5jKVxyXG4vL31cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjbGVhbnNlV1NJbkZpbGUoZmlsZW5hbWUxOiBzdHJpbmcsIGZpbGVuYW1lMiA6IHN0cmluZywgZG9uZSA6IGFueSApIDogYW55IHtcclxuICAvL3ZhciBsbiA9IGZzLnJlYWRGaWxlU3luYyhmaWxlbmFtZTEsIHsgZW5jb2RpbmcgOiAndXRmLTgnfSk7XHJcbiAgdmFyIHdzT3V0ID0gZ2V0V1MoZmlsZW5hbWUyKTtcclxuICBjb25zdCBsaW5lciA9IG5ldyBsaW5lQnlMaW5lKGZpbGVuYW1lMSk7XHJcbiAgdmFyIGxpbmUgPSBcIlwiO1xyXG4gIHdoaWxlKCBsaW5lID0gbGluZXIubmV4dCgpICl7XHJcbiAgICBpZiAoIGxpbmUgKSB7XHJcbiAgICAgIHdzT3V0LndyaXRlKCAoJycgKyBsaW5lKS5yZXBsYWNlKC87XFxzKy9nLFwiO1wiKSApLndyaXRlKCdcXG4nKTtcclxuICAgIH1cclxuICB9XHJcbiAgd3NPdXQud3Mub24oJ2ZpbmlzaCcsICgpID0+IHsgZG9uZSgpOyB9KTtcclxuICB3c091dC53cy5lbmQoKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdlblVzZXIoaSA6IG51bWJlcikgOiBzdHJpbmcge1xyXG4gIHJldHVybiAnUCcgKyBwYWRaZXJvcyhpLDUpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2VuVVNFUkhpZXJhcmNoeVcod3MgOiBhbnksIG5ycGVycyA6IG51bWJlciApIHtcclxuICAvLyB3ZSBidWlsZCBhIHBhcmVudCBjaGlsZCBoaWVyYXJjaHkgIHVzaW5nIHByaW1lIG51bWJlciBkZWNvbXBvc2l0aW9uLFxyXG4gIC8vIHdlIGJ1aWxkIGEgcGFyZW50IGNoaWxkIGhpZXJhcmNoeSAgdXNpbmcgcHJpbWUgbnVtYmVyIGRlY29tcG9zaXRpb24sXHJcbiAgLy8gd2l0aCBwZXJzb25zIG1hZGUgY2hpbGRyZW4gb2YgdGhlIFwibGFnZXN0IHByaW1lIGZhY3RvclwiXHJcbiAgLy8gdG8gbm90IGVuZCB1cCB3aXRoIHRvbyBtYW55IHJvb3RzIHdlIG9ubHkgbWFrZSBldmVyeSBuLXRoIHByaW1lIGZhY3RvciBhIHJvb3QuXHJcbiAgLy9cclxuICAvL1xyXG4gIHZhciByZXMgPSB7fTtcclxuICB2YXIgbnJQcmltZXMgPSAwO1xyXG4gIC8vIDEzIC0gNSAtIDJcclxuICBmb3IodmFyIGkgPSAxOyBpIDw9IG5ycGVyczsgKytpICkge1xyXG4gICAgdmFyIHByaW0gPSBnZXRNYXhQcmltZXMoaSk7XHJcbiAgICBpZiggIXJlc1twcmltXSkge1xyXG4gICAgICArK25yUHJpbWVzO1xyXG4gICAgICBpZiAoIChpID4gMTApICYmIChuclByaW1lcyAlIDIwICE9IDE1KSApIHtcclxuICAgICAgICB2YXIgcHJpbVBhciA9IGdldE1heFByaW1lcyhNYXRoLmZsb29yKGkvMTApKTtcclxuICAgICAgICByZXNbcHJpbV0gPSBwcmltUGFyO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJlc1twcmltXSA9IC0xOyAvLyBhIHJvb3RcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYoIGkgIT0gcHJpbSApIHtcclxuICAgICAgcmVzW2ldID0gcHJpbTtcclxuICAgIH1cclxuICB9XHJcbiAgLy9kdW1wIHRoZSBsaXN0XHJcbiAgd3Mud3JpdGUoXCJVU0VSO1VTRVJfUEFSRU5UXFxuXCIpO1xyXG4gIGZvcih2YXIgaSA9IDE7IGkgPD0gbnJwZXJzOyArK2kpIHtcclxuICAgIHdzLndyaXRlKGdlblVzZXIoaSkpLndyaXRlKCc7Jyk7XHJcbiAgICBpZiAoIHJlc1tpXSA+IDAgKSB7XHJcbiAgICAgIHdzLndyaXRlKGdlblVzZXIocmVzW2ldKSkud3JpdGUoJ1xcbicpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgd3Mud3JpdGUoXCJcXG5cIik7IC8vTnVsbCFcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbiJdfQ==
