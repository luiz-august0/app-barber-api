import formatters from "../formatters"

export default (data) => {
    return `
    <p>Olá ${data.NomeCliente},</p>

    <p>Esperamos que você esteja bem! É um prazer agendar um horário para atendê-lo(a) na barbearia <strong>${data.Barb_Nome}</strong>. Abaixo, você encontrará os detalhes do seu agendamento:</p>

    <ul>
        <li><strong>Nome da Barbearia:</strong> ${data.Barb_Nome}</li>
        <li><strong>Endereço da Barbearia:</strong> ${data.Barb_Rua}, ${data.Barb_Numero} - ${data.Barb_Bairro}, ${data.Barb_Cidade} - ${data.Barb_UF}, ${formatters.formataCampo(data.Barb_CEP, "00.000-000")}/li>
        <li><strong>Nome do Barbeiro:</strong> ${data.NomeBarbeiro}</li>
        ${data.ContatoBarbeiro!==null&&data.ContatoBarbeiro!==undefined?
            `<li><strong>Contato do Barbeiro:</strong> ${data.ContatoBarbeiro}</li>`
        :null}
        <li><strong>Descrição do Serviço:</strong> ${data.Serv_Nome}</li>
        <li><strong>Valor do Serviço:</strong> R$ ${data.Serv_Valor}</li>
        <li><strong>Tempo de Duração do Serviço:</strong> Aproximadamente ${data.Minutos} minutos</li>
        <li><strong>Data do Agendamento:</strong> ${data.Agdm_Data}</li>
        <li><strong>Horário do Agendamento:</strong> ${data.Agdm_HoraInicio}</li>
    </ul>

    <p>Agradecemos pela escolha da barbearia <strong>${data.Barb_Nome}</strong> e esperamos vê-lo(a) em breve. Tenha um ótimo dia!</p>

    <button 
        style="width: 150px; height: 80px; border-radius: 10px; background-color: #000; color: #fff; align-items: center; justify-content: center"
        onclick="">
        Visualizar barbearia no mapa
    </button>`
}