"use strict";
var Status;
(function (Status) {
    Status["inprogress"] = "in-progress";
    Status["completed"] = "completed";
    Status["cancelled"] = "cancelled";
})(Status || (Status = {}));
class Task extends Promise {
    constructor() {
        super(...arguments);
        this.status = Status.inprogress;
    }
}
class HelpDesk {
    constructor(name) {
        this.available = true;
        this.currentTask = new Task(() => { });
        this.name = name;
    }
    assignTask(task) {
        this.available = false;
        this.currentTask = Object.assign(task, { status: Status.inprogress });
        this.currentTask.then(() => {
            this.currentTask.status = Status.completed;
            this.available = true;
        });
        this.currentTask.catch(() => { this.currentTask.status = Status.cancelled; });
    }
}
class HelpDeskFactory {
    static create(noOfCounter) {
        for (let i = 1; i <= noOfCounter; i++) {
            let helpDesk = new HelpDesk(`HELP-DESK-${i}`);
            if (i === 1) {
                this.helpDesks = [helpDesk];
            }
            else {
                this.helpDesks.push(helpDesk);
            }
        }
    }
    static getAvailableHelpDesk() {
        return this.helpDesks.find(item => item.available === true);
    }
    static async getNextAvailableHelpDesk() {
        let runningTasks = this.helpDesks.map(item => item.currentTask);
        runningTasks = runningTasks.filter(item => item.status === Status.inprogress);
        await Task.race(runningTasks);
        return this.helpDesks.find(item => item.available === true);
    }
}
// This function is called by airport.js once when program starts.
function queueManager(noOfCounters) {
    HelpDeskFactory.create(noOfCounters);
    // This function is called by airport.js as and when people join the queue (based on @arrivalMs).
    async function registerWaiter(personName, fnCounterSimulator) {
        let availableHelpDesk = HelpDeskFactory.getAvailableHelpDesk();
        if (!availableHelpDesk) {
            availableHelpDesk = await HelpDeskFactory.getNextAvailableHelpDesk();
        }
        if (availableHelpDesk) {
            availableHelpDesk.assignTask(fnCounterSimulator(`${personName} AT ${availableHelpDesk.name}`));
        }
    }
    return registerWaiter;
}
module.exports = queueManager;
