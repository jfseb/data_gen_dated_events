import * as fs from 'fs';
import * as Helpers from './helpers';

const { exit } = require('process');

import {LocalDate } from  "@js-joda/core";

import * as seedrandom from 'seedrandom';

var rnd = seedrandom("first", { global: true });

var NRPERS=2;


var d1 = LocalDate.of(2020,1,6);
var d1Idx = Helpers.dateToDayIndex(d1);
var d2 = LocalDate.of(2024,6,1);
var d2Idx = Helpers.dateToDayIndex(d2);
var deltaTime = d2Idx-d1Idx;

var LocationsObj = { "NewYork" : 5,
  "LA" : 5,
  "Chicago" : 5,
  "Berlin" : 2,
  "Frankfurt" : 2,
  "Bangalore" :  2,
  "SFO" : 1
};

var pars = {
 AVG_NEXT : 300,
 LOCCHANGE : 0.5,
 FTECHANGE : 0.5,
 L_EVENT : 0.7,
 L_HIRE : 0.5,
 locations : Helpers.makeMap(LocationsObj),
 firstDate : d1,
 lastDate  : d2,
 random : seedrandom('next')
} as Helpers.GenParams;

var NRPERS=2;
var writeStream = fs.createWriteStream('result.csv');
Helpers.writeHeader(writeStream);
for(var p = 1; p < NRPERS; ++p) {
  Helpers.genPerson(writeStream, p, pars);
}

writeStream.on('finish', () => {
  console.log('Wrote data to file');
});
writeStream.end();

