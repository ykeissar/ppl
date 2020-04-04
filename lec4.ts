interface Animal{
	animalId: string
	count?: number
}

interface Dog{
	animalId: string
	dogId: string
	count?: number
}

interface Greyhound{
	animalId: string
	dogId: string
	greyhoundId: string
	count?: number
}
let dog0:Animal = {animalId:"1"};
let dog1:Dog = {animalId:"123",dogId:"11"};
let dog2:Greyhound = {animalId:"123",dogId:"11",greyhoundId:"1323"};

let array:Dog[] = [dog1,dog2];
console.log(array);
// let func1:((g:Greyhound) => Greyhound) = g => {
// 	let g2:Greyhound = g;
// 	g2.count++;
// 	return g2;
// };

// let func2:((g:Greyhound) => Animal) = g => {
// 	let g2:Greyhound = g;
// 	g2.count++;
// 	return g2;
// };
// let func3:((g:Animal) => Greyhound) = g => {
// 	let g2:Greyhound;
// 	g2.count++;
// 	return g2;
// };
// let func4:((g:Animal) => Animal) = g => {
// 	let g2:Animal = g;
// 	g2.count++;
// 	return g2;
// };

