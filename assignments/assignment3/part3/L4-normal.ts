// ========================================================
// L4 normal eval
import { Sexp } from "s-expression";
import { map } from "ramda";
import { CExp, Exp, IfExp, Program, parseL4Exp, LetExp, Binding } from "./L4-ast";
import { isLetExp,isAppExp, isBoolExp, isCExp, isDefineExp, isIfExp, isLitExp, isNumExp,
         isPrimOp, isProcExp, isStrExp, isVarRef,VarDecl } from "./L4-ast";
import { applyEnv, makeEmptyEnv, Env, CExpEnv,makeExtEnv, makeCExpEnv, makeRecEnv } from './L4-env-normal';
import { applyPrimitive } from "./evalPrimitive";
import { isClosure, makeClosure, Value,Closure } from "./L4-value";
import { first, rest, isEmpty } from '../shared/list';
import { safe2,Result, makeOk, makeFailure, bind, mapResult } from "../shared/result";
import { parse as p } from "../shared/parser";

// Evaluate a sequence of expressions (in a program)
export const evalExps = (exps: Exp[], env: Env): Result<Value> =>
    isEmpty(exps) ? makeFailure("Empty program") :
    isDefineExp(first(exps)) ? evalDefineExps(first(exps), rest(exps), env) :
    evalCExps(first(exps), rest(exps), env);

/*
Purpose: Evaluate an L3 expression with normal-eval algorithm
Signature: L3-normal-eval(exp,env)
Type: CExp * Env => Value
*/
export const normalEval = (exp: CExp, env: Env): Result<Value> =>
    isBoolExp(exp) ? makeOk(exp.val) :
    isNumExp(exp) ? makeOk(exp.val) :
    isStrExp(exp) ? makeOk(exp.val) :
    isPrimOp(exp) ? makeOk(exp) :
    isLitExp(exp) ? makeOk(exp.val) :
    isVarRef(exp) ? bind(applyEnv(env, exp.var),(cexpEnv:CExpEnv) =>evalVarRef(cexpEnv)) :
    isIfExp(exp) ? evalIf(exp, env) :
    isProcExp(exp) ? makeOk(makeClosure(exp.args, exp.body,env)) :
    isLetExp(exp) ? evalLet(exp, env) :
    isAppExp(exp) ? safe2((proc: Value, args: CExpEnv[]) => applyProcedure(proc, args))
                        (normalEval(exp.rator, env), mapResult((rand: CExp) => makeOk(makeCExpEnv(rand,env)),exp.rands)) :
    makeFailure(`Bad ast: ${exp}`);

const evalIf = (exp: IfExp, env: Env): Result<Value> =>
    bind(normalEval(exp.test, env),
         test => isTrueValue(test) ? normalEval(exp.then, env) : normalEval(exp.alt, env));

const evalLet = (exp:LetExp, env:Env): Result<Value> =>{
    const vals = mapResult((v: CExp) => makeOk(makeCExpEnv(v, env)), map((b: Binding) => b.val, exp.bindings));
    const vars = map((b: Binding) => b.var.var, exp.bindings);
    return bind(vals, (vals: CExpEnv[]) => evalSequence(exp.body, makeExtEnv(vars, vals, env)));
}

const evalVarRef = (cexpEnv:CExpEnv):Result<Value> =>
    normalEval(cexpEnv.cexp,cexpEnv.env);

const applyProcedure = (proc: Value, args: CExpEnv[]): Result<Value> =>
    isPrimOp(proc) ? bind(mapResult((x:CExpEnv)=>normalEval(x.cexp,x.env),args),(vArgs:Value[])=>applyPrimitive(proc,vArgs)) :
    isClosure(proc) ? applyClosure(proc, args) :
    makeFailure(`Bad procedure ${JSON.stringify(proc)}`);

const applyClosure = (proc: Closure, args: CExpEnv[]): Result<Value> => {
    const vars = map((v: VarDecl) => v.var, proc.params);
    return evalSequence(proc.body, makeExtEnv(vars, args, proc.env));
}

// Evaluate a sequence of expressions (in a program)
export const evalSequence = (seq: Exp[], env: Env): Result<Value> =>
    isEmpty(seq) ? makeFailure("Empty sequence") :
    isDefineExp(first(seq)) ? evalDefineExps(first(seq), rest(seq), env) :
    evalCExps(first(seq), rest(seq), env);

/*
Purpose: Evaluate a sequence of expressions
Signature: L3-normal-eval-sequence(exps, env)
Type: [List(CExp) * Env -> Value]
Pre-conditions: exps is not empty
*/
const normalEvalSeq = (exps: CExp[], env: Env): Result<Value> => {
    if (isEmpty(rest(exps)))
        return normalEval(first(exps), env);
    else {
        normalEval(first(exps), env);
        return normalEvalSeq(rest(exps), env);
    }
};
    
const evalCExps = (exp1: Exp, exps: Exp[], env: Env): Result<Value> =>
    isCExp(exp1) && isEmpty(exps) ? normalEval(exp1, env) :
    isCExp(exp1) ? bind(normalEval(exp1, env), _ => evalExps(exps, env)) :
    makeFailure("Never");
    
// Eval a sequence of expressions when the first exp is a Define.
// Compute the rhs of the define, extend the env with the new binding
// then compute the rest of the exps in the new env.
const evalDefineExps = (def: Exp, exps: Exp[], env: Env): Result<Value> =>
    isDefineExp(def) ? isProcExp(def.val) ? evalExps(exps, makeRecEnv([def.var.var], [def.val.args] ,[def.val.body], env)) : 
    evalExps(exps, makeExtEnv([def.var.var], [makeCExpEnv(def.val,env)], env)) :
    makeFailure("Unexpected " + def);

export const evalNormalProgram = (program: Program): Result<Value> =>
    evalExps(program.exps, makeEmptyEnv());

export const evalNormalParse = (s: string): Result<Value> =>
    bind(p(s),
         (parsed: Sexp) => bind(parseL4Exp(parsed),
                                (exp: Exp) => evalExps([exp], makeEmptyEnv())));

export const isTrueValue = (x: Value): boolean =>
! (x === false);