import axios from 'axios';
import agendamentoBarbeiroHTML from '../htmlEmails/agendamentoBarbeiroHTML';
import agendamentoClienteHTML from '../htmlEmails/agendamentoClienteHTML';
import agendamentoProprietarioBarbeariaHTML from '../htmlEmails/agendamentoProprietarioBarbeariaHTML';
import recuperacaoSenhaHTML from '../htmlEmails/recuperacaoSenhaHTML';
import agendamentoClienteWP from '../wpMensagens/agendamentoClienteWP';
import agendamentoBarbeiroWP from '../wpMensagens/agendamentoBarbeiroWP';
import agendamentoProprietarioBarbeariaWP from '../wpMensagens/agendamentoProprietarioBarbeariaWP';
import agendamentoClientePUSH from '../pushNotificationMensagens/agendamentoClientePUSH';
import agendamentoBarbeiroPUSH from '../pushNotificationMensagens/agendamentoBarbeiroPUSH';
import agendamentoProprietarioBarbeariaPUSH from '../pushNotificationMensagens/agendamentoProprietarioBarbeariaPUSH';

require('dotenv').config();
const nodemailer = require("nodemailer");
const mysql = require('../config/mysql').pool;
const apiWP = axios.create({
    baseURL: process.env.APIWP_URL
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
        return await apiWP.post('/wpvenom/mensagem', { contact: subjectContact, message: wpMessage });
    }
}

export async function sendPushNotification(data) {
    let pushMessage = '';
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
            pushMessage = agendamentoClientePUSH(data.dataNotificacao, data.status, data.notificacao);
            break;
        case 'AGENDAMENTOBARBEIRO':
            pushMessage = agendamentoBarbeiroPUSH(data.dataNotificacao, data.status, data.notificacao);
            break;
        case 'AGENDAMENTOPROPRIETARIOBARBEARIA':
            pushMessage = agendamentoProprietarioBarbeariaPUSH(data.dataNotificacao, data.nome, data.status, data.notificacao);
            break;
    }

    function sendPush() {
        return new Promise((resolve, reject) => {
            mysql.getConnection((error, conn) => {
                if (error) return reject(error);
    
                try {				
                    conn.query(
                        `SELECT Token FROM usuario_token_notificacao_app WHERE Usr_Codigo = ${data.id}`,
                        (error, result, fields) => {
                            if (error) return reject(error);
                            if (result.length > 0) {
                                result.map(async(e) => {
                                    await apiExpo.post('/--/api/v2/push/send', { to: e.Token, title: notificationTitle, body: pushMessage });
                                })
                            }

                            return resolve();                     
                        }
                    )
                    conn.release();
                } catch (error) {
                    return reject(error)
                }
            })
        })
    }

    return await sendPush();
}