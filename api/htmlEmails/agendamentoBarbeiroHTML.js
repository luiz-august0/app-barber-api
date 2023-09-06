import formatters from "../formatters";

export default (data) => {
    return `
    <p>Olá ${data.NomeBarbeiro},</p>

    <p>Esperamos que você esteja bem! Foi realizado um agendamento em sua barbearia. Abaixo, você encontrará os detalhes do agendamento:</p>

    <ul>
        <li><strong>Nome do Cliente:</strong> ${data.NomeCliente}</li>
        <li><strong>Email do Cliente:</strong> ${data.EmailCliente}</li>
        ${data.ContatoCliente!==null&&data.ContatoCliente!==undefined?
            `<li><strong>Contato do Cliente:</strong> ${formatters.formataTelefone(data.ContatoCliente.toString())}</li>`
        :""}
        <li><strong>Descrição do Serviço:</strong> ${data.Serv_Nome}</li>
        <li><strong>Valor do Serviço:</strong> R$ ${formatters.PointPerComma(data.Serv_Valor.toFixed(2).toString())}</li>
        <li><strong>Tempo de Duração do Serviço:</strong> Aproximadamente ${data.Minutos} minutos</li>
        <li><strong>Data do Agendamento:</strong> ${formatters.formatStringDate(new Date(data.Agdm_Data))}</li>
        <li><strong>Horário do Agendamento:</strong> ${data.Agdm_HoraInicio}</li>
    </ul>`
}