import { expect } from 'chai';
import { parseL5Exp, Exp } from '../../L5/L5-ast';
import { typeofExp, L5typeof } from '../../L5/L5-typecheck';
import { makeEmptyTEnv, makeExtendTEnv } from '../../L5/TEnv';
import { makeBoolTExp, makeNumTExp, makeProcTExp, makeTVar, makeVoidTExp, parseTE, unparseTExp, makeNonEmptyTupleTExp, isEmptyTupleTExp } from '../../L5/TExp';
import { makeOk, bind, isOkT } from '../../shared/result';
import { parse as p } from "../../shared/parser";

describe('L5 Type Checker22', () => {
    it('returns the type of "let-values" expressions32', () => {
        expect(L5typeof("(let-values ((((x : number) (y : number))(values 3 6)))(+ x y))")).to.deep.equal(makeOk("number"));
        //expect(L5typeof("(let-values (((x y)(values 3 6)))(+ x y))")).to.deep.equal(makeOk("(number -> number)"));
    });

    it('let ',()=>{
        expect(L5typeof("(let (((x : number) 3)((y : number) 6))(+ x y))")).to.deep.equal(makeOk("number"));

    });

});