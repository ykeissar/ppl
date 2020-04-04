import * as R from 'ramda';

export interface Pokemon{
	name:{
		english:string
	}
	base:{
		Speed: number
	}
	type: string[]
}

//question1
export const partition: <T>(pred:(x:T) => boolean , array:T[]) => T[][] = 
	<T>(pred:(x:T) => boolean,array:T[]) =>
	[
		R.filter(pred,array),
		R.filter((x:T) => !pred(x) ,array)
	];

//question2
export const mapMat: <T1,T2>(func: (x:T1)=> T2 ,mat:T1[][]) => T2[][] = 
	<T1,T2>(func: (x:T1)=> T2 ,mat:T1[][]) => 
		R.map((y:T1[]) => R.map(func,y),mat);

//question3
export const composeMany: <T>(funcArray:((x:T)=>T)[]) => (x:T)=> T =
	<T>(funcArray:((x:T)=>T)[]) =>
	R.reduce((acc:(x:T)=>T ,curr:(x:T)=>T) => R.compose(acc,curr), R.identity, funcArray);

//question4	
//4.1
export const maxSpeed: (poke:Pokemon[]) => Pokemon[] = 
	(poke:Pokemon[]) => {
		const maxSpeed = R.reduce((acc,cur) => R.max(acc,cur.base.Speed) ,0,poke);
		return R.filter((x:Pokemon) => x.base.Speed === maxSpeed ,poke); 
	};

//4.2
export const grassType: (poke:Pokemon[]) => string[] = 
	(poke:Pokemon[]) => {
		const grassArray:Pokemon[] = R.filter((x:Pokemon) => R.contains('Grass',x.type),poke);
		return R.map((x:Pokemon) => x.name.english,grassArray).sort();
	}

//4.3
export const uniqueTypes: (poke:Pokemon[]) => string[] = 
	(poke:Pokemon[]) => 
		R.reduce((acc:string[],curr:Pokemon) => acc.concat(R.filter((t:string)=> !R.contains(t,acc) ,curr.type)), [], poke).sort();
