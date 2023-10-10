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

    return `Olá ${data.NomeCliente},
    
Esperamos que você esteja bem!${!notificacao?`${statusPrint!==""?` O agendamento do dia ${dataAgdm} às ${data.Agdm_HoraInicio} na barbearia *${data.Barb_Nome}* foi ${statusPrint}`:
` Foi realizado um agendamento na barbearia *${data.Barb_Nome}* para o dia ${dataAgdm} às ${data.Agdm_HoraInicio}`}`:` Gostaríamos de lembrá-lo de seu agendamento do dia ${dataAgdm} às ${data.Agdm_HoraInicio} na barbearia *${data.Barb_Nome}*`}. Abaixo, você encontrará os detalhes do agendamento:

*Nome da Barbearia:* ${data.Barb_Nome}

*Endereço da Barbearia:* ${data.Barb_Rua}, ${data.Barb_Numero} - ${data.Barb_Bairro}, ${data.Barb_Cidade} - ${data.Barb_UF}, ${formatters.formataCampo(data.Barb_CEP, "00.000-000")}

*Nome do Barbeiro:* ${data.NomeBarbeiro}
${data.ContatoBarbeiro!==null&&data.ContatoBarbeiro!==undefined&&data.ContatoBarbeiro!==""?
`
*Contato do Barbeiro:* ${formatters.formataTelefone(data.ContatoBarbeiro.toString())}
`
:""}
*Descrição do Serviço:* ${data.Serv_Nome}

*Valor do Serviço:* R$ ${formatters.PointPerComma(data.Serv_Valor.toFixed(2).toString())}

*Tempo de Duração do Serviço:* Aproximadamente ${data.Minutos} minutos

*Data do Agendamento:* ${dataAgdm}

*Horário do Agendamento:* ${data.Agdm_HoraInicio}
    
Agradecemos pela escolha da barbearia *${data.Barb_Nome}* e esperamos vê-lo(a) em breve. Tenha um ótimo dia!
 
Clique no link para visualizar a barbearia no google maps: https://www.google.com/maps?q=${data.Barb_GeoLatitude},${data.Barb_GeoLongitude} `
}