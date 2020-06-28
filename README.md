# Airport Check In

Objective of this assignment is to simulate operations of a __Airline Ticketing Office__. Imagine an airline has setup a few counters and a common waiting queue. People can join queue anytime and they are served in joining order by a counter as soon as it becomes free. To setup office and queue at ticketing office, an input JSON file is provided. Please have a look below at a sample input file.

## Sample JSON Input File
```
{"noOfCounters": 3, "queue": [
  {"name": "A", "tickets": 8, "arrivalSec": 0.2},
  {"name": "B", "tickets": 6, "arrivalSec": 0.4},
  {"name": "C", "tickets": 6, "arrivalSec": 0.4},
  {"name": "D", "tickets": 6, "arrivalSec": 0.4},
  {"name": "E", "tickets": 2, "arrivalSec": 4.8}
]}
```

#### noOfCounters
Number of counters that your ticketing office has. This indicates maximum number of people who can be serviced simultaneously.

#### queue
Represents a common queue for all the counters. If two people arrive at the same time (arrivalSec), they will be served as per the order in the queue array.

#### name
Name of the person, waiting in the queue.

#### tickets
Number of tickets a person wants. It takes exactly 1 sec to issue a ticket. So in this example, for person B, total time taken to issue all the tickets will be 6 seconds.

#### arrivalSec
Number of seconds after which a person joins the queue. The time can be in decimal. It is rounded to 1 decimal place before using.

## Assignment
- Processing of this input file is present in `airport.js`.
- `airport.js` imports `queue-manager.js`. The contract between the files is already documented in the comments of `queue-manager.js`. Please read all the comments in this file carefully.
- The queue management in implemented in `queue-manager.js`. Following rules apply:
    - **As soon as a counter is free, the next person from the queue should be serviced without any delay.**
    - **At a given moment, only one person can be serviced at a counter.** A person must fully finish his work at the counter before next person is begins.
- Sample code in `queue-manager.js` demonstrates serving all the people simultaneously, as if there is no dearth of counters. You will need to improve it by adding `noOfCounters` restriction.
- All required output to the console is done via `airport.js`.

## Expected Output
Your program outputs `arrival`, `start` and `finish` of each person. All the logging is automatically done via `airport.js`. 

### Output for the above sample:
```
    0.2 : ARRIVED  CUSTOMER: A WITH 8 TCIKETS
    0.2 : STARTED  SERVING CUSTOMER: A WITH 8 TCIKETS
    0.4 : ARRIVED  CUSTOMER: B WITH 6 TCIKETS
    0.4 : ARRIVED  CUSTOMER: C WITH 6 TCIKETS
    0.4 : ARRIVED  CUSTOMER: D WITH 6 TCIKETS
    0.4 : STARTED  SERVING CUSTOMER: B WITH 6 TCIKETS
    0.4 : STARTED  SERVING CUSTOMER: C WITH 6 TCIKETS
    4.8 : ARRIVED  CUSTOMER: E WITH 2 TCIKETS
    6.4 : FINISHED SERVING CUSTOMER: B WITH 6 TCIKETS
    6.4 : FINISHED SERVING CUSTOMER: C WITH 6 TCIKETS
    6.4 : STARTED  SERVING CUSTOMER: D WITH 6 TCIKETS
    6.4 : STARTED  SERVING CUSTOMER: E WITH 2 TCIKETS
    8.2 : FINISHED SERVING CUSTOMER: A WITH 8 TCIKETS
    8.4 : FINISHED SERVING CUSTOMER: E WITH 2 TCIKETS
   12.4 : FINISHED SERVING CUSTOMER: D WITH 6 TCIKETS
   12.4 : DONE

```

## Testing
- Run the latest stable version of `Node.js`.
- To test the code run `node airport.js`.
- To test the code with a custom input, copy file `input.json` as `<custom-input>.json` and then run `node airport.js <custom-input>.json`.
- For code in Typescript, first compile your code by running `tsc`. `tsconfig.json` is already provided for this purpose.
