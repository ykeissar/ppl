import * as R from 'ramda';
/* Question 3 */

export type Ok<T> = {tag: 'Ok' , value:T};
export type Failure<T> = {tag: 'Failure', message: string};
export type Result<T> = Ok<T> | Failure<T>;

export const makeOk = <T>(x:T):Result<T> => {return {tag:'Ok', value:x}};
export const makeFailure =  <T>(x:string):Result<T> => {return {tag:'Failure', message:x}};

export const isOk = <T>(x:any): x is Ok<T> => x.tag ==='Ok';
export const isFailure = <T>(x:any): x is Failure<T> => x.tag ==='Failure';

/* Question 4 */
export const bind = <T,U>(result:Result<T> , func: (x:T)=>Result<U>): Result<U>=>
isOk(result) ? func(result.value): makeFailure(result.message);

/* Question 5 */
interface User {
    name: string;
    email: string;
    handle: string;
}

const validateName = (user: User): Result<User> =>
    user.name.length === 0 ? makeFailure("Name cannot be empty") :
    user.name === "Bananas" ? makeFailure("Bananas is not a name") :
    makeOk(user);

const validateEmail = (user: User): Result<User> =>
    user.email.length === 0 ? makeFailure("Email cannot be empty") :
    user.email.endsWith("bananas.com") ? makeFailure("Domain bananas.com is not allowed") :
    makeOk(user);

const validateHandle = (user: User): Result<User> =>
    user.handle.length === 0 ? makeFailure("Handle cannot be empty") :
    user.handle.startsWith("@") ? makeFailure("This isn't Twitter") :
    makeOk(user);

export const naiveValidateUser = (user:User): Result<User> =>
{const result1:Result<User> = validateName(user);
 const result2:Result<User> = validateEmail(user);
 const result3:Result<User> = validateHandle(user);
 return isFailure(result1) ? result1 :
        isFailure(result2) ? result2 :
        isFailure(result3) ? result3 :
        makeOk(user) ;
} 

export const monadicValidateUser = (user: User) :Result<User> =>
R.reduce((acc:Result<User>,curr)=> bind(acc,curr),makeOk(user),[validateName,validateEmail, validateHandle])