

exports.addUniqueEmployeeId = () => {
  return async context => {
    try {
      const { data, app } = context;

      let randomId = await checkUniqueEmployeeId(app);
      data["employeeId"] = randomId;

    } catch (error) {
      return Promise.reject(error)
    }
  }
}


const checkUniqueEmployeeId = (app) => {
  return new Promise(async (resolve, reject) => {
    try {
      let val = Math.floor(100000 + Math.random() * 900000)
      val = `emp-${val}`
      let alreadyExist = await app.service('employee').findOne({query : {employeeId : val}});
      if(alreadyExist){
        checkUniqueEmployeeId(app);
      }else{
        resolve(val)
      }
    } catch (error) {
      return reject(error);
    }
  })
}