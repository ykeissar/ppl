export function* braid(generator1:Generator,generator2:Generator){
	let isOne = true;
	let val1 = generator1.next().value;
	let val2 = generator2.next().value;
	while( !isUndifined(val1) || !isUndifined(val2)){
		yield isOne ? (!isUndifined(val1) ? val1 : val2) : (!isUndifined(val2) ? val2 : val1);
		console.log(`isOne: ${isOne} , val1: ${val1}, val2:${val2}`);
		val1 = isOne ? generator1.next().value : val1;
		val2 = isOne ? val2 : generator2.next().value;
		isOne = isUndifined(val1) ? false : (isUndifined(val2) ? true : !isOne);
	}
}

export function* biased(generator1:Generator,generator2:Generator){
	let state = 0; // 0,1 => gen1, 2 => gen2 
	let val1 = generator1.next().value;
	let val2 = generator2.next().value;
	while( !isUndifined(val1) || !isUndifined(val2)){
		yield state === 0 || state === 1 ? (!isUndifined(val1) ? val1 : val2) : (!isUndifined(val2) ? val2 : val1);
		console.log(`state: ${state} , val1: ${val1}, val2:${val2}`);
		val1 = state === 0 || state === 1 ? generator1.next().value : val1;
		val2 = state === 2 ? generator2.next().value : val2;
		state = isUndifined(val1) ? 2 : (isUndifined(val2) ? 0 : (state+1)%3);
	}
}

const isUndifined = (x:any):boolean => x === undefined;