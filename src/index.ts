import * as fs from 'fs';
import * as Helpers from './helpers';

const { exit } = require('process');

import { ArgumentParser } from 'argparse';
const { version } = require('../package.json');

import {LocalDate } from  "@js-joda/core";

import * as seedrandom from 'seedrandom';

const parser = new ArgumentParser( {
  description: "date_gen_dated_events, generate HR data"
});


parser.add_argument('-v', '--version', { action: 'version', version });
parser.add_argument('-n', '--nrpersons', { action : 'store', help: 'Number of persons' , default: 2 });
parser.add_argument('-z', '--zero', { action: 'store_true',  help: 'write zero lines ( one record each month) .Z. ' });
parser.add_argument('-s', '--stopRecords', { action: 'store_true', help: 'write stop records, default extension .S. ' });
parser.add_argument('-o', '--output', { action : 'store', help: 'output prefix, default MONAG_<nrpers>.Z.csv , RANGE_<nrpers>.xx' });
parser.add_argument('-p', '--period', { action: 'store', default : 150,  help: 'Event period write zero lines ( one reacord each month) .Z. ' });
parser.add_argument('-u', '--userHierarchy', { action: 'store_true', help: 'generate hierarchy for nrpersons (DIM_USER_<xxxx>.csv) ' });

var args = parser.parse_args();

console.log(args);
console.log(JSON.stringify(args));
var NRPERS= args.nrpersons;

var BASEFILENAME = args.output || '';
if ( BASEFILENAME.length && !BASEFILENAME.endsWith('_')) {
  BASEFILENAME += '_';
}

var AVG_NEXT = args.period;

var SUFFIX = Helpers.padZeros(AVG_NEXT,4) + '_'  + Helpers.padZeros(NRPERS,6)

var NOZERO = !args.zero;
var STOPRECORDs = args.stopRecords;

var ext = "." + (NOZERO ? "" :  "Z.")  +   (STOPRECORDs ? "S." : "") + "csv";
var extc = "." + (NOZERO ? "" :  "Z.")  +   (STOPRECORDs ? "S." : "") + "C.csv";

var FILENAME_MONAG = BASEFILENAME + "MONAG_" +  SUFFIX +  ext;
var FILENAME_MONAG_C = BASEFILENAME + "MONAG_" +  SUFFIX +  extc;
var FILENAME_RANGE = BASEFILENAME + "RANGE_" +  SUFFIX +  ext;
var FILENAME_RANGE_C = BASEFILENAME + "RANGE_" +  SUFFIX +  extc;



if ( args.userHierarchy ) {
  Helpers.genUSERHierarchy(NRPERS);
}

var d1 = LocalDate.of(2020,1,6);
var d1Idx = Helpers.dateToDayIndex(d1);
var d2 = LocalDate.of(2024,6,1);
var d2Idx = Helpers.dateToDayIndex(d2);
var deltaTime = d2Idx-d1Idx;

var LOCATION_VALUES = { "NewYork" : 5,
  "LA" : 5,
  "Chicago" : 5,
  "Berlin" : 2,
  "Frankfurt" : 2,
  "Bangalore" :  2,
  "SFO" : 1
};

var ESTAT_VALUES = {
  "A" : 4,
  "U" : 1,
  "P" : 1,
  "S" : 2,
};
console.log(args);


var pars = {
 AVG_NEXT : 150,
 LOCCHANGE : 0.5,
 FTECHANGE : 0.5,
 ESTATCHANGE : 0.8,
 L_EVENT : 0.7,
 L_HIRE : 0.5,
 LOCATIONs : Helpers.makeMap(LOCATION_VALUES),
 ESTATs : Helpers.makeMap(ESTAT_VALUES),
 firstDate : d1,
 lastDate  : d2,
 random : seedrandom('abc'),
 randomOD : { "ESTAT" : seedrandom('XZY') },
 REOP_ESTATS :  ["A","U","P"],
 wsMONAG : undefined,
 wsRANGE : undefined,
 optsMONAG : {
  noZero : NOZERO,
  stopRecords : STOPRECORDs
}
} as Helpers.GenParams;


pars.wsMONAG = Helpers.getWS(FILENAME_MONAG);
pars.wsRANGE = Helpers.getWS(FILENAME_RANGE);
Helpers.writeHeader(pars.wsMONAG);
Helpers.writeHeader(pars.wsRANGE);
for(var p = 1; p < NRPERS; ++p) {
  var pn = Helpers.genUser(p);
  Helpers.genPerson(pn, pars);
}

pars.wsMONAG.ws.on('finish', () => {
  console.log('Wrote data to file ' + FILENAME_MONAG );
  Helpers.cleanseWSInFile(FILENAME_MONAG, FILENAME_MONAG_C, function() {
    console.log('Wrote cleansed file to ' + FILENAME_MONAG_C );
  });
});
pars.wsRANGE.ws.on('finish', () => {
  console.log('Wrote data to file ' + FILENAME_RANGE );
  Helpers.cleanseWSInFile(FILENAME_RANGE, FILENAME_RANGE_C, function() {
    console.log('Wrote cleansed file to ' + FILENAME_RANGE_C );
  });
});

pars.wsMONAG.ws.end();
pars.wsRANGE.ws.end();

