import UserModel from "../model/User.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ENV from '../config.js';
import otpGenerator from 'otp-generator';


/** middleware for verify user */

export async function verifyUser(req, res, next) {
  try {
      const {username} = req.method == "GET" ? req.query : req.body;

      //check the user existance
      let exist = await UserModel.findOne({username});
      if(!exist) return res.status(404).send({error: "Can't find User!"});
      next();
  } catch (error) {
     return res.status(404).send({error: "Authentication Error"});
  }
}



export async function register(req, res) {
  try {
    const { username, password, profile, email } = req.body;
    //   console.log("find data", req.body); // Fix the typo here

    // Check if the username already exists
    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "Please use a unique username" });
    }

    // Check if the email already exists
    const existingEmail = await UserModel.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Please use a unique email" });
    }

    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }


    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new UserModel({
      username,
      password: hashedPassword,
      profile: profile || "",
      email,
    });

    // Save the user to the database
    const result = await user.save();
    return res.status(201).json({ msg: "User Registered Successfully", result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

/** Post: http://localhost:8080/api/login
 * @param: {
 * "username:"john1"
 * "password":"john@123"}
 */
export async function login(req, res) {
  const { username, password } = req.body;

  try {
    UserModel.findOne({ username })
      .then(user => {

        bcrypt.compare(password, user.password)
          .then(passwordCheck => {
            
            if (!passwordCheck) return res.status(400).send({ error: "Don't have Password" });


            // create jwt token
            const token = jwt.sign({
              userId: user._id,
              username: user.username,
            }, ENV.JWT_SECRET, { expiresIn: "24h" }
            );

            // let token;

            // try {
            //   token = jwt.sign(
            //     {
            //       userId: user._id,
            //       username: user.username,
            //     },
            //     ENV.JWT_SECRET,
            //     { expiresIn: "24h" }
            //   );
            // } catch (error) {
            //   console.error("Error generating token:", error);
            //   return res.status(500).json({ error: "token problem Server Error" });
            // }
            // console.log("Token", token);/
            return res.status(200).send({
              meg: "Login Successfull...!",
              username: user.username,
              token
            })
          })
          .catch(error => {
            return res.status(400).send({ error: "Password does not Match", password});
          })
      })
      .catch(error => {
        return res.status(404).send({ error: "Username not Found" });
      })
  } catch (error) {
    return res.status(500).send({ error });
  }
}

/** GET: http://localhost:8080/api/user/john */
// export async function getUser(req, res) {
  
//   const { username } = req.params;
//   console.log("userNAmeeee:", username);

//   try {
//       if(!username) return res.status(501).send({error: "Invalid UserName"});
      
//       UserModel.findOne({username}, function(err, user) {
//         if(err) return res.status(500).send({err});
//         if(!user) return res.status(501).send({error: "Couldn't Find the User"});

//         return res.status(201).send(user);
//       })
//   } catch (error) {
//       return res.status(404).send({error: "Can't Find User Data"});
//   }
// }

export async function getUser(req, res) {
  const { username } = req.params;
  console.log("Extracted Username:", username);

  try {
    if (!username) {
      return res.status(501).send({ error: "Invalid Username" });
    }

    // Use async/await for better error handling
    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(501).send({ error: "Couldn't Find the User" });
    }

    /** remove password from user  */
    //mongoose teturn unnecessary data with object so convert it into
    const {password, ...rest} = Object.assign({}, user.toJSON());

    return res.status(201).send(rest);
  } catch (error) {
    console.error("Unexpected Error:", error);
    return res.status(404).send({ error: "Can't Find User Data" });
  }
}


/** PUT: http://localhost:8080/api/updateuser 
 * @param: {
  "header" : "<token>"
}
body: {
    firstName: '',
    address : '',
    profile : ''
}
*/
// export async function updateuser(req, res) {
//     try {
//         const id = req.query.id;
//         console.log("find ID: ",id);
//         if(id){
//             const body = req.body;
//             console.log('which want to update data', body);
//             // update the data
//             UserModel.updateOne({_id : id}, body, function(err, data) {
//               if(err) throw err;
//               return res.status(201).send({msg: "Record Updated...!"});
//             })
//         }else{
//           return res.status(401).send({error:"User Not Found...!"});
//         }
        

//     } catch (error) {
//         return res.status(401).send({error});
//     }
// }

export async function updateuser(req, res) {
  try {
    // const id = req.query.id;
    const { userId } = req.user;
    console.log("userID....... ", userId);
    if (userId) {
      const body = req.body;  

      // Use async/await to update the data
      const result = await UserModel.updateOne({ _id: userId }, body);

      // Check if any document was modified
      if (result.modifiedCount > 0) {
        return res.status(201).send({ msg: 'Record Updated...!' });
      } else {
        return res.status(404).send({ error: 'No record found to update' });
      }
    } else {
      return res.status(400).send({ error: 'User ID not provided' });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).send({ error: 'Internal Server Error' });
  }
}

/** GET: http://localhos:8080/api/generateOTP */
export async function generateOTP(req, res) {
   req.app.locals.OTP  =  await otpGenerator.generate(6, { 
    lowerCaseAlphabets: false, 
      upperCaseAlphabets: false, 
      specialChars: false
    })
   res.status(201).send({code: res.app.locals.OTP})
}

/**GET: http:localhost:8080/api/verifyOTP */
export async function verifyOTP(req, res) {
  const {code} = req.query;
  if(parseInt(req.app.locals.OTP) === parseInt(code)){
    req.app.locals.OTP = null; // reset the OTP value
    req.app.locals.resetSession = true; // start session for reset password
    return res.status(201).send({msg: "Verify Successfully!"});
  }
  return res.status(400).send({error: "Invalid OTP"});
}

// successfully redirect user when otp is valid
/**GET:http://localhost://8080/api/createResetSession  */
export async function createResetSession(req, res) {
   if(req.app.locals.resetSession) {
    req.app.locals.resetSession = false
    return res.status(201).send({msg: "access granted!"});
   }
   return res.status(440).send({error: "session expired!"})
}

// update the password when we have valid session
/**PUT:http://localhost:8080/api/resetPassword */
// export async function resetPassword(req, res) {
//   try {
//       const {username, password} = req.body;

//       try {
//           UserModel.findOne({username})
//           .then(user => {
//             bcrypt.hash(password, 10)
//             .then(hashedPassword => {
//               UserModel.updateOne({username:user.username},
//                 {password: hashedPassword}, function(err, data) {
//                   if(err) throw err;
//                   return res.status(201).send({msg: "Record Updated...!"})
//                 }
//               )
//             }).catch(e => {
//               return res.status(500).send({
//                 error:"Enable to hashed password"
//               })
//             })
//           })
//       } catch (error) {
//           return res.status(404).send({error: "Username not Found"});
//       }
//   } catch (error) {
//       return res.status(401).send({error})
//   }
// }

export async function resetPassword(req, res) {
  try {


    if(!req.app.locals.resetSession)
      return res.status(440).send({error:"Session expired!"});

      const { username, password} = req.body;

      const user = UserModel.findOne({username});
      if(!user) {
        return res.status(404).send({error:"Username not found!.."})
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await UserModel.updateOne(
        {username: user.username},
        {password : user.password}
      );

      return res.status(201).send({msg:"Record updated Successfully!"});

  } catch (error) {
      return res.status(500).send({error: "Internal Server Error"});
  }
}


