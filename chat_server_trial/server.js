var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))
app.set('view engine', 'ejs');

var Message = mongoose.model('Message',{
  name : String,
  message : String
})

app.get('/home', (req, res) =>{
    res.sendFile(__dirname+'/public/home.html');
})

app.post('/index', (req,res)=>{
    //res.render("index.ejs");
    //es.render("/index.ejs", {type: req.body.type, name: req.body.name});
    res.render("chat", {type:'patient', name:'bob'});
    console.log(req.url);
});

app.get('/messages', (req, res) => {
  Message.find({},(err, messages)=> {
    res.send(messages);
  })
})

app.get('/messages/:user', (req, res) => {
  var user = req.params.user
  Message.find({name: user},(err, messages)=> {
    res.send(messages);
  });
});

app.post('/messages', async (req, res) => {
  try{
    var message = new Message(req.body);

    var savedMessage = await message.save()
    console.log('*chat saved*');
    // var censored = await Message.findOne({message:'badword'});
    //   if(censored)
    //     await Message.remove({_id: censored.id});
    //   else
    io.emit('message', req.body);
    res.sendStatus(200);
  }
  catch (error){
    res.sendStatus(500);
    return console.log('error',error);
  }
  finally{
    console.log('*Chat Posted*');
  }
})

io.on('connection', () =>{
  console.log('*User Connected*');
})

mongoose.connect('mongodb://yhack:yhack2018@ds131139.mlab.com:31139/yhack',(err) => {
  console.log('*Mongodb Connected*',err);
})

var server = http.listen(3000, () => {
  console.log('Server running on port ', server.address().port);
});