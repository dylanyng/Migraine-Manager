module.exports = {
    getIndex: (req, res) => {
        res.render('index', { 
            title: 'Home', 
            user: req.user,
            layout: false // Do not use layout.ejs
        });
    },
    getContact: (req, res) => {
        res.render('contact', { 
            title: 'Contact', 
            user: req.user,
            layout: false // Do not use layout.ejs
        });
    }
}