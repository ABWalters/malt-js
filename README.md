# malt-js

Maltego transforms in 3 lines of code that can run anywhere.

## Usage

```javascript
@transform('toDetails')
function toDetails(resp, request){
  request.addEntity(Phrase, "Hello World")
}
```
