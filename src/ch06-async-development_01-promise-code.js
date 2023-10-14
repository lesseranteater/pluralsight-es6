const getOrder = (orderId) => {
  return Promise.resolve({ userId: 35 });
};

const getUser = (userId) => {
  return Promise.resolve({ companyId: 18 });
};

const getCompany = (companyId) => {
  return Promise.resolve({ name: "Pluralsight" });
};

const getCourse = (courseId) => {
  let courses = {
    1: { name: "Introduction to Cobol" },
    2: { name: "Yet Another C# Course" },
    3: { name: "How to make billions by blogging" }
  };
  return Promise.resolve(courses[courseId]);
};

export { getOrder, getUser, getCompany, getCourse };
