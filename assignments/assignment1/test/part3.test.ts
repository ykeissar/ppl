import { expect } from "chai";
import * as O from "../src/part3/optional";
import * as R from "../src/part3/result";

describe("Assignment 1 Part 3", () => {
	it("question 1,2", () =>{ 
		expect(O.isSome({tag:"Some",value:true})).to.equal(true);
		expect(O.isSome({})).to.equal(false);

		expect(O.isNone({tag:"None"})).to.equal(true);
		expect(O.isNone({})).to.equal(false);
		
		const safeDiv = (x: number, y: number): O.Optional<number> =>
					y === 0 ? O.makeNone() : O.makeSome(x / y);
	
		const x = safeDiv(15,0);
		const y = safeDiv(15,5);

		const isEven = (x:number): O.Optional<boolean> => O.makeSome(x % 2 === 0);
		
		expect(O.bind(x,isEven)).to.eql({tag:"None"});
		expect(O.bind(y,isEven)).to.eql({tag:"Some",value:false});
	});

	it("question 3-4",() => {
		expect(R.isOk({tag:"Ok",value:true})).to.equal(true);
		expect(R.isOk({})).to.equal(false);

		expect(R.isFailure({tag:"Failure",message:"msg"})).to.equal(true);
		expect(R.isFailure({})).to.equal(false);
		
		const safeDiv = (x: number, y: number): R.Result<number> =>
					y === 0 ? R.makeFailure("Can't devied by 0") : R.makeOk(x / y);
	
		const x = safeDiv(15,0);
		const y = safeDiv(15,5);

		const isEven = (x:number): R.Result<boolean> => R.makeOk(x % 2 === 0);
		
		expect(R.bind(x,isEven)).to.eql({tag:"Failure",message:"Can't devied by 0"});
		expect(R.bind(y,isEven)).to.eql({tag:"Ok",value:false});
	});
	it("question 5-6", () => {
		const goodUser:R.User = {name:"Yosi",email:"blabla@gmail.com",handle:"hnadle1"};

		const badUser1:R.User = {name:"",email:"blabla@gmail.com",handle:"hnadle1"}; //empty name
		const badUser2:R.User = {name:"Bananas",email:"blabla@gmail.com",handle:"hnadle1"};//name cant be bananas
		const badUser3:R.User = {name:"Yosi",email:"",handle:"sdfsdf"};//email cannot be empty
		const badUser4:R.User = {name:"Yosi",email:"yosi@bananas.com",handle:"asdasd"};//domain bananas.com is not allowed
		const badUser5:R.User = {name:"Yosi",email:"blabla@gmail.com",handle:""};//handle empty
		const badUser6:R.User = {name:"Yosi",email:"blabla@gmail.com",handle:"@hnadle1"};//start with @

		expect(R.naiveValidateUser(goodUser)).to.eql({tag:"Ok",value:goodUser});
		expect(R.monadicValidateUser(goodUser)).to.eql({tag:"Ok",value:goodUser});

		expect(R.naiveValidateUser(badUser1)).to.eql({tag:"Failure",message:"Name cannot be empty"});
		expect(R.monadicValidateUser(badUser1)).to.eql({tag:"Failure",message:"Name cannot be empty"});

		expect(R.naiveValidateUser(badUser2)).to.eql({tag:"Failure",message:"Bananas is not a name"});
		expect(R.monadicValidateUser(badUser2)).to.eql({tag:"Failure",message:"Bananas is not a name"});

		expect(R.naiveValidateUser(badUser3)).to.eql({tag:"Failure",message:"Email cannot be empty"});
		expect(R.monadicValidateUser(badUser3)).to.eql({tag:"Failure",message:"Email cannot be empty"});

		expect(R.naiveValidateUser(badUser4)).to.eql({tag:"Failure",message:"Domain bananas.com is not allowed"});
		expect(R.monadicValidateUser(badUser4)).to.eql({tag:"Failure",message:"Domain bananas.com is not allowed"});

		expect(R.naiveValidateUser(badUser5)).to.eql({tag:"Failure",message:"Handle cannot be empty"});
		expect(R.monadicValidateUser(badUser5)).to.eql({tag:"Failure",message:"Handle cannot be empty"});

		expect(R.naiveValidateUser(badUser6)).to.eql({tag:"Failure",message:"This isn't Twitter"});
		expect(R.monadicValidateUser(badUser6)).to.eql({tag:"Failure",message:"This isn't Twitter"});

	});

});