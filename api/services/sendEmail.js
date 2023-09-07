import agendamentoBarbeiroHTML from '../htmlEmails/agendamentoBarbeiroHTML';
import agendamentoClienteHTML from '../htmlEmails/agendamentoClienteHTML';
import agendamentoProprietarioBarbeariaHTML from '../htmlEmails/agendamentoProprietarioBarbeariaHTML';
import recuperacaoSenhaHTML from '../htmlEmails/recuperacaoSenhaHTML';

require('dotenv').config();
const nodemailer = require("nodemailer");

export default async function sendEmail(data) {
    let subjectEmail = '';
    let htmlEmail = '';
    let subjectEmailAgendamento = '';
    const subjectRecuperacao = "Recuperação de Senha";

    if (data.status!==null) {
        subjectEmailAgendamento = "Status de Agendamento"; 
    }
    else if (data.notificacao) {
        subjectEmailAgendamento = "Lembrete de Agendamento";  
    }
    else {
        subjectEmailAgendamento = "Agendamento de Horário";
    }

    switch (data.tipo) {
        case 'RECUPERACAO':
            subjectEmail = subjectRecuperacao;
            htmlEmail = recuperacaoSenhaHTML(data.link);
            break;
        case 'AGENDAMENTOCLIENTE':
            subjectEmail = subjectEmailAgendamento;
            htmlEmail = agendamentoClienteHTML(data.dataEmail, data.status, data.notificacao);
            break;
        case 'AGENDAMENTOBARBEIRO':
            subjectEmail = subjectEmailAgendamento;
            htmlEmail = agendamentoBarbeiroHTML(data.dataEmail, data.status, data.notificacao);
            break;
        case 'AGENDAMENTOPROPRIETARIOBARBEARIA':
            subjectEmail = subjectEmailAgendamento;
            htmlEmail = agendamentoProprietarioBarbeariaHTML(data.dataEmail, data.nome, data.status, data.notificacao);
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