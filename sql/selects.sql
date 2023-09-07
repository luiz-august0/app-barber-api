-- Horarios disponiveis sem considerar agendamento, somente o dia
SELECT H.* FROM horarios H, barbearia_horarios BH
WHERE H.Horario >= BH.BarbH_HoraInicio
AND H.Horario <= BH.BarbH_HoraFim
AND BH.BarbH_Dia = "SEG";

-- Horarios ja agendados por codigo do barbeiro e data de agendamento
SELECT H.* FROM horarios H, agendamento A
WHERE H.Horario >= A.Agdm_HoraInicio
AND H.Horario <= A.Agdm_HoraFim
AND A.Agdm_Barbeiro = 5
AND A.Agdm_Data = '2023-06-20'
AND A.Agdm_Status NOT IN ('C', 'R');

-- Traz somente horarios disponiveis para agendamento
SELECT * FROM horarios
WHERE Horario NOT IN (
SELECT H.Horario FROM horarios H, agendamento A
WHERE H.Horario >= DATE_SUB(A.Agdm_HoraInicio, INTERVAL 60 - 15 MINUTE)
AND H.Horario < A.Agdm_HoraFim
AND A.Agdm_Barbeiro = 5
AND A.Agdm_Data = '2023-06-20'
AND A.Agdm_Status NOT IN ('C', 'R'))
AND Horario IN (
SELECT H.Horario FROM horarios H, barbearia_horarios BH
WHERE H.Horario >= BH.BarbH_HoraInicio
AND H.Horario < DATE_SUB(BH.BarbH_HoraFim, INTERVAL 60 - 15 MINUTE)
AND BH.BarbH_Dia = "SEG")
GROUP BY Id;

SELECT Agdm_Codigo FROM agendamento 
WHERE Agdm_Data = DATE(NOW())
AND Agdm_HoraInicio <= TIME(DATE_ADD(NOW(), INTERVAL - 60 MINUTE))