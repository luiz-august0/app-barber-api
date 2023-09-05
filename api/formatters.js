class Formatters {
	DateToWeekday = (date) => {
		let newDate = new Date(date);
		let day = newDate.getDay();

		switch (day) {
			case 0:
				return "SEG";
			case 1:
				return "TER";
			case 2: 
				return "QUA";
			case 3:
				return "QUI";
			case 4:
				return "SEX";
			case 5:
				return "SAB";
			case 6:
				return "DOM"
			default:
				return "";
		}
	} 

	formataCampo(campo, Mascara) { 
		if (campo === null) {
			return "";
		}

		var boleanoMascara; 

		var exp = /\-|\.|\/|\(|\)| /g
		var campoSoNumeros = campo.toString().replace( exp, "" ); 

		var i = 0;
		var posicaoCampo = 0;    
		var NovoValorCampo ="";
		var TamanhoMascara = campoSoNumeros.length;; 

		for(i=0; i<= TamanhoMascara; i++) { 
			boleanoMascara = ((Mascara.charAt(i) == "-") || (Mascara.charAt(i) == ".")
														|| (Mascara.charAt(i) == "/")) 
			boleanoMascara = boleanoMascara || ((Mascara.charAt(i) == "(") 
														|| (Mascara.charAt(i) == ")") || (Mascara.charAt(i) == " ")) 
			if (boleanoMascara) { 
				NovoValorCampo += Mascara.charAt(i); 
				TamanhoMascara++;
			}else { 
				NovoValorCampo += campoSoNumeros.charAt(posicaoCampo); 
				posicaoCampo++; 
			}          
		}      
		return NovoValorCampo;
	}

	formataCPF = (value) => {
		if (value === null) {
			return "";
		}

		return value.replace(/^(\d{3})\D*(\d{3})\D*(\d{3})\D*(\d{2})$/g,'$1.$2.$3-$4');
	}

	formataTelefone = (value) => {
		if (value === null) {
			return "";
		}

		value = value.replace(/\D/g,'');
		value = value.replace(/(\d{2})(\d)/,"($1) $2");
		value = value.replace(/(\d)(\d{4})$/,"$1-$2");
		return value;
	} 

	minsToHHMMSS = (value) => {
		var mins_num = parseFloat(value, 10);
		var hours   = Math.floor(mins_num / 60);
		var minutes = Math.floor((mins_num - ((hours * 3600)) / 60));
		var seconds = Math.floor((mins_num * 60) - (hours * 3600) - (minutes * 60));

		if (hours   < 10) {hours   = "0"+hours;}
		if (minutes < 10) {minutes = "0"+minutes;}
		if (seconds < 10) {seconds = "0"+seconds;}
		return hours+':'+minutes+':'+seconds;
	}

	formatStringDate = (date) => {
		let year = date.getFullYear();
		let month = (1 + date.getMonth()).toString().padStart(2, '0');
		let day = date.getDate().toString().padStart(2, '0');
	
		return day + '/' + month + '/' + year;
	}

	formatDateToSql = (date) => {
		let year = date.getFullYear();
		let month = (1 + date.getMonth()).toString().padStart(2, '0');
		let day = date.getDate().toString().padStart(2, '0');
	
		return year + '-' + month + '-' + day;
	}

	commaPerPoint = (value) => {
		if (value !== '' && value !== null && value !== undefined) {
			return value.replace(',', '.');
		} else {
			return '';
		}
	}

	PointPerComma = (value) => {
		if (value !== '' && value !== null && value !== undefined) {
			return value.replace('.', ',');
		} else {
			return '';
		}
	}
}

export default new Formatters();