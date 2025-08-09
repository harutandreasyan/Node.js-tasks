const { BaseModel } = require("./BaseModel");

class EmployeesModel extends BaseModel {
    table = 'employees'
}

module.exports =  new EmployeesModel() 
