import { Employee } from "./employee.js";

export class Company {
  hire(...names) {
    this.employees = names.map((n) => new Employee(n));
  }

  doWork() {
    let work = [];
    this.employees.forEach((e) => work.push(e.doWork()));
    return work;
  }
}
