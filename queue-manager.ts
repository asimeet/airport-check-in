enum Status {
  inprogress = "in-progress",
  completed = "completed",
  cancelled = "cancelled"
}

class Task<T> extends Promise<T>{
  status: Status = Status.inprogress;
}

class HelpDesk {
  name: String;
  available: Boolean = true;
  currentTask: Task<any> = new Task(() => { });
  constructor(name: string) {
    this.name = name;
  }
  assignTask(task: Promise<any>) {
    this.available = false;
    this.currentTask = Object.assign(task, { status: Status.inprogress });
    this.currentTask.then(() => {
      this.currentTask.status = Status.completed;
      this.available = true;
    });
    this.currentTask.catch(() => { this.currentTask.status = Status.cancelled });
  }
}
class HelpDeskFactory {
  static helpDesks: Array<HelpDesk>;

  static create(noOfCounter: number) {
    for (let i = 1; i <= noOfCounter; i++) {
      let helpDesk = new HelpDesk(`HELP-DESK-${i}`);
      if (i === 1) {
        this.helpDesks = [helpDesk];
      } else {
        this.helpDesks.push(helpDesk);
      }
    }
  }
  private static getRunningTasks() {
    let runningTasks = this.helpDesks.map(item => item.currentTask);
    runningTasks = runningTasks.filter(item => item.status === Status.inprogress);
    return runningTasks;
  }
  
  static async getAvailableHelpDesk() {
    let helpDesk = this.helpDesks.find(item => item.available === true);
    if (!helpDesk) {
      let runningTasks = this.getRunningTasks();
      await Promise.race(runningTasks);
      helpDesk = this.helpDesks.find(item => item.available === true);
    }
    return helpDesk;
  }
}
// This function is called by ticketing-office.js once when program starts.
function queueManager(noOfCounters: number) {
  HelpDeskFactory.create(noOfCounters);
  // This function is called by ticketing-office.js as and when people join the queue (based on @arrivalMs).
  async function registerWaiter(personName: string,
    fnCounterSimulator: (personName: string) => Promise<void>) {
    /*
      Return a promise that gets fulfilled when personName has been serviced. To
      service a person you must call fnCounterSimulator(personName) when you
      are ready to service a person. 

      fnCounterSimulator is already provided to you from ticketing-office.js. It 
      returns a promise that is fulfilled when requested number of tickets are issued. 
      Internally, it implements a timer for this.
    */

    /* -- YOUR CODE HERE -- */

    // Following is a buggy dummy implementation. Here waiter is serviced as soon as 
    // he is registered, without honouring the number of counters that are available.
    let availableHelpDesk = await HelpDeskFactory.getAvailableHelpDesk();
    if (availableHelpDesk) availableHelpDesk.assignTask(fnCounterSimulator(personName));
  }

  return registerWaiter
}

export = queueManager
