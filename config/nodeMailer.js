import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

let mailTransporter = 
	nodemailer.createTransport(
		{
			service: 'gmail',
			auth: {
				user: process.env.EMAIL,
				pass: process.env.EMAIL_PASSWORD
			}
		}
	);

    export default mailTransporter;
// let mailDetails = {
// 	from: 'bp32395@gmail.com',
// 	to: 'bhanuprksh05@gmail.com',
// 	subject: 'Password reset link',
// 	text: 'Node.js testing mail for GeeksforGeeks'
// };

// mailTransporter
// 	.sendMail(mailDetails,
// 		function (err, data) {
// 			if (err) {
// 				console.log('Error Occurs');
// 			} else {
// 				console.log('Email sent successfully');
// 			}
// 		});
