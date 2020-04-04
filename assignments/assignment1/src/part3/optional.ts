/* Question 1 */
export type Some<T> = {tag:'Some', value:T};
export type None<T> = {tag:'None'};
export type Optional<T> = Some<T> | None<T>;

export const makeSome = <T>(x:T): Optional<T> =>{ return {tag:'Some',value:x}};
export const makeNone = <T>(): Optional<T>=> {return {tag:'None'}};

export const isSome = <T>(x:any): x is Some<T> => x.tag ==='Some';
export const isNone =  <T>(x:any): x is None<T> => x.tag ==='None';

/* Question 2 */
export const bind = <T,U>(optional:Optional<T> , func: (x:T)=>Optional<U>): Optional<U>=>
isSome(optional) ? func(optional.value): makeNone();