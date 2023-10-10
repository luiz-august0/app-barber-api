import formatters from "../formatters";

export default (data, status, notificacao) => {
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

    return `Olá ${data.NomeBarbeiro},

Esperamos que você esteja bem!${!notificacao?`${statusPrint!==""?` O agendamento do dia ${dataAgdm} às ${data.Agdm_HoraInicio} foi ${statusPrint}`:
` Foi realizado um agendamento para o dia ${dataAgdm} às ${data.Agdm_HoraInicio}`}`:` Gostaríamos de lembrá-lo de seu agendamento do dia ${dataAgdm} às ${data.Agdm_HoraInicio}`}. Abaixo, você encontrará os detalhes do agendamento:

*Nome do Cliente:* ${data.NomeCliente}

*Email do Cliente:* ${data.EmailCliente}
${data.ContatoCliente!==null&&data.ContatoCliente!==undefined&&data.ContatoCliente!==""?
`
*Contato do Cliente:* ${formatters.formataTelefone(data.ContatoCliente.toString())}
`
:""}
*Descrição do Serviço:* ${data.Serv_Nome}

*Valor do Serviço:* R$ ${formatters.PointPerComma(data.Serv_Valor.toFixed(2).toString())}

*Tempo de Duração do Serviço:* Aproximadamente ${data.Minutos} minutos

*Data do Agendamento:* ${dataAgdm}

*Horário do Agendamento:* ${data.Agdm_HoraInicio}`
}