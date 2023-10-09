import axios from 'axios';
import agendamentoBarbeiroHTML from '../htmlEmails/agendamentoBarbeiroHTML';
import agendamentoClienteHTML from '../htmlEmails/agendamentoClienteHTML';
import agendamentoProprietarioBarbeariaHTML from '../htmlEmails/agendamentoProprietarioBarbeariaHTML';
import recuperacaoSenhaHTML from '../htmlEmails/recuperacaoSenhaHTML';

require('dotenv').config();
const nodemailer = require("nodemailer");
const api = axios.create({
    baseURL: "http://localhost:6000"
});

export async function sendEmail(data) {
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
            htmlEmail = agendamentoClienteHTML(data.dataNotificacao, data.status, data.notificacao);
            break;
        case 'AGENDAMENTOBARBEIRO':
            subjectEmail = subjectEmailAgendamento;
            htmlEmail = agendamentoBarbeiroHTML(data.dataNotificacao, data.status, data.notificacao);
            break;
        case 'AGENDAMENTOPROPRIETARIOBARBEARIA':
            subjectEmail = subjectEmailAgendamento;
            htmlEmail = agendamentoProprietarioBarbeariaHTML(data.dataNotificacao, data.nome, data.status, data.notificacao);
            break;
    }

    let transporter = nodemailer.createTransport({
        host: process.env.SMTP,
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL, 
            pass: process.env.EMAILPASS
        },
    });
    
    
    return await transporter.sendMail({
        from: "Suporte Barbeiro App",
        to: data.email,
        subject: subjectEmail,
        html: htmlEmail
    });   
}

export async function sendMessageWP(data) {
    let subjectContact = '';
    let htmlMessage = '';

    switch (data.tipo) {
        case 'AGENDAMENTOCLIENTE':
            subjectContact = data.dataNotificacao.ContatoCliente;
            htmlMessage = agendamentoClienteHTML(data.dataNotificacao, data.status, data.notificacao);
            break;
        case 'AGENDAMENTOBARBEIRO':
            subjectContact = data.dataNotificacao.ContatoBarbeiro;
            htmlMessage = agendamentoBarbeiroHTML(data.dataNotificacao, data.status, data.notificacao);
            break;
        case 'AGENDAMENTOPROPRIETARIOBARBEARIA':
            subjectContact = data.contato;
            htmlMessage = agendamentoProprietarioBarbeariaHTML(data.dataNotificacao, data.nome, data.status, data.notificacao);
            break;
    }

    if (subjectContact!==null) {
        try {
            api.post('/barberwp/mensagem', { contact: subjectContact, message: htmlMessage });
            return;
        } catch (error) {
            return error;
        }
    }
}