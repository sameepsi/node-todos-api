const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc!';

bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    console.log(hash);
  });
});

var hashedPassword = '$2a$10$ttuO/qsrRm4Fs7tyDaRuGuLOdKNUX/FpQ7L4CmMDvXx0M8Qi90yRS';

bcrypt.compare(password, hashedPassword, (err, res) => {
  console.log(res);
});

// jwt.sign
// jwt.verify

// var data = {
//   id:10
// };
//
// var token = jwt.sign(data, '123abc');
// console.log(token);
//
// var decoded = jwt.verify(token,'123abc');
// console.log('decoded', decoded);

// var message = 'I am user number 3';
// var hash =  SHA256(message).toString();
// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);
//
// var data = {
//   id: 4
// };
//
// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'SomeSecret').toString()
// };
//
// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data).toString());
//
// var resultHash = SHA256(JSON.stringify(token.data) + 'SomeSecret').toString();
// if(resultHash === token.hash){
//   console.log('Data was not changed');
// }
// else{
//   console.log(`Data was changed don't trust`);
// }
