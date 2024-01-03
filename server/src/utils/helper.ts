export const generateToken = (length = 6) => {
  // declare a variable
  let otp = "";

  for (let i = 0; i < length; i++) {
    // get a random character from the set of all characters.
    const digit = Math.floor(Math.random() * 10);
    otp += digit; // append the digit to the OTP
  }
  return otp;
};
