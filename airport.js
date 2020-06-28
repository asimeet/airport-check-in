'use strict'

const fs            = require('fs'),
      queueManager  = require('./queue-manager.js')

let startMs = 0 // Represents the time when counters are ready to begin services.

async function main() {
  const json            = JSON.parse(fs.readFileSync(process.argv[2] || 'input.json').toString()),
        noOfCounters    = json.noOfCounters,
        queue           = json.queue,
        registerWaiter  = queueManager(noOfCounters)

  startMs = Date.now()
  await Promise.all(queue.map(objItem => registerWaiterWithDelay(objItem, registerWaiter)))
  timedLogger('ALL CUSTOMERS HAVE ARRIVED')
}

async function registerWaiterWithDelay(objItem, registerWaiter) {
  const arrivalMs = Math.round((objItem.arrivalSec || 0) * 10 + Number.EPSILON) * 100
  await new Promise((resolve) => setTimeout(resolve, arrivalMs))
  timedLogger(`ARRIVED  CUSTOMER: ${objItem.name} WITH ${objItem.tickets} TICKETS`)
  await registerWaiter(objItem.name, counterSimulator.bind(this, objItem.tickets))
}

async function counterSimulator(noOfTickets, personName) {
  await counterSimulatorTimer(personName, noOfTickets)
  timedLogger(`FINISHED SERVING CUSTOMER: ${personName} WITH ${noOfTickets} TCIKETS`)
}

async function counterSimulatorTimer(personName, noOfTickets) {
  timedLogger(`STARTED  SERVING CUSTOMER ${personName} WITH ${noOfTickets} TICKETS`)
  await new Promise((resolve) => setTimeout(resolve, noOfTickets * 1000))
}

function timedLogger() {
  console.log(((Date.now() - startMs)/1000).toFixed(1).padStart(7, ' '), ':', ...arguments)
}

main()
