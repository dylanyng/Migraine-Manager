module.exports = function(err, req, res, next) {
    console.error(err.stack);
    
    // Set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // Set flash message
    req.flash('error', err.message || 'An unexpected error occurred');
  
    // Render the error page
    res.status(err.status || 500);
    res.render('error');
  };