import {makeVarGen} from "../L3/substitute"
import {SExpValue, isClosure, isSymbolSExp, SymbolSExp, isEmptySExp, CompoundSExp, isCompoundSExp} from "./L4-value"
import {AppExp,Binding,CExp,isAppExp,isLetExp,LetExp,Exp,VarDecl,ProcExp,isProcExp ,isLitExp,IfExp, isIfExp,isVarRef,isNumExp,Parsed,isBoolExp,isStrExp,AtomicExp,isAtomicExp,isPrimOp, isLetrecExp, LetrecExp, SetExp, isSetExp, isProgram, isDefineExp, DefineExp, LitExp, parseL4Exp} from "./L4-ast"
import {safe3,isOk,safe2,mapResult,Result, makeOk, bind, makeFailure} from "../shared/result"
import {Edge,isAtomicGraph,NodeRef,Node,makeEdge,Graph,makeNodeDecl,NodeDecl, isGraph, makeGraph, makeTD, GraphContent,makeDir, makeCompoundGraph, isCompoundGraph, makeNodeRef, isNodeDecl} from "./mermaid-ast"
import { concat,map, reduce } from "ramda";
import { parse } from "../shared/parser"
import { Sexp } from "s-expression"

const generatos = {
	string: makeVarGen(),
	NumExp: makeVarGen(),
	BoolExp: makeVarGen(),
	StrExp: makeVarGen(),
	VarRef: makeVarGen(),
	VarDecl: makeVarGen(),
	PrimOp: makeVarGen(),
	LitExp: makeVarGen(),
	DefineExp: makeVarGen(),
	IfExp: makeVarGen(),
	ProcExp: makeVarGen(),
	SetExp: makeVarGen(),
	LetExp: makeVarGen(),
	AppExp: makeVarGen(),
	number: makeVarGen(),
	boolean: makeVarGen(),
	EmptySExp: makeVarGen(),
	Rands: makeVarGen(),
	CompoundSExp: makeVarGen(),
	Params: makeVarGen(),
	Body: makeVarGen(),
	Bindings: makeVarGen(),
	Binding: makeVarGen(),
	SymbolSExp: makeVarGen(),
};

const varGenerator = (typeExp:string):string => 
	typeExp === 'string'? generatos.string(typeExp):
	typeExp === 'NumExp'? generatos.NumExp(typeExp):
	typeExp === 'StrExp'? generatos.StrExp(typeExp):
	typeExp === 'PrimOp'? generatos.PrimOp(typeExp):
	typeExp === 'VarRef'? generatos.VarRef(typeExp):
	typeExp === 'VarDecl'? generatos.VarDecl(typeExp):
	typeExp === 'BoolExp'? generatos.BoolExp(typeExp):
	typeExp === 'LitExp'? generatos.LitExp(typeExp):
	typeExp === 'IfExp'? generatos.IfExp(typeExp):
	typeExp === 'Define'? generatos.DefineExp(typeExp):
	typeExp === 'ProcExp'? generatos.ProcExp(typeExp):
	typeExp === 'SetExp'? generatos.SetExp(typeExp):
	typeExp === 'LetExp'? generatos.LetExp(typeExp):
	typeExp === 'number'? generatos.number(typeExp):
	typeExp === 'boolean'? generatos.boolean(typeExp):
	typeExp === 'EmptySExp'? generatos.EmptySExp(typeExp):
	typeExp === 'CompoundSExp'? generatos.CompoundSExp(typeExp):
	typeExp === 'Rands'? generatos.Rands(typeExp):
	typeExp === 'Params'? generatos.Params(typeExp):
	typeExp === 'Bindings'? generatos.Bindings(typeExp):
	typeExp === 'Binding'? generatos.Binding(typeExp):
	typeExp === 'SymbolSExp'? generatos.SymbolSExp(typeExp):
	typeExp === 'AppExp'? generatos.AppExp(typeExp):
	typeExp === 'Body'? generatos.Body(typeExp) : '';

export const mapL4toMermaid = (exp: Parsed): Result<Graph> =>
	bind(mapL4toMermaidContent(exp),(g:GraphContent) => makeOk(makeGraph(makeDir(makeTD()),g)));

const mapL4toMermaidContent = (exp:Parsed): Result<GraphContent> =>
	isProgram(exp) ? safeConcatGraphArray(mapResult(mapL4toMermaidContent,exp.exps)) :
	isDefineExp(exp) ? makeDefineGraph(exp) :
	isNumExp(exp) ? makeOk(makeNodeDecl(varGenerator('NumExp'),`NumExp(${exp.val})`)):
	isBoolExp(exp) ? makeOk(makeNodeDecl(varGenerator('BoolExp'),`BoolExp(${exp.val})`)):
	isStrExp(exp)	? makeOk(makeNodeDecl(varGenerator('StrExp'),`StrExp(${exp.val})`)):
	isPrimOp(exp)	? makeOk(makeNodeDecl(varGenerator('PrimOp'),`PrimOp(${exp.op})`)):
	isVarRef(exp)	? makeOk(makeNodeDecl(varGenerator('VarRef'),`VarRef(${exp.var})`)):
	isLitExp(exp)	? makeLitExpGraph(exp):
	isIfExp(exp) ? makeIfGraph(exp):
	isProcExp(exp) ? makeProcGraph(exp):
	isSetExp(exp) ? makeSetGraph(exp):
	isLetExp(exp) || isLetrecExp(exp) ? makeLetGraph(exp):
	isAppExp(exp) ? makeAppExpGraph(exp) :
	makeFailure("Bad Input!");	

	// (if test then alt)
	export const makeIfGraph = (exp:IfExp):Result<GraphContent> =>{
		const ifNode = makeNodeDecl(varGenerator('IfExp'),'IfExp');
		const testGraph = mapL4toMermaidContent(exp.test);
		const thenGraph = mapL4toMermaidContent(exp.then);
		const altGraph = mapL4toMermaidContent(exp.alt);

		return safe3((testG:GraphContent,thenG:GraphContent,altG:GraphContent) => 
									makeOk(makeCompoundGraph([makeEdge(ifNode,getFirstNode(testG),'test')]
																					 .concat([makeEdge(nodeDeclToRef(ifNode),getFirstNode(thenG),'then')])
																					 .concat([makeEdge(nodeDeclToRef(ifNode),getFirstNode(altG),'alt')])
																					 .concat(getEdges(testG))
																					 .concat(getEdges(thenG))
																					 .concat(getEdges(altG))
																					 )))(testGraph,thenGraph,altGraph);
	}

	const makeVarDeclGraph = (exp:VarDecl):Result<NodeDecl> => makeOk(makeNodeDecl(varGenerator('VarDecl'),`VarDecl(${exp.var})`));

	const makeProcGraph = (exp:ProcExp):Result<GraphContent> =>{
		const procNode = makeNodeDecl(varGenerator('ProcExp'),'ProcExp');
		const argsNode = makeNodeDecl(varGenerator('Params'),':');
		const bodyNode = makeNodeDecl(varGenerator('Body'),':');

		const procToArgs = makeEdge(procNode,argsNode,'args');
		const procToBody = makeEdge(nodeDeclToRef(procNode),bodyNode,'body');

		const argsGraphs = mapResult(makeVarDeclGraph,exp.args);
		const bodyGraphs = mapResult(mapL4toMermaidContent,exp.body);

		const argsEdges = bind(argsGraphs,(nodeDecls:NodeDecl[]) => mapResult((n:NodeDecl) => makeOk(makeEdge(nodeDeclToRef(argsNode),n)) ,nodeDecls));
		const bodyEdges = bind(bodyGraphs,(bodyGraphs:GraphContent[]) => mapResult((g:GraphContent) => makeOk(makeEdge(nodeDeclToRef(bodyNode),getFirstNode(g))),bodyGraphs));
		const procEdges = safe2((argE:Edge[], bodyE:Edge[]) => makeOk(makeCompoundGraph([procToArgs].concat([procToBody]).concat(argE).concat(bodyE))))
						(argsEdges,bodyEdges);
		return safeConcatGraph(procEdges,safeConcatGraphArray(bodyGraphs));
	}

	//(let ((x 1)(y 2)) (+ x y))
	export const makeLetGraph = (exp:LetExp | LetrecExp):Result<GraphContent> =>{
		const letNode = makeNodeDecl(varGenerator('LetExp'),'LetExp');
		const bindingsNode = makeNodeDecl(varGenerator('Bindings'),':');
		const bodyNode = makeNodeDecl(varGenerator('Body'),':');
		
		const letToBindings = makeEdge(letNode,bindingsNode,'bindings');
		const letToBody = makeEdge(nodeDeclToRef(letNode),bodyNode,'body');

		const bindingsGraphs = mapResult(makeBindingGraph,exp.bindings);
		const bodyGraphs = mapResult(mapL4toMermaidContent,exp.body);

		const bindingsEdges = bind(bindingsGraphs,(bindingsGraphs:GraphContent[]) => mapResult((g:GraphContent) => makeOk(makeEdge(nodeDeclToRef(bindingsNode),getFirstNode(g))),bindingsGraphs));
		const bodyEdges = bind(bodyGraphs,(bodyGraphs:GraphContent[]) => mapResult((g:GraphContent) => makeOk(makeEdge(nodeDeclToRef(bodyNode),getFirstNode(g))),bodyGraphs));
		
		const letEdges = safe2((bindingsE:Edge[], bodyE:Edge[]) => makeOk(makeCompoundGraph([letToBindings].concat([letToBody]).concat(bindingsE.concat(bodyE)))))
										(bindingsEdges,bodyEdges);
		return safeConcatGraph(safeConcatGraph(letEdges,safeConcatGraphArray(bindingsGraphs)),safeConcatGraphArray(bodyGraphs));
		}

	const makeBindingGraph = (exp:Binding):Result<GraphContent> =>{
		const bindingNode = makeNodeDecl(varGenerator('Binding'),'Binding');
		const varGraph = makeVarDeclGraph(exp.var);
		const valGraph = mapL4toMermaidContent(exp.val);

		return safe2((varG:NodeDecl,valG:GraphContent) => 
		makeOk(makeCompoundGraph([makeEdge(bindingNode,getFirstNode(varG),'var')]
														 .concat([makeEdge(nodeDeclToRef(bindingNode),getFirstNode(valG),'val')])
														 .concat(getEdges(valG))
														 )))(varGraph,valGraph);
	}

	const makeSetGraph = (exp:SetExp):Result<GraphContent> =>{
		const setNode = makeNodeDecl(varGenerator('Set'),'Set');
		const varGraph = mapL4toMermaidContent(exp.var);
		const valGraph = mapL4toMermaidContent(exp.val);

		return safe2((varG:GraphContent,valG:GraphContent) => 
		makeOk(makeCompoundGraph([makeEdge(setNode,getFirstNode(varG),'var')]
														 .concat([makeEdge(nodeDeclToRef(setNode),getFirstNode(valG),'val')])
														 .concat(getEdges(valG))
														 )))(varGraph,valGraph);
	}

	export const makeDefineGraph = (exp:DefineExp):Result<GraphContent> => {
		const defineNode = makeNodeDecl(varGenerator('Define'),'Define');
		
		const varGraph = makeVarDeclGraph(exp.var);
		const valGraph = mapL4toMermaidContent(exp.val);

		return safe2((varG:GraphContent,valG:GraphContent) => 
		makeOk(makeCompoundGraph([makeEdge(defineNode,getFirstNode(varG),'var')]
														 .concat([makeEdge(nodeDeclToRef(defineNode),getFirstNode(valG),'val')])
														 .concat(getEdges(valG))
														 )))(varGraph,valGraph);
	}
	
	export const makeAppExpGraph = (exp:AppExp):Result<GraphContent> => {
		const appNode = makeNodeDecl(varGenerator('AppExp'),'AppExp');
		const randsNode = makeNodeDecl(varGenerator('Rands'),':');
		
		const appToRands = makeEdge(appNode,randsNode,'rands');

		const ratorGraph = mapL4toMermaidContent(exp.rator);
		const randsGraphs = mapResult(mapL4toMermaidContent,exp.rands);

		const randsEdges = bind(randsGraphs,(randsGraphs:GraphContent[]) => mapResult((g:GraphContent) => makeOk(makeEdge(nodeDeclToRef(randsNode),getFirstNode(g))),randsGraphs));
		const appEdges = bind(ratorGraph,(ratorGraph:GraphContent) => makeOk(makeCompoundGraph([appToRands,makeEdge(nodeDeclToRef(appNode),getFirstNode(ratorGraph),'rator')])));
		
		return safeConcatGraph(appEdges,safeConcatGraph(bind(randsEdges,(randsEdges:Edge[]) => makeOk(makeCompoundGraph(randsEdges))),safeConcatGraph(safeConcatGraphArray(randsGraphs),ratorGraph)))
	}

	const makeLitExpGraph = (exp:LitExp):Result<GraphContent> =>{
		const litNode = makeNodeDecl(varGenerator('LitExp'),'LitExp');
		const sExpGraph = makeSExpValueGraph(exp.val);

		const litToSExp = bind(sExpGraph,(sExpGraph:GraphContent) => makeOk(makeCompoundGraph([makeEdge(litNode,getFirstNode(sExpGraph),'val')])));
		return safeConcatGraph(litToSExp,sExpGraph);
	}

	const makeSExpValueGraph = (exp:SExpValue): Result<GraphContent> =>
		typeof exp === 'number' ? makeOk(makeNodeDecl(varGenerator('number'),`number(${exp})`)):
		typeof exp === 'boolean' ? makeOk(makeNodeDecl(varGenerator('boolean'),`boolean(${exp})`)):
		typeof exp === 'string' ? makeOk(makeNodeDecl(varGenerator('string'),`string(${exp})`)):
		isPrimOp(exp) ? mapL4toMermaidContent(exp):
		isSymbolSExp(exp) ? makeSymbolSExpGraph(exp):
		isEmptySExp(exp) ? makeOk(makeNodeDecl(varGenerator('EmptySExp'),`EmptySExp`)):
		isCompoundSExp(exp) ? makeCompoundSExpGraph(exp):
		makeFailure(`Can't handle clousers`);

	const makeSymbolSExpGraph = (exp:SymbolSExp): Result<GraphContent> =>{
		const symbolSExpNode = makeNodeDecl(varGenerator('SymbolSExp'),'SymbolSExp');
		const sExpGraph = makeSExpValueGraph(exp.val);

		const symbolToSExp = bind(sExpGraph,(sExpGraph:GraphContent) => makeOk(makeCompoundGraph([makeEdge(symbolSExpNode,getFirstNode(sExpGraph),'val')])));
		return safeConcatGraph(symbolToSExp,sExpGraph);
	}

	const makeCompoundSExpGraph = (exp:CompoundSExp): Result<GraphContent> =>{
		const compoundSExpNode = makeNodeDecl(varGenerator('CompoundSExp'),'CompoundSExp');
		const sExpGraph1 = makeSExpValueGraph(exp.val1);
		const sExpGraph2 = makeSExpValueGraph(exp.val2);

		const symbolToSExp1 = bind(sExpGraph1,(sExpGraph:GraphContent) => makeOk(makeCompoundGraph([makeEdge(compoundSExpNode,getFirstNode(sExpGraph),'val1')])));
		const symbolToSExp2 = bind(sExpGraph2,(sExpGraph:GraphContent) => makeOk(makeCompoundGraph([makeEdge(nodeDeclToRef(compoundSExpNode),getFirstNode(sExpGraph),'val2')])));
		return safeConcatGraph(symbolToSExp1,safeConcatGraph(symbolToSExp2,safeConcatGraph(sExpGraph1,sExpGraph2)));
	}

	const getFirstNode = (g:GraphContent):Node => isCompoundGraph(g) ? nodeDeclToRef(g.edges[0].from) : g ;

	const getEdges = (g:GraphContent):Edge[] => isCompoundGraph(g) ? g.edges : [];
	const nodeDeclToRef = (node:Node):NodeRef => makeNodeRef(node.id);

	const safeConcatGraph = (g1:Result<GraphContent>,g2:Result<GraphContent>):Result<GraphContent> => 
		safe2((g1:GraphContent,g2:GraphContent) => makeOk(makeCompoundGraph(getEdges(g1).concat(getEdges(g2)))))(g1,g2);

	const safeConcatGraphArray = (g:Result<GraphContent[]>):Result<GraphContent> =>
			bind(g,(gc:GraphContent[]) => makeOk(reduce((acc,curr) => makeCompoundGraph(getEdges(acc).concat(getEdges(curr))),makeCompoundGraph([]),gc)));	


	export const unparseMermaid = (exp: Graph): Result<string> => 
		isCompoundGraph(exp.content) ? 	makeOk(reduce((acc,curr) => acc.concat(unparseEdge(curr)),`graph ${exp.dir.dir.tag}\n`,exp.content.edges)):
		makeFailure('Cant unparse atomic')
	
	const unparseEdge = (edge:Edge):string => edge.from.id
											.concat(isNodeDecl(edge.from) ? `["${edge.from.label}"] `:' ')
											.concat(edge.label ? `-->|${edge.label}| `:'--> ')
											.concat(edge.to.id)
											.concat(isNodeDecl(edge.to) ? `["${edge.to.label}"]\n`:'\n');

	export const L4toMermaid = (concrete: string): Result<string> => 
					bind(parse(concrete),(exp:Sexp) => bind(parseL4Exp(exp),(astExp:Exp) => bind(mapL4toMermaid(astExp),(g:Graph)=>unparseMermaid(g))))