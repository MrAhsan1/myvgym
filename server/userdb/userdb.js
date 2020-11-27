var db = require('../db').db;
var nodemailer = require('nodemailer');
var dateFormat = require('dateformat');
const Pusher = require('pusher');
let pusher = new Pusher({
  appId: "1113840",
  key: "5d55da894e2d4107129a",
  secret: "3d98dff21edc68222387",
  cluster: "ap2",
  useTLS: true
});

const pusherAuth = (req,res,next) =>{
  const socketId = req.body.socket_id;
  const channel = req.body.channel_name;
  const presenceData = {
    user_id: "unique_user_id",
    user_info: {
      name: "Mr Channels",
      twitter_id: "@pusher"
    }
  };
  const auth = pusher.authenticate(socketId, channel, presenceData);
  res.send(auth);
}

const loginUsers = (req,res,next)=>{
  const {email,password} = req.body;
  console.log(email,password);
  db.query('select * from users as u where u.username=$1 and u.password=$2',[email,password])
    .then((users)=>{
      if(users.length >=1 ){
        console.log(users);
        res.json({
          status:true,
          data:users,
        })
      }
      else {
        res.json({
          data:"fail",
          status:false,
        })
      }
    })
    .catch(err=>{
      console.log(err);
      res.json({
        data:"fail",
        status:false,
      })
    })
}
const counters = (req,res,next)=>{
  const {uid} = req.body;
  let d;
  db.query('select count(*) from consultation where user_id=$1',[uid]).then((data) => {
    d = data[0];
    db.query('select count(*) from client where user_id=$1',[uid])
    .then((count)=>{
      res.json({
        status:true,
        consultation:d,
        client:count[0],
      })
    })
    .catch(err=>{
      console.log(err);
      res.json({
        data:"fail",
        status:false,
      })
    })
  })
}
const getUsers = (req,res,next)=>{
  const {email,password} = req.body;
  console.log(email,password);
  db.query('select * from users as u left join client on client.user_id = u.userid where u.username=$1 and u.password=$2',[email,password])
    .then((users)=>{
      if(users.length >=1 ){
        console.log(users);
        res.json({
          status:"success",
          data:users,
        })
      }
      else {
        res.json({
          data:"fail"
        })
      }
    })
    .catch(err=>{
      console.log(err);
      res.json({
        data:"fail"
      })
    })
}

const createUser = (req,res,next)=>{
  const {email,password,firstname,lastname} = req.body;
  console.log(req.body)
  db.query('select * from users where username=$1', email).then((check) => {
    if(check.length > 0) {
      res.json({
        status: false,
        msg: 'Email Already Registerd'
      })
    } else {
      db.query('insert into users(username,password,firstName,lastName) values ($1,$2,$3,$4)',[email,password,firstname,lastname])
    .then((users)=>{
      res.json({
          status: true,
        })
    })
    .catch(err=>{
      console.log(err);
      res.json({
        data:"fail"
      })
    })
    }
  });
  
}

const createClient = (req,res,next)=>{
  const userid = req.body.userid;
  const {state} = '';
  const {firstName,lastName,email,apptNumber,streetAddress,country,age,city,dateBirth,province} = req.body.clientDetails;
  const {bloodPressure,bodyDetails,bodyFat,fitnessGoal,heightDetails,restingHeart} = req.body.healthDetails;
  const {hipsDetails,leftBicepDetails,leftCalfDetails,leftThighDetails,neckDetails,rightBicepDetails,rightCalfDetails,rightThighDetails,waistDetails,chestDetails} = req.body.bodyMeasurement;
  db.query('insert into users(username,password,firstName,lastName, isAdmin) values ($1,$2,$3,$4,$5)',[email,email,firstName,lastName, 'false']).then((users) =>{
    db.query('SELECT * FROM users where username=$1', email)
    .then((reterieveLatestId) => {
      db.query('insert into client(first_name,last_name,street_address,apartment_number,city'+
      ',country,province,state,email,date_of_birth,age,height,body_weight,body_fat,'+
      'resting_heart_rate,blood_pressure,fitness_goal,neck,chest,right_bicep,left_bicep,waist,'+
      'hips,right_thigh,left_thigh,right_calf,left_calf,user_id,my_id) '+
      'values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29)'
      ,[firstName,lastName,streetAddress,apptNumber,city,country,province,state,email,dateBirth,age,
        heightDetails,bodyDetails,bodyFat,restingHeart,bloodPressure,fitnessGoal,neckDetails,chestDetails,
        rightBicepDetails,leftBicepDetails,waistDetails,hipsDetails,rightThighDetails,leftThighDetails,rightCalfDetails,leftCalfDetails,userid,reterieveLatestId[0].userid])
      .then(resp => {
        db.query('SELECT * FROM client ORDER BY id DESC LIMIT 1')
        .then(reterieveLatestId=>{
          console.log("retrieve latest id",reterieveLatestId[0]);
          db.query('INSERT INTO userdetails(user_id,user_added_details,user_details) VALUES ( $1, $2,$3)',[reterieveLatestId[0].id,reterieveLatestId[0],'[]'])
        })
        res.json ({
          status: true
        })
      })
      .catch(err=>{
        console.log(err);
        res.json({
          status: false
        })
      })
    })
  });
}

const getClient = (req,res,next) =>{
  const {clientid} = req.body;
  console.log("req.body",req.body)
  db.query('select * from client where id=$1', clientid)
  .then(resp=>{
    res.json({
      status: true,
      data:resp
    })
  })
}
const getClients = (req,res,next) =>{
  const {userid} = req.body;
  console.log("req.body",req.body)
  db.query('select * from client where user_id=$1', userid)
  .then(resp=>{
    res.json({
      status: true,
      data:resp
    })
  })
}

const delClient = (req,res,next) =>{
  const {id} = req.body;
  db.query('delete from client where client.id=$1',id)
  .then(resp=>{
    res.json({
      status: true,
      data:resp
    })
  })
}
const delConsultation = (req,res,next) =>{
  const {id} = req.body;
  db.query('delete from consultation where id=$1',id)
  .then(resp=>{
    res.json({
      status: true,
      data:resp
    })
  })
}

const getAdminClient = (req,res,next) => {
  const {user_id} = req.body;
  console.log("req.body",req.body)
  db.query('select * from client where user_id=$1',user_id)
  .then(resp=>{
    res.json({
      status:true,
      data:resp
    })
  })
}

const getConsultation = (req,res,next)=>{
  db.query('select * from consultation where client_id=$1',req.body.client_id)
  .then(resp=>{
    res.json({
      status: true,
      data:resp
    })
  })  
}

const getAdminConsultation = (req,res,next)=>{
  db.query('select * from consultation where user_id=$1 Order BY id DESC',req.body.user_id)
  .then(resp=>{
    res.json({
      status:true,
      data:resp
    })
  })  
}

const createConsultation = (req,res,next)=>{
  const clientId = req.body.id;
  const reqDate = dateFormat(req.body.consult.date, "yyyy-mm-dd");
  const reqTime = dateFormat(req.body.consult.time, "hh:mm:ss tt");
  const reason = req.body.consult.reason;
  const fitnessGoals = req.body.goals;
  db.query('select * from client where my_id=$1',clientId).then((data) => {
    const {user_id,first_name,last_name,email,appartment_number,street_address,
      state,country,age,city,date_of_birth,province,height,body_weight,
      body_fat,resting_heart_rate,blood_pressure,fitness_goal,neck,
      chest,right_bicep,left_bicep,waist,hips,right_thigh,left_thigh,right_calf,left_calf} = data[0];
    db.query('insert into consultation (first_name,last_name,street_address,apartment_number,city,country,province,state,email,date_of_birth,age,height,body_weight,body_fat,resting_heart_rate,blood_pressure,fitness_goal,neck,chest,right_bicep,left_bicep,waist,hips,right_thigh,left_thigh,right_calf,left_calf,new_fitness_goals,status,req_date,acp_date,req_time,acp_time,reason,user_id,client_id) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33,$34,$35,$36)',
    [first_name,last_name,street_address,appartment_number,city,country,province,state,email,date_of_birth,age,height,body_weight,body_fat,resting_heart_rate,blood_pressure,fitness_goal,neck,chest,right_bicep,left_bicep,waist,hips,right_thigh,left_thigh,right_calf,left_calf,fitnessGoals,"pending",reqDate,"",reqTime,"",reason,user_id,clientId]
  )
  .then(resp=>{
        const fullname = first_name + ' ' + last_name;
        const message = 'Booked an Appointment';
        const consult = clientId;
        const trainer = user_id;
      pushNotifications(fullname, message, consult, trainer);
      res.json({
        status: true,
      })
  })
  .catch(err=>{
    console.log("erorrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr" + err);
    res.json({
      status: false
    })
  })
  })
}

const updateConsultation = (req,res,next)=>{
  const {acp_date,acp_time,id,status} = req.body;
  db.query('UPDATE consultation SET acp_date =$1 , acp_time =$2 ,status =$3  WHERE id =$4',[acp_date,acp_time,status,id])
  .then(resp=>{
    const data = {
      name: req.body.first_name + ' ' + req.body.last_name,
      message: ' Your Appointment has been ' + status,
      consult: req.body.client_id,
      trainer: req.body.user_id
    }
    pushNotificationsToConsult(data);
    res.json({
      status: true
    })
  })
}
 
const getUserDetails = (req,res,next)=>{
  db.query('select * from userdetails where user_id=$1',req.body.user_id)
  .then(resp=>{
    console.log("------------------------------------------",resp);
    res.json({
      status:"success",
      data:resp
    })
  })
}

const updateUserDetails = (req,res,next)=>{
  console.log("-------------------------------------------------------------------")
  console.log(req.body)
  const user_id = req.body.id;
  const obj = {
    userDetails:req.body.values,
    userData: req.body.client.data
  }
  obj.userDetails.date = req.body.date;
  obj.userDetails.id = user_id;
  db.query('UPDATE userdetails SET user_details = user_details || $1 ::jsonb WHERE user_id= $2',[obj,user_id])
  .then((resp)=>{
    res.json({
      status:"success"
    })
  })
}

// by me
const getDashboard = (req,res,next)=>{
  db.query('select * from users where userid=$1',req.body.user_id)
  .then(resp=>{
    console.log("------------------------------------------",resp);
    res.json({
      status:"success",
      data:resp
    })
  })
}

const forgetPassword =  (req,res,next)=>{
  db.query('select * from users where username=$1',req.body.email)
  .then(async resp=> {
    if (resp.length > 0) {
      SentEmail(resp[0], function(ress) {
        console.log(ress.status);
      });
      res.json({
        status: true,
        msg: "We Sent you an email for password reset.",
        data:resp
      })
    }
    else {
      res.json({
        status: false,
        msg: "Email is not register",
        data:'fail'
      })
    }
  })
  .catch(err=>{
    console.log("erorrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");
    res.json({
      status:"fail"
    })
  })
}
function SentEmail(obj, res) {
  var transporter = nodemailer.createTransport({
    service: 'gmail',//smtp.gmail.com  //in place of service use host...
    // host: "smtp.mailtrap.io",
    // port: 2525,
    auth: {
        user: "ahsanayoub.itsolutions@gmail.com",
        pass: "nwrudqjeegugsncf"
    }
  });
  var currentDateTime = new Date();
    var mailOptions = {
        from: 'ahsanayoub.itsolutions@gmail.com',
        to: obj.username,
        subject: 'Password Reset',
        // text: 'That was easy!',
        html: "<h1>Welcome To MyVgym ! </h1><p>\
        <h3>Hello "+obj.firstname+"</h3>\
        If You are requested to reset your password then click on below link<br/>\
        <a href='http://localhost:4200/resetpassword'>Click On This Link</a>\
        </p>"
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
          console.log(error);
          return false;
      } else {
          console.log('Email sent: ' + info.response);
          const val = {
            status:"success",
            msg: "We Sent you a email for password reset.",
            data: resp
          }
          return res(val);
      }
  });
}
const resetPassword =  (req,res,next)=>{
  console.log(req.body);
  db.query('Update users Set password=$1 where username=$2',[req.body.password,req.body.email])
  .then(async resp=> {
    console.log(resp)
      res.json({
        status: true,
        msg: "Password Changed Successfully",
        data:resp
      })
  })
  .catch(err=>{
    console.log("erorrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");
    res.json({
      status:"fail"
    })
  })
}
const changePassword =  (req,res,next)=>{
  console.log(req.body);
  db.query('Update users Set password=$1 where userid=$2',[req.body.passForm,Number(req.body.user_id)])
  .then(async resp=> {
    console.log(resp)
      res.json({
        status: true,
        msg: "Password Changed Successfully",
        data:resp
      })
  })
  .catch(err=>{
    console.log("erorrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");
    res.json({
      status:"fail"
    })
  })
}

const updateClient = (req,res,next)=> {
  const id = req.body.clientid;
  const {state} = '';
  const {firstName,lastName,email,apptNumber,streetAddress,country,age,city,dateBirth,province} = req.body.clientDetails;
  const {bloodPressure,bodyDetails,bodyFat,fitnessGoal,heightDetails,restingHeart} = req.body.healthDetails;
  const {hipsDetails,leftBicepDetails,leftCalfDetails,leftThighDetails,neckDetails,rightBicepDetails,rightCalfDetails,rightThighDetails,waistDetails,chestDetails} = req.body.bodyMeasurement;
  
  db.query('Update client Set first_name=$1,last_name=$2,street_address=$3,apartment_number=$4,city=$5'+
      ',country=$6,province=$7,state=$8,email=$9,date_of_birth=$10,age=$11,height=$12,body_weight=$13,body_fat=$14,'+
      'resting_heart_rate=$15,blood_pressure=$16,fitness_goal=$17,neck=$18,chest=$19,right_bicep=$20,left_bicep=$21,waist=$22,'+
      'hips=$23,right_thigh=$24,left_thigh=$25,right_calf=$26,left_calf=$27 where id=$28'
      ,[firstName,lastName,streetAddress,apptNumber,city,country,province,state,email,dateBirth,age,
        heightDetails,bodyDetails,bodyFat,restingHeart,bloodPressure,fitnessGoal,neckDetails,chestDetails,
        rightBicepDetails,leftBicepDetails,waistDetails,hipsDetails,rightThighDetails,leftThighDetails,
        rightCalfDetails,leftCalfDetails,id])
      .then(resp => {
        res.json ({
          status: true
        })
      })
      .catch(err=>{
        console.log(err);
        res.json({
          status: false
        })
      })
}
const showProgress = (req,res,next)=>{
  console.log(req.body);
  const userid = String(req.body.id);
  const date = dateFormat(req.body.date.date, "yyyy-mm-dd");
  db.query('select * from client where id=$1',userid).then((data) => {
    db.query('select * from progress where client_id=$1 and date = $2',[userid, date])
    .then(resp=>{
      res.json({
        status: true,
        data:resp,
        client: data 
      })
    })
  })
}
const getClientProgress = (req,res,next)=>{
  console.log(req.body);
  const userid = String(req.body.client_id);
  db.query('select * from client where my_id=$1',userid).then((data) => {
    console.log(data);
    db.query('select * from progress where client_id=$1',[String(data[0].id)])
    .then(resp=>{
      res.json({
        status: true,
        data:resp,
        client: data 
      })
    })
  })
}
const createProgress = (req,res,next)=>{
  const {chestDetails,harvard_step_test,hipsDetails,leftBicepDetails,leftCalfDetails,
    leftThighDetails,max_chin_ups,max_pull_ups,max_push_ups,neckDetails,plank,rightBicepDetails,
    rightCalfDetails,rightThighDetails,waistDetails,wallsit} = req.body.progress;
  const clientid = String(req.body.clientid);
  const date = dateFormat(new Date(), "yyyy-mm-dd");
  db.query('insert into progress(chest_details,harvard_step_test,hips_details,left_bicep_details,left_calf_details'+
    ',left_thigh_details,max_chin_ups,max_pull_ups,max_push_ups,neck_details,plank,right_bicep_details'+
    ',right_calf_details,right_thigh_details,waist_details,wallsit,date,client_id) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)',
    [chestDetails,harvard_step_test,hipsDetails,leftBicepDetails,leftCalfDetails,
      leftThighDetails,max_chin_ups,max_pull_ups,max_push_ups,neckDetails,plank,rightBicepDetails,
      rightCalfDetails,rightThighDetails,waistDetails,wallsit, date, clientid]).then((data) => {
        console.log(data);
      res.json({
        status: true,
        data:data,
      })
    }).catch(err=>{
      console.log('------'+err);
      res.json({
        status: false
      })
    })
}
const getTrainerNotification = (req,res,next)=>{
  const userid = String(req.body.trainer_id);
  db.query('select * from noifications where trainer_id=$1 and read=$2 order by id DESC ',[userid, false]).then((data) => {
      res.json({
        status: true,
        data: data 
      })
  })
}
const getConsultNotification = (req,res,next)=>{
  const userid = String(req.body.consultant_id);
  db.query('select * from noifications where consultant_id=$1 and read=$2 order by id DESC',[userid, false]).then((data) => {
      res.json({
        status: true,
        data: data 
      })
  })
}
function pushNotifications(name, message, consult, trainer) {
  const dateToday = dateFormat(new Date(), 'yyyy-mm-dd hh:mm tt');
  pusher.trigger("my-channel."+ trainer, "my-event", {
    message: name + ' ' + message,
    date: dateToday
  });
  db.query('insert into noifications(trainer_id,consultant_id,message,date, name) values($1,$2,$3,$4,$5)', [trainer
  ,consult,message, dateToday, name]);
}
function pushNotificationsToConsult(data) {
  const dateToday = dateFormat(new Date(), 'yyyy-mm-dd hh:mm tt');
  pusher.trigger("my-channel."+ data.consult, "my-event", {
    message: data.name + ' ' + data.message,
    date: dateToday
  });
  db.query('insert into noifications(trainer_id,consultant_id,message,date, name) values($1,$2,$3,$4,$5)', [data.trainer
  ,data.consult,data.message, dateToday, data.name]);
}
const UpdateNotification = (req,res,next)=>{
  const id = String(req.body.noti_id);
  db.query('Update noifications set read=$1 where id=$2',[true, id]).then((data) => {
      res.json({
        status: true,
        data: data 
      })
  })
}
module.exports = {
  loginUsers:loginUsers,
  counters:counters,
  getUsers:getUsers,
  createUser:createUser,
  createClient:createClient,
  getClient:getClient,
  createConsultation:createConsultation,
  getConsultation:getConsultation,
  getAdminClient:getAdminClient,
  getAdminConsultation:getAdminConsultation,
  updateConsultation:updateConsultation,
  getUserDetails:getUserDetails,
  updateUserDetails:updateUserDetails,
  updateClient: updateClient,
  // by me
  getDashboard:getDashboard,
  forgetPassword:forgetPassword,
  resetPassword:resetPassword,
  delClient:delClient,
  delConsultation:delConsultation,
  getClients:getClients,
  showProgress:showProgress,
  createProgress:createProgress,
  getClientProgress:getClientProgress,
  pusherAuth:pusherAuth,
  getConsultNotification:getConsultNotification,
  getTrainerNotification:getTrainerNotification,
  UpdateNotification:UpdateNotification,
  changePassword:changePassword
}