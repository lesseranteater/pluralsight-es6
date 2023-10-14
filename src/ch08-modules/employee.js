let _name = Symbol(); // use weak encapsulation

// export a class
export class Employee {
  constructor(name) {
    this[_name] = name;
  }

  get name() {
    return this[_name];
  }

  doWork() {
    return `${this.name} is working`;
  }
}

// export a function
export let employeeName = (employee) => {
  return employee.name;
};

// export a value
export let defaultRaise = 0.03;

// export an instance of a class
export let modelEmployee = new Employee("Allen");
