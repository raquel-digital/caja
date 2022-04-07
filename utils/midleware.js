var adminOk;

const middlewares = {

    isLogin : function (req, res, next) {
        let log = req.body
        const admin = {usuario: "capadmin", contraseña: "capri2665" }
        //const user = {usuario: "capadmin", contraseña: "capri2665" }
        if(admin.usuario == log.usuario && admin.contraseña == log.contraseña){
            adminOk=true;
            return adminOk, next();
        }else{            
            return res.redirect("/login");
        } 
    },
    logged : function (req, res, next) {
        const check = require("../server");
        if(check){           
              return next()
        }else{            
          return res.redirect('/login');
        }
    },
    superAdmin : function (req, res, next){
        if(adminOk){
            return next() 
      }else{
        return res.redirect('/login')
           
      }
    },
    superAdminCheck : function () {
        if(adminOk){
            return true;
        }else{
            return false;
        }
    },  
    logOk: function () {
        return true;
    }, 
    logNotOk: function () {
        return false;
    }, 
    salir: function () {
        loginOk = false;
        adminOk = false;
    }
    
};

module.exports = middlewares;
