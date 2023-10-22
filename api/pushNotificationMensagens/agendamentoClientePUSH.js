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

    return `Olá ${data.NomeCliente},${!notificacao?`${statusPrint!==""?` o agendamento do dia ${dataAgdm} às ${data.Agdm_HoraInicio} na barbearia ${data.Barb_Nome} foi ${statusPrint}`:
` foi realizado um agendamento na barbearia ${data.Barb_Nome} para o dia ${dataAgdm} às ${data.Agdm_HoraInicio}`}`:` gostaríamos de lembrá-lo de seu agendamento do dia ${dataAgdm} às ${data.Agdm_HoraInicio} na barbearia ${data.Barb_Nome}`}. Abra o App para visualizar mais informações do agendamento.`
}