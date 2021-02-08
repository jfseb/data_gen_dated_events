const { isFunctionDeclaration } = require("typescript");

var root = '../js';

var Helpers = require(root + '/helpers.js');
var LocalDate = require('@js-joda/core').LocalDate;

var seedrandom = require('seedrandom');

function fakeWS() {
  class Obj  {
   constructor()
   {
     this.s = '';
   }
   write(a) {
     this.s += '' + a;
     return this;
    }
    toString() {
      return ''+ this.s;
    }
  };
  return new Obj();
}

const DATE2020_06_01 = (LocalDate.of(2020,6,1));
const DATE2020_01_01 = (LocalDate.of(2020,1,1));
const DATE2020_01_15 = (LocalDate.of(2020,1,15));
const DATE2020_01_31 = (LocalDate.of(2020,1,31));
const DATE2020_02_01 = (LocalDate.of(2020,2,1));
const DATE2020_03_01 = (LocalDate.of(2020,3,1));
const DATE2021_01_01 = (LocalDate.of(2021,1,1));
const DATE2021_02_01 = (LocalDate.of(2021,2,1));
const DATE2021_01_15 = (LocalDate.of(2021,1,15));
const DATE2021_01_31 = (LocalDate.of(2021,1,31));

it('testWriteEOM', done => {
  expect(Helpers.diffMonth(DATE2020_01_01, DATE2021_02_01)).toEqual(13);
  var ws = fakeWS();
  Helpers.writeTenure(ws,DATE2020_01_31, {
    hired : true,
    lastHired : LocalDate.of(2010,1,1)
  });
  expect(ws.toString()).toEqual('120;120;120;');
  done();
}
);

var LocationsObj = { "NewYork" : 5,
  "LA" : 5,
  "Chicago" : 5,
  "Berlin" : 2,
  "Frankfurt" : 2,
  "Bangalore" :  2
};

it('testMakeMap', done => {
  var ws = fakeWS();
  var r = Helpers.makeMap(LocationsObj);
  expect(r.length).toEqual(21);
  done();
}
);

it('testEOMONTH', done => {
  expect(Helpers.asDate(Helpers.EOMONTH(DATE2020_01_01))).toEqual("2020-01-31");
  done();
}
);


it('testDayToDayIndex', done => {
  expect(LocalDate.parse("2020-01-01").toEpochDay() + Helpers.EXCELOFFSET).toEqual(43831);
  expect(Helpers.dateToDayIndex(LocalDate.parse("2020-01-01"))).toEqual(43831);
  done();
}
);

it('testWriteTenure', done => {
  var ws = fakeWS();
  Helpers.writeTenure(ws, DATE2021_01_15, {
    lastHired : DATE2020_06_01,
     }, false);
  expect(ws.toString()).toEqual("0;0;0;");
  done();
}
);
it('testWriteTenureHired', done => {
  var ws = fakeWS();
  Helpers.writeTenure(ws, DATE2021_01_15, {
    hired: 1,
    lastHired : DATE2020_06_01,
     }, false);
  expect(ws.toString()).toEqual("7;0;0;");
  done();
}
);

it('testasDate', done => {
  expect(Helpers.asDate(DATE2021_01_01)).toEqual('2021-01-01');
  expect('' + DATE2021_01_01).toEqual('2021-01-01');
  done();
}
);

it('testWriteAge', done => {
  var ws = fakeWS();
  Helpers.writeAge(ws, DATE2021_01_15, {
    dob : LocalDate.of(2000,1,1),
    hired : 0,
    lastHired : DATE2020_06_01,
     }, false);
  expect(ws.toString()).toEqual("0;0;0;");
  done();
}
);

it('testWriteAgeHired', done => {
  var ws = fakeWS();
  Helpers.writeAge(ws, DATE2021_01_15, {
    dob : LocalDate.of(2000,1,1),
    hired : 1,
    lastHired : DATE2020_06_01,
     }, false);
  expect(ws.toString()).toEqual("21;0;0;");
  done();
}
);

it('testWriteAge2', done => {
  var ws = fakeWS();
  Helpers.writeAge(ws, LocalDate.of(2020,1,31), {
    hired : 1,
    dob : LocalDate.of(2000,1,15)
     }, true);
  expect(ws.toString()).toEqual("20;19;20;");
  done();
}
);

it('isEOQ', done => {
  expect(Helpers.isEOQ(LocalDate.of(2000,3,31))).toEqual(true);
  expect(Helpers.isEOQ(LocalDate.of(2000,12,31))).toEqual(true);
  expect(Helpers.isEOQ(LocalDate.of(2000,6,30))).toEqual(true);
  expect(Helpers.isEOQ(LocalDate.of(2000,9,30))).toEqual(true);
  expect(Helpers.isEOQ(LocalDate.of(2000,9,29))).toEqual(false);
  expect(Helpers.isEOQ(LocalDate.of(2000,2,29))).toEqual(false);
  expect(Helpers.isEOQ(LocalDate.of(2000,1,1))).toEqual(false);
  done();
}
);


it('mutate', done => {
  var d= LocalDate.of(2001,3,15);
  expect(''+ d).toEqual("2001-03-15");
  var d2 = d.withDayOfMonth(1);
  expect(''+ d2).toEqual("2001-03-01");
  expect(''+ d).toEqual("2001-03-15");
  done();
}
);


it('testDiffYears', done => {
  expect(Helpers.diffYears(DATE2020_01_01, DATE2021_02_01)).toEqual(1);
  expect(Helpers.diffYears(DATE2020_01_15, DATE2021_02_01)).toEqual(1);
  expect(Helpers.diffYears(DATE2020_02_01, DATE2021_02_01)).toEqual(1);
  expect(Helpers.diffYears(DATE2020_03_01, DATE2021_02_01)).toEqual(0);
  expect(Helpers.diffYears(DATE2021_02_01, DATE2020_01_01)).toEqual(-1);
  expect(Helpers.diffYears(DATE2021_02_01, DATE2020_01_15)).toEqual(-1);
  expect(Helpers.diffYears(DATE2021_02_01, DATE2020_02_01)).toEqual(-1);
  expect(Helpers.diffYears(DATE2021_02_01, DATE2020_03_01)).toEqual(0);
  done();
}
);

it('testDaysInMonth', done => {
  expect(Helpers.daysInMonth(DATE2020_01_01)).toEqual(31);
  done();
}
);



it('testSeedRND', done => {
  var rnd = seedrandom("first");
  expect(rnd()).toEqual(0.5553384910006973);
  expect(rnd()).toEqual(0.023301137453416255);
  done();
}
);

var fs = require('fs');

it('testGenPerson', done => {
  var ws = fakeWS();

  var LocationsObj = { "NewYork" : 5,
  "LA" : 5,
  "Chicago" : 5,
  "Berlin" : 2,
  "Frankfurt" : 2,
  "Bangalore" :  2
  };

  var d1 = LocalDate.of(2020,1,6);
  var d1Idx = Helpers.dateToDayIndex(d1);
  var d2 = LocalDate.of(2022,6,1);
  var d2Idx = Helpers.dateToDayIndex(d2);
  var pars = {
    AVG_NEXT : 150,
    LOCCHANGE : 0.5,
    FTECHANGE : 0.5,
    L_EVENT : 0.7,
    L_HIRE : 0.5,
    locations : Helpers.makeMap(LocationsObj),
    firstDate : d1,
    lastDate  : d2,
    random : seedrandom('abc')
  };
  Helpers.writeHeader(ws);
  Helpers.genPerson(ws,'P1', pars);
  fs.writeFileSync('testData/gp1.csv.tmp',ws.toString(), { encoding : 'utf-8' });
  var exp = fs.readFileSync('testData/gp1.csv') + '';
  expect(ws.toString().replace(/\r\n/g,"\n")).toEqual(exp.replace(/\r\n/g,"\n"));

  done();
}
);

