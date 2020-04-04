import { expect } from "chai";
import * as P2 from "../src/part2/part2";

describe("Assignment 1 Part 2", () => {
	it("question 1", () =>{
		const pred = (item:number) => item % 2 === 0 ;
		const array = [1,2,3,4,5,6,7,8];
		expect(P2.partition(pred,array)).to.eql([[2,4,6,8],[1,3,5,7]]);
	});

	it("question 2", () =>{
		const mat = [
			[1,2,3],
			[4,5,6],
			[7,8,9]
		];
		const fun = (x:number) => x*x;
		expect(P2.mapMat(fun,mat)).to.eql([[1,4,9],[16,25,36],[49,64,81]]);
	});

	it("question 3", () => {
		const squareAndHalf = P2.composeMany([(x: number) => x / 2, (x: number) => x * x]);
		expect(squareAndHalf(5)).to.equal(12.5);

		const squareAndDoubleAndDevide5 = P2.composeMany([(x:number) => x/5,(x: number) => x + x, (x: number) => x * x]);
		expect(squareAndDoubleAndDevide5(5)).to.equal(10);
	});

	it("question 4",() => {
		const pokemons:P2.Pokemon[] = [
			{name:{english:'Jiglipaf'},base:{Speed:3},type:['Singer','Grass']},
			{name:{english:'Pikachu'},base:{Speed:5},type:['Electrict']},
			{name:{english:'Zalbazor'},base:{Speed:2},type:['Grass']},
			{name:{english:'Charizard'},base:{Speed:4},type:['Fire']},
			{name:{english:'Balbazor'},base:{Speed:5},type:['Grass','Singer']},
			{name:{english:'Charizard'},base:{Speed:4},type:['Fire']},
			{name:{english:'Tharizard'},base:{Speed:4},type:['Fire','Dragon']},
		];

		expect(P2.maxSpeed(pokemons)).to.eql([
			{name:{english:'Pikachu'},base:{Speed:5},type:['Electrict']},
			{name:{english:'Balbazor'},base:{Speed:5},type:['Grass','Singer']},
		]);

		expect(P2.grassType(pokemons)).to.eql(['Balbazor','Jiglipaf','Zalbazor']);

		expect(P2.uniqueTypes(pokemons)).to.eql(['Dragon','Electrict','Fire','Grass','Singer']);
	});
});