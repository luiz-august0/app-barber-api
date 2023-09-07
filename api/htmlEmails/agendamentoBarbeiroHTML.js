import formatters from "../formatters";

export default (data, status) => {
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

    return `
    <p>Olá ${data.NomeBarbeiro},</p>

    <p>Esperamos que você esteja bem! ${statusPrint!==""?` O agendamento do dia ${dataAgdm} às ${data.Agdm_HoraInicio} foi <strong style="color: ${statusColor};">${statusPrint}</strong>`:
    ` Foi realizado um agendamento em sua barbearia para o dia ${dataAgdm} às ${data.Agdm_HoraInicio}`}. Abaixo, você encontrará os detalhes do agendamento:</p>

    <ul>
        <li><strong>Nome do Cliente:</strong> ${data.NomeCliente}</li>
        <li><strong>Email do Cliente:</strong> ${data.EmailCliente}</li>
        ${data.ContatoCliente!==null&&data.ContatoCliente!==undefined?
            `<li><strong>Contato do Cliente:</strong> ${formatters.formataTelefone(data.ContatoCliente.toString())}</li>`
        :""}
        <li><strong>Descrição do Serviço:</strong> ${data.Serv_Nome}</li>
        <li><strong>Valor do Serviço:</strong> R$ ${formatters.PointPerComma(data.Serv_Valor.toFixed(2).toString())}</li>
        <li><strong>Tempo de Duração do Serviço:</strong> Aproximadamente ${data.Minutos} minutos</li>
        <li><strong>Data do Agendamento:</strong> ${dataAgdm}</li>
        <li><strong>Horário do Agendamento:</strong> ${data.Agdm_HoraInicio}</li>
    </ul>`
}