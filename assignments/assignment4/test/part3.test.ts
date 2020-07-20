import { expect } from 'chai';
import * as Q from './part3'
describe('part3 tests',() =>{
	it('q1',()=>{
		for(let v in Q.braid(Q.gen1(),Q.gen2())){
			console.log(v);
		}
	});
});