var fs = require('fs');
const { exit } = require('process');
import * as _ from 'lodash';
import * as lineByLine from 'n-readlines';
import * as readline from 'readline';

//var seedrandom = require('seedrandom');
import * as seedrandom from 'seedrandom';
// EXCEL
//     1 1900-01-01
// 25569 1970-01-01
//
export const EXCELOFFSET = 25569;

import {LocalDate } from  "@js-joda/core";
import { SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS } from 'constants';

export function dateToDayIndex(d : LocalDate ) : number {
  return  d.toEpochDay() + EXCELOFFSET;
}

var d1 = LocalDate.of(2020,1,6);
var d1Idx = dateToDayIndex(d1);
var d2 = LocalDate.of(2024,6,1);
var d2Idx = dateToDayIndex(d2);
var deltaTime = d2Idx-d1Idx;

export function makeMap(obj) {
  var idx = 0;
  var res = [];
  Object.getOwnPropertyNames(obj).forEach( function(a) {
    for(var i = 0; i < obj[a]; ++i) {
      res.push(a);
    }
  });
  return res;
}

export class WSWrap  {
  ws: any;
  constructor(fn : string)
  {
    this.ws = fs.createWriteStream(fn);
  }
  write(a) {
    this.ws.write('' + a);
    return this;
  }
};

export class WSWrap2  {
  ws: any;
  _log: any;
  _onFinish : any;
  constructor(fn : string)
  {
    this.ws = this;
    this._log = fs.openSync(fn,'w');
    this._onFinish = undefined;
  }
  on( s : string, fn : any) {
    this._onFinish = fn;
  }
  end() {
    fs.closeSync(this._log);
    this._log = undefined;
    if( this._onFinish) {
      this._onFinish();
    }
  }
  write(a : any) {
    fs.writeSync(this._log, '' + a);
    return this;
  }
};


export function getWS(filename: string) : WSWrap {

  return new WSWrap2(filename);
}


// 1 Simple range based  (no monthly interim data)
//  [xxx]-[yyy]  <attributes>
//
//  optional sprinkle in 0,0,0,0 <attributes> Mark  EOM/EOP numbers.
//
//to support different output flavours,
//
//

export class OptsMONAG {
  noZero : boolean;
  stopRecords : boolean;
}

export class GenParams {
  AVG_NEXT : number;
  LOCCHANGE : number;
  FTECHANGE: number;
  ESTATCHANGE:number;
  L_HIRE : number;
  L_EVENT : number;
  LOCATIONs: string[];
  ESTATs : string[];
  firstDate : LocalDate;
  lastDate : LocalDate;
  random : any;
  wsMONAG : any;
  optsMONAG? : OptsMONAG;
  wsRANGE : any;
  optsRANGE : any;
  randomOD : any; // { "ESTAT" : seedrandom('XZY') },
  REOP_ESTATS : string[]; // ESTATS which contribute to EOP, this is just head count IF ESTAT IN ["A","U","P"] EOP_HC : 0
}

export class Person {
  // immutable
  user: string;
  // changing
  dob: LocalDate;
  location : string;
  hired: number;
  hiredSOM: number;
  hiredPrev : number; // person  hire state previous range
  fte : number;
  ftePrev : number; // person fte state previous range
  fteSOM: number;
  ESTAT : string;
  ESTATPrev : string;
  ESTATSOM : string;
  // changing
  lastHired: LocalDate;
  prevDateEnd : LocalDate;
  prevRangeEnd: LocalDate; // end of last range
}

function getNext(pars:GenParams) {
  return Math.floor(pars.random() * pars.AVG_NEXT) + 1;
}

function getLocation(pars: GenParams) {
  return pars.LOCATIONs[Math.floor(pars.random() * pars.LOCATIONs.length)];
}

function getESTAT(pars: GenParams, key : string) {
  return pars.ESTATs[Math.floor(pars.randomOD[key]() * pars.ESTATs.length)];
}


function nextLocation(pars: GenParams, pers : Person) {
  if( pars.random() < pars.LOCCHANGE) {
    return getLocation(pars);
  }
  return  pers.location;
}

function nextFTE(pars: GenParams, pers : Person) {
  if( pars.random() < pars.FTECHANGE) {
    if( pers.fte == 1) {
      return 0.5;
    }
    return 1.0;
  }
  return pers.fte;
}


function getNextESTAT(pars: GenParams, pers : Person, key : string) {
//  pars.randomOD[key]();
  if( pars.randomOD[key]() < pars.ESTATCHANGE) {
    return getESTAT(pars, key);
  }
  return  pers.ESTAT;
}


function isEvent(pars:GenParams) {
  return pars.random() < pars.L_EVENT;
}

export function dateIndexToDate(dateIdx : number) : LocalDate {
  return LocalDate.ofEpochDay(dateIdx - EXCELOFFSET);
}

function isEOM(dateIdx : any) {
  var d = undefined as LocalDate;
  if ( dateIdx instanceof LocalDate) {
    d = dateIdx;
  }
  else {
     d = dateIndexToDate(dateIdx);
  }
  var d = copyDate(d).plusDays(1);
  if(d.dayOfMonth() == 1)
    return true;
  return false;
}

export function copyDate(d : LocalDate) {
  return LocalDate.ofEpochDay(d.toEpochDay());
}

export function isEOQ(d: LocalDate) {
  d = copyDate(d).plusDays(1);
  if(d.dayOfMonth() == 1 &&  [1,4,7,10].indexOf(d.monthValue()) >= 0)
    return true;
  return false;
}



export function isEOY(d : LocalDate) {
  var d = copyDate(d).plusDays(1);
  if(d.dayOfMonth() == 1 && d.monthValue() == 1)
    return true;
  return false;
}

export function padZeros(a : any, len : number) {
  var s = "" +a;
  return "0000000".substr(0, len - s.length) + s;
}

export function padSpace(a : any, len : number) {
  var s = "" +a;
  return "                   ".substr(0, len - s.length) + s;
}

export function padSpaceQ(a : any, len : number) {
  var s = "" +a;
  return '"' + s + '"' + "                   ".substr(0, len - s.length);
}


export function asDate(dateIdx : any): string {
  var d = undefined as LocalDate;
  if ( dateIdx instanceof LocalDate) {
    d = dateIdx;
  } else {
    d = dateIndexToDate(dateIdx);
  }
  return '' + d;
  //return d.year() + "-" + pad(d.monthValue(),2) + "-" + pad(d.dayOfMonth(),2);
}

export function EOMONTH(d : LocalDate) : LocalDate {
  return copyDate(d).plusMonths(1).withDayOfMonth(1).minusDays(1);
}

export function daysInMonth(d : any) {
  var dt =undefined as LocalDate;
  if(d instanceof LocalDate ) {
    dt = d;
  } else {
    dt = dateIndexToDate(d as number);
  }
  var deom = EOMONTH(dt);
  return dateToDayIndex(deom) - dateToDayIndex(copyDate(deom).withDayOfMonth(1)) + 1;
}

export function writeHeader(ws) {
  ws.write("YEAR;QUART;CALMONTHIC;CALMONTHI;CALMONTH;CALMONTHS;START_DATE_IDX;END_DATE_IDX;ISEOM;ISEOQ;ISEOY;DAYSINMONTH;START_DATE;END_DATE;")
  ws.write("USER;LOCATION;ESTAT;HC;HC_SOM;HC_EOM;DAYSWORKED;FTE;FTE_SOM;FTE_EOM;FTEWORKED;TENURE;TENURE_SOM;TENURE_EOM;AGE;AGE_SOM;AGE_EOM;HC_EOMS;X\n")
}

export function makeQuarter(d : LocalDate) {
  return d.year() + '' + '_Q' +  (Math.floor((d.monthValue()-1)/3)+1);
}

export function writeDay(ws, prevDateEnd:LocalDate, dateIdx : LocalDate) {
  var startIdx = copyDate(prevDateEnd).plusDays(1);
  var d = dateIdx;
  var y = d.year();
  var m = d.monthValue();
  var cmi = y*100 + m;
  var cmic =  (y-2000)*12 + m;
  ws.write(y).write(';');
  ws.write(makeQuarter(d)).write(';');
  ws.write('' + cmic + ";" + cmi + ";" + cmi + ";" + cmi+ ";"); // CALMONTH IC I ~ S
  ws.write(dateToDayIndex(startIdx)+ ";"+ dateToDayIndex(dateIdx) + ";");
  ws.write(isEOM(d)? "1.0" : "0.0").write(";");
  ws.write(isEOQ(d)? "1.0" : "0.0").write(";");
  ws.write(isEOY(d)? "1.0" : "0.0").write(";");
  var dim = daysInMonth(d);
  ws.write(dim).write(";");
  ws.write(asDate(startIdx)).write(";");
  ws.write(asDate(d)).write(";");
  return dim;
}

export function diffYears(dateLow: LocalDate, dateHigh: LocalDate) {
  return dateLow.until(dateHigh).years();
}

export function diffMonth(dateLow : LocalDate, dateHigh : LocalDate) {
  var a = dateLow.until(dateHigh);
  return a.years()*12 + a.months();
}

export function writeTENUREAGE(pers :Person) {
  return pers.hired > 0;
}

export function writeTenure(ws, now: LocalDate, pers: Person, eom) {
  if ( !writeTENUREAGE(pers) ) {
    ws.write(' 0; 0; 0;');
    return;
  }
  var tenureNow = diffMonth(pers.lastHired,now);
  ws.write(padSpace(tenureNow,2)).write(';');
  if( isEOM(now)) {
    var dsom = getSOM(now);
    var tenureSOM = diffMonth(pers.lastHired,dsom);
    ws.write(padSpace(tenureSOM,2)).write(';')
    ws.write(padSpace(tenureNow,2)).write(';');
  } else {
    ws.write(' 0; 0;')
  }
}

export function getSOM(dateIdx : LocalDate)  : LocalDate {
  return dateIdx.withDayOfMonth(1);
}

export function writeAge(ws, now : LocalDate, pers, eom: boolean) {
  if ( !writeTENUREAGE(pers) ) {
    ws.write(' 0; 0; 0;');
    return;
  }
  var ageNow = diffYears(pers.dob,now);
  ws.write(padSpace(ageNow,2)).write(';');
  if( isEOM(now) ) {
    var dsom = getSOM(now);
    var ageSOM = diffYears(pers.dob,dsom);
    ws.write(padSpace(ageSOM,2)).write(';')
    ws.write(padSpace(ageNow,2)).write(';');
  } else {
    ws.write(' 0; 0;')
  }
}

export function writeTripel(ws, vsom : any, vnow: any, eom : boolean) {
  ws.write(padSpace(vnow,3)).write(';');
  if( eom ) {
    ws.write(padSpace(vsom,3)).write(';')
    ws.write(padSpace(vnow,3)).write(';');
  } else {
    ws.write('0.0;0.0;')
  }
}

export function toDec1(n : number) {
  return (n || 0).toFixed(1);
}

export function memorizeSOM(dateIdx : LocalDate, pers : Person) {
  var eom = isEOM(dateIdx);
  if (eom) {
    pers.fteSOM = pers.hired * pers.fte;
    pers.hiredSOM = pers.hired;
  }
}

function isAllZero(pers : Person) {
  return (pers.hired == 0 &&  pers.hiredSOM == 0);
}

/**
 * This function does mutate pers, use a clone if not desired!
 * @param ws
 * @param dateIdx
 * @param pers
 * @param comment
 */
export function writeRecord(ws, dateIdx : LocalDate, pers : Person, pars : GenParams, comment: string )
{
  var startIdx = copyDate(pers.prevDateEnd).plusDays(1);
  var eom = isEOM(dateIdx);
  ws.write(padSpaceQ(pers.user,5)).write(';');
  ws.write(padSpaceQ(pers.location,20)).write(';');
  ws.write(padSpaceQ(pers.ESTAT,1)).write(';'); // we always write this, needed for STOP records
  writeTripel(ws, pers.hiredSOM ? "1.0": "0.0" ,pers.hired ? "1.0": "0.0",isEOM(dateIdx));
  var daysInPeriod = startIdx.until(dateIdx).days() + 1;
  ws.write(padSpace(pers.hiredPrev * daysInPeriod,2)).write(';'); //DAYSWORKED
  writeTripel(ws, toDec1(pers.fteSOM),toDec1(pers.hired * pers.fte),isEOM(dateIdx));
  ws.write(padSpace(pers.hiredPrev * pers.ftePrev * daysInPeriod,4)).write(';'); // FTEWORKED
  writeTenure(ws, dateIdx, pers, eom);
  writeAge(ws, dateIdx, pers, eom);
  if(eom && pars.REOP_ESTATS && pars.REOP_ESTATS.indexOf(pers.ESTAT) >= 0) {
    ws.write(padSpace(pers.hired,1)).write(';');
  } else {
    ws.write('0').write(';');
  }
  pers.hiredPrev = pers.hired;
  pers.ftePrev = pers.fte;
  pers.prevDateEnd = copyDate(dateIdx);

  ws.write(comment + "\n");
}

/**
 * This function does mutate pers, use a clone if not desired!
 * @param ws
 * @param dateIdx
 * @param pers
 * @param comment
 */
export function writeRecord0(ws, dateIdx : LocalDate, pers : Person,  comment: string )
{
  var startIdx = copyDate(dateIdx);
  var eom = isEOM(dateIdx);
  ws.write(padSpaceQ(pers.user,5)).write(';');
  ws.write(padSpaceQ(pers.location,20)).write(';');
  ws.write(padSpaceQ(pers.ESTAT,1)).write(';'); // we always write this, needed for STOP records
  writeTripel(ws, "0.0", "0.0", false); // pers.hiredSOM ? "1.0": "0.0" ,pers.hired ? "1.0": "0.0",isEOM(dateIdx));
  var daysInPeriod = "0.0"; //startIdx.until(dateIdx).days() + 1;
  ws.write(padSpace(0,2)).write(';'); //DAYSWORKED
  writeTripel(ws, toDec1(0),toDec1(0),isEOM(dateIdx));
  ws.write(padSpace(0,4)).write(';'); // FTEWORKED
  ws.write(" 0; 0; 0;");
  //writeTenure(ws, dateIdx, pers, eom); // CHECK WHETHER MEASURE OR DIM
  ws.write(" 0; 0; 0;")
  //writeAge(ws, dateIdx, pers, eom);
  ws.write("0;");
  //if(eom && pars.REOP_ESTATS && pars.REOP_ESTATS.indexOf(pers.ESTAT) >= 0) {
  //    ws.write(padSpace(pers.hired,1)).write(';');
  //} else {
  //  ws.write('0').write(';');
  //}
  ws.write(comment + "\n");
}

function writeStateLineRANGE(ws,dateIdx : LocalDate, pers : Person, nextHire, nextLoc, nextFTE, comment:string) {
  if(ws == undefined) {
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
function writeStateLineMONAG(ws,dateIdx : LocalDate, pers : Person, nextHire, nextLoc, nextFTE, pars: GenParams, comment:string) {
  writeDay(ws, pers.prevDateEnd, dateIdx);
  pers.location = nextLoc || pers.location;
  pers.fte = nextFTE || pers.fte;
  //pers.lastWritten = dateIdx;
  writeRecord(ws, dateIdx, pers, pars, "st" + comment);
  memorizeSOM(dateIdx,pers);
  if(nextHire != pers.hired) {
    ws.write("NEVER\n")
  }
}

function isUnhiredChange(pers: Person, nextHire, nextLoc, nextFTE, nextESTAT) {
  return  (nextHire != pers.hired)
       || ( nextLoc != pers.location )
       || ( nextFTE != pers.fte )
       || ( nextESTAT != pers.ESTAT );
}

function isAChange(pers: Person, nextHire, nextLoc, nextFTE, nextESTAT) {
  return  (nextHire != pers.hired)
       || (pers.hired && nextLoc != pers.location )
       || (pers.hired && nextFTE != pers.fte )
       || (pers.hired && nextESTAT != pers.ESTAT );
}

function isHIRE( pers: Person , nextHire ) {
  return pers.hired == 0 && nextHire == 1;
}
function isTERM( pers: Person , nextHire ) {
  return pers.hired == 1 && nextHire == 0;
}

function closePreviousRange(ws, dateIdx:LocalDate, pers: Person, pars : GenParams, comment: string) {
  var dmin1 = copyDate(dateIdx).minusDays(1);
  writeDay(ws, pers.prevDateEnd, dmin1);
  writeRecord(ws, dmin1, pers, pars, comment);
}

function writeChangeLineRANGE(ws,dateIdx : LocalDate, pers: Person, nextHire, nextLoc, nextFTE, nextESTAT, pars : GenParams, comment:string) {
  if( ws == undefined) {
    return;
  }
  var isChange = isAChange(pers,nextHire,nextLoc,nextFTE,nextESTAT);
  if ( !isChange && !isEOM(dateIdx)) {
    return;
  }
  // at dateIdx the person state changes to new state.
  // clone the object
  var nextPers = _.cloneDeep(pers);
  nextPers.prevDateEnd = copyDate(nextPers.prevRangeEnd); //!!!
  //pers = undefined;
  var isterm = isTERM(nextPers, nextHire);
  if ( isterm ) {
    // close previous record
    closePreviousRange(ws, dateIdx, nextPers, pars,  "termclose-1" +  dateIdx + ' ' +  comment);
    pers.prevRangeEnd = copyDate(dateIdx).minusDays(1);
  } else if ( isHIRE(nextPers,nextHire)) {
    //nextPers.lastHired = dateIdx;
    pers.prevRangeEnd = copyDate(dateIdx).minusDays(1); // SET THIS!
    // do nothing, will be captured next
  } else {
    // close previous record, always
    var dmin1 = copyDate(dateIdx).minusDays(1);
    writeDay(ws, nextPers.prevDateEnd, dmin1);
    writeRecord(ws, dmin1, nextPers , pars, "perclose-1 from " + dateIdx + ' ' +  comment);
    pers.prevRangeEnd = copyDate(dateIdx).minusDays(1);
  }
}

function isStopRecordsRequested(pars: GenParams) {
  return ( pars.optsMONAG && pars.optsMONAG.stopRecords);
}

function isNoZeroRequested(pars: GenParams) {
  return ( pars.optsMONAG && pars.optsMONAG.noZero);
}


// we write a record with all measures zero (or null?)
function writeSTOPRecordAfter(ws, pers : Person, d : LocalDate, pars: GenParams, comment : string ) {
  writeDay(ws, d, d); // [d-d];
  writeRecord0(ws, d, pers, comment);
}

// there is a change @date , new values are to the right;
// this i called on a change in values.
function writeChangeLineMONAG(ws, dateIdx : LocalDate, pers :Person, nextHire, nextLoc, nextFTE, nextESTAT, pars : GenParams, comment:string) {
  var isChange = isAChange(pers, nextHire, nextLoc, nextFTE, nextESTAT);
  if ( !isChange && !isEOM(dateIdx)) {
    pers.location = nextLoc;
    //pers.nextFTE = nextFTE;  /// TODO FIX!
    pers.ESTAT = nextESTAT;
    return;
  }
  var isterm = isTERM(pers, nextHire);
  if ( isterm ) {
    // close previous record
    if (dateIdx.dayOfMonth() != 1) { // unless we already closed it by a month record
      var dmin1 = copyDate(dateIdx).minusDays(1);
      writeDay(ws, pers.prevDateEnd, dmin1);
      writeRecord(ws, dmin1, pers, pars, "termclose-1@" +  dateIdx + ' ' + comment);
      memorizeSOM(dmin1,pers);
    }
    // always write a stop record if required
    if ( isStopRecordsRequested(pars)) {
      writeSTOPRecordAfter(ws,pers,dateIdx, pars,  "stopAfterm@" +  dateIdx + ' ' + comment);
    }
    pers.hired = 0;
    pers.hiredPrev = 0;
    //pers.lastTerm = dateIdx;
  } else if ( isHIRE(pers,nextHire)) {
    pers.lastHired = dateIdx;
    pers.prevDateEnd = copyDate(dateIdx).minusDays(1);
    // added
    pers.ftePrev = pers.fte;
    pers.hiredPrev = 1;
    // do nothing, will be captured next
  } else {
    // close previous record
    if ( dateIdx.dayOfMonth() != 1) {
      // unless we already closed it by a month record
      var dmin1 = copyDate(dateIdx).minusDays(1);
      writeDay(ws, pers.prevDateEnd, dmin1);
      writeRecord(ws, dmin1, pers, pars, "perclose-1 from " + dateIdx + ' '+  comment);
      memorizeSOM(dmin1,pers);
    }
    // always write a stop record if reqested
    if ( isStopRecordsRequested(pars)) {
      writeSTOPRecordAfter(ws,pers,dateIdx, pars,  "stopAfteve@" +  dateIdx + ' ' + comment);
    }
  }
  pers.hired = nextHire;
  pers.location = nextLoc;
  pers.fte = nextFTE;
  if (isEOM(dateIdx)) {
    // later suppress unless lastTerm within range
    if ( !isNoZeroRequested(pars) || !isAllZero(pers)) {
      writeStateLineMONAG(ws,dateIdx,pers, pers.hired, pers.location, pers.fte, pars, "WCL");
    }
  }
}

/////////////////// percentages

export function isHireChange(pars : GenParams) : boolean {
  return pars.random() < pars.L_HIRE;
}

function getDOB(pars : GenParams) : LocalDate {

  var year = 1950 + Math.floor(pars.random()*55);
  var month = Math.floor(pars.random()*12);
  var daybase = Math.floor(pars.random()*31);
  return LocalDate.of(year,1+month, 1).plusDays(daybase - 1);
}
//LocalDate.of(1950+Math.floor(pars.random()*55),Math.floor(pars.random()*12),Math.floor(pars.random()*31)),

export function genPerson(p, pars: GenParams) {
	var pers = {
    user : p,
    hired: 0,
    hiredPrev : 0,
    fte : 1,
    ftePrev : 0,
    dob : getDOB(pars),
    location : getLocation(pars),
    prevDateEnd : pars.firstDate,
    prevRangeEnd : pars.firstDate,
    hiredSOM : 0,
    lastHired : pars.firstDate,
    fteSOM : 0,
    ESTAT : "A",
    ESTATSOM : "A",
  } as Person;
  var nextDate = getNext(pars) + pars.firstDate.toEpochDay();
  for(var i = pars.firstDate.toEpochDay(); i <= pars.lastDate.toEpochDay(); ++i) {
    var d = LocalDate.ofEpochDay(i);
    if ( i == nextDate ) {
      if( isHireChange(pars)) {
       // writeChangeLineMONAG(pars.wsMONAG, d,pers, pers.hired ? 0 : 1, nextLocation(pars,pers), nextFTE(pars,pers)  , "HC");
        //+
        // ORDER IS CRUCIAL!
        var nl = nextLocation(pars,pers);
        var nf = nextFTE(pars,pers);
        var nESTAT = getNextESTAT(pars,pers,"ESTAT");
        writeChangeLineRANGE(pars.wsRANGE, d, pers, pers.hired ? 0 : 1, nl, nf, nESTAT,  pars, "HC");
        writeChangeLineMONAG(pars.wsMONAG, d, pers, pers.hired ? 0 : 1, nl, nf, nESTAT, pars, "HC");
        nextDate += getNext(pars);
      } else if (isEvent(pars)) {
        var nl = nextLocation(pars, pers);
        // force
        var nf = nextFTE(pars, pers);
        var nESTAT = getNextESTAT(pars,pers,"ESTAT");
        while( !isUnhiredChange(pers,pers.hired, nl,nf, nESTAT)) {
          nl = nextLocation(pars, pers);
          // force
          nf = nextFTE(pars, pers);
        }
        writeChangeLineRANGE(pars.wsRANGE, d, pers, pers.hired, nl, nf, nESTAT, pars, "LC");
        writeChangeLineMONAG(pars.wsMONAG, d, pers, pers.hired, nl, nf, nESTAT, pars, "LC" );
        nextDate += getNext(pars);
      } else if (isEOM(d)) {
          writeStateLineMONAG(pars.wsMONAG, d, pers, pers.hired, pers.location, pers.fte, pars, "EOMe");
      }
    } else if (isEOM(d)) {
      //if( pers.hired > 0 ) {
        if ( !isNoZeroRequested(pars) || !isAllZero(pers)) {
          writeStateLineMONAG(pars.wsMONAG, d, pers, pers.hired, pers.location, pers.fte, pars, "EOM");
        }
      //}
      // else {
        memorizeSOM(d,pers);
      //}
    }
	};
}


var primes  = [];

export function getMaxPrimes(nr: number) : number {
  var max = Math.floor(Math.sqrt(nr)+3);
  var mp = 1;
  var remain = nr;
  for(var i = 1; i <= max; ++i ) {
    if (remain == 1) {
      return mp;
    }
    while(i > 1 &&  (remain % i == 0)) {
      mp = Math.max(mp,i);
      remain = remain/i;
    }
  }
  return remain;
}

export function genUSERHierarchy(nrpers : number ) {
  var ws = getWS( "DIM_USER_" + padZeros(nrpers,6) + ".csv");
  genUSERHierarchyW(ws,nrpers);
  ws.ws.end();
}


//export function cleanseWSInFile(filename1: string, filename2 : string ) {
//  var ln = fs.readFileSync(filename1, { encoding : 'utf-8'});
//  var lnc = ln.replace(/;\s+/g,";");
//  fs.writeFileSync(filename2, lnc)
//}

export function cleanseWSInFile(filename1: string, filename2 : string, done : any ) : any {
  //var ln = fs.readFileSync(filename1, { encoding : 'utf-8'});
  var wsOut = getWS(filename2);
  const liner = new lineByLine(filename1);
  var line = "";
  while( line = liner.next() ){
    if ( line ) {
      wsOut.write( ('' + line).replace(/;\s+/g,";") ).write('\n');
    }
  }
  wsOut.ws.on('finish', () => { done(); });
  wsOut.ws.end();
}

export function genUser(i : number) : string {
  return 'P' + padZeros(i,5);
}

export function genUSERHierarchyW(ws : any, nrpers : number ) {
  // we build a parent child hierarchy  using prime number decomposition,
  // we build a parent child hierarchy  using prime number decomposition,
  // with persons made children of the "lagest prime factor"
  // to not end up with too many roots we only make every n-th prime factor a root.
  //
  //
  var res = {};
  var nrPrimes = 0;
  // 13 - 5 - 2
  for(var i = 1; i <= nrpers; ++i ) {
    var prim = getMaxPrimes(i);
    if( !res[prim]) {
      ++nrPrimes;
      if ( (i > 10) && (nrPrimes % 20 != 15) ) {
        var primPar = getMaxPrimes(Math.floor(i/10));
        res[prim] = primPar;
      } else {
        res[prim] = -1; // a root
      }
    }
    if( i != prim ) {
      res[i] = prim;
    }
  }
  //dump the list
  ws.write("USER;USER_PARENT\n");
  for(var i = 1; i <= nrpers; ++i) {
    ws.write(genUser(i)).write(';');
    if ( res[i] > 0 ) {
      ws.write(genUser(res[i])).write('\n');
    } else {
      ws.write("\n"); //Null!
    }
  }
}

