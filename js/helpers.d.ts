export declare const EXCELOFFSET = 25569;
import { LocalDate } from "@js-joda/core";
export declare function dateToDayIndex(d: LocalDate): number;
export declare function makeMap(obj: any): any[];
export declare class WSWrap2 {
    ws: any;
    _log: any;
    _onFinish: any;
    constructor(fn: string);
    on(s: string, fn: any): void;
    end(): void;
    write(a: any): this;
}
export declare function getWS(filename: string): WSWrap2;
export declare class OptsMONAG {
    noZero: boolean;
    stopRecords: boolean;
}
export declare class GenParams {
    NRPERS: number;
    AVG_NEXT: number;
    LOCCHANGE: number;
    FTECHANGE: number;
    ESTATCHANGE: number;
    L_HIRE: number;
    L_EVENT: number;
    LOCATIONs: string[];
    ESTATs: string[];
    firstDate: LocalDate;
    lastDate: LocalDate;
    random: any;
    wsMONAG: any;
    optsMONAG?: OptsMONAG;
    wsRANGE: any;
    optsRANGE: any;
    randomOD: any;
    REOP_ESTATS: string[];
}
export declare class Person {
    user: string;
    dob: LocalDate;
    location: string;
    hired: number;
    hiredSOM: number;
    hiredPrev: number;
    fte: number;
    ftePrev: number;
    fteSOM: number;
    ESTAT: string;
    ESTATPrev: string;
    ESTATSOM: string;
    lastHired: LocalDate;
    prevDateEnd: LocalDate;
    prevRangeEnd: LocalDate;
}
export declare function copyDate(d: LocalDate): LocalDate;
export declare function isEOQ(d: LocalDate): boolean;
export declare function isEOY(d: LocalDate): boolean;
export declare function padZeros(a: any, len: number): string;
export declare function padSpace(a: any, len: number): string;
export declare function padSpaceQ(a: any, len: number): string;
export declare function asDate(dateIdx: LocalDate): string;
export declare function EOMONTH(d: LocalDate): LocalDate;
export declare function daysInMonth(dateIdx: LocalDate): number;
export declare function writeHeader(ws: any): void;
export declare function makeQuarter(d: LocalDate): string;
export declare function writeDay(ws: any, prevDateEnd: LocalDate, dateIdx: LocalDate): number;
export declare function diffYears(dateLow: LocalDate, dateHigh: LocalDate): number;
export declare function diffMonth(dateLow: LocalDate, dateHigh: LocalDate): number;
export declare function writeTENUREAGE(pers: Person): boolean;
export declare function writeTenure(ws: any, now: LocalDate, pers: Person, eom: any): void;
export declare function getSOM(dateIdx: LocalDate): LocalDate;
export declare function writeAge(ws: any, now: LocalDate, pers: any, eom: boolean): void;
export declare function writeTripel(ws: any, vsom: any, vnow: any, eom: boolean): void;
export declare function toDec1(n: number): string;
export declare function memorizeSOM(dateIdx: LocalDate, pers: Person): void;
/**
 * This function does mutate pers, use a clone if not desired!
 * @param ws
 * @param dateIdx
 * @param pers
 * @param comment
 */
export declare function writeRecord(ws: any, dateIdx: LocalDate, pers: Person, pars: GenParams, comment: string): void;
/**
 * This function does mutate pers, use a clone if not desired!
 * @param ws
 * @param dateIdx
 * @param pers
 * @param comment
 */
export declare function writeRecord0(ws: any, dateIdx: LocalDate, pers: Person, comment: string): void;
export declare function isHireChange(pars: GenParams): boolean;
export declare function genPerson(p: any, pars: GenParams): void;
export declare function getMaxPrimes(nr: number): number;
export declare function genUSERHierarchy(nrpers: number): void;
export declare function cleanseWSInFile(filename1: string, filename2: string, done: any): any;
export declare function genUser(i: number): string;
export declare function genUSERHierarchyW(ws: any, nrpers: number): void;
