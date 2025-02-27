let employees = [];
let deletedEmployees = [];
let searchQuery = "";
let sortKey = "name";

// Function to load employee
function loademployees()
{
  let storedEmployees = localStorage.getItem("employees");
  let storedDeletedEmployees = localStorage.getItem("deletedEmployees");
  if(storedEmployees)
  {
    employees = JSON.parse(storedEmployees);
  }
  else{
    //Default employees if no data in loacalStorage
    employees = [
      { id: 1, name: "Sneha Kumari Das", salary: 75000, joiningDate: "2019-01-21" },
      { id: 2, name: "Smriti Joshi", salary: 80000, joiningDate: "2018-02-13" },
      { id: 3, name: "Aachal Das", salary: 65000, joiningDate: "2015-06-26" },
      { id: 4, name: "Sunny Chaudhary", salary: 90000, joiningDate: "2021-03-11" }
    ];
  }
  if (storedDeletedEmployees)
  {
    deletedEmployees = JSON.parse(storedDeletedEmployees);
  }
}

//Function to save an employee
function saveEmployees() {
  localStorage.setItem("employees" , JSON.stringify(employees));
  localStorage.setItem("deletedEmployees", JSON.stringify(deletedEmployees));
}

// Function to display employees
function displayEmployees() {
  let list = document.getElementById("employee-list");
  list.innerHTML = "";

  let filteredEmployees = employees.filter(emp => 
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      emp.id.toString().includes(searchQuery)
  );

  let sortedEmployees = filteredEmployees.sort((a, b) => {
      if (sortKey === "salary") return b.salary - a.salary;
      if (sortKey === "joiningDate") return new Date(a.joiningDate) - new Date(b.joiningDate);
      if (sortKey === "id") return a.id - b.id;
      return a.name.localeCompare(b.name);
  });

  if (sortedEmployees.length === 0) {
      list.innerHTML = "<li>No matching employee found</li>";
  } else {
      sortedEmployees.forEach(emp => {
          let li = document.createElement("li");
          li.innerHTML = `<strong>${emp.name}</strong> - ${formatCurrency(emp.salary)} - Joined: ${formatDate(emp.joiningDate)}
              <button onclick="deleteEmployee(${emp.id})">Delete</button>`;
          list.appendChild(li);
      });
  }
  displayDeletedEmployees();
}
// Function to display deleted employees
function displayDeletedEmployees() {
  let list = document.getElementById("deleted-list");
  list.innerHTML = "";

  deletedEmployees.forEach(emp => {
      let li = document.createElement("li");
      li.innerHTML = `<strong>${emp.name}</strong> - ${formatCurrency(emp.salary)} 
          <button onclick="restoreEmployee(${emp.id})">Restore</button>`;
      list.appendChild(li);
  });
}

// Function to format salary in NPR currency (Removes $ sign)
function formatCurrency(amount) {
  return `NPR ${new Intl.NumberFormat("en-IN", { 
      minimumFractionDigits: 0, 
      maximumFractionDigits: 0 
  }).format(amount)}`;
}

//Function to format date properly
function formatDate(datestring)
{
  let options = { year: "numeric", month: "long", day: "numeric"};
  return new Date(datestring).toLocaleDateString("en-US", options);
}

// Function to add a new employee
function addEmployee() {
  let name = document.getElementById("name").value.trim();
  let salary = document.getElementById("salary").value.trim();
  let joiningDate = document.getElementById("joiningDate").value.trim();

  if (name === "" || salary === "" || joiningDate === "") {
      alert("Please fill all fields correctly!");
      return;
  }

  let newEmp = {
      id: employees.length + 1,
      name,
      salary: parseInt(salary),
      joiningDate
  };

  employees.push(newEmp);
  saveEmployees(); //Save to loaclStorage
  displayEmployees();
  
  // Clear input fields after adding employee
  document.getElementById("name").value = "";
  document.getElementById("salary").value = "";
  document.getElementById("joiningDate").value = "";
}

// Function to delete an employee
function deleteEmployee(id) {
  let index = employees.findIndex(emp => emp.id === id);
  if (index !== -1) {
      deletedEmployees.push(employees[index]);
      employees.splice(index, 1);
      saveEmployees();
      displayEmployees();
  }
}

// Function to restore an employee
function restoreEmployee(id) {
  let index = deletedEmployees.findIndex(emp => emp.id === id);
  if (index !== -1) {
      employees.push(deletedEmployees[index]);
      deletedEmployees.splice(index, 1);
      saveEmployees();
      displayEmployees();
  }
}

// Function to handle search
document.getElementById("search").addEventListener("input", function() {
  searchQuery = this.value.trim();
  displayEmployees();
});

// Function to handle sorting
document.getElementById("sort").addEventListener("change", function() {
  sortKey = this.value;
  displayEmployees();
});

//function load employees when page loads
document.addEventListener("DOMContentLoaded", function()
{
  loademployees();
  displayEmployees();
});


// Initial display
document.addEventListener("DOMContentLoaded", displayEmployees)