const pick = (obj: any, keys: string[]) => {
	let finalObj: any = {};
	for (let key of keys) {
		if (obj[key]) {
			finalObj[key] = obj[key];
		}
	}
	return finalObj;
};

export default pick;
