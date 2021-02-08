var fs = require('fs');
const { exit } = require('process');

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

//console.log(locations);
//console.log(locations.length);


export class GenParams {
  AVG_NEXT : number;
  LOCCHANGE : number;
  FTECHANGE: number;
  L_HIRE : number;
  L_EVENT : number;
  locations: string[];
  firstDate : LocalDate;
  lastDate : LocalDate;
  random : any;
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
  // changing
  lastHired: LocalDate;
  lastRecorded: LocalDate;
  prevDateEnd : LocalDate;
}

function getNext(pars:GenParams) {
  return Math.floor(pars.random() * pars.AVG_NEXT) + 1;
}

function getLocation(pars: GenParams) {
  return pars.locations[Math.floor(pars.random() * pars.locations.length)];
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

export function pad(a : any, len : number) {
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
  ws.write("CALMONTHIC;CALMONTHI;CALMONTH;CALMONTHS;START_DATE_IDX;END_DATE_IDX;ISEOM;ISEOQ;ISEOY;DAYSINMONTH;START_DATE;END_DATE;")
  ws.write("USER;LOCATION;HC;HC_SOM;HC_EOM;DAYSWORKED;FTE;FTE_SOM;FTE_EOM;FTEWORKED;TENURE;TENURE_SOM;TENURE_EOM;AGE;AGE_SOM;AGE_EOM;X\n")
}

export function writeDay(ws, prevDateEnd:LocalDate, dateIdx : LocalDate) {
  var startIdx = copyDate(prevDateEnd).plusDays(1);
  var d = dateIdx;
  var y = d.year();
  var m = d.monthValue();
  var cmi = y*100 + m;
  var cmic =  (y-2000)*12 + m;
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
//console.log(diffYears(new Date(2001,2,1), new Date(2002,3,1)));
//console.log(diffYears(new Date(2001,2,1), new Date(2003,1,31)));
//console.log(diffYears(new Date(2001,2,1), new Date(2003,2,1)));

export function writeTenure(ws, now: LocalDate, pers: Person, eom) {
  if ( !writeTENUREAGE(pers) ) {
    ws.write('0;0;0;');
    return;
  }
  var tenureNow = diffMonth(pers.lastHired,now);
  ws.write(tenureNow).write(';');
  if( isEOM(now)) {
    var dsom = getSOM(now);
    var tenureSOM = diffMonth(pers.lastHired,dsom);
    ws.write(tenureSOM).write(';')
    ws.write(tenureNow).write(';');
  } else {
    ws.write('0;0;')
  }
}

export function getSOM(dateIdx : LocalDate)  : LocalDate {
  return dateIdx.withDayOfMonth(1);
}

export function writeAge(ws, now : LocalDate, pers, eom: boolean) {
  if ( !writeTENUREAGE(pers) ) {
    ws.write('0;0;0;');
    return;
  }
  var ageNow = diffYears(pers.dob,now);
  ws.write(ageNow).write(';');
  if( isEOM(now) ) {
    var dsom = getSOM(now);
    var ageSOM = diffYears(pers.dob,dsom);
    ws.write(ageSOM).write(';')
    ws.write(ageNow).write(';');
  } else {
    ws.write('0;0;')
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

export function memorizeSOM(eom : boolean,pers : Person) {
  if (eom) {
    pers.fteSOM = pers.hired * pers.fte;
    pers.hiredSOM = pers.hired;
  }
}

export function writeRecord(ws, dateIdx : LocalDate, pers : Person, comment: string )
{
  var startIdx = copyDate(pers.prevDateEnd).plusDays(1);
  var eom = isEOM(dateIdx);
  ws.write(padSpaceQ(pers.user,5)).write(';');
  ws.write(padSpaceQ(pers.location,20)).write(';');
  writeTripel(ws, pers.hiredSOM ? "1.0": "0.0" ,pers.hired ? "1.0": "0.0",isEOM(dateIdx));
  var daysInPeriod = startIdx.until(dateIdx).days() + 1;
  ws.write(padSpace(pers.hiredPrev * daysInPeriod,2)).write(';'); //DAYSWORKED
  writeTripel(ws, toDec1(pers.fteSOM),toDec1(pers.hired * pers.fte),isEOM(dateIdx));
  ws.write(padSpace(pers.hiredPrev * pers.ftePrev * daysInPeriod,4)).write(';'); // FTEWORKED
  writeTenure(ws, dateIdx, pers, eom);
  writeAge(ws, dateIdx, pers, eom);
  pers.hiredPrev = pers.hired;
  pers.ftePrev = pers.fte;
  memorizeSOM(eom,pers);
  pers.prevDateEnd = dateIdx;
  ws.write(comment + "\n");
}

function writeStateLine(ws,dateIdx : LocalDate, pers, nextHire, nextLoc, nextFTE, comment:string) {
  writeDay(ws, pers.prevDateEnd, dateIdx);
  pers.location = nextLoc || pers.location;
  pers.fte = nextFTE || pers.fte;
  pers.lastWritten = dateIdx;
  writeRecord(ws, dateIdx, pers, "st" + comment);
  if(nextHire != pers.hired) {
    ws.write("NEVER\n")
  }
}



function isUnhiredChange(pers: Person, nextHire, nextLoc, nextFTE) {
  return  (nextHire != pers.hired)
       || ( nextLoc != pers.location )
       || ( nextFTE != pers.fte );
}


function isAChange(pers: Person, nextHire, nextLoc, nextFTE) {
  return  (nextHire != pers.hired)
       || (pers.hired && nextLoc != pers.location )
       || (pers.hired && nextFTE != pers.fte );
}

function isHIRE( pers: Person , nextHire ) {
  return pers.hired == 0 && nextHire == 1;
}
function isTERM( pers: Person , nextHire ) {
  return pers.hired == 1 && nextHire == 0;
}

// there is a change @date , new values are to the right;
function writeChangeLine(ws,dateIdx : LocalDate, pers, nextHire, nextLoc, nextFTE, comment:string) {
  var isChange = isAChange(pers,nextHire,nextLoc,nextFTE);
  if ( !isChange && !isEOM(dateIdx)) {
    pers.location = nextLoc;
    pers.nextFTE = nextFTE;
    return;
  }
  var isterm = isTERM(pers, nextHire);
  if ( isterm ) {
    // close previous record
    if (dateIdx.dayOfMonth() != 1) { // unless we already closed it by a month record
      var dmin1 = copyDate(dateIdx).minusDays(1);
      writeDay(ws, pers.prevDateEnd, dmin1);
      writeRecord(ws, dmin1, pers, "termclose-1" +  dateIdx + ' ' + comment);
    }
    pers.hired = 0;
    pers.hiredPrev = 0;
    pers.lastTerm = dateIdx;
  } else if ( isHIRE(pers,nextHire)) {
    pers.lastHired = dateIdx;
    pers.prevDateEnd = copyDate(dateIdx).minusDays(1);
    // do nothing, will be captured next
  } else {
    // close previous record
    if ( dateIdx.dayOfMonth() != 1) {
      // unless we already closed it by a month record
      var dmin1 = copyDate(dateIdx).minusDays(1);
      writeDay(ws, pers.prevDateEnd, dmin1);
      writeRecord(ws, dmin1, pers , "perclose-1 from " + dateIdx + ' '+  comment);
    }
  }
  pers.hired = nextHire;
  pers.location = nextLoc;
  pers.fte = nextFTE;
  if (isEOM(dateIdx)) {
    // later suppress unles lastTerm within range
    writeStateLine(ws,dateIdx,pers, pers.hired, pers.location, pers.fte, "WCL");
  }
}

/////////////////// percentages

export function isHireChange(pars : GenParams) : boolean {
  return pars.random() < pars.L_HIRE;
}

export function genPerson(ws, p, pars: GenParams) {
	var pers = {
    user : p,
    hired: 0,
    hiredPrev : 0,
    fte : 1,
    ftePrev : 0,
    dob : LocalDate.of(1950+Math.floor(pars.random()*55),Math.floor(pars.random()*12),Math.floor(pars.random()*31)),
    location : getLocation(pars),
    prevDateEnd : pars.firstDate,
    hiredSOM : 0,
    lastHired : pars.firstDate,
    lastRecorded : pars.firstDate,
    fteSOM : 0
  } as Person;
  var nextDate = getNext(pars) + pars.firstDate.toEpochDay();
  for(var i = pars.firstDate.toEpochDay(); i <= pars.lastDate.toEpochDay(); ++i) {
    var d = LocalDate.ofEpochDay(i);
    if ( i == nextDate ) {
      if( isHireChange(pars)) {
        writeChangeLine(ws,d,pers, pers.hired ? 0 : 1, nextLocation(pars,pers), nextFTE(pars,pers)  , "HC");
        nextDate += getNext(pars);
      } else if (isEvent(pars)) {
        var nl = nextLocation(pars, pers);
        // force
        var nf = nextFTE(pars, pers);
        while( !isUnhiredChange(pers,pers.hired, nl,nf)) {
          nl = nextLocation(pars, pers);
          // force
          nf = nextFTE(pars, pers);
        }
        writeChangeLine(ws, d, pers, pers.hired, nl, nf, "LC" );
        nextDate += getNext(pars);
      } else if (isEOM(d)) {
          writeStateLine(ws, d, pers, pers.hired, pers.location, pers.fte, "EOMe");
      }
    } else if (isEOM(d)) {
      //if( pers.hired > 0 ) {
        writeStateLine(ws, d, pers, pers.hired, pers.location, pers.fte, "EOM");
      //}
      // lese {
        memorizeSOM(true,pers);
      //}
    }
	};
}
