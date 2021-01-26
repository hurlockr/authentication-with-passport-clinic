import express from "express";
import passport from "passport";

const sessionRouter = new express.Router();

sessionRouter.post("/", (req, res, next) => {
  return passport.authenticate("local", (err, user) => { // built into passport, uses the strategy we setup to find the user by looking at params
    if (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }

    if (user) {
      return req.login(user, () => { // login the user if the authentication fails 
        return res.status(201).json(user);
      });
    }

    return res.status(401).json(undefined);
  })(req, res, next); // weirdly, the authenticate method returns a function, so we need to pass req, res and next to that function
});

sessionRouter.get("/current", async (req, res) => {
  // this endpoint helps us check if there is a signed in user, especially any time the page refreshes 
  if (req.user) {
    res.status(200).json(req.user);
  } else {
    res.status(401).json(undefined);
  }
});

sessionRouter.delete("/", (req, res) => {
  req.logout(); // built in method to delete our user session when signing out
  res.status(200).json({ message: "User signed out" });
});

export default sessionRouter;
