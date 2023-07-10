export const DateToWeekday = (date) => {
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