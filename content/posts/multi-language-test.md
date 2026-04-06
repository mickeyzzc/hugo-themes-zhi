+++
title = 'Multi-Language Test'
date = 2023-01-20T09:00:00-07:00
draft = false
+++

## Go Code

```go
package main

import "fmt"

func main() {
    fmt.Println("Hello from Go!")
    var greeting string = "Welcome"
    fmt.Printf("%s to Hugo\n", greeting)
}
```

## Python Code

```python
def hello():
    print("Hello from Python!")
    greeting = "Welcome"
    print(f"{greeting} to Hugo")

if __name__ == "__main__":
    hello()
```

## TypeScript Code

```typescript
function hello(): string {
  console.log("Hello from TypeScript!");
  const greeting: string = "Welcome";
  return `${greeting} to Hugo`;
}
```

## CSS Code

```css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--code-bg);
  color: var(--code-text);
}
```

## HTML Code

```html
<!DOCTYPE html>
<html>
<head>
  <title>Test</title>
</head>
<body>
  <div class="container">Hello</div>
</body>
</html>
```

## Bash Code

```bash
#!/bin/bash
echo "Hello from Bash!"
greeting="Welcome"
echo "$greeting to Hugo"
```

## YAML Code

```yaml
title: "Test Post"
date: 2023-01-20
tags:
  - code
  - test
```

## JSON Code

```json
{
  "title": "Test Post",
  "date": "2023-01-20",
  "tags": ["code", "test"]
}
```

## Rust Code

```rust
fn main() {
    println!("Hello from Rust!");
    let greeting = "Welcome";
    println!("{} to Hugo", greeting);
}
```