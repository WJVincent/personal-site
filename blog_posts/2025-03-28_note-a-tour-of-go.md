# WIP - Note: A Tour of Go

[tags]:- go, learning, programming, note, WIP

This post is my notes as I read and work through the "[tour of
go](https://go.dev/tour/welcome/1)" interactive introduction to golang.

---

## Basics

### Hello

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

### Packages

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

### Imports


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

### Exported Names

- A name is exported if it begins with a capital letter.
- When importing a package you can only refer to its exported names.

### Functions

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

### Multiple Results

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

### Named Return Values

- Go's return values can be named.
- If so, they are treated as variables defined at the top of the function
- A return statement without arguments returns the named return values. A "naked return"

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

