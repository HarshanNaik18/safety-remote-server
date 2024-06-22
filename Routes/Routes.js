const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();

// Retrieve email credentials and parent email from environment variables
const EMAIL_USER = process.env.NODE_SENDER_EMAIL;
const EMAIL_PASSWORD = process.env.NODE_EMAIL_PASSWORD;
const TO_EMAIL = process.env.NODE_TO_EMAIL;
const MAP_API_KEY = process.env.NODE_GOOGLE_MAP_API_KEY;

// Function to generate Google Maps Static URL
const generateStaticMapUrl = (latitude, longitude) => {
  const apiKey = MAP_API_KEY;
  const baseUrl = "https://maps.googleapis.com/maps/api/staticmap";
  const zoom = 15;
  const size = "600x400";
  const marker = `markers=color:red%7Clabel:A%7C${latitude},${longitude}`;

  return `${baseUrl}?center=${latitude},${longitude}&zoom=${zoom}&size=${size}&${marker}&key=${apiKey}`;
};

// Function to generate Google Maps URL for redirection
const generateMapsUrl = (latitude, longitude) => {
  return `https://www.google.com/maps?q=${latitude},${longitude}`;
};

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
});

// Endpoint to send location
router.get("/send_location", (req, res) => {
  const { latitude, longitude } = req.query;
  const mapsUrl = generateMapsUrl(latitude, longitude);

  const subject = "Child Location Alert";
  const htmlContent = `
    <a href="${mapsUrl}" target="_blank">
      <h1>Hello</h1>
    </a>
  `;
  // HTML content for the email
  //   const htmlContent = `
  //   <h1>Alert</h1>
  //   <p>Your child has clicked the button. Their location is</p>
  //   <a href="${mapsUrl}" target="_blank">
  //     <img src="${staticMapUrl}" alt="Map">
  //   </a>
  // `;

  const mailOptions = {
    from: EMAIL_USER,
    to: TO_EMAIL,
    subject: subject,
    html: htmlContent,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send("Error sending email: " + error.toString());
    }
    res.status(200).send("Location sent successfully!");
  });
});

// Endpoint to send location with image
router.post("/send_location_with_image", (req, res) => {
  const { latitude, longitude, image } = req.body;
  const mapsUrl = generateMapsUrl(latitude, longitude);

  const subject = "Child Location Alert";
  const htmlContent = `
    <a href="${mapsUrl}" target="_blank">
      <h1>Hello</h1>
    </a>
  `;
  // HTML content for the email
  //   const htmlContent = `
  //   <h1>Alert</h1>
  //   <p>Your child has clicked the button. Their location is</p>
  //   <a href="${mapsUrl}" target="_blank">
  //     <img src="${staticMapUrl}" alt="Map">
  //   </a>
  // `;

  const mailOptions = {
    from: EMAIL_USER,
    to: TO_EMAIL,
    subject: subject,
    html: htmlContent,
    attachments: [
      {
        filename: "image.jpg",
        content: image,
        encoding: "base64",
      },
    ],
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send("Error sending email: " + error.toString());
    }
    res.status(200).send("Location and image sent successfully!");
  });
});


router.get("/hello", (req, res)=>{
    res.status(200).send("Hello from backend");
})

module.exports = router;
