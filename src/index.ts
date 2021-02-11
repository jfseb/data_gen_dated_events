import * as ParseArgs from './parseArgs';

var args = ParseArgs.parseArguments(undefined);
var o = ParseArgs.getOutputParams( args );
var pars  = ParseArgs.GetParams1( args );

ParseArgs.dumpUserHierarchyIfRequested( args );

ParseArgs.GeneratePersons( pars, o );
