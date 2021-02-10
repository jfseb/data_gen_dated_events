"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genUSERHierarchyW = exports.genUser = exports.cleanseWSInFile = exports.genUSERHierarchy = exports.getMaxPrimes = exports.genPerson = exports.isHireChange = exports.writeRecord0 = exports.writeRecord = exports.memorizeSOM = exports.toDec1 = exports.writeTripel = exports.writeAge = exports.getSOM = exports.writeTenure = exports.writeTENUREAGE = exports.diffMonth = exports.diffYears = exports.writeDay = exports.makeQuarter = exports.writeHeader = exports.daysInMonth = exports.EOMONTH = exports.asDate = exports.padSpaceQ = exports.padSpace = exports.padZeros = exports.isEOY = exports.isEOQ = exports.copyDate = exports.dateIndexToDate = exports.Person = exports.GenParams = exports.OptsMONAG = exports.getWS = exports.WSWrap = exports.makeMap = exports.dateToDayIndex = exports.EXCELOFFSET = void 0;
var fs = require('fs');
const { exit } = require('process');
const _ = require("lodash");
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
class WSWrap {
    constructor(fn) {
        this.ws = fs.createWriteStream(fn);
    }
    write(a) {
        this.ws.write('' + a);
        return this;
    }
}
exports.WSWrap = WSWrap;
;
function getWS(filename) {
    return new WSWrap(filename);
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
function dateIndexToDate(dateIdx) {
    return core_1.LocalDate.ofEpochDay(dateIdx - exports.EXCELOFFSET);
}
exports.dateIndexToDate = dateIndexToDate;
function isEOM(dateIdx) {
    var d = undefined;
    if (dateIdx instanceof core_1.LocalDate) {
        d = dateIdx;
    }
    else {
        d = dateIndexToDate(dateIdx);
    }
    var d = copyDate(d).plusDays(1);
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
    var d = undefined;
    if (dateIdx instanceof core_1.LocalDate) {
        d = dateIdx;
    }
    else {
        d = dateIndexToDate(dateIdx);
    }
    return '' + d;
    //return d.year() + "-" + pad(d.monthValue(),2) + "-" + pad(d.dayOfMonth(),2);
}
exports.asDate = asDate;
function EOMONTH(d) {
    return copyDate(d).plusMonths(1).withDayOfMonth(1).minusDays(1);
}
exports.EOMONTH = EOMONTH;
function daysInMonth(d) {
    var dt = undefined;
    if (d instanceof core_1.LocalDate) {
        dt = d;
    }
    else {
        dt = dateIndexToDate(d);
    }
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
    pers.prevDateEnd = dateIdx;
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
        pers.nextFTE = nextFTE; /// TODO FIX!
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
        pers.lastTerm = dateIdx;
    }
    else if (isHIRE(pers, nextHire)) {
        pers.lastHired = dateIdx;
        pers.prevDateEnd = copyDate(dateIdx).minusDays(1);
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
function cleanseWSInFile(filename1, filename2) {
    var ln = fs.readFileSync(filename1, { encoding: 'utf-8' });
    var lnc = ln.replace(/;\s+/g, ";");
    fs.writeFileSync(filename2, lnc);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,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LEVBQUUsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDNUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNqRCxFQUFFLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsZ0RBQWdEO0lBQzlGLFdBQVcsQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFBLENBQUMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFBLENBQUMsQ0FBQyxLQUFLLEVBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDeEYsSUFBSSxZQUFZLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDdEQsRUFBRSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxZQUFZLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxZQUFZO0lBQzVFLFdBQVcsQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDbEYsRUFBRSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMs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b0JBQW9CLENBQUMsQ0FBQztJQUMvQixLQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFO1FBQy9CLEVBQUUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2hDLElBQUssR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRztZQUNoQixFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUN2QzthQUFNO1lBQ0wsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU87U0FDeEI7S0FDRjtBQUNILENBQUM7QUFuQ0QsOENBbUNDIiwiZmlsZSI6ImhlbHBlcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgZnMgPSByZXF1aXJlKCdmcycpO1xyXG5jb25zdCB7IGV4aXQgfSA9IHJlcXVpcmUoJ3Byb2Nlc3MnKTtcclxuaW1wb3J0ICogYXMgXyBmcm9tICdsb2Rhc2gnO1xyXG5cclxuLy92YXIgc2VlZHJhbmRvbSA9IHJlcXVpcmUoJ3NlZWRyYW5kb20nKTtcclxuaW1wb3J0ICogYXMgc2VlZHJhbmRvbSBmcm9tICdzZWVkcmFuZG9tJztcclxuLy8gRVhDRUxcclxuLy8gICAgIDEgMTkwMC0wMS0wMVxyXG4vLyAyNTU2OSAxOTcwLTAxLTAxXHJcbi8vXHJcbmV4cG9ydCBjb25zdCBFWENFTE9GRlNFVCA9IDI1NTY5O1xyXG5cclxuaW1wb3J0IHtMb2NhbERhdGUgfSBmcm9tICBcIkBqcy1qb2RhL2NvcmVcIjtcclxuaW1wb3J0IHsgU1NMX09QX0RPTlRfSU5TRVJUX0VNUFRZX0ZSQUdNRU5UUyB9IGZyb20gJ2NvbnN0YW50cyc7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZGF0ZVRvRGF5SW5kZXgoZCA6IExvY2FsRGF0ZSApIDogbnVtYmVyIHtcclxuICByZXR1cm4gIGQudG9FcG9jaERheSgpICsgRVhDRUxPRkZTRVQ7XHJcbn1cclxuXHJcbnZhciBkMSA9IExvY2FsRGF0ZS5vZigyMDIwLDEsNik7XHJcbnZhciBkMUlkeCA9IGRhdGVUb0RheUluZGV4KGQxKTtcclxudmFyIGQyID0gTG9jYWxEYXRlLm9mKDIwMjQsNiwxKTtcclxudmFyIGQySWR4ID0gZGF0ZVRvRGF5SW5kZXgoZDIpO1xyXG52YXIgZGVsdGFUaW1lID0gZDJJZHgtZDFJZHg7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbWFrZU1hcChvYmopIHtcclxuICB2YXIgaWR4ID0gMDtcclxuICB2YXIgcmVzID0gW107XHJcbiAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMob2JqKS5mb3JFYWNoKCBmdW5jdGlvbihhKSB7XHJcbiAgICBmb3IodmFyIGkgPSAwOyBpIDwgb2JqW2FdOyArK2kpIHtcclxuICAgICAgcmVzLnB1c2goYSk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbiAgcmV0dXJuIHJlcztcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFdTV3JhcCAge1xyXG4gIHdzOiBhbnk7XHJcbiAgY29uc3RydWN0b3IoZm4gOiBzdHJpbmcpXHJcbiAge1xyXG4gICAgdGhpcy53cyA9IGZzLmNyZWF0ZVdyaXRlU3RyZWFtKGZuKTtcclxuICB9XHJcbiAgd3JpdGUoYSkge1xyXG4gICAgdGhpcy53cy53cml0ZSgnJyArIGEpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldFdTKGZpbGVuYW1lOiBzdHJpbmcpIDogV1NXcmFwIHtcclxuXHJcbiAgcmV0dXJuIG5ldyBXU1dyYXAoZmlsZW5hbWUpO1xyXG59XHJcblxyXG5cclxuLy8gMSBTaW1wbGUgcmFuZ2UgYmFzZWQgIChubyBtb250aGx5IGludGVyaW0gZGF0YSlcclxuLy8gIFt4eHhdLVt5eXldICA8YXR0cmlidXRlcz5cclxuLy9cclxuLy8gIG9wdGlvbmFsIHNwcmlua2xlIGluIDAsMCwwLDAgPGF0dHJpYnV0ZXM+IE1hcmsgIEVPTS9FT1AgbnVtYmVycy5cclxuLy9cclxuLy90byBzdXBwb3J0IGRpZmZlcmVudCBvdXRwdXQgZmxhdm91cnMsXHJcbi8vXHJcbi8vXHJcblxyXG5leHBvcnQgY2xhc3MgT3B0c01PTkFHIHtcclxuICBub1plcm8gOiBib29sZWFuO1xyXG4gIHN0b3BSZWNvcmRzIDogYm9vbGVhbjtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEdlblBhcmFtcyB7XHJcbiAgQVZHX05FWFQgOiBudW1iZXI7XHJcbiAgTE9DQ0hBTkdFIDogbnVtYmVyO1xyXG4gIEZURUNIQU5HRTogbnVtYmVyO1xyXG4gIEVTVEFUQ0hBTkdFOm51bWJlcjtcclxuICBMX0hJUkUgOiBudW1iZXI7XHJcbiAgTF9FVkVOVCA6IG51bWJlcjtcclxuICBMT0NBVElPTnM6IHN0cmluZ1tdO1xyXG4gIEVTVEFUcyA6IHN0cmluZ1tdO1xyXG4gIGZpcnN0RGF0ZSA6IExvY2FsRGF0ZTtcclxuICBsYXN0RGF0ZSA6IExvY2FsRGF0ZTtcclxuICByYW5kb20gOiBhbnk7XHJcbiAgd3NNT05BRyA6IGFueTtcclxuICBvcHRzTU9OQUc/IDogT3B0c01PTkFHO1xyXG4gIHdzUkFOR0UgOiBhbnk7XHJcbiAgb3B0c1JBTkdFIDogYW55O1xyXG4gIHJhbmRvbU9EIDogYW55OyAvLyB7IFwiRVNUQVRcIiA6IHNlZWRyYW5kb20oJ1haWScpIH0sXHJcbiAgUkVPUF9FU1RBVFMgOiBzdHJpbmdbXTsgLy8gRVNUQVRTIHdoaWNoIGNvbnRyaWJ1dGUgdG8gRU9QLCB0aGlzIGlzIGp1c3QgaGVhZCBjb3VudCBJRiBFU1RBVCBJTiBbXCJBXCIsXCJVXCIsXCJQXCJdIEVPUF9IQyA6IDBcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFBlcnNvbiB7XHJcbiAgLy8gaW1tdXRhYmxlXHJcbiAgdXNlcjogc3RyaW5nO1xyXG4gIC8vIGNoYW5naW5nXHJcbiAgZG9iOiBMb2NhbERhdGU7XHJcbiAgbG9jYXRpb24gOiBzdHJpbmc7XHJcbiAgaGlyZWQ6IG51bWJlcjtcclxuICBoaXJlZFNPTTogbnVtYmVyO1xyXG4gIGhpcmVkUHJldiA6IG51bWJlcjsgLy8gcGVyc29uICBoaXJlIHN0YXRlIHByZXZpb3VzIHJhbmdlXHJcbiAgZnRlIDogbnVtYmVyO1xyXG4gIGZ0ZVByZXYgOiBudW1iZXI7IC8vIHBlcnNvbiBmdGUgc3RhdGUgcHJldmlvdXMgcmFuZ2VcclxuICBmdGVTT006IG51bWJlcjtcclxuICBFU1RBVCA6IHN0cmluZztcclxuICBFU1RBVFByZXYgOiBzdHJpbmc7XHJcbiAgRVNUQVRTT00gOiBzdHJpbmc7XHJcbiAgLy8gY2hhbmdpbmdcclxuICBsYXN0SGlyZWQ6IExvY2FsRGF0ZTtcclxuICBwcmV2RGF0ZUVuZCA6IExvY2FsRGF0ZTtcclxuICBwcmV2UmFuZ2VFbmQ6IExvY2FsRGF0ZTsgLy8gZW5kIG9mIGxhc3QgcmFuZ2VcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0TmV4dChwYXJzOkdlblBhcmFtcykge1xyXG4gIHJldHVybiBNYXRoLmZsb29yKHBhcnMucmFuZG9tKCkgKiBwYXJzLkFWR19ORVhUKSArIDE7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldExvY2F0aW9uKHBhcnM6IEdlblBhcmFtcykge1xyXG4gIHJldHVybiBwYXJzLkxPQ0FUSU9Oc1tNYXRoLmZsb29yKHBhcnMucmFuZG9tKCkgKiBwYXJzLkxPQ0FUSU9Ocy5sZW5ndGgpXTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0RVNUQVQocGFyczogR2VuUGFyYW1zLCBrZXkgOiBzdHJpbmcpIHtcclxuICByZXR1cm4gcGFycy5FU1RBVHNbTWF0aC5mbG9vcihwYXJzLnJhbmRvbU9EW2tleV0oKSAqIHBhcnMuRVNUQVRzLmxlbmd0aCldO1xyXG59XHJcblxyXG5cclxuZnVuY3Rpb24gbmV4dExvY2F0aW9uKHBhcnM6IEdlblBhcmFtcywgcGVycyA6IFBlcnNvbikge1xyXG4gIGlmKCBwYXJzLnJhbmRvbSgpIDwgcGFycy5MT0NDSEFOR0UpIHtcclxuICAgIHJldHVybiBnZXRMb2NhdGlvbihwYXJzKTtcclxuICB9XHJcbiAgcmV0dXJuICBwZXJzLmxvY2F0aW9uO1xyXG59XHJcblxyXG5mdW5jdGlvbiBuZXh0RlRFKHBhcnM6IEdlblBhcmFtcywgcGVycyA6IFBlcnNvbikge1xyXG4gIGlmKCBwYXJzLnJhbmRvbSgpIDwgcGFycy5GVEVDSEFOR0UpIHtcclxuICAgIGlmKCBwZXJzLmZ0ZSA9PSAxKSB7XHJcbiAgICAgIHJldHVybiAwLjU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gMS4wO1xyXG4gIH1cclxuICByZXR1cm4gcGVycy5mdGU7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBnZXROZXh0RVNUQVQocGFyczogR2VuUGFyYW1zLCBwZXJzIDogUGVyc29uLCBrZXkgOiBzdHJpbmcpIHtcclxuLy8gIHBhcnMucmFuZG9tT0Rba2V5XSgpO1xyXG4gIGlmKCBwYXJzLnJhbmRvbU9EW2tleV0oKSA8IHBhcnMuRVNUQVRDSEFOR0UpIHtcclxuICAgIHJldHVybiBnZXRFU1RBVChwYXJzLCBrZXkpO1xyXG4gIH1cclxuICByZXR1cm4gIHBlcnMuRVNUQVQ7XHJcbn1cclxuXHJcblxyXG5mdW5jdGlvbiBpc0V2ZW50KHBhcnM6R2VuUGFyYW1zKSB7XHJcbiAgcmV0dXJuIHBhcnMucmFuZG9tKCkgPCBwYXJzLkxfRVZFTlQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkYXRlSW5kZXhUb0RhdGUoZGF0ZUlkeCA6IG51bWJlcikgOiBMb2NhbERhdGUge1xyXG4gIHJldHVybiBMb2NhbERhdGUub2ZFcG9jaERheShkYXRlSWR4IC0gRVhDRUxPRkZTRVQpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpc0VPTShkYXRlSWR4IDogYW55KSB7XHJcbiAgdmFyIGQgPSB1bmRlZmluZWQgYXMgTG9jYWxEYXRlO1xyXG4gIGlmICggZGF0ZUlkeCBpbnN0YW5jZW9mIExvY2FsRGF0ZSkge1xyXG4gICAgZCA9IGRhdGVJZHg7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgIGQgPSBkYXRlSW5kZXhUb0RhdGUoZGF0ZUlkeCk7XHJcbiAgfVxyXG4gIHZhciBkID0gY29weURhdGUoZCkucGx1c0RheXMoMSk7XHJcbiAgaWYoZC5kYXlPZk1vbnRoKCkgPT0gMSlcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNvcHlEYXRlKGQgOiBMb2NhbERhdGUpIHtcclxuICByZXR1cm4gTG9jYWxEYXRlLm9mRXBvY2hEYXkoZC50b0Vwb2NoRGF5KCkpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNFT1EoZDogTG9jYWxEYXRlKSB7XHJcbiAgZCA9IGNvcHlEYXRlKGQpLnBsdXNEYXlzKDEpO1xyXG4gIGlmKGQuZGF5T2ZNb250aCgpID09IDEgJiYgIFsxLDQsNywxMF0uaW5kZXhPZihkLm1vbnRoVmFsdWUoKSkgPj0gMClcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIHJldHVybiBmYWxzZTtcclxufVxyXG5cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaXNFT1koZCA6IExvY2FsRGF0ZSkge1xyXG4gIHZhciBkID0gY29weURhdGUoZCkucGx1c0RheXMoMSk7XHJcbiAgaWYoZC5kYXlPZk1vbnRoKCkgPT0gMSAmJiBkLm1vbnRoVmFsdWUoKSA9PSAxKVxyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgcmV0dXJuIGZhbHNlO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcGFkWmVyb3MoYSA6IGFueSwgbGVuIDogbnVtYmVyKSB7XHJcbiAgdmFyIHMgPSBcIlwiICthO1xyXG4gIHJldHVybiBcIjAwMDAwMDBcIi5zdWJzdHIoMCwgbGVuIC0gcy5sZW5ndGgpICsgcztcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHBhZFNwYWNlKGEgOiBhbnksIGxlbiA6IG51bWJlcikge1xyXG4gIHZhciBzID0gXCJcIiArYTtcclxuICByZXR1cm4gXCIgICAgICAgICAgICAgICAgICAgXCIuc3Vic3RyKDAsIGxlbiAtIHMubGVuZ3RoKSArIHM7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBwYWRTcGFjZVEoYSA6IGFueSwgbGVuIDogbnVtYmVyKSB7XHJcbiAgdmFyIHMgPSBcIlwiICthO1xyXG4gIHJldHVybiAnXCInICsgcyArICdcIicgKyBcIiAgICAgICAgICAgICAgICAgICBcIi5zdWJzdHIoMCwgbGVuIC0gcy5sZW5ndGgpO1xyXG59XHJcblxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGFzRGF0ZShkYXRlSWR4IDogYW55KTogc3RyaW5nIHtcclxuICB2YXIgZCA9IHVuZGVmaW5lZCBhcyBMb2NhbERhdGU7XHJcbiAgaWYgKCBkYXRlSWR4IGluc3RhbmNlb2YgTG9jYWxEYXRlKSB7XHJcbiAgICBkID0gZGF0ZUlkeDtcclxuICB9IGVsc2Uge1xyXG4gICAgZCA9IGRhdGVJbmRleFRvRGF0ZShkYXRlSWR4KTtcclxuICB9XHJcbiAgcmV0dXJuICcnICsgZDtcclxuICAvL3JldHVybiBkLnllYXIoKSArIFwiLVwiICsgcGFkKGQubW9udGhWYWx1ZSgpLDIpICsgXCItXCIgKyBwYWQoZC5kYXlPZk1vbnRoKCksMik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBFT01PTlRIKGQgOiBMb2NhbERhdGUpIDogTG9jYWxEYXRlIHtcclxuICByZXR1cm4gY29weURhdGUoZCkucGx1c01vbnRocygxKS53aXRoRGF5T2ZNb250aCgxKS5taW51c0RheXMoMSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkYXlzSW5Nb250aChkIDogYW55KSB7XHJcbiAgdmFyIGR0ID11bmRlZmluZWQgYXMgTG9jYWxEYXRlO1xyXG4gIGlmKGQgaW5zdGFuY2VvZiBMb2NhbERhdGUgKSB7XHJcbiAgICBkdCA9IGQ7XHJcbiAgfSBlbHNlIHtcclxuICAgIGR0ID0gZGF0ZUluZGV4VG9EYXRlKGQgYXMgbnVtYmVyKTtcclxuICB9XHJcbiAgdmFyIGRlb20gPSBFT01PTlRIKGR0KTtcclxuICByZXR1cm4gZGF0ZVRvRGF5SW5kZXgoZGVvbSkgLSBkYXRlVG9EYXlJbmRleChjb3B5RGF0ZShkZW9tKS53aXRoRGF5T2ZNb250aCgxKSkgKyAxO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gd3JpdGVIZWFkZXIod3MpIHtcclxuICB3cy53cml0ZShcIllFQVI7UVVBUlQ7Q0FMTU9OVEhJQztDQUxNT05USEk7Q0FMTU9OVEg7Q0FMTU9OVEhTO1NUQVJUX0RBVEVfSURYO0VORF9EQVRFX0lEWDtJU0VPTTtJU0VPUTtJU0VPWTtEQVlTSU5NT05USDtTVEFSVF9EQVRFO0VORF9EQVRFO1wiKVxyXG4gIHdzLndyaXRlKFwiVVNFUjtMT0NBVElPTjtFU1RBVDtIQztIQ19TT007SENfRU9NO0RBWVNXT1JLRUQ7RlRFO0ZURV9TT007RlRFX0VPTTtGVEVXT1JLRUQ7VEVOVVJFO1RFTlVSRV9TT007VEVOVVJFX0VPTTtBR0U7QUdFX1NPTTtBR0VfRU9NO0hDX0VPTVM7WFxcblwiKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gbWFrZVF1YXJ0ZXIoZCA6IExvY2FsRGF0ZSkge1xyXG4gIHJldHVybiBkLnllYXIoKSArICcnICsgJ19RJyArICAoTWF0aC5mbG9vcigoZC5tb250aFZhbHVlKCktMSkvMykrMSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiB3cml0ZURheSh3cywgcHJldkRhdGVFbmQ6TG9jYWxEYXRlLCBkYXRlSWR4IDogTG9jYWxEYXRlKSB7XHJcbiAgdmFyIHN0YXJ0SWR4ID0gY29weURhdGUocHJldkRhdGVFbmQpLnBsdXNEYXlzKDEpO1xyXG4gIHZhciBkID0gZGF0ZUlkeDtcclxuICB2YXIgeSA9IGQueWVhcigpO1xyXG4gIHZhciBtID0gZC5tb250aFZhbHVlKCk7XHJcbiAgdmFyIGNtaSA9IHkqMTAwICsgbTtcclxuICB2YXIgY21pYyA9ICAoeS0yMDAwKSoxMiArIG07XHJcbiAgd3Mud3JpdGUoeSkud3JpdGUoJzsnKTtcclxuICB3cy53cml0ZShtYWtlUXVhcnRlcihkKSkud3JpdGUoJzsnKTtcclxuICB3cy53cml0ZSgnJyArIGNtaWMgKyBcIjtcIiArIGNtaSArIFwiO1wiICsgY21pICsgXCI7XCIgKyBjbWkrIFwiO1wiKTsgLy8gQ0FMTU9OVEggSUMgSSB+IFNcclxuICB3cy53cml0ZShkYXRlVG9EYXlJbmRleChzdGFydElkeCkrIFwiO1wiKyBkYXRlVG9EYXlJbmRleChkYXRlSWR4KSArIFwiO1wiKTtcclxuICB3cy53cml0ZShpc0VPTShkKT8gXCIxLjBcIiA6IFwiMC4wXCIpLndyaXRlKFwiO1wiKTtcclxuICB3cy53cml0ZShpc0VPUShkKT8gXCIxLjBcIiA6IFwiMC4wXCIpLndyaXRlKFwiO1wiKTtcclxuICB3cy53cml0ZShpc0VPWShkKT8gXCIxLjBcIiA6IFwiMC4wXCIpLndyaXRlKFwiO1wiKTtcclxuICB2YXIgZGltID0gZGF5c0luTW9udGgoZCk7XHJcbiAgd3Mud3JpdGUoZGltKS53cml0ZShcIjtcIik7XHJcbiAgd3Mud3JpdGUoYXNEYXRlKHN0YXJ0SWR4KSkud3JpdGUoXCI7XCIpO1xyXG4gIHdzLndyaXRlKGFzRGF0ZShkKSkud3JpdGUoXCI7XCIpO1xyXG4gIHJldHVybiBkaW07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkaWZmWWVhcnMoZGF0ZUxvdzogTG9jYWxEYXRlLCBkYXRlSGlnaDogTG9jYWxEYXRlKSB7XHJcbiAgcmV0dXJuIGRhdGVMb3cudW50aWwoZGF0ZUhpZ2gpLnllYXJzKCk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkaWZmTW9udGgoZGF0ZUxvdyA6IExvY2FsRGF0ZSwgZGF0ZUhpZ2ggOiBMb2NhbERhdGUpIHtcclxuICB2YXIgYSA9IGRhdGVMb3cudW50aWwoZGF0ZUhpZ2gpO1xyXG4gIHJldHVybiBhLnllYXJzKCkqMTIgKyBhLm1vbnRocygpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gd3JpdGVURU5VUkVBR0UocGVycyA6UGVyc29uKSB7XHJcbiAgcmV0dXJuIHBlcnMuaGlyZWQgPiAwO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gd3JpdGVUZW51cmUod3MsIG5vdzogTG9jYWxEYXRlLCBwZXJzOiBQZXJzb24sIGVvbSkge1xyXG4gIGlmICggIXdyaXRlVEVOVVJFQUdFKHBlcnMpICkge1xyXG4gICAgd3Mud3JpdGUoJyAwOyAwOyAwOycpO1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICB2YXIgdGVudXJlTm93ID0gZGlmZk1vbnRoKHBlcnMubGFzdEhpcmVkLG5vdyk7XHJcbiAgd3Mud3JpdGUocGFkU3BhY2UodGVudXJlTm93LDIpKS53cml0ZSgnOycpO1xyXG4gIGlmKCBpc0VPTShub3cpKSB7XHJcbiAgICB2YXIgZHNvbSA9IGdldFNPTShub3cpO1xyXG4gICAgdmFyIHRlbnVyZVNPTSA9IGRpZmZNb250aChwZXJzLmxhc3RIaXJlZCxkc29tKTtcclxuICAgIHdzLndyaXRlKHBhZFNwYWNlKHRlbnVyZVNPTSwyKSkud3JpdGUoJzsnKVxyXG4gICAgd3Mud3JpdGUocGFkU3BhY2UodGVudXJlTm93LDIpKS53cml0ZSgnOycpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB3cy53cml0ZSgnIDA7IDA7JylcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRTT00oZGF0ZUlkeCA6IExvY2FsRGF0ZSkgIDogTG9jYWxEYXRlIHtcclxuICByZXR1cm4gZGF0ZUlkeC53aXRoRGF5T2ZNb250aCgxKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHdyaXRlQWdlKHdzLCBub3cgOiBMb2NhbERhdGUsIHBlcnMsIGVvbTogYm9vbGVhbikge1xyXG4gIGlmICggIXdyaXRlVEVOVVJFQUdFKHBlcnMpICkge1xyXG4gICAgd3Mud3JpdGUoJyAwOyAwOyAwOycpO1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICB2YXIgYWdlTm93ID0gZGlmZlllYXJzKHBlcnMuZG9iLG5vdyk7XHJcbiAgd3Mud3JpdGUocGFkU3BhY2UoYWdlTm93LDIpKS53cml0ZSgnOycpO1xyXG4gIGlmKCBpc0VPTShub3cpICkge1xyXG4gICAgdmFyIGRzb20gPSBnZXRTT00obm93KTtcclxuICAgIHZhciBhZ2VTT00gPSBkaWZmWWVhcnMocGVycy5kb2IsZHNvbSk7XHJcbiAgICB3cy53cml0ZShwYWRTcGFjZShhZ2VTT00sMikpLndyaXRlKCc7JylcclxuICAgIHdzLndyaXRlKHBhZFNwYWNlKGFnZU5vdywyKSkud3JpdGUoJzsnKTtcclxuICB9IGVsc2Uge1xyXG4gICAgd3Mud3JpdGUoJyAwOyAwOycpXHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gd3JpdGVUcmlwZWwod3MsIHZzb20gOiBhbnksIHZub3c6IGFueSwgZW9tIDogYm9vbGVhbikge1xyXG4gIHdzLndyaXRlKHBhZFNwYWNlKHZub3csMykpLndyaXRlKCc7Jyk7XHJcbiAgaWYoIGVvbSApIHtcclxuICAgIHdzLndyaXRlKHBhZFNwYWNlKHZzb20sMykpLndyaXRlKCc7JylcclxuICAgIHdzLndyaXRlKHBhZFNwYWNlKHZub3csMykpLndyaXRlKCc7Jyk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHdzLndyaXRlKCcwLjA7MC4wOycpXHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gdG9EZWMxKG4gOiBudW1iZXIpIHtcclxuICByZXR1cm4gKG4gfHwgMCkudG9GaXhlZCgxKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIG1lbW9yaXplU09NKGRhdGVJZHggOiBMb2NhbERhdGUsIHBlcnMgOiBQZXJzb24pIHtcclxuICB2YXIgZW9tID0gaXNFT00oZGF0ZUlkeCk7XHJcbiAgaWYgKGVvbSkge1xyXG4gICAgcGVycy5mdGVTT00gPSBwZXJzLmhpcmVkICogcGVycy5mdGU7XHJcbiAgICBwZXJzLmhpcmVkU09NID0gcGVycy5oaXJlZDtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzQWxsWmVybyhwZXJzIDogUGVyc29uKSB7XHJcbiAgcmV0dXJuIChwZXJzLmhpcmVkID09IDAgJiYgIHBlcnMuaGlyZWRTT00gPT0gMCk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBUaGlzIGZ1bmN0aW9uIGRvZXMgbXV0YXRlIHBlcnMsIHVzZSBhIGNsb25lIGlmIG5vdCBkZXNpcmVkIVxyXG4gKiBAcGFyYW0gd3NcclxuICogQHBhcmFtIGRhdGVJZHhcclxuICogQHBhcmFtIHBlcnNcclxuICogQHBhcmFtIGNvbW1lbnRcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiB3cml0ZVJlY29yZCh3cywgZGF0ZUlkeCA6IExvY2FsRGF0ZSwgcGVycyA6IFBlcnNvbiwgcGFycyA6IEdlblBhcmFtcywgY29tbWVudDogc3RyaW5nIClcclxue1xyXG4gIHZhciBzdGFydElkeCA9IGNvcHlEYXRlKHBlcnMucHJldkRhdGVFbmQpLnBsdXNEYXlzKDEpO1xyXG4gIHZhciBlb20gPSBpc0VPTShkYXRlSWR4KTtcclxuICB3cy53cml0ZShwYWRTcGFjZVEocGVycy51c2VyLDUpKS53cml0ZSgnOycpO1xyXG4gIHdzLndyaXRlKHBhZFNwYWNlUShwZXJzLmxvY2F0aW9uLDIwKSkud3JpdGUoJzsnKTtcclxuICB3cy53cml0ZShwYWRTcGFjZVEocGVycy5FU1RBVCwxKSkud3JpdGUoJzsnKTsgLy8gd2UgYWx3YXlzIHdyaXRlIHRoaXMsIG5lZWRlZCBmb3IgU1RPUCByZWNvcmRzXHJcbiAgd3JpdGVUcmlwZWwod3MsIHBlcnMuaGlyZWRTT00gPyBcIjEuMFwiOiBcIjAuMFwiICxwZXJzLmhpcmVkID8gXCIxLjBcIjogXCIwLjBcIixpc0VPTShkYXRlSWR4KSk7XHJcbiAgdmFyIGRheXNJblBlcmlvZCA9IHN0YXJ0SWR4LnVudGlsKGRhdGVJZHgpLmRheXMoKSArIDE7XHJcbiAgd3Mud3JpdGUocGFkU3BhY2UocGVycy5oaXJlZFByZXYgKiBkYXlzSW5QZXJpb2QsMikpLndyaXRlKCc7Jyk7IC8vREFZU1dPUktFRFxyXG4gIHdyaXRlVHJpcGVsKHdzLCB0b0RlYzEocGVycy5mdGVTT00pLHRvRGVjMShwZXJzLmhpcmVkICogcGVycy5mdGUpLGlzRU9NKGRhdGVJZHgpKTtcclxuICB3cy53cml0ZShwYWRTcGFjZShwZXJzLmhpcmVkUHJldiAqIHBlcnMuZnRlUHJldiAqIGRheXNJblBlcmlvZCw0KSkud3JpdGUoJzsnKTsgLy8gRlRFV09SS0VEXHJcbiAgd3JpdGVUZW51cmUod3MsIGRhdGVJZHgsIHBlcnMsIGVvbSk7XHJcbiAgd3JpdGVBZ2Uod3MsIGRhdGVJZHgsIHBlcnMsIGVvbSk7XHJcbiAgaWYoZW9tICYmIHBhcnMuUkVPUF9FU1RBVFMgJiYgcGFycy5SRU9QX0VTVEFUUy5pbmRleE9mKHBlcnMuRVNUQVQpID49IDApIHtcclxuICAgIHdzLndyaXRlKHBhZFNwYWNlKHBlcnMuaGlyZWQsMSkpLndyaXRlKCc7Jyk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHdzLndyaXRlKCcwJykud3JpdGUoJzsnKTtcclxuICB9XHJcbiAgcGVycy5oaXJlZFByZXYgPSBwZXJzLmhpcmVkO1xyXG4gIHBlcnMuZnRlUHJldiA9IHBlcnMuZnRlO1xyXG4gIHBlcnMucHJldkRhdGVFbmQgPSBkYXRlSWR4O1xyXG5cclxuICB3cy53cml0ZShjb21tZW50ICsgXCJcXG5cIik7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBUaGlzIGZ1bmN0aW9uIGRvZXMgbXV0YXRlIHBlcnMsIHVzZSBhIGNsb25lIGlmIG5vdCBkZXNpcmVkIVxyXG4gKiBAcGFyYW0gd3NcclxuICogQHBhcmFtIGRhdGVJZHhcclxuICogQHBhcmFtIHBlcnNcclxuICogQHBhcmFtIGNvbW1lbnRcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiB3cml0ZVJlY29yZDAod3MsIGRhdGVJZHggOiBMb2NhbERhdGUsIHBlcnMgOiBQZXJzb24sICBjb21tZW50OiBzdHJpbmcgKVxyXG57XHJcbiAgdmFyIHN0YXJ0SWR4ID0gY29weURhdGUoZGF0ZUlkeCk7XHJcbiAgdmFyIGVvbSA9IGlzRU9NKGRhdGVJZHgpO1xyXG4gIHdzLndyaXRlKHBhZFNwYWNlUShwZXJzLnVzZXIsNSkpLndyaXRlKCc7Jyk7XHJcbiAgd3Mud3JpdGUocGFkU3BhY2VRKHBlcnMubG9jYXRpb24sMjApKS53cml0ZSgnOycpO1xyXG4gIHdzLndyaXRlKHBhZFNwYWNlUShwZXJzLkVTVEFULDEpKS53cml0ZSgnOycpOyAvLyB3ZSBhbHdheXMgd3JpdGUgdGhpcywgbmVlZGVkIGZvciBTVE9QIHJlY29yZHNcclxuICB3cml0ZVRyaXBlbCh3cywgXCIwLjBcIiwgXCIwLjBcIiwgZmFsc2UpOyAvLyBwZXJzLmhpcmVkU09NID8gXCIxLjBcIjogXCIwLjBcIiAscGVycy5oaXJlZCA/IFwiMS4wXCI6IFwiMC4wXCIsaXNFT00oZGF0ZUlkeCkpO1xyXG4gIHZhciBkYXlzSW5QZXJpb2QgPSBcIjAuMFwiOyAvL3N0YXJ0SWR4LnVudGlsKGRhdGVJZHgpLmRheXMoKSArIDE7XHJcbiAgd3Mud3JpdGUocGFkU3BhY2UoMCwyKSkud3JpdGUoJzsnKTsgLy9EQVlTV09SS0VEXHJcbiAgd3JpdGVUcmlwZWwod3MsIHRvRGVjMSgwKSx0b0RlYzEoMCksaXNFT00oZGF0ZUlkeCkpO1xyXG4gIHdzLndyaXRlKHBhZFNwYWNlKDAsNCkpLndyaXRlKCc7Jyk7IC8vIEZURVdPUktFRFxyXG4gIHdzLndyaXRlKFwiIDA7IDA7IDA7XCIpO1xyXG4gIC8vd3JpdGVUZW51cmUod3MsIGRhdGVJZHgsIHBlcnMsIGVvbSk7IC8vIENIRUNLIFdIRVRIRVIgTUVBU1VSRSBPUiBESU1cclxuICB3cy53cml0ZShcIiAwOyAwOyAwO1wiKVxyXG4gIC8vd3JpdGVBZ2Uod3MsIGRhdGVJZHgsIHBlcnMsIGVvbSk7XHJcbiAgd3Mud3JpdGUoXCIwO1wiKTtcclxuICAvL2lmKGVvbSAmJiBwYXJzLlJFT1BfRVNUQVRTICYmIHBhcnMuUkVPUF9FU1RBVFMuaW5kZXhPZihwZXJzLkVTVEFUKSA+PSAwKSB7XHJcbiAgLy8gICAgd3Mud3JpdGUocGFkU3BhY2UocGVycy5oaXJlZCwxKSkud3JpdGUoJzsnKTtcclxuICAvL30gZWxzZSB7XHJcbiAgLy8gIHdzLndyaXRlKCcwJykud3JpdGUoJzsnKTtcclxuICAvL31cclxuICB3cy53cml0ZShjb21tZW50ICsgXCJcXG5cIik7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHdyaXRlU3RhdGVMaW5lUkFOR0Uod3MsZGF0ZUlkeCA6IExvY2FsRGF0ZSwgcGVycyA6IFBlcnNvbiwgbmV4dEhpcmUsIG5leHRMb2MsIG5leHRGVEUsIGNvbW1lbnQ6c3RyaW5nKSB7XHJcbiAgaWYod3MgPT0gdW5kZWZpbmVkKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogV3JpdGUgYSBzdGF0ZSBsaW5lIGZvciBNb250aGx5IGFnZ3JlZ2F0ZXMsIHRoaXMgaXMgZS5nLiB0aGUgRW5kLW9mIG1vbnRoIHJlY29yZC5cclxuICogQHBhcmFtIHdzXHJcbiAqIEBwYXJhbSBkYXRlSWR4XHJcbiAqIEBwYXJhbSBwZXJzXHJcbiAqIEBwYXJhbSBuZXh0SGlyZVxyXG4gKiBAcGFyYW0gbmV4dExvY1xyXG4gKiBAcGFyYW0gbmV4dEZURVxyXG4gKiBAcGFyYW0gY29tbWVudFxyXG4gKi9cclxuZnVuY3Rpb24gd3JpdGVTdGF0ZUxpbmVNT05BRyh3cyxkYXRlSWR4IDogTG9jYWxEYXRlLCBwZXJzIDogUGVyc29uLCBuZXh0SGlyZSwgbmV4dExvYywgbmV4dEZURSwgcGFyczogR2VuUGFyYW1zLCBjb21tZW50OnN0cmluZykge1xyXG4gIHdyaXRlRGF5KHdzLCBwZXJzLnByZXZEYXRlRW5kLCBkYXRlSWR4KTtcclxuICBwZXJzLmxvY2F0aW9uID0gbmV4dExvYyB8fCBwZXJzLmxvY2F0aW9uO1xyXG4gIHBlcnMuZnRlID0gbmV4dEZURSB8fCBwZXJzLmZ0ZTtcclxuICAvL3BlcnMubGFzdFdyaXR0ZW4gPSBkYXRlSWR4O1xyXG4gIHdyaXRlUmVjb3JkKHdzLCBkYXRlSWR4LCBwZXJzLCBwYXJzLCBcInN0XCIgKyBjb21tZW50KTtcclxuICBtZW1vcml6ZVNPTShkYXRlSWR4LHBlcnMpO1xyXG4gIGlmKG5leHRIaXJlICE9IHBlcnMuaGlyZWQpIHtcclxuICAgIHdzLndyaXRlKFwiTkVWRVJcXG5cIilcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzVW5oaXJlZENoYW5nZShwZXJzOiBQZXJzb24sIG5leHRIaXJlLCBuZXh0TG9jLCBuZXh0RlRFLCBuZXh0RVNUQVQpIHtcclxuICByZXR1cm4gIChuZXh0SGlyZSAhPSBwZXJzLmhpcmVkKVxyXG4gICAgICAgfHwgKCBuZXh0TG9jICE9IHBlcnMubG9jYXRpb24gKVxyXG4gICAgICAgfHwgKCBuZXh0RlRFICE9IHBlcnMuZnRlIClcclxuICAgICAgIHx8ICggbmV4dEVTVEFUICE9IHBlcnMuRVNUQVQgKTtcclxufVxyXG5cclxuZnVuY3Rpb24gaXNBQ2hhbmdlKHBlcnM6IFBlcnNvbiwgbmV4dEhpcmUsIG5leHRMb2MsIG5leHRGVEUsIG5leHRFU1RBVCkge1xyXG4gIHJldHVybiAgKG5leHRIaXJlICE9IHBlcnMuaGlyZWQpXHJcbiAgICAgICB8fCAocGVycy5oaXJlZCAmJiBuZXh0TG9jICE9IHBlcnMubG9jYXRpb24gKVxyXG4gICAgICAgfHwgKHBlcnMuaGlyZWQgJiYgbmV4dEZURSAhPSBwZXJzLmZ0ZSApXHJcbiAgICAgICB8fCAocGVycy5oaXJlZCAmJiBuZXh0RVNUQVQgIT0gcGVycy5FU1RBVCApO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpc0hJUkUoIHBlcnM6IFBlcnNvbiAsIG5leHRIaXJlICkge1xyXG4gIHJldHVybiBwZXJzLmhpcmVkID09IDAgJiYgbmV4dEhpcmUgPT0gMTtcclxufVxyXG5mdW5jdGlvbiBpc1RFUk0oIHBlcnM6IFBlcnNvbiAsIG5leHRIaXJlICkge1xyXG4gIHJldHVybiBwZXJzLmhpcmVkID09IDEgJiYgbmV4dEhpcmUgPT0gMDtcclxufVxyXG5cclxuZnVuY3Rpb24gY2xvc2VQcmV2aW91c1JhbmdlKHdzLCBkYXRlSWR4OkxvY2FsRGF0ZSwgcGVyczogUGVyc29uLCBwYXJzIDogR2VuUGFyYW1zLCBjb21tZW50OiBzdHJpbmcpIHtcclxuICB2YXIgZG1pbjEgPSBjb3B5RGF0ZShkYXRlSWR4KS5taW51c0RheXMoMSk7XHJcbiAgd3JpdGVEYXkod3MsIHBlcnMucHJldkRhdGVFbmQsIGRtaW4xKTtcclxuICB3cml0ZVJlY29yZCh3cywgZG1pbjEsIHBlcnMsIHBhcnMsIGNvbW1lbnQpO1xyXG59XHJcblxyXG5mdW5jdGlvbiB3cml0ZUNoYW5nZUxpbmVSQU5HRSh3cyxkYXRlSWR4IDogTG9jYWxEYXRlLCBwZXJzOiBQZXJzb24sIG5leHRIaXJlLCBuZXh0TG9jLCBuZXh0RlRFLCBuZXh0RVNUQVQsIHBhcnMgOiBHZW5QYXJhbXMsIGNvbW1lbnQ6c3RyaW5nKSB7XHJcbiAgaWYoIHdzID09IHVuZGVmaW5lZCkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICB2YXIgaXNDaGFuZ2UgPSBpc0FDaGFuZ2UocGVycyxuZXh0SGlyZSxuZXh0TG9jLG5leHRGVEUsbmV4dEVTVEFUKTtcclxuICBpZiAoICFpc0NoYW5nZSAmJiAhaXNFT00oZGF0ZUlkeCkpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgLy8gYXQgZGF0ZUlkeCB0aGUgcGVyc29uIHN0YXRlIGNoYW5nZXMgdG8gbmV3IHN0YXRlLlxyXG4gIC8vIGNsb25lIHRoZSBvYmplY3RcclxuICB2YXIgbmV4dFBlcnMgPSBfLmNsb25lRGVlcChwZXJzKTtcclxuICBuZXh0UGVycy5wcmV2RGF0ZUVuZCA9IGNvcHlEYXRlKG5leHRQZXJzLnByZXZSYW5nZUVuZCk7IC8vISEhXHJcbiAgLy9wZXJzID0gdW5kZWZpbmVkO1xyXG4gIHZhciBpc3Rlcm0gPSBpc1RFUk0obmV4dFBlcnMsIG5leHRIaXJlKTtcclxuICBpZiAoIGlzdGVybSApIHtcclxuICAgIC8vIGNsb3NlIHByZXZpb3VzIHJlY29yZFxyXG4gICAgY2xvc2VQcmV2aW91c1JhbmdlKHdzLCBkYXRlSWR4LCBuZXh0UGVycywgcGFycywgIFwidGVybWNsb3NlLTFcIiArICBkYXRlSWR4ICsgJyAnICsgIGNvbW1lbnQpO1xyXG4gICAgcGVycy5wcmV2UmFuZ2VFbmQgPSBjb3B5RGF0ZShkYXRlSWR4KS5taW51c0RheXMoMSk7XHJcbiAgfSBlbHNlIGlmICggaXNISVJFKG5leHRQZXJzLG5leHRIaXJlKSkge1xyXG4gICAgLy9uZXh0UGVycy5sYXN0SGlyZWQgPSBkYXRlSWR4O1xyXG4gICAgcGVycy5wcmV2UmFuZ2VFbmQgPSBjb3B5RGF0ZShkYXRlSWR4KS5taW51c0RheXMoMSk7IC8vIFNFVCBUSElTIVxyXG4gICAgLy8gZG8gbm90aGluZywgd2lsbCBiZSBjYXB0dXJlZCBuZXh0XHJcbiAgfSBlbHNlIHtcclxuICAgIC8vIGNsb3NlIHByZXZpb3VzIHJlY29yZCwgYWx3YXlzXHJcbiAgICB2YXIgZG1pbjEgPSBjb3B5RGF0ZShkYXRlSWR4KS5taW51c0RheXMoMSk7XHJcbiAgICB3cml0ZURheSh3cywgbmV4dFBlcnMucHJldkRhdGVFbmQsIGRtaW4xKTtcclxuICAgIHdyaXRlUmVjb3JkKHdzLCBkbWluMSwgbmV4dFBlcnMgLCBwYXJzLCBcInBlcmNsb3NlLTEgZnJvbSBcIiArIGRhdGVJZHggKyAnICcgKyAgY29tbWVudCk7XHJcbiAgICBwZXJzLnByZXZSYW5nZUVuZCA9IGNvcHlEYXRlKGRhdGVJZHgpLm1pbnVzRGF5cygxKTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGlzU3RvcFJlY29yZHNSZXF1ZXN0ZWQocGFyczogR2VuUGFyYW1zKSB7XHJcbiAgcmV0dXJuICggcGFycy5vcHRzTU9OQUcgJiYgcGFycy5vcHRzTU9OQUcuc3RvcFJlY29yZHMpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBpc05vWmVyb1JlcXVlc3RlZChwYXJzOiBHZW5QYXJhbXMpIHtcclxuICByZXR1cm4gKCBwYXJzLm9wdHNNT05BRyAmJiBwYXJzLm9wdHNNT05BRy5ub1plcm8pO1xyXG59XHJcblxyXG5cclxuLy8gd2Ugd3JpdGUgYSByZWNvcmQgd2l0aCBhbGwgbWVhc3VyZXMgemVybyAob3IgbnVsbD8pXHJcbmZ1bmN0aW9uIHdyaXRlU1RPUFJlY29yZEFmdGVyKHdzLCBwZXJzIDogUGVyc29uLCBkIDogTG9jYWxEYXRlLCBwYXJzOiBHZW5QYXJhbXMsIGNvbW1lbnQgOiBzdHJpbmcgKSB7XHJcbiAgd3JpdGVEYXkod3MsIGQsIGQpOyAvLyBbZC1kXTtcclxuICB3cml0ZVJlY29yZDAod3MsIGQsIHBlcnMsIGNvbW1lbnQpO1xyXG59XHJcblxyXG4vLyB0aGVyZSBpcyBhIGNoYW5nZSBAZGF0ZSAsIG5ldyB2YWx1ZXMgYXJlIHRvIHRoZSByaWdodDtcclxuLy8gdGhpcyBpIGNhbGxlZCBvbiBhIGNoYW5nZSBpbiB2YWx1ZXMuXHJcbmZ1bmN0aW9uIHdyaXRlQ2hhbmdlTGluZU1PTkFHKHdzLCBkYXRlSWR4IDogTG9jYWxEYXRlLCBwZXJzLCBuZXh0SGlyZSwgbmV4dExvYywgbmV4dEZURSwgbmV4dEVTVEFULCBwYXJzIDogR2VuUGFyYW1zLCBjb21tZW50OnN0cmluZykge1xyXG4gIHZhciBpc0NoYW5nZSA9IGlzQUNoYW5nZShwZXJzLCBuZXh0SGlyZSwgbmV4dExvYywgbmV4dEZURSwgbmV4dEVTVEFUKTtcclxuICBpZiAoICFpc0NoYW5nZSAmJiAhaXNFT00oZGF0ZUlkeCkpIHtcclxuICAgIHBlcnMubG9jYXRpb24gPSBuZXh0TG9jO1xyXG4gICAgcGVycy5uZXh0RlRFID0gbmV4dEZURTsgIC8vLyBUT0RPIEZJWCFcclxuICAgIHBlcnMuRVNUQVQgPSBuZXh0RVNUQVQ7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIHZhciBpc3Rlcm0gPSBpc1RFUk0ocGVycywgbmV4dEhpcmUpO1xyXG4gIGlmICggaXN0ZXJtICkge1xyXG4gICAgLy8gY2xvc2UgcHJldmlvdXMgcmVjb3JkXHJcbiAgICBpZiAoZGF0ZUlkeC5kYXlPZk1vbnRoKCkgIT0gMSkgeyAvLyB1bmxlc3Mgd2UgYWxyZWFkeSBjbG9zZWQgaXQgYnkgYSBtb250aCByZWNvcmRcclxuICAgICAgdmFyIGRtaW4xID0gY29weURhdGUoZGF0ZUlkeCkubWludXNEYXlzKDEpO1xyXG4gICAgICB3cml0ZURheSh3cywgcGVycy5wcmV2RGF0ZUVuZCwgZG1pbjEpO1xyXG4gICAgICB3cml0ZVJlY29yZCh3cywgZG1pbjEsIHBlcnMsIHBhcnMsIFwidGVybWNsb3NlLTFAXCIgKyAgZGF0ZUlkeCArICcgJyArIGNvbW1lbnQpO1xyXG4gICAgICBtZW1vcml6ZVNPTShkbWluMSxwZXJzKTtcclxuICAgIH1cclxuICAgIC8vIGFsd2F5cyB3cml0ZSBhIHN0b3AgcmVjb3JkIGlmIHJlcXVpcmVkXHJcbiAgICBpZiAoIGlzU3RvcFJlY29yZHNSZXF1ZXN0ZWQocGFycykpIHtcclxuICAgICAgd3JpdGVTVE9QUmVjb3JkQWZ0ZXIod3MscGVycyxkYXRlSWR4LCBwYXJzLCAgXCJzdG9wQWZ0ZXJtQFwiICsgIGRhdGVJZHggKyAnICcgKyBjb21tZW50KTtcclxuICAgIH1cclxuICAgIHBlcnMuaGlyZWQgPSAwO1xyXG4gICAgcGVycy5oaXJlZFByZXYgPSAwO1xyXG4gICAgcGVycy5sYXN0VGVybSA9IGRhdGVJZHg7XHJcbiAgfSBlbHNlIGlmICggaXNISVJFKHBlcnMsbmV4dEhpcmUpKSB7XHJcbiAgICBwZXJzLmxhc3RIaXJlZCA9IGRhdGVJZHg7XHJcbiAgICBwZXJzLnByZXZEYXRlRW5kID0gY29weURhdGUoZGF0ZUlkeCkubWludXNEYXlzKDEpO1xyXG4gICAgLy8gZG8gbm90aGluZywgd2lsbCBiZSBjYXB0dXJlZCBuZXh0XHJcbiAgfSBlbHNlIHtcclxuICAgIC8vIGNsb3NlIHByZXZpb3VzIHJlY29yZFxyXG4gICAgaWYgKCBkYXRlSWR4LmRheU9mTW9udGgoKSAhPSAxKSB7XHJcbiAgICAgIC8vIHVubGVzcyB3ZSBhbHJlYWR5IGNsb3NlZCBpdCBieSBhIG1vbnRoIHJlY29yZFxyXG4gICAgICB2YXIgZG1pbjEgPSBjb3B5RGF0ZShkYXRlSWR4KS5taW51c0RheXMoMSk7XHJcbiAgICAgIHdyaXRlRGF5KHdzLCBwZXJzLnByZXZEYXRlRW5kLCBkbWluMSk7XHJcbiAgICAgIHdyaXRlUmVjb3JkKHdzLCBkbWluMSwgcGVycywgcGFycywgXCJwZXJjbG9zZS0xIGZyb20gXCIgKyBkYXRlSWR4ICsgJyAnKyAgY29tbWVudCk7XHJcbiAgICAgIG1lbW9yaXplU09NKGRtaW4xLHBlcnMpO1xyXG4gICAgfVxyXG4gICAgLy8gYWx3YXlzIHdyaXRlIGEgc3RvcCByZWNvcmQgaWYgcmVxZXN0ZWRcclxuICAgIGlmICggaXNTdG9wUmVjb3Jkc1JlcXVlc3RlZChwYXJzKSkge1xyXG4gICAgICB3cml0ZVNUT1BSZWNvcmRBZnRlcih3cyxwZXJzLGRhdGVJZHgsIHBhcnMsICBcInN0b3BBZnRldmVAXCIgKyAgZGF0ZUlkeCArICcgJyArIGNvbW1lbnQpO1xyXG4gICAgfVxyXG4gIH1cclxuICBwZXJzLmhpcmVkID0gbmV4dEhpcmU7XHJcbiAgcGVycy5sb2NhdGlvbiA9IG5leHRMb2M7XHJcbiAgcGVycy5mdGUgPSBuZXh0RlRFO1xyXG4gIGlmIChpc0VPTShkYXRlSWR4KSkge1xyXG4gICAgLy8gbGF0ZXIgc3VwcHJlc3MgdW5sZXNzIGxhc3RUZXJtIHdpdGhpbiByYW5nZVxyXG4gICAgaWYgKCAhaXNOb1plcm9SZXF1ZXN0ZWQocGFycykgfHwgIWlzQWxsWmVybyhwZXJzKSkge1xyXG4gICAgICB3cml0ZVN0YXRlTGluZU1PTkFHKHdzLGRhdGVJZHgscGVycywgcGVycy5oaXJlZCwgcGVycy5sb2NhdGlvbiwgcGVycy5mdGUsIHBhcnMsIFwiV0NMXCIpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuLy8vLy8vLy8vLy8vLy8vLy8vLyBwZXJjZW50YWdlc1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGlzSGlyZUNoYW5nZShwYXJzIDogR2VuUGFyYW1zKSA6IGJvb2xlYW4ge1xyXG4gIHJldHVybiBwYXJzLnJhbmRvbSgpIDwgcGFycy5MX0hJUkU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldERPQihwYXJzIDogR2VuUGFyYW1zKSA6IExvY2FsRGF0ZSB7XHJcblxyXG4gIHZhciB5ZWFyID0gMTk1MCArIE1hdGguZmxvb3IocGFycy5yYW5kb20oKSo1NSk7XHJcbiAgdmFyIG1vbnRoID0gTWF0aC5mbG9vcihwYXJzLnJhbmRvbSgpKjEyKTtcclxuICB2YXIgZGF5YmFzZSA9IE1hdGguZmxvb3IocGFycy5yYW5kb20oKSozMSk7XHJcbiAgcmV0dXJuIExvY2FsRGF0ZS5vZih5ZWFyLDErbW9udGgsIDEpLnBsdXNEYXlzKGRheWJhc2UgLSAxKTtcclxufVxyXG4vL0xvY2FsRGF0ZS5vZigxOTUwK01hdGguZmxvb3IocGFycy5yYW5kb20oKSo1NSksTWF0aC5mbG9vcihwYXJzLnJhbmRvbSgpKjEyKSxNYXRoLmZsb29yKHBhcnMucmFuZG9tKCkqMzEpKSxcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZW5QZXJzb24ocCwgcGFyczogR2VuUGFyYW1zKSB7XHJcblx0dmFyIHBlcnMgPSB7XHJcbiAgICB1c2VyIDogcCxcclxuICAgIGhpcmVkOiAwLFxyXG4gICAgaGlyZWRQcmV2IDogMCxcclxuICAgIGZ0ZSA6IDEsXHJcbiAgICBmdGVQcmV2IDogMCxcclxuICAgIGRvYiA6IGdldERPQihwYXJzKSxcclxuICAgIGxvY2F0aW9uIDogZ2V0TG9jYXRpb24ocGFycyksXHJcbiAgICBwcmV2RGF0ZUVuZCA6IHBhcnMuZmlyc3REYXRlLFxyXG4gICAgcHJldlJhbmdlRW5kIDogcGFycy5maXJzdERhdGUsXHJcbiAgICBoaXJlZFNPTSA6IDAsXHJcbiAgICBsYXN0SGlyZWQgOiBwYXJzLmZpcnN0RGF0ZSxcclxuICAgIGZ0ZVNPTSA6IDAsXHJcbiAgICBFU1RBVCA6IFwiQVwiLFxyXG4gICAgRVNUQVRTT00gOiBcIkFcIixcclxuICB9IGFzIFBlcnNvbjtcclxuICB2YXIgbmV4dERhdGUgPSBnZXROZXh0KHBhcnMpICsgcGFycy5maXJzdERhdGUudG9FcG9jaERheSgpO1xyXG4gIGZvcih2YXIgaSA9IHBhcnMuZmlyc3REYXRlLnRvRXBvY2hEYXkoKTsgaSA8PSBwYXJzLmxhc3REYXRlLnRvRXBvY2hEYXkoKTsgKytpKSB7XHJcbiAgICB2YXIgZCA9IExvY2FsRGF0ZS5vZkVwb2NoRGF5KGkpO1xyXG4gICAgaWYgKCBpID09IG5leHREYXRlICkge1xyXG4gICAgICBpZiggaXNIaXJlQ2hhbmdlKHBhcnMpKSB7XHJcbiAgICAgICAvLyB3cml0ZUNoYW5nZUxpbmVNT05BRyhwYXJzLndzTU9OQUcsIGQscGVycywgcGVycy5oaXJlZCA/IDAgOiAxLCBuZXh0TG9jYXRpb24ocGFycyxwZXJzKSwgbmV4dEZURShwYXJzLHBlcnMpICAsIFwiSENcIik7XHJcbiAgICAgICAgLy8rXHJcbiAgICAgICAgLy8gT1JERVIgSVMgQ1JVQ0lBTCFcclxuICAgICAgICB2YXIgbmwgPSBuZXh0TG9jYXRpb24ocGFycyxwZXJzKTtcclxuICAgICAgICB2YXIgbmYgPSBuZXh0RlRFKHBhcnMscGVycyk7XHJcbiAgICAgICAgdmFyIG5FU1RBVCA9IGdldE5leHRFU1RBVChwYXJzLHBlcnMsXCJFU1RBVFwiKTtcclxuICAgICAgICB3cml0ZUNoYW5nZUxpbmVSQU5HRShwYXJzLndzUkFOR0UsIGQsIHBlcnMsIHBlcnMuaGlyZWQgPyAwIDogMSwgbmwsIG5mLCBuRVNUQVQsICBwYXJzLCBcIkhDXCIpO1xyXG4gICAgICAgIHdyaXRlQ2hhbmdlTGluZU1PTkFHKHBhcnMud3NNT05BRywgZCwgcGVycywgcGVycy5oaXJlZCA/IDAgOiAxLCBubCwgbmYsIG5FU1RBVCwgcGFycywgXCJIQ1wiKTtcclxuICAgICAgICBuZXh0RGF0ZSArPSBnZXROZXh0KHBhcnMpO1xyXG4gICAgICB9IGVsc2UgaWYgKGlzRXZlbnQocGFycykpIHtcclxuICAgICAgICB2YXIgbmwgPSBuZXh0TG9jYXRpb24ocGFycywgcGVycyk7XHJcbiAgICAgICAgLy8gZm9yY2VcclxuICAgICAgICB2YXIgbmYgPSBuZXh0RlRFKHBhcnMsIHBlcnMpO1xyXG4gICAgICAgIHZhciBuRVNUQVQgPSBnZXROZXh0RVNUQVQocGFycyxwZXJzLFwiRVNUQVRcIik7XHJcbiAgICAgICAgd2hpbGUoICFpc1VuaGlyZWRDaGFuZ2UocGVycyxwZXJzLmhpcmVkLCBubCxuZiwgbkVTVEFUKSkge1xyXG4gICAgICAgICAgbmwgPSBuZXh0TG9jYXRpb24ocGFycywgcGVycyk7XHJcbiAgICAgICAgICAvLyBmb3JjZVxyXG4gICAgICAgICAgbmYgPSBuZXh0RlRFKHBhcnMsIHBlcnMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB3cml0ZUNoYW5nZUxpbmVSQU5HRShwYXJzLndzUkFOR0UsIGQsIHBlcnMsIHBlcnMuaGlyZWQsIG5sLCBuZiwgbkVTVEFULCBwYXJzLCBcIkxDXCIpO1xyXG4gICAgICAgIHdyaXRlQ2hhbmdlTGluZU1PTkFHKHBhcnMud3NNT05BRywgZCwgcGVycywgcGVycy5oaXJlZCwgbmwsIG5mLCBuRVNUQVQsIHBhcnMsIFwiTENcIiApO1xyXG4gICAgICAgIG5leHREYXRlICs9IGdldE5leHQocGFycyk7XHJcbiAgICAgIH0gZWxzZSBpZiAoaXNFT00oZCkpIHtcclxuICAgICAgICAgIHdyaXRlU3RhdGVMaW5lTU9OQUcocGFycy53c01PTkFHLCBkLCBwZXJzLCBwZXJzLmhpcmVkLCBwZXJzLmxvY2F0aW9uLCBwZXJzLmZ0ZSwgcGFycywgXCJFT01lXCIpO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKGlzRU9NKGQpKSB7XHJcbiAgICAgIC8vaWYoIHBlcnMuaGlyZWQgPiAwICkge1xyXG4gICAgICAgIGlmICggIWlzTm9aZXJvUmVxdWVzdGVkKHBhcnMpIHx8ICFpc0FsbFplcm8ocGVycykpIHtcclxuICAgICAgICAgIHdyaXRlU3RhdGVMaW5lTU9OQUcocGFycy53c01PTkFHLCBkLCBwZXJzLCBwZXJzLmhpcmVkLCBwZXJzLmxvY2F0aW9uLCBwZXJzLmZ0ZSwgcGFycywgXCJFT01cIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAvL31cclxuICAgICAgLy8gZWxzZSB7XHJcbiAgICAgICAgbWVtb3JpemVTT00oZCxwZXJzKTtcclxuICAgICAgLy99XHJcbiAgICB9XHJcblx0fTtcclxufVxyXG5cclxuXHJcbnZhciBwcmltZXMgID0gW107XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2V0TWF4UHJpbWVzKG5yOiBudW1iZXIpIDogbnVtYmVyIHtcclxuICB2YXIgbWF4ID0gTWF0aC5mbG9vcihNYXRoLnNxcnQobnIpKzMpO1xyXG4gIHZhciBtcCA9IDE7XHJcbiAgdmFyIHJlbWFpbiA9IG5yO1xyXG4gIGZvcih2YXIgaSA9IDE7IGkgPD0gbWF4OyArK2kgKSB7XHJcbiAgICBpZiAocmVtYWluID09IDEpIHtcclxuICAgICAgcmV0dXJuIG1wO1xyXG4gICAgfVxyXG4gICAgd2hpbGUoaSA+IDEgJiYgIChyZW1haW4gJSBpID09IDApKSB7XHJcbiAgICAgIG1wID0gTWF0aC5tYXgobXAsaSk7XHJcbiAgICAgIHJlbWFpbiA9IHJlbWFpbi9pO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gcmVtYWluO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2VuVVNFUkhpZXJhcmNoeShucnBlcnMgOiBudW1iZXIgKSB7XHJcbiAgdmFyIHdzID0gZ2V0V1MoIFwiRElNX1VTRVJfXCIgKyBwYWRaZXJvcyhucnBlcnMsNikgKyBcIi5jc3ZcIik7XHJcbiAgZ2VuVVNFUkhpZXJhcmNoeVcod3MsbnJwZXJzKTtcclxuICB3cy53cy5lbmQoKTtcclxufVxyXG5cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjbGVhbnNlV1NJbkZpbGUoZmlsZW5hbWUxOiBzdHJpbmcsIGZpbGVuYW1lMiA6IHN0cmluZyApIHtcclxuICB2YXIgbG4gPSBmcy5yZWFkRmlsZVN5bmMoZmlsZW5hbWUxLCB7IGVuY29kaW5nIDogJ3V0Zi04J30pO1xyXG4gIHZhciBsbmMgPSBsbi5yZXBsYWNlKC87XFxzKy9nLFwiO1wiKTtcclxuICBmcy53cml0ZUZpbGVTeW5jKGZpbGVuYW1lMiwgbG5jKVxyXG59XHJcblxyXG5cclxuXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZ2VuVXNlcihpIDogbnVtYmVyKSA6IHN0cmluZyB7XHJcbiAgcmV0dXJuICdQJyArIHBhZFplcm9zKGksNSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBnZW5VU0VSSGllcmFyY2h5Vyh3cyA6IGFueSwgbnJwZXJzIDogbnVtYmVyICkge1xyXG4gIC8vIHdlIGJ1aWxkIGEgcGFyZW50IGNoaWxkIGhpZXJhcmNoeSAgdXNpbmcgcHJpbWUgbnVtYmVyIGRlY29tcG9zaXRpb24sXHJcbiAgLy8gd2UgYnVpbGQgYSBwYXJlbnQgY2hpbGQgaGllcmFyY2h5ICB1c2luZyBwcmltZSBudW1iZXIgZGVjb21wb3NpdGlvbixcclxuICAvLyB3aXRoIHBlcnNvbnMgbWFkZSBjaGlsZHJlbiBvZiB0aGUgXCJsYWdlc3QgcHJpbWUgZmFjdG9yXCJcclxuICAvLyB0byBub3QgZW5kIHVwIHdpdGggdG9vIG1hbnkgcm9vdHMgd2Ugb25seSBtYWtlIGV2ZXJ5IG4tdGggcHJpbWUgZmFjdG9yIGEgcm9vdC5cclxuICAvL1xyXG4gIC8vXHJcbiAgdmFyIHJlcyA9IHt9O1xyXG4gIHZhciBuclByaW1lcyA9IDA7XHJcbiAgLy8gMTMgLSA1IC0gMlxyXG4gIGZvcih2YXIgaSA9IDE7IGkgPD0gbnJwZXJzOyArK2kgKSB7XHJcbiAgICB2YXIgcHJpbSA9IGdldE1heFByaW1lcyhpKTtcclxuICAgIGlmKCAhcmVzW3ByaW1dKSB7XHJcbiAgICAgICsrbnJQcmltZXM7XHJcbiAgICAgIGlmICggKGkgPiAxMCkgJiYgKG5yUHJpbWVzICUgMjAgIT0gMTUpICkge1xyXG4gICAgICAgIHZhciBwcmltUGFyID0gZ2V0TWF4UHJpbWVzKE1hdGguZmxvb3IoaS8xMCkpO1xyXG4gICAgICAgIHJlc1twcmltXSA9IHByaW1QYXI7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmVzW3ByaW1dID0gLTE7IC8vIGEgcm9vdFxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiggaSAhPSBwcmltICkge1xyXG4gICAgICByZXNbaV0gPSBwcmltO1xyXG4gICAgfVxyXG4gIH1cclxuICAvL2R1bXAgdGhlIGxpc3RcclxuICB3cy53cml0ZShcIlVTRVI7VVNFUl9QQVJFTlRcXG5cIik7XHJcbiAgZm9yKHZhciBpID0gMTsgaSA8PSBucnBlcnM7ICsraSkge1xyXG4gICAgd3Mud3JpdGUoZ2VuVXNlcihpKSkud3JpdGUoJzsnKTtcclxuICAgIGlmICggcmVzW2ldID4gMCApIHtcclxuICAgICAgd3Mud3JpdGUoZ2VuVXNlcihyZXNbaV0pKS53cml0ZSgnXFxuJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB3cy53cml0ZShcIlxcblwiKTsgLy9OdWxsIVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuIl19
