const os = require('os');
os.hostname = () => 'localhost';
import _ from 'lodash';

const nodemailer = require("nodemailer");
require('dotenv').config()

const sendSimpleEmail = async (dataSend) => {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL, // generated ethereal user
            pass: process.env.EMAIL_PASSWORD, // generated ethereal password
        },
    });


    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"nhân viên iE 👻" <jack1102ng@gmail.com>', // sender address
        to: dataSend.recieverEmail, // list of receivers
        subject: "Thông tin đơn hàng ", // Subject line
        text: "Thông tin đơn hàng", // plain text body
        html: getBookEmailHtml(dataSend)
    });
}

const getBookEmailHtml = (dataSend) => {
    let result = ''
    if (dataSend.lang === 'vi') {
        result = `
        <h3>Xin chào ${dataSend.clientName}</h3>
        <p>Đây là thông tin về đơn hàng bạn đã đặt ở ecobike.com</p>
        <p>Ngày đặt hàng: ${dataSend.dateData}</p>
        <p>Nơi nhận: ${dataSend.noi_nhan}</p>
        <p>Ghi chú: ${dataSend.ghi_chu}</p>
        <p><b>Danh sách sản phẩm đã đặt: </b></p>
        <ul>
        ${dataSend.orderDetails && dataSend.orderDetails.length > 0 &&
            dataSend.orderDetails.map(item => (
                `
                <li key=${item.id}>
                    <div>
                        <span>${item.productData && !_.isEmpty(item.productData) && item.productData.name}
                        &nbsp;
                        <span>x${item.so_luong}</span>
                        &nbsp;
                        <span>${item.sum_price}&nbsp;VND</span>
                    </div>
                </li>
                `
            ))
            }
        </ul>
        <p><b>Phương thức giao hàng:</b>&nbsp;${!_.isEmpty(dataSend.deliveryData) && dataSend.deliveryData.valueVi}</p>
        <p><b>Phương thức thanh toán:</b>&nbsp;${!_.isEmpty(dataSend.paymentData) && dataSend.paymentData.valueVi}</p>
        <p>Nếu tất cả thông tin ở trên là chính xác, vui lòng click vào nút Xác nhận để xác nhận</p>
        <button><a href=${dataSend.redirect} target="_blank">Xác nhận</a></button>
    `
    } else {
        result = `
        <h3>Dear ${dataSend.clientName}</h3>
        <p>This is the information about the order you have booked at ecobike.com</p>
        <p>Time order: ${dataSend.dateData}</p>
        <p>Address: ${dataSend.noi_nhan}</p>
        <p>Note: ${dataSend.ghi_chu}</p>
        <ul>
        ${dataSend.orderDetails && dataSend.orderDetails.length > 0 &&
            dataSend.orderDetails.map(item => (
                `
                <li key=${item.id}>
                    <div>
                        <span>${item.productData && !_.isEmpty(item.productData) && item.productData.name}
                        &nbsp;
                        <span>x${item.so_luong}</span>
                        &nbsp;
                        <span>${item.sum_price}&nbsp;VND</span>
                    </div>
                </li>
                `
            ))
            }
        </ul>
        <p><b>Ship method:</b>&nbsp;${dataSend.deliveryData.valueEn}</p>
        <p><b>Payment method:</b>&nbsp;${dataSend.paymentData.valueEn}</p>
        <p>If all the information above is correct, please click the Confirm button to confirm</p>
        <button><a href=${dataSend.redirect} target="_blank">Confirm</a></button>
    `
    }
    return result
}

//---------------------------------------------------------------------------

const sendRemedyEmail = async (dataSend) => {

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL, // generated ethereal user
            pass: process.env.EMAIL_PASSWORD, // generated ethereal password
        },
    });


    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"bác sĩ iE 👻" <jack1102ng@gmail.com>', // sender address
        to: dataSend.email, // list of receivers
        subject: "Hóa đơn khám bệnh của bạn", // Subject line
        text: "Hóa đơn khám bệnh của bạn", // plain text body
        html: getRemedyEmailHtml(dataSend),
        attachments: [
            {   // encoded string as an attachment
                filename: `remery-${dataSend.patientId}-${new Date()}.png`,
                content: dataSend.imageBase64.split("base64,")[1],
                encoding: 'base64'
            },
        ]
    });
}

const getRemedyEmailHtml = (dataSend) => {
    let result = ''
    if (dataSend.lang === 'vi') {
        result = `
        <h3>Xin chào ${dataSend.patientName}</h3>
        <p>Bạn đã được bác sĩ xác nhận lịch hẹn khám bệnh, đây là hóa đơn của bạn</p>
        <p>Chân thành cảm ơn</p>
    `
    } else {
        result = `
        <h3>Dear ${dataSend.patientName}</h3>
        <p>You've been confirmed by your doctor for your appointment, here's your bill</p>
        <p>Thank you very much</p>
    `
    }
    return result
}

export {
    sendSimpleEmail, sendRemedyEmail
}