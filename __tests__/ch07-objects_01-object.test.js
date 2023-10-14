describe("object", function () {
  describe("is function", function () {
    it("should consider positive and " + "negative zero to be different", function () {
      expect(-0 === 0).toBe(true);
      expect(Object.is(0, -0)).toBe(false);
    });

    it("should consider NaN to be NaN", function () {
      expect(NaN === NaN).toBe(false);
      expect(Object.is(NaN, NaN)).toBe(true);
    });
  });

  describe("assign function", function () {
    it("should apply mixins to objects", function () {
      let shark = {
        bite: function (target) {
          target.hurt = true;
        }
      };
      let person = {};

      let laser = {
        pewpew: function (target) {
          target.exploded = true;
        }
      };

      Object.assign(shark, laser);

      shark.pewpew(person);
      expect(person.exploded).toBe(true);
    });
  });

  describe("property initializer shorthand", function () {
    it("should create properties " + "from local variables", function () {
      let model = "Ford";
      let year = 1969;

      // traditionally:
      // let Classic = {
      //   model: model,
      //   year: year,
      // };

      let Classic = {
        model,
        year
      };

      expect(Classic.model).toBe("Ford");
      expect(Classic.year).toBe(1969);
    });
  });

  describe("method initializer shorthand", function () {
    it("should create methods using shorthand", function () {
      // traditionally:
      // let server = {
      //   getPort: function () {
      //     return 8000;
      //   },
      // };

      let server = {
        getPort() {
          return 8000;
        }
      };

      expect(server.getPort()).toBe(8000);
    });
  });

  describe("computed property names", function () {
    it("should support letiables for " + "property names", function () {
      function createSimpleObject(propName, propVal) {
        // traditionally:
        // let obj = {};
        // obj[propName] = propVal;
        // return obj;

        return {
          [propName]: propVal // the square brackets show that the property is an expressions and letiables are allowed
        };
      }

      let simpleObj = createSimpleObject("color", "red");
      expect(simpleObj.color).toBe("red");
    });

    it("should support concatenation", function () {
      function createTriumvirate(first, second, third) {
        return {
          ["member_" + first.name]: first,
          ["member_" + second.name]: second,
          ["member_" + third.name]: third
        };
      }

      let joe = { name: "Joe" };
      let ralph = { name: "Ralph" };
      let harry = { name: "Harry" };

      let tri = createTriumvirate(joe, ralph, harry);
      console.log(tri);
      expect(tri.member_Joe).toBe(joe);
    });
  });
});
