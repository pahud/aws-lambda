console.log('loading lambda');
var async      = require('async')
var AWS        = require("aws-sdk");
var dateFormat = require('dateformat');

if (!process.env.LAMBDA_TASK_ROOT) {
  // not in Lambda runtime, load local credentials
  var credentials        = new AWS.SharedIniFileCredentials({profile: 'pahud'});
  AWS.config.credentials = credentials;
  AWS.config.update({region: 'ap-northeast-1' });
}

var ec2 = new AWS.EC2();
//var lambda       = new AWS.Lambda();

var getInstanceIds = function(cb){
  var ids = []
  ec2.describeInstances({}, function(err, data) {
    if (err) {
      console.log(err, err.stack); // an error occurred
    } else {
      for(var i=0;i<data.Reservations[0].Instances.length;i++){
        ids.push(data.Reservations[0].Instances[i].InstanceId)
      }
    }   
    cb(err, ids)
  }); 
}

var createAMI = function(instanceId, cb) {
  var datestr = dateFormat(new Date(), "yyyymmddHHMM")
  var params = {
    InstanceId: instanceId,
    Name: instanceId+datestr,
    NoReboot: true
  }
  ec2.createImage(params, function(err, data) {
    //if (err) console.log(err, err.stack); // an error occurred
    //else console.log(data);  
    cb(err, data)         
  });
}


var main = function(cb){
  getInstanceIds(function(err, data){
    if (data) {
      async.mapLimit(data, 10, 
        function(item, cb){
          createAMI(item, function(err, data){
            cb(err, data)
          })
        },
        function(err, results){
          //if(err)  console.log('got err', err)
          //else console.log(results)
          cb(err, results)
        }
      )
    }
  })
}

exports.handler = function(event, context){
  console.log(event)
  main(function(err, result){
    if(err)  {
      console.log('got err', err)
    } else { 
      console.log(result)
    }
    context.done(err, result)
  })
}
