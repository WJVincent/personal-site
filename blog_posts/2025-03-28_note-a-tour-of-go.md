# WIP - Note: A Tour of Go

[tags]:- go, learning, programming, note, WIP

This post is my notes as I read and work through the "[tour of
go](https://go.dev/tour/welcome/1)" interactive introduction to golang.

---

- [Basics](#basics)
    - [Packages, variables, functions](#packagesvariablesfunctions)
    - [Flow control statements: for, if, else, switch, defer](#flowcontrolstatementsforifelseswitchdefer)
    - [More types: structs, slices, and maps](#moretypesstructsslicesandmaps)
- [Methods and interfaces](#methodsandinterfaces)
- [Generics](#generics)
- [Concurrency](#concurrency)

---
    
## Basics

### Packages, variables, functions

#### Hello

- gofmt: built in formatting tool

```go
package main

import (
	"fmt"
)

func main() {
	fmt.Println("Hello, 世界")
}
```

#### Packages

- Programs start running in package `main`
- Convention to have the package name be the same as the last element of the
  import path.

```go
package main

import (
	"fmt"
	"math/rand" // "math/rand" -> rand
)

func main() {
	fmt.Println("My favorite number is", rand.Int(10))
}
```

#### Imports


```go
package main

import (
	"fmt"
	"math"
)

/*
Can also be written as individual line items, the parenthesized "factored" version is preferred

import "fmt"
import "math"
*/

func main() {
	fmt.Printf("Now you have %g problems.\n", math.Sqrt(7))
}
```

#### Exported Names

- A name is exported if it begins with a capital letter.
- When importing a package you can only refer to its exported names.

#### Functions

- A function can take zero or more args
- The type comes _after_ the variable
- [Article ](https://go.dev/blog/declaration-syntax) on the reasons behind the
  declaration sytax

```go
package main

import "fmt"

func add(x int, y int) int {
  return x + y
}

func main(){
  fmt.Println(add(42, 13))
}
```

- When two or more consecutive named function parameters share a type you can
  omit the type from all but the last.

```go
package main

import "fmt"

func add(x, y int) int {
  return x + y
}

func main(){
  fmt.Println(add(42, 13))
}
```

#### Multiple Results

- A function can return any number of results

```go
package main

import "fmt"

func swap(x, y string) (string, string) {
	return y, x // multiple results
}

func main() {
	a, b := swap("hello", "world") // grabbing both results
	fmt.Println(a, b)
}
```

#### Named Return Values

- Go's return values can be named.
- If so, they are treated as variables defined at the top of the function
- A return statement without arguments returns the named return values. A "naked
  return"

```go
package main

import "fmt"

func split(sum int) (x, y int) {
	x = sum * 4 / 9
	y = sum - x
	return // return (x, y)
}

func main() {
	fmt.Println(split(17)) // prints 7 10
}
```

#### Variables

- `var` declares a list of variables.
- The same as function arguments, the type is last.
- `var` statements can be at the package or function level

```go

package main

import "fmt"

var c, python, java bool // package level

func main() {
	var i int // function level
	fmt.Println(i, c, python, java)
}
```

#### Variables with initializers

- A `var` declaration can include initializers, one per variable
- If an initializer is present, the type can be omitted because it will be
  inferred from the type of the initializer.
  
```go
package main

import "fmt"

var i, j int = 1, 2

func main() {
	var c, python, java = true, false, "no!"
	fmt.Println(i, j, c, python, java)
}
```

#### Short variable declarations

- Inside a function, the short assignment statement `:=` can be used instead of
  a `var` declaration with implicit typing
- This is not available at the package level, only the function level

```go
package main

import "fmt"

func main() {
	var i, j int = 1, 2
	k := 3
	c, python, java := true, false, "no!"

	fmt.Println(i, j, k, c, python, java)
}
```

#### Basic types

- bool
- string
- int, int8, int16, int32, int64
- uint, uint8, uint32, uint64, uintptr
- byte (alias for uint8)
- rune (alias for int32, represents a Unicode code point)
- float32, float64
- complex64, complex128

```go
package main

import (
	"fmt"
	"math/cmplx"
)

var (
	ToBe   bool       = false
	MaxInt uint64     = 1<<64 - 1
	z      complex128 = cmplx.Sqrt(-5 + 12i)
)

func main() {
	fmt.Printf("Type: %T Value: %v\n", ToBe, ToBe)
	fmt.Printf("Type: %T Value: %v\n", MaxInt, MaxInt)
	fmt.Printf("Type: %T Value: %v\n", z, z)
}

```

#### Zero values

- Variables declared without an explicit initial value are given their _zero value_
- The zero value is:
  - `0` for numeric types
  - `false` for booleans
  - `""` (empty string) for strings

```go
package main

import "fmt"

func main() {
	var i int
	var f float64
	var b bool
	var s string
	fmt.Printf("%v %v %v %q\n", i, f, b, s)
}
```

#### Type conversions

- The expression `T(v)` converts the value `v` to the type `T`
- Assignment between items of different types requires explicit conversion.
- Can be done with long or short assignment styles

```go
package main

import (
	"fmt"
	"math"
)

func main() {
	var x, y int = 3, 4
	var f float64 = math.Sqrt(float64(x*x + y*y)) // long style
	z := uint(f) // short style
	fmt.Println(x, y, z)
}
```

#### Type inference

- When declaring a variable without specifying an explicit type, the variables
  type is inferred from the value on the right hand side.
- When the right hand side of the declaration is typed, the new variable is of
  that same type
- When the right hand side is untyped, the new variable will depend on the precision of the constant

```go
// Typed example

var i int
j := i // j is an int
```

```go
// Untyped example

i := 42           // int
f := 3.142        // float64
g := 0.867 + 0.5i // complex128
```

```go
package main

import "fmt"

func main() {
	v := 42 // change me!
	fmt.Printf("v is of type %T\n", v)
}
```

#### Constants

- Constants are declared like variables, but using the `const` keyword
- Constants can be character, string, boolean, or numeric values
- Constants cannot be declared using the `:=` syntax

```go
package main

import "fmt"

const Pi = 3.14

func main() {
	const World = "世界"
	fmt.Println("Hello", World)
	fmt.Println("Happy", Pi, "Day")

	const Truth = true
	fmt.Println("Go rules?", Truth)
}
```

#### Numeric constants

- Numeric constants are high precision values
- An untyped constant takes the type needed by its context

```go
package main

import "fmt"

const (
	// Create a huge number by shifting a 1 bit left 100 places.
	// In other words, the binary number that is 1 followed by 100 zeroes.
	Big = 1 << 100
	// Shift it right again 99 places, so we end up with 1<<1, or 2.
	Small = Big >> 99
)

func needInt(x int) int { return x*10 + 1 }
func needFloat(x float64) float64 {
	return x * 0.1
}

func main() {
	fmt.Println(needInt(Small))
	//fmt.Println(needInt(Big)) will cause crash (an int can store at max a 64-bit integer)
	fmt.Println(needFloat(Small))
	fmt.Println(needFloat(Big))
}
```
    
### Flow control statements: for, if, else, switch, defer

#### For

- Go has only one looping construct, the `for` loop
- The basic `for` loop has three components seperated by semicolons
  - the init statement: executed before the first iteration
  - the condition expression: evaluated before every iteration
  - the post statement: executed at the end of every iteration
- Unlike other languages like C, Java, or JavaScript there are no parentheses
  surrounding the three components or the `for` statement and the braces `{}`
  are always required

```go
package main

import "fmt"

func main() {
	sum := 0
	for i := 0; i < 10; i++ {
		sum += i
	}
	fmt.Println(sum)
}
```

### More types: structs, slices, and maps

## Methods and interfaces

## Generics

## Concurrency
