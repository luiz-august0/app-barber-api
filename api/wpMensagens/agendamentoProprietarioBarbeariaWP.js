import formatters from "../formatters";

export default (data, nome, status, notificacao) => {
    let statusPrint = "";
    let statusColor = "";
    if (status !== null) {
        switch (status) {
            case "RL":
                statusPrint = "MARCADO COMO REALIZADO";
                statusColor = "#10E805";
                break;
            case "R":
                statusPrint = "RECUSADO";
                statusColor = "#EA0800";
                break;
            case "C":
                statusPrint = "CANCELADO";
                statusColor = "#EA0800";
                break;
            default:
                break;
        }
    }

    let dataAgdm = formatters.formatStringDate(new Date(data.Agdm_Data));

    return `Olá ${nome},

Esperamos que você esteja bem!${!notificacao?`${statusPrint!==""?` O agendamento do dia ${dataAgdm} às ${data.Agdm_HoraInicio} na barbearia *${data.Barb_Nome}* foi ${statusPrint}`:
` Foi realizado um agendamento na barbearia *${data.Barb_Nome}* para o dia ${dataAgdm} às ${data.Agdm_HoraInicio}`}`:` Gostaríamos de lembrá-lo do agendamento do dia ${dataAgdm} às ${data.Agdm_HoraInicio} na barbearia *${data.Barb_Nome}*`}. Abaixo, você encontrará os detalhes do agendamento:

*Nome do Cliente:* ${data.NomeCliente}

*Email do Cliente:* ${data.EmailCliente}
${data.ContatoCliente!==null&&data.ContatoCliente!==undefined?
`
*Contato do Cliente:* ${formatters.formataTelefone(data.ContatoCliente.toString())}
`
:""}
*Nome do Barbeiro:* ${data.NomeBarbeiro}
${data.ContatoBarbeiro!==null&&data.ContatoBarbeiro!==undefined?
`
*Contato do Barbeiro:* ${formatters.formataTelefone(data.ContatoBarbeiro.toString())}
`
:""}
*Email do Barbeiro:* ${data.EmailBarbeiro}

*Descrição do Serviço:* ${data.Serv_Nome}

*Valor do Serviço:* R$ ${formatters.PointPerComma(data.Serv_Valor.toFixed(2).toString())}

*Tempo de Duração do Serviço:* Aproximadamente ${data.Minutos} minutos

*Data do Agendamento:* ${dataAgdm}

*Horário do Agendamento:* ${data.Agdm_HoraInicio}`
}