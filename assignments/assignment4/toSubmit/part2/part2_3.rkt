(define f (number -> (number * number))
  (lambda ((x: number)): (number * number)
    (values x (+ x 1))))

(define g (T -> (string * T))
	(lambda (x: T):(string * T)
		(values “x” x)))