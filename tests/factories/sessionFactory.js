//factory is a function that creates and returns resource f/reuse
const Buffer = require("safe-buffer").Buffer;
//keygrip node.js module for signing and verifying data
const Keygrip = require("keygrip");
const keys = require("../../config/keys");
const keygrip = new Keygrip([keys.cookieKey]);

module.exports = (user) => {
  const sessionObject = {
    passport: {
      user: user._id.toString(),
    },
  };
  const session = Buffer.from(JSON.stringify(sessionObject)).toString("base64");
  const sig = keygrip.sign(`session=${session}`);
  //   return { session: session, sig: sig };
  // es2015 more pro version
  return { session, sig };
};
