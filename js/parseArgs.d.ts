import * as Helpers from './helpers';
export declare function getInputSamples(): string[];
export declare class ParsedArgs {
    nrpersons: number;
    zero: boolean;
    stopRecords: boolean;
    startRecords: boolean;
    addInputSamples: boolean;
    output: string;
    period: number;
    userHierarchy: boolean;
}
export declare function parseArguments(explicitArgs: string): ParsedArgs;
export declare class OutputParams {
    NRPERS: string;
    AVG_NEXT: number;
    FILENAME_MONAG: string;
    FILENAME_MONAG_C: string;
    samplesMONAG: string[];
    FILENAME_RANGE: string;
    FILENAME_RANGE_C: string;
    samplesRANGE: string[];
    NOZERO: boolean;
    STOPRECORDs: boolean;
}
export declare function getOutputParams(args: ParsedArgs): OutputParams;
export declare function dumpUserHierarchyIfRequested(args: ParsedArgs): void;
export declare class SeedRandomWrap {
    sr: any;
    _last: number;
    constructor(s: string);
    random(): number;
    otherRandom(i: number): number;
}
export declare function getSeedRandom(s: string): SeedRandomWrap;
export declare function GetParams1(args: ParsedArgs): Helpers.GenParams;
export declare function GeneratePersons(pars: Helpers.GenParams, o: OutputParams): void;
