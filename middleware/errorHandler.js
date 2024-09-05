module.exports = function(err, req, res, next) {
  // Log the full error details server-side
  console.error(err.stack);
  
  // In development, provide full error details
  if (req.app.get('env') === 'development') {
    res.locals.message = err.message;
    res.locals.error = err;
  } else {
    // In production, provide a generic message
    res.locals.message = 'An unexpected error occurred';
    res.locals.error = {};
  }

  // Set flash message
  req.flash('error', res.locals.message);

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
};