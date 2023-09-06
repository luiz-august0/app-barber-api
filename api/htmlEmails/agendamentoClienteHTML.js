import formatters from "../formatters";

export default (data) => {
    return `
    <p>Olá ${data.NomeCliente},</p>

    <p>Esperamos que você esteja bem! É um prazer agendar um horário para atendê-lo(a) na barbearia <strong>${data.Barb_Nome}</strong>. Abaixo, você encontrará os detalhes do seu agendamento:</p>

    <ul>
        <li><strong>Nome da Barbearia:</strong> ${data.Barb_Nome}</li>
        <li><strong>Endereço da Barbearia:</strong> ${data.Barb_Rua}, ${data.Barb_Numero} - ${data.Barb_Bairro}, ${data.Barb_Cidade} - ${data.Barb_UF}, ${formatters.formataCampo(data.Barb_CEP, "00.000-000")}</li>
        <li><strong>Nome do Barbeiro:</strong> ${data.NomeBarbeiro}</li>
        ${data.ContatoBarbeiro!==null&&data.ContatoBarbeiro!==undefined?
            `<li><strong>Contato do Barbeiro:</strong> ${formatters.formataTelefone(data.ContatoBarbeiro.toString())}</li>`
        :""}
        <li><strong>Descrição do Serviço:</strong> ${data.Serv_Nome}</li>
        <li><strong>Valor do Serviço:</strong> R$ ${formatters.PointPerComma(data.Serv_Valor.toFixed(2).toString())}</li>
        <li><strong>Tempo de Duração do Serviço:</strong> Aproximadamente ${data.Minutos} minutos</li>
        <li><strong>Data do Agendamento:</strong> ${formatters.formatStringDate(new Date(data.Agdm_Data))}</li>
        <li><strong>Horário do Agendamento:</strong> ${data.Agdm_HoraInicio}</li>
    </ul>

    <p>Agradecemos pela escolha da barbearia <strong>${data.Barb_Nome}</strong> e esperamos vê-lo(a) em breve. Tenha um ótimo dia!</p>

    <a 
        style="display: flex; padding: 10px; align-items: center; justify-content: center; cursor: pointer; background-color: #fff; border-radius: 10px; color: #000; font-size: 14px; border-width: 2px; border-color: #000; text-decoration: none; font-size: 16px;"
        href="https://www.google.com/maps?q=${data.Barb_GeoLatitude},${data.Barb_GeoLongitude}">
        <img src="https://cdn-icons-png.flaticon.com/512/2991/2991231.png" style="width: 40px; height: 40px;" />
        Ver no Mapa
    </a>`
}