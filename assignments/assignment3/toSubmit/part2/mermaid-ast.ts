

/**
 * <graph> ::= <header> <graphContent> 							// Graph(dir: Dir, content: GraphContent)
	<header> ::= graph (TD|LR)<newline> 							// Direction can be TD or LR
	<graphContent> ::= <atomicGraph> | <compoundGraph>
	<atomicGraph> ::= <nodeDecl>
	<compoundGraph> ::= <edge>+
	<edge> ::= <node> --><edgeLabel>? <node><newline> // <edgeLabel> is optional
																										// Edge(from: Node, to: Node, label?: string)
	<node> ::= <nodeDecl> | <nodeRef>
	<nodeDecl> ::= <identifier>["<string>"] 					// NodeDecl(id: string, label: string)
	<nodeRef> ::= <identifier> 												// NodeRef(id: string)
	<edgeLabel> ::= |<identifier>| 										// string
 */

export type GraphContent = AtomicGraph | CompoundGraph;
export type AtomicGraph = NodeDecl;
export type Node = NodeRef | NodeDecl;

export interface Graph {tag:"Graph"; dir:Dir; content:GraphContent;};
export interface Dir {tag:"Dir"; dir:TD|LR}
export interface TD {tag:"TD";};
export interface LR {tag:"LR";};

export interface CompoundGraph {tag:"CompoundGraph"; edges:Edge[];};
export interface Edge {tag:"Edge"; from:Node; to:Node; label?:string;};

export interface NodeRef {tag:"NodeRef"; id:string;};
export interface NodeDecl {tag:"NodeDecl"; id:string; label:string;};

//constructors
export const makeGraph = (dir:Dir,content:GraphContent): Graph =>({tag:"Graph", dir:dir, content:content});
export const makeDir = (dir:TD|LR): Dir =>({tag:"Dir",dir:dir});
export const makeTD = (): TD =>({tag:"TD"});
export const makeLR = (): LR =>({tag:"LR"});
export const makeCompoundGraph = (edges:Edge[]): CompoundGraph =>({tag:"CompoundGraph", edges:edges});
export const makeEdge = (from:Node, to:Node, label?:string): Edge =>({tag:"Edge", from:from,to:to, label:label});
export const makeNodeRef = (id:string): NodeRef =>({tag:"NodeRef", id:id});
export const makeNodeDecl = (id:string, label:string): NodeDecl =>({tag:"NodeDecl", id:id,label:label});

//predicates
export const isGraph = (x: any): x is Graph => x.tag === "Graph";
export const isDir = (x: any): x is Dir => x.tag === "Dir";
export const isTD = (x: any): x is TD => x.tag === "TD";
export const isLR = (x: any): x is LR => x.tag === "LR";
export const isCompoundGraph = (x: any): x is CompoundGraph => x.tag === "CompoundGraph";
export const isEdge = (x: any): x is Edge => x.tag === "Edge";
export const isNodeRef = (x: any): x is NodeRef => x.tag === "NodeRef";
export const isNodeDecl = (x: any): x is NodeDecl => x.tag === "NodeDecl";

export const isGraphContent = (x: any): x is GraphContent => isAtomicGraph(x) || isCompoundGraph(x);
export const isAtomicGraph = (x: any): x is AtomicGraph => isNodeDecl(x);
export const isNode = (x: any): x is Node => isNodeRef(x) || isNodeDecl(x);

/** 
const m:Graph = {
	tag:'Graph',
	dir:{
		tag:"Dir",
		dir: {tag:"TD"}
	},
	content:{
		tag:'CompoundGraph',
		edges:[
			{
				tag:'Edge',
				from: {
					tag:'NodeDecl',
					id: 'AppExp_1',
					label: 'AppExp'
				}
			}
		]
	}
	
}
//(lamda (x) (* x 2))
const pc: GraphContent = {
	tag: 'CompoundGraph',
	edges: [
		{
			tag: 'Edge',
			from: { tag: "NodeDecl",id:'ProcExp_1',label: 'ProcExp'},
			to:   { tag: "NodeDecl",id:'Params_1',label: ':'},
			label: 'args'
		},
		{
			tag: 'Edge',
			from: { tag: "NodeDecl",id:'ProcExp_1',label: 'ProcExp'},
			to: { tag: "NodeDecl",id:'Body_1',label: ':'},
			label: 'body'
		},
		{
			tag: 'Edge',
			from: { tag: "NodeRef",id:'Params_1'},
			to: { tag: "NodeDecl",id:'Params_1',label: ':'},
			label: 'args'
		}
	]	
}
*/
