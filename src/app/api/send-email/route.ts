import { NextResponse } from "next/server";

export async function GET() {
  const mailjet = require("node-mailjet").connect(
    process.env.MJ_APIKEY_PUBLIC,
    process.env.MJ_APIKEY_PRIVATE
  );
  const request = mailjet.post("send").request({
    FromEmail: "pilot@mailjet.com",
    FromName: "Mailjet Pilot",
    Subject: "Your email flight plan!",
    "Text-part":
      "Dear passenger, welcome to Mailjet! May the delivery force be with you!",
    "Html-part":
      '<h3>Dear passenger, welcome to <a href="https://www.mailjet.com/">Mailjet</a>!<br />May the delivery force be with you!',
    Recipients: [{ Email: "shantanuesakpal1420@gmail.com" }],
    Attachments: [
      {
        "Content-type": "text/plain",
        Filename: "test.txt",
        content: "VGhpcyBpcyB5b3VyIGF0dGFjaGVkIGZpbGUhISEK",
      },
    ],
  });
  request
    .then((result) => {
      console.log(result.body);
    })
    .catch((err) => {
      console.log(err.statusCode);
    });

  return NextResponse.json({ message: "Email sent" });
}

export async function POST(request: Request) {
  const data = await request.json();
  console.log(data);
  return NextResponse.json({ data });
}
