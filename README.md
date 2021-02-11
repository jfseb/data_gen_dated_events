# data_gen_dated_events [![Build Status](https://www.travis-ci.com/jfseb/data_gen_dated_events.svg?branch=main)](https://www.travis-ci.com/jfseb/data_gen_dated_events.svg?branch=main)[![Coverage Status](https://coveralls.io/repos/github/jfseb/data_gen_dated_events/badge.svg?branch=main)](https://coveralls.io/github/jfseb/data_gen_dated_events?branch=main)



Sample Data Generator for date events, e.g. HR Data

This currently generates a sparse "hired values only" data with just two dimensions User, Location, FTE and a set of aggregates and hire state toggled (on off)

- date ranged [from,to],
- at least one monthly record on the last day of the month if hired.
- a record for every hire change


```
247;202007;202007;202007;44013;44043;1.0;0.0;0.0;31;2020-07-01;2020-07-31;"P1"   ;"NewYork"             ;1.0;1.0;1.0;31;0.5;0.5;0.5;15.5;4;3;4;30;29;30;stEOM
248;202008;202008;202008;44044;44067;0.0;0.0;0.0;31;2020-08-01;2020-08-24;"P1"   ;"NewYork"             ;1.0;0.0;0.0;24;0.5;0.0;0.0;  12;5;0;0;30;0;0;termclose-12020-08-25 HC
248;202008;202008;202008;44068;44074;1.0;0.0;0.0;31;2020-08-25;2020-08-31;"P1"   ;"Frankfurt"           ;0.0;1.0;0.0; 0;0.0;0.5;0.0;   0;0;0;0;0;0;0;stEOM
```

run it without arguments

```
git clone ...
npm install

gulp build
gulp test
```


```
node js\index.js --NRPERS 20  --nonpm run
```



