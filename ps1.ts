import {map} from 'ramda';

interface Movie{
	id: number
	title: string
	box: string
	url: string
	raiting: number
	bookmark: Mark[]
}

interface Mark{
	id: number
	time: number
}

const myMovies:Movie[] = [
	{
		id:1,
		title: 'movie1',
		box: 'someBox',
		url: '1.1.1.1',
		raiting: 5,
		bookmark: [{id:3,time:6}]
	},
	{
		id:2,
		title: 'movie2',
		box: 'someBox',
		url: '1.1.1.1',
		raiting: 4.5,
		bookmark: [{id:3,time:6}]
	},
	{
		id:3,
		title: 'movie3',
		box: 'someBox',
		url: '1.1.1.1',
		raiting: 2.3,
		bookmark: [{id:3,time:6}]
	}
] 

const namesAndRatings = myMovies.map(movie => `${movie.title}: ${movie.raiting}`);

console.log(namesAndRatings);

console.log(map(x => x * x, [1, 2, 3, 4]));