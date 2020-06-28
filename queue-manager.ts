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
function queueManager(noOfCounters: number) {
  HelpDeskFactory.create(noOfCounters);
  // This function is called by airport.js as and when people join the queue (based on @arrivalMs).
  async function registerWaiter(personName: string,
    fnCounterSimulator: (personName: string) => Promise<void>) {

    let availableHelpDesk = HelpDeskFactory.getAvailableHelpDesk();
    if (!availableHelpDesk) {
      availableHelpDesk = await HelpDeskFactory.getNextAvailableHelpDesk();
    }
    if(availableHelpDesk){
      availableHelpDesk.assignTask(fnCounterSimulator(`${personName} AT ${availableHelpDesk.name}`));
    }
  }

  return registerWaiter
}

export = queueManager
