const { isFunctionDeclaration } = require("typescript");

var root = '../js';

var Helpers = require(root + '/helpers.js');
var ParseArgs = require(root + '/parseArgs.js');
var LocalDate = require('@js-joda/core').LocalDate;

var _ = require('lodash');
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
  expect(ws.toString()).toEqual(" 0; 0; 0;");
  done();
}
);
it('testWriteTenureHired', done => {
  var ws = fakeWS();
  Helpers.writeTenure(ws, DATE2021_01_15, {
    hired: 1,
    lastHired : DATE2020_06_01,
     }, false);
  expect(ws.toString()).toEqual(" 7; 0; 0;");
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
  expect(ws.toString()).toEqual(" 0; 0; 0;");
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
  expect(ws.toString()).toEqual("21; 0; 0;");
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
  var rnd = ParseArgs.getSeedRandom("first");
  expect(rnd.random()).toEqual(0.5553384910006973);
  expect(rnd.random()).toEqual(0.023301137453416255);
  expect(rnd.random()).toEqual(0.9234945529300768);
  expect(rnd.otherRandom(1)).toEqual(0.494552930076793);
  expect(rnd.random()).toEqual(0.18968538978539123);
  expect(rnd.otherRandom(3)).toEqual(0.5389785391234909);
  expect(rnd.otherRandom(8)).toEqual(0.853912353515625);
  expect(rnd.otherRandom(2)).toEqual(0.8538978539122581);
  expect(rnd.random()).toEqual(0.5111133580651583);
  done();
}
);

var fs = require('fs');

function writeToFile(filename, ws) {
  fs.writeFileSync(filename, ws.toString(), { encoding : 'utf-8' });
}

function readFromFile(filename) {
  var exp = fs.readFileSync(filename)+ '';
  return exp.replace(/\r\n/g,"\n");
}


var LOCATION_VALUES = { "NewYork" : 5,
  "LA" : 5,
  "Chicago" : 5,
  "Berlin" : 2,
  "Frankfurt" : 2,
  "Bangalore" :  2
};

var ESTAT_VALUES = {
  "A" : 4,
  "U" : 1,
  "P" : 1,
  "S" : 2,
};

var DEFPARS = {
    AVG_NEXT : 150,
    LOCCHANGE : 0.5,
    FTECHANGE : 0.5,
    ESTATCHANGE : 0.8,
    L_EVENT : 0.7,
    L_HIRE : 0.5,
    LOCATIONs : Helpers.makeMap(LOCATION_VALUES),
    ESTATs : Helpers.makeMap(ESTAT_VALUES),
    firstDate : undefined,
    lastDate  : undefined,
    random : ParseArgs.getSeedRandom('abc'),
    randomOD : { "ESTAT" : ParseArgs.getSeedRandom('XZY') },
    REOP_ESTATS :  ["A","U","P"],
    wsMONAG : undefined,
    wsRANGE : undefined
};

function initParsRandom( pars ) {
  var d1 = LocalDate.of(2020,1,6);
  var d1Idx = Helpers.dateToDayIndex(d1);
  var d2 = LocalDate.of(2022,6,1);
  var d2Idx = Helpers.dateToDayIndex(d2);
  pars.firstDate = d1;
  pars.lastDate = d2;
  pars.random = ParseArgs.getSeedRandom('abc');
  pars.randomOD = { "ESTAT" : ParseArgs.getSeedRandom('XZY') }; // we use
}

it('testGenPerson1', done => {
  var wsMONAG = fakeWS();
  var wsRANGE = undefined;


  var pars =   _.cloneDeep(DEFPARS);
  pars.wsMONAG = wsMONAG;
  pars.wsRANGE = wsRANGE;
  initParsRandom(pars);
  Helpers.writeHeader(wsMONAG);
  Helpers.genPerson('P1', pars);
  writeToFile('testData/gp1.monag.csv.tmp',wsMONAG);
  {
    var expMONAG = readFromFile('testData/gp1.monag.csv') + '';
    expect(wsMONAG.toString().replace(/\r\n/g,"\n")).toEqual(expMONAG.replace(/\r\n/g,"\n"));
  }
  done();
}
);

it('testGenPersonB', done => {
  var wsMONAG = fakeWS();
  var wsRANGE = fakeWS();

  var d1 = LocalDate.of(2020,1,6);
  var d1Idx = Helpers.dateToDayIndex(d1);
  var d2 = LocalDate.of(2022,6,1);
  var d2Idx = Helpers.dateToDayIndex(d2);
  var pars = _.clone(DEFPARS);
  initParsRandom(pars);
  pars.wsMONAG = wsMONAG;
  pars.wsRANGE = wsRANGE;
  Helpers.writeHeader( wsMONAG );
  Helpers.writeHeader( wsRANGE );
  Helpers.genPerson( 'P1', pars );
  writeToFile('testData/gp1.monag2.csv.tmp', wsMONAG);
  writeToFile('testData/gp1.range2.csv.tmp', wsRANGE);
  {
    var expMONAG = readFromFile('testData/gp1.monag.csv') + '';
    expect( wsMONAG.toString().replace(/\r\n/g,"\n") ).toEqual( expMONAG.replace(/\r\n/g,"\n") );
  }
  {
    var expRANGE = readFromFile('testData/gp1.range.csv') + '';
    expect( wsRANGE.toString().replace(/\r\n/g,"\n") ).toEqual( expRANGE.replace(/\r\n/g,"\n") );
  }
  done();
}
);

it('testGenPersonStopNZ', done => {
  var wsMONAG = fakeWS();
  var wsRANGE = fakeWS();
  var pars = _.cloneDeep(DEFPARS);
  initParsRandom(pars);
  pars.optsMONAG = {
    noZero : true,
    stopRecords : true
  };
  pars.wsMONAG = wsMONAG;
  pars.wsRANGE = wsRANGE;
  Helpers.writeHeader(wsMONAG);
  if ( pars.wsRANGE ) {
    Helpers.writeHeader(wsRANGE);
  }
  Helpers.genPerson('P1', pars);
  writeToFile('testData/gp1.monagNZS.csv.tmp',wsMONAG);
  writeToFile('testData/gp1.range.csv.tmp',wsRANGE);
  {
    var expMONAG = readFromFile('testData/gp1.monagNZS.csv') + '';
    expect(wsMONAG.toString().replace(/\r\n/g,"\n")).toEqual(expMONAG.replace(/\r\n/g,"\n"));
  }
  {
    var expRANGE = readFromFile('testData/gp1.range.csv') + '';
    expect(wsRANGE.toString().replace(/\r\n/g,"\n")).toEqual(expRANGE.replace(/\r\n/g,"\n"));
  }
  done();
});

it('testGetMaxPrim', done => {
  expect(Helpers.getMaxPrimes(1)).toEqual(1);
  expect(Helpers.getMaxPrimes(2)).toEqual(2);
  expect(Helpers.getMaxPrimes(12)).toEqual(3);
  expect(Helpers.getMaxPrimes(7)).toEqual(7);
  expect(Helpers.getMaxPrimes(14)).toEqual(7);
  done();
});

it('testGenHierarchy', done => {
  var ws = fakeWS();
  Helpers.genUSERHierarchyW(ws,15);
  writeToFile('testData/dim_user_15.csv.tmp',ws);
  {
    var expDim = readFromFile('testData/dim_user_15.csv') + '';
    expect(ws.toString().replace(/\r\n/g,"\n")).toEqual(expDim);
  }
  done();
}
);

it('testGenHierarchy', done => {
  var ws = fakeWS();
  Helpers.genUSERHierarchyW(ws,32);
  writeToFile('testData/dim_user_32.csv.tmp',ws);
  {
    var expDim = readFromFile('testData/dim_user_32.csv') + '';
    expect(ws.toString().replace(/\r\n/g,"\n")).toEqual(expDim);
  }
  done();
}
);

it('testWSWrap', done => {
  var u = Helpers.getWS('testData/xx.tmp');
  u.write('0; 0; 000; 123; "  ";0;');
  u.ws.on('finish', () => {
    Helpers.cleanseWSCommentsRepeatedHeaderInFile('testData/xx.tmp', 'testData/cleansed.S.csv.tmp', function() {
      {
        var expDim = readFromFile('testData/cleansed.S.csv') + '';
        var actDim = readFromFile('testData/cleansed.S.csv.tmp') + '';
        expect(actDim.replace(/\r\n/g,"\n")).toEqual(expDim);
      }
      done();
    });
  });
  u.ws.end();
}
);


it('testCleanseESTBUN', done => {
  Helpers.cleanseWSCommentsRepeatedHeaderInFile('input/MONAG_SAMPLE_EASTBU.S.csv', 'input/MONAG_SAMPLE_EASTBU.S.C.csv', function() {
    done();
  });
}
);

it('testCleanseASANTA', done => {
  Helpers.cleanseWSCommentsRepeatedHeaderInFile('input/MONAG_SAMPLE_ASANTA.S.csv', 'input/MONAG_SAMPLE_ASTANTA.S.C.csv', function() {
      done();
  });
}
);

it('testCleanseA1', done => {
  Helpers.cleanseWSCommentsRepeatedHeaderInFile('input/MONAG_SAMPLE_A1.S.csv', 'input/MONAG_SAMPLE_A1.S.C.csv', function() {
    done();
  });
}
);

it('testCleanseJBAKER', done => {
  Helpers.cleanseWSCommentsRepeatedHeaderInFile('input/MONAG_SAMPLE_JBAKER.S.csv', 'input/MONAG_SAMPLE_JBAKER.S.C.csv', function() {
      done();
  });
}
);

it('testCleanseTWALKER', done => {
  Helpers.cleanseWSCommentsRepeatedHeaderInFile('input/MONAG_SAMPLE_TWALKE.S.csv', 'input/MONAG_SAMPLE_TWALKE.C.csv', function() {
      done();
  });
}
);

it('testParseArgs', done => {
  expect(ParseArgs.parseArguments('-n 3 -s -u')).toEqual( { nrpersons: 3, period : 150, stopRecords : true, userHierarchy : true, zero : false, addSamples: false } );
  expect(ParseArgs.parseArguments('-n 34 --zero --period 413')).toEqual( { nrpersons: 34, period : 413, stopRecords : false, userHierarchy : false, zero : true, addSamples: false } );
  done();
}
);

it('testGetOutputParams', done => {
  var o = ParseArgs.getOutputParams( { nrpersons: 3, period: 222, zero: true, stopRecords : true} );
  expect(o.FILENAME_MONAG).toEqual("MONAG_0222_000003.Z.S.csv");
  done();
}
);

it('testGetParams1', done => {
  var o = ParseArgs.GetParams1( { nrpersons: 4, period : 222, nozero: true, stopRecords : true} );
  expect(o.NRPERS).toEqual(4);
  expect(o.optsMONAG.stopRecords).toEqual(true);
  expect(o.optsMONAG.noZero).toEqual(true);
  done();
});

it('testGetParams1', done => {
  ParseArgs.dumpUserHierarchyIfRequested( { nrpersons: 4, period : 222, nozero: true, stopRecords : true} );
  ParseArgs.dumpUserHierarchyIfRequested( { nrpersons: 100, period : 222, nozero: true, stopRecords : true, userHierarchy : true } );
  done();
});

it('testRunFile', done => {
  /*
  export class OutputParams {
    NRPERS : string;
    AVG_NEXT : number;
    FILENAME_MONAG : string;
    FILENAME_MONAG_C : string;
    FILENAME_RANGE : string;
    FILENAME_RANGE_C : string;
    NOZERO : boolean;
    STOPRECORDs: boolean;
  } */
  var p  = ParseArgs.GetParams1( { nrpersons: 4, period : 222, nozero: true, stopRecords : true} );
  var o = {
    NRPERS : p.NRPERS,
    AVG_NEXT : 222,
    FILENAME_MONAG : 'testData/M1.csv.tmp',
    FILENAME_MONAG_C : 'testData/M1.csv.tmp',
    FILENAME_RANGE : 'testData/R1.csv.tmp',
    FILENAME_RANGE_C : 'testData/R1.csv.C.tmp'
  };
  ParseArgs.GeneratePersons( p, o );
  done();
}
);