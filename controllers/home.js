module.exports = {
    getIndex: (req, res) => {
        res.render('index', { title: 'Home', user: req.user });
    }
}