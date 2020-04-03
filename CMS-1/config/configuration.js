module.exports = {
    mongoDbUrl : 'mongodb+srv://dev:dev@clustercms-faqog.gcp.mongodb.net/cmsdb?retryWrites=true&w=majority',
    PORT: process.env.PORT || 3000,
    globalVariables: (req, res, next) => {
      res.locals.success_message = req.flash("success_message");
      res.locals.error_message = req.flash("error_message");

      next();
    }
};