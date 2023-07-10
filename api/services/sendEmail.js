require('dotenv').config();
const nodemailer = require("nodemailer");

export default async function sendEmail(data) {
    let subjectEmail = '';
    let htmlEmail = '';

    const recuperacaoSub = "Recuperação de Senha";
    const recuperacaoHtml = '<p>Olá,</p><p>Você solicitou a recuperação de senha, por gentileza, acesse o link a baixo para realizar a troca de sua senha.<br></p><p>' + 
                            '<u>' + data.link + '</u></p>Caso você não tenha feito essa solicitação, sugerimos que verifique suas informações de segurança o quanto antes.</p>';
    
    switch (data.tipo) {
        case 'RECUPERACAO':
            subjectEmail = recuperacaoSub;
            htmlEmail = recuperacaoHtml;
            break;
    }

    const send = async() => {
        let transporter = nodemailer.createTransport({
            host: process.env.SMTP,
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL, 
                pass: process.env.EMAILPASS
            },
        });
      
        
        await transporter.sendMail({
            from: "Suporte Barbeiro App",
            to: data.email,
            subject: subjectEmail,
            html: htmlEmail
        });   
    }

    return await send();
}