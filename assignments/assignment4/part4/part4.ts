export const f = (x:number):Promise<number> => 
	new Promise<number>((resolve,reject) =>
		x !== 0 ? resolve(1/x) : reject(`Can't devied by 0!`)
);

export const g = (x:number):Promise<number> => 
	new Promise<number>((resolve) => resolve(x*x) )


export const h = (x:number):Promise<number> => 
	g(x)
	.then((y:number) => f(y));


export const slower = <T1,T2>(proms:[Promise<T1>,Promise<T2>]):Promise<[number,T1|T2]> =>
	new Promise<[number,T1|T2]>((resolve,reject)=>{
		let amImFirst = true;
		
		proms[0]
		.then((value) => {
				if(amImFirst)
					amImFirst = false;
				else
					resolve([0,value]);
			})
		.catch((err) => reject(err));

		proms[1]
		.then((value) => {
				if(amImFirst)
					amImFirst = false;
				else
					resolve([1,value]);
		})
		.catch((err) => reject(err));
	}	
);