import axios from 'axios';
import agendamentoBarbeiroHTML from '../htmlEmails/agendamentoBarbeiroHTML';
import agendamentoClienteHTML from '../htmlEmails/agendamentoClienteHTML';
import agendamentoProprietarioBarbeariaHTML from '../htmlEmails/agendamentoProprietarioBarbeariaHTML';
import recuperacaoSenhaHTML from '../htmlEmails/recuperacaoSenhaHTML';
import agendamentoClienteWP from '../wpMensagens/agendamentoClienteWP';
import agendamentoBarbeiroWP from '../wpMensagens/agendamentoBarbeiroWP';
import agendamentoProprietarioBarbeariaWP from '../wpMensagens/agendamentoProprietarioBarbeariaWP';

require('dotenv').config();
const nodemailer = require("nodemailer");
const apiWP = axios.create({
    baseURL: "http://localhost:6000"
});

const apiExpo = axios.create({
    baseURL: "https://exp.host"
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
    let wpMessage = '';

    switch (data.tipo) {
        case 'AGENDAMENTOCLIENTE':
            subjectContact = data.dataNotificacao.ContatoCliente;
            wpMessage = agendamentoClienteWP(data.dataNotificacao, data.status, data.notificacao);
            break;
        case 'AGENDAMENTOBARBEIRO':
            subjectContact = data.dataNotificacao.ContatoBarbeiro;
            wpMessage = agendamentoBarbeiroWP(data.dataNotificacao, data.status, data.notificacao);
            break;
        case 'AGENDAMENTOPROPRIETARIOBARBEARIA':
            subjectContact = data.contato;
            wpMessage = agendamentoProprietarioBarbeariaWP(data.dataNotificacao, data.nome, data.status, data.notificacao);
            break;
    }

    if (subjectContact!==null&&subjectContact!=="") {
        return await apiWP.post('/barberwp/mensagem', { contact: subjectContact, message: wpMessage });
    }
}

export async function sendMessageWP(data) {
    let subjectToken = '';
    let wpMessage = '';
    let notificationTitle = '';

    if (data.status!==null) {
        notificationTitle = "Status de Agendamento"; 
    }
    else if (data.notificacao) {
        notificationTitle = "Lembrete de Agendamento";  
    }
    else {
        notificationTitle = "Agendamento de Horário";
    }

    switch (data.tipo) {
        case 'AGENDAMENTOCLIENTE':
            subjectToken = data.dataNotificacao.ContatoCliente;
            wpMessage = agendamentoClienteWP(data.dataNotificacao, data.status, data.notificacao);
            break;
        case 'AGENDAMENTOBARBEIRO':
            subjectToken = data.dataNotificacao.ContatoBarbeiro;
            wpMessage = agendamentoBarbeiroWP(data.dataNotificacao, data.status, data.notificacao);
            break;
        case 'AGENDAMENTOPROPRIETARIOBARBEARIA':
            subjectToken = data.contato;
            wpMessage = agendamentoProprietarioBarbeariaWP(data.dataNotificacao, data.nome, data.status, data.notificacao);
            break;
    }

    if (subjectToken!==null&&subjectToken!=="") {
        return await apiExpo.post('/--/api/v2/push/send', { to: subjectToken, title: notificationTitle, body: wpMessage });
    }
}