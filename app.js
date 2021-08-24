// invoke express
const express = require('express');
const app = express();

// set urlencoded to capture the form data
app.use(express.urlencoded({extended:false}));
app.use(express.json());

// invoke dotenv
const dotenv = require('dotenv');
dotenv.config({path: './env/.env'})

// set dir public
app.use('/resources', express.static('public'));
app.use('/resources', express.static(__dirname + '/public'));
// console.log(__dirname);

// template ejs
app.set('view engine', 'ejs');

// invoke bcryptjs
const bcryptjs = require('bcryptjs');

// config var of session
const session = require('express-session');
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Invoke the connection module to the DB
const connection = require('./database/db');

// the routes
// app.get('/', (req, res)=> {
//     res.render('index');
// })
app.get('/login', (req, res)=> {
    res.render('login');
})
app.get('/register', (req, res)=> {
    res.render('register');
})

// registration
app.post('/register', async(req, res)=> {
    const user = req.body.user;
    const name = req.body.name;
    const pass = req.body.pass;
    let passwordHaash = await bcryptjs.hash(pass, 8);
    connection.query('INSERT INTO users SET ?', {user:user, name:name, pass:passwordHaash},
    async(error, results)=> {
        if(error){
            console.log(error);
        } else {
            res.render('register', {
                alert: true,
                alertTitle: "Registration",
                alertMessage: "¡Successful Registration!",
                alertIcon: 'success',
                showConfirmButton: false,
                timer: 1500,
                ruta: ''
            })
        }
    })
})

// Authentication
app.post('/auth', async (req,res) => {
    const user = req.body.user;
    const pass = req.body.pass;
    let passwordHaash = await bcryptjs.hash(pass, 8);
    if(user && pass){
        connection.query('SELECT * FROM users WHERE user =?', [user], async (error, results)=>{
            if(results.length == 0 || !(await bcryptjs.compare(pass, results[0].pass))){
                res.render("login", {
                  alert: true,
                  alertTitle: "Error",
                  alertMessage: "Incorrect user and/or password",
                  alertIcon: "error",
                  showConfirmButton: true,
                  timer: 15000,
                  ruta: 'login',
                });
            } else {
                req.session.loggedin = true;           
                req.session.name = results[0].name;
                // res.render('index')
                res.render('login',{
                  alert: true,
                  alertTitle: "Successful connection",
                  alertMessage: "Correct Login!",
                  alertIcon: "success",
                  showConfirmButton: false,
                  timer: 1000,
                  ruta: '',
                })

            }
        })
    } 
} )

//Auth pages
app.get('/', (req, res)=> {
    if(req.session.loggedin){
        res.render('index',{
            login: true,
            name: req.session.name
        });
    } else {
        res.render('index', {
            login: false,
            name: 'You must log in'
        })
    }
})


// logout
app.get('/logout', (req, res)=> {
    req.session.destroy(()=>{
        res.redirect('/')
    })
})



app.listen( process.env.PORT || 3000, (req, res) => {
    console.log(' server running in http://localhost:3000');
})