const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const mysql = require('mysql');
const app = express();

// Configure middleware
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("./public"));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'madhav2711',
    database: 'event_management'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL Server Status -  CONNECTED');
});


// Routes
app.get('/', (req, res) => {
    res.render('login');
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.get('/eve', (req, res) => {
    res.render('eve');
   });

app.post('/signup', (req, res) => {
    const { username, password } = req.body;
    const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.query(sql, [username, password], (err, result) => {
        if (err) {
            res.send('An error occurred during signup.');
        } else {
            res.redirect('/');
        }
    });
});


app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.query(sql, [username, password], (err, results) => {
        if (err || results.length === 0) {
            res.send('Invalid username or password.');
        } else {
            req.session.user = results[0];
            req.session.username = username; // Store username in session
            res.redirect('/dashboard');
        }
    });
});



// Dynamic event route
app.get('/event/:eventType', (req, res) => {
    const eventType = req.params.eventType;
    let eventDetails = {};

    // Define event details based on the eventType parameter
    if (eventType === 'workshops') {
        eventDetails = {
            name: 'Workshops',
            venue: 'Universe',
            imageUrl: 'https://static.vecteezy.com/system/resources/thumbnails/007/117/181/small/training-of-office-staff-increase-sales-and-skills-team-thinking-and-brainstorming-analytics-of-company-information-flat-illustration-vector.jpg',
            description: 'Unleash your creativity and gain valuable skills with theEVEsuites interactive workshops!  We craft engaging sessions led by industry experts, designed to equip you with practical knowledge. Learn by doing in a collaborative environment, with ample opportunity to ask questions and network.  theEVEsuite provides everything you need - from venue sourcing to registration - for a seamless and productive workshop experience.  Reserve your spot today and empower yourself!'
        };
    } else if (eventType === 'wedding') {
        eventDetails = {
            name: 'Wedding',
            imageUrl: 'https://st3.depositphotos.com/1000917/12845/i/450/depositphotos_128450570-stock-photo-amazing-hindu-wedding-ceremony-details.jpg',
            description: 'Celebrate your special day with our organization & management.'
        };
    } else if (eventType === 'summit') {
        eventDetails = {
            name: 'Summit',
            imageUrl: 'summit_image_url',
            description: 'Celebrate your special day surrounded by nature and beauty.'
        };
    }   else if (eventType === 'wedrec') {
        eventDetails = {
            name: 'Wedding Reception',
           imageUrl: 'summit_image_url',
            description: 'Celebrate your special day surrounded by nature and beauty.'
        };
    }
        else if (eventType === 'ringceremony') {
        eventDetails = {
            name: 'Ring Ceremony',
            venue: 'Lovely Garden',
            imageUrl: 'summit_image_url',
            description: 'Celebrate your special day surrounded by nature and beauty.'
        };
    }   else if (eventType === 'bday') {
        eventDetails = {
            name: 'Birthday Party',
            venue: 'Lovely Garden',
            imageUrl: 'summit_image_url',
            description: 'Celebrate your special day surrounded by nature and beauty.'
        };
    }   else if (eventType === 'anniv') {
        eventDetails = {
            name: 'Anniversary',
            venue: 'Lovely Garden',
            imageUrl: 'summit_image_url',
            description: 'Celebrate your special day surrounded by nature and beauty.'
        };
    }   else if (eventType === 'funeral') {
        eventDetails = {
            name: 'Funeral & Related...',
            venue: 'Lovely Garden',
            imageUrl: 'summit_image_url',
            description: 'Celebrate your special day surrounded by nature and beauty.'
        };
    }   else if (eventType === 'office') {
        eventDetails = {
            name: 'Office Party',
            venue: 'Lovely Garden',
            imageUrl: 'summit_image_url',
            description: 'Celebrate your special day surrounded by nature and beauty.'
        };
    }   else if (eventType === 'meeting') {
        eventDetails = {
            name: 'Official Meeting',
            venue: 'Lovely Garden',
            imageUrl: 'summit_image_url',
            description: 'Celebrate your special day surrounded by nature and beauty.'
        };
    }
    // Add more conditions for other event types as needed...

    res.render('eve', { eventDetails });
});

app.post('/events/register', (req, res) => {
    const { name, address, email, phone, field5, field6, field7, loc, ppl, evetime, food, cmnt } = req.body;
    const sql = 'INSERT INTO events (cli_name, cli_address, email, phone, field5, field6, field7, loc, ppl, evetime, food, cmnt, username) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const username = req.session.username;
    db.query(sql, [name, address, email, phone, field5, field6, field7, loc, ppl, evetime, food, cmnt, username], (err, result) => {
        if (err) {
            res.send('An error occurred.');
        } else {
            res.render('success'); // Render the success.ejs template
        }
    });
});



app.get('/dashboard', (req, res) => {
    // Check if user is authenticated
    if (!req.session.user) {
        res.redirect('/'); // Redirect to login if user is not authenticated
    } else {
        // Fetch events for the logged-in user (sample data)
        const events = [
            
        ];
        res.render('dashboard', { user: req.session.user, events }); // Pass 'events' array to dashboard.ejs
    }
});

app.get('/myevents', (req, res) => {
    // Check if user is authenticated
    if (!req.session.user) {
        res.redirect('/'); // Redirect to login if user is not authenticated
    } else {
        const username = req.session.username;
        const sql = 'SELECT * FROM events WHERE username = ?';
        db.query(sql, [username], (err, results) => {
            if (err) {
                res.send('An error occurred.');
            } else {
                res.render('myevents', { events: results }); // Render myevents.ejs with events data
            }
        });
    }
});


app.post('/myevents/delete', (req, res) => {
    const eventId = req.body.eventId;
    const sql = 'DELETE FROM events WHERE id = ?';
    db.query(sql, [eventId], (err, result) => {
        if (err) {
            res.send('An error occurred while deleting the event.');
        } else {
            res.redirect('/myevents'); // Redirect back to myevents page after deletion
        }
    });
});

app.get('/admin', (req, res) => {
    res.render('admin_login');
});


app.post('/admin/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'tes2711') {
        req.session.admin = true;
        res.redirect('/admin/dashboard');
    } else {
        res.send('Invalid admin credentials.');
    }
});


app.get('/admin/dashboard', (req, res) => {
    if (!req.session.admin) {
        res.redirect('/admin');
    } else {
        const sql = 'SELECT *, DATE_FORMAT(booked_at, "%Y-%m-%d %H:%i:%s") AS booking_date FROM events';
        db.query(sql, (err, results) => {
            if (err) {
                res.send('An error occurred.');
            } else {
                res.render('admin_dashboard', { events: results });
            }
        });
    }
});


app.post('/admin/events/delete', (req, res) => {
    const eventId = req.body.eventId;
    const sqlDeleteEvent = 'DELETE FROM events WHERE id = ?';
    db.query(sqlDeleteEvent, [eventId], (err, result) => {
        if (err) {
            res.json({ success: false });
        } else {
            res.json({ success: true, username: req.body.username });
        }
    });
});

app.post('/admin/users/delete', (req, res) => {
    const username = req.body.username;
    const sqlDeleteUser = 'DELETE FROM users WHERE username = ?';
    db.query(sqlDeleteUser, [username], (err, result) => {
        if (err) {
            res.json({ success: false });
        } else {
            res.json({ success: true });
        }
    });
});





// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy(); // Destroy session
    res.redirect('/'); // Redirect to login page
});


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});