import fs from 'fs';
import {isOk,Result,bind,isOkT, makeFailure} from "../shared/result"
import {parse as parseSexp} from "../shared/parser"
import {isLetExp,isIfExp,isProcExp,Exp,parseL4Exp, isAppExp, isDefineExp} from "./L4-ast"
import {isCompoundGraph, isGraph} from "./mermaid-ast"
import {mapL4toMermaid,makeDefineGraph,makeIfGraph,makeLetGraph,makeAppExpGraph,unparseMermaid, L4toMermaid} from "./mermaid"

import { expect } from 'chai';


export const p = (x: string): Result<Exp> => bind(parseSexp(x), parseL4Exp);

describe('L4 Parser', () => {
	it('test ifExp', () => {
		expect(p("(lambda () 1)")).to.satisfy(isOkT(isProcExp));
		const pro = p('(if #t (* 4 5) 2)');
		const porc = isOk(pro) ? isIfExp(pro.value) ? makeIfGraph(pro.value) : null : null;
		const compGra = porc && isOk(porc) ? isCompoundGraph(porc.value ) ? porc.value : null : null;
		const edges = compGra ? compGra.edges : null;
		//console.log(edges);
	});

	it('test letxpp', () => {
		const letE = p('(let ((x 1)(y 2)) (+ x y))');
		//onst bindin = isOk(letE) && isL
		const porc = isOk(letE) ? isLetExp(letE.value) ? makeLetGraph(letE.value) : null : null;
		const compGra = porc && isOk(porc) ? isCompoundGraph(porc.value ) ? porc.value : null : null;
		const edges = compGra ? compGra.edges : null;
		//console.log(edges);
	});
	it('test appExp', () => {
		const letE = p('((lambda (x y) (+ x y)) 1 2)');
		//onst bindin = isOk(letE) && isL
		const mer = isOk(letE)? mapL4toMermaid(letE.value): makeFailure('');
		const porc = isOk(letE) ? isAppExp(letE.value) ? makeAppExpGraph(letE.value) : null : null;
		const compGra = porc && isOk(porc) ? isCompoundGraph(porc.value ) ? porc.value : null : null;
		const edges = compGra ? compGra.edges : null;
		const merUnparsed = isOk(mer)&& isGraph(mer.value) ? unparseMermaid(mer.value) : makeFailure('');

		// if(isOk(merUnparsed)){
		// 	const fi = fs.writeFileSync("merFile",merUnparsed.value);
		// 	console.log(merUnparsed.value);
		// }
	});
	it('test define', () => {
		const letE = p(`(define my-list '(1 2))`);
		const porc = isOk(letE) ? isDefineExp(letE.value) ? makeDefineGraph(letE.value) : null : null;
		const compGra = porc && isOk(porc) ? isCompoundGraph(porc.value ) ? porc.value : null : null;
		const edges = compGra ? compGra.edges : null;
		//console.log(edges);
	});
	it('test define', () => {
		const letE = p(`(define my-list '(1 2))`);
		const mer = isOk(letE)? mapL4toMermaid(letE.value): makeFailure('');
		const porc = isOk(letE) ? isDefineExp(letE.value) ? makeDefineGraph(letE.value) : null : null;
		const compGra = porc && isOk(porc) ? isCompoundGraph(porc.value ) ? porc.value : null : null;
		const edges = compGra ? compGra.edges : null;
		const merUnparsed = isOk(mer)&& isGraph(mer.value) ? unparseMermaid(mer.value) : makeFailure('');
		const mer2 = L4toMermaid(`(define my-list '(1 2))`);
		isOk(mer2) ? console.log(mer2.value): '';

	});
});