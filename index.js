var fs = require('fs');
const { exit } = require('process');

var seedrandom = require('seedrandom');

var rnd = seedrandom("first", { global: true });

const MSDAYS = 1000*24*3600;

var NRPERS=2;


var d1 = new Date(2020,1,6);
var d1Idx = (d1 - 0)/MSDAYS;
var d2 = new Date(2024,6,1);
var d2Idx = (d2 - 0)/MSDAYS;
var deltaTime = d2Idx-d1Idx;



var LocationsObj = { "NewYork" : 5,
  "LA" : 5,
  "Chicago" : 5,
  "Berlin" : 2,
  "Frankfurt" : 2,
  "Bangalore" :  2
};

function makeMap(obj) {
  var idx = 0;
  var res = [];
  Object.getOwnPropertyNames(obj).forEach( function(a) {
    for(var i = 0; i < obj[a]; ++i) {
      res.push(a);
    }
  });
  return res;
}

var locations = makeMap(LocationsObj);

var AVG_NEXT = 300;
var LOCCHANGE = 0.5;
var FTECHANGE = 0.5;
var EVENT = 0.7;

var GENPARS = new

console.log(locations);
console.log(locations.length);

var AVG_NEXT = 300;
var LOCCHANGE = 0.5;
var FTECHANGE = 0.5;
var EVENT = 0.7;

function getNext() {
  return Math.random() * AVG_NEXT;
}

function getLocation() {
  return locations[Math.floor(Math.random() * locations.length)];
}

function nextLocation(pers) {
  if( Math.random() < LOCCHANGE) {
    return getLocation();
  }
  return undefined;
}

function nextFTE(pers) {
  if( Math.random() < FTECHANGE) {
    if( pers.fte == 1) {
      return 0.5;
    }
    return 1.0;
  }
  return undefined;
}

function isEevent() {
  return Math.random() < EVENT;
}

function isEOM(dateIdx) {
  var d = new Date(dateIdx + MSDAYS);
  if(d.getDate() == 1)
    return true;
  return false;
}

function isEOQ(dateIdx) {
  var d = new Date(dateIdx + MSDAYS);
  if(d.getDate() == 1 &&  [1,4,7,10].indexOf(d.getMonth()) >= 0)
    return true;
  return false;
}

function isEOY(dateIdx) {
  var d = new Date(dateIdx + MSDAYS);
  if(d.getDate() == 1 && d.getMonth() == 1)
    return true;
  return false;
}



for(var k = 0; k < 35; ++k) {
  var n = new Date(2008,01,02) - 0;
  var j = n + k * MSDAYS;
  var d = new Date( j );
  console.log(d);
  var d2 = new Date( d - 0  + MSDAYS);
  console.log(d2);
//  console.log( ' ' + isEOM(d - 0 ) + ' ' + d.getDate()+ ' ');
}

function writeHead(ws) {
  ws.write("CALMONTHIC;CALMONTHI;CALMONTH;START_DATE;END_DATE;START_DATE_IDX;END_DATE_IDX;ISEOM;ISEOQ;ISEOY;DAYSINMONTH;")
  ws.write("USER;LOCATION;HC;HC_SOM;HC_EOM;DAYSWORKED;FTE;FTE_SOM;FTE_EOM;FTEWORKED;TENURE;TENURE_SOM;TENURE_EOM;AGE;AGE_SOM;AGE_EOM")
}

function writeDay(ws, startIdx, dateIdx) {
  var d = new Date(dateIdx);
  var y = d.getFullYear();
  var m = d.getMonth();
  var cmi = y*100 + m;
  cmic =  (y-2000)*12 + m;
  ws.write('' + cmic + ";" + cmi + ";" + cim + ";");
  ws.write(asDate(startIdx)).write(";");
  ws.write(asDate(d)).write(";");
  ws.write(startIdx+ ";"+ dateIdx + ";");
  ws.write(isEOM(d)).write(";");
  ws.write(isEOQ(d)).write(";");
  ws.write(isEOY(d)).write(";");
  var dim = daysInMonth(d);
  ws.write(dim).write(";");
  return dim;
}

var moment = require('moment');

function diffYears(dateLow, dateHigh) {
  var mL = moment(dateLow);
  var mH = moment(dateHigh);
  return mL.diff(mH,'year');
}

console.log(diffYears(new Date(2001,02,01), new Date(2002,03,01)));
console.log(diffYears(new Date(2001,02,01), new Date(2003,01,31)));
console.log(diffYears(new Date(2001,02,01), new Date(2003,02,01)));

function writeTenure(ws, dsom, now, pers, eom) {
  var tenureNow = diffMonth(pers.lastHired,now);
  ws.write(tenureNow).write(';');
  if( eom) {
    var tenureSOM = diffMonth(pers.lastHired,dsom);
    ws.write(tenureSOM).write(';')
    ws.write(tenureNow).write(';');
  } else {
    ws.write('0;0;')
  }
}

function getSOM(dateIdx) {
  return new Date(dateIdx.getFullYear(),dateIdx.getMonth(),1);
}

function writeAge(ws, now, pers, eom) {
  var ageNow = diffYears(pers.dob,now);
  ws.write(tenureNow).write(';');
  if( eom ) {
    var dsom = getSOM(now);
    var ageSOM = diffMonth(pers.dob,dsom);
    ws.write(ageSOM).write(';')
    ws.write(ageNow).write(';');
  } else {
    ws.write('0;0;')
  }
}


function writeRecord(ws, dateIdx, daysInMonth, pers )
{
  var eom = isEOM(dateIdx);
  ws.write(pers.user).write(';');
  ws.write(pers.location).write(';');
  ws.write(pers.hired).write(';');
  writeTripel(pers.hiredSOM,pers.hired,isEOM(dateIdx));
  writeTripel(pers.fteSOM,pers.fte,isEOM(dateIdx));
  daysInPeriod = (dateIdx - ws.lastWritten)/MSDAYS + 1;
  ws.write(pers.hired * daysInPeriod).write(';'); //DAYSWORKED
  ws.write(pers.hired * pers.fte * daysInPeriod).write(';'); // FTEWORKED
  writeTenure(ws, dateIdx, pers, eom);
  writeAge(ws, dateIdx, pers, eom);

}

function writeStateLine(ws,dateIdx, pers, nextHire, nextLoc, nextFTE) {
  var daysworked = writeDay(ws, pers.prevDate, dateIdx);
  if(nextHire != pers.hired) {
    ws.write("TOODHIRE\n")
  }
  pers.location = nextLoc || pers.location;
  pers.fte = nextFTE || pers.fte;
  pers.lastWritten = dateIdx;
  writeRecord(daysworked,pers);
  ws.write("\n");
}

function genPerson(ws, p) {
	var pers = {
    key : p,
    hired: 1,
    fte : 1,
    dob : new Date(1950+Math.floor(Math.random*55),Math.floor(Math.random()*12),Math.floor(Math.random()*31)),
    location : getLocation(),
    prevDate : d1Idx
  };
  var nextDate = getNext() + d1Idx;
  for(var i = d1Idx; i < d2Idx; ++i) {
    if ( i == nextDate ) {
      if( isHireChange()) {
        writeChangeLine(ws,i,pers, !pers.hired, nextLocation(pers), nextFTE(pers) );
        nextDate += getNext();
      } else if (isEvent()) {
          nl = nextLocation(pers, 10);
          // force
          nf = nextFTE(pers, 10);
        writeChangeLine(ws, i, pers, 0, nl, nf);
        nextDate += getNext();
      } else if (isEOM(i)) {
        if( pers.hired ) {
          writeStateLine(ws, i, pers, 0, 0, 0);
        }
      }
    } else if ( isEOM(i)) {
      if( pers.hired ) {
        writeStateLine(ws, i, pers, 0, 0, 0);
      }
    }
	};
}


var NRPERS=2;
var writeStream = fs.createWriteStream('result.csv');
writeHead(ws);
for(var p = 1; p < NRPERS; ++p) {
  genPerson(writeStream,p);
}

writeStream.on('finish', () => {
  console.log('Wrote data to file');
});
writeStream.end();

