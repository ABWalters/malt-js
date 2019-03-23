# malt-js

Library for writing Maltego transforms in Node.

Write the transforms once, and have them run locally, as lambda scripts or as a Koa server.

## Usage

```javascript
app.transform({ inputType: Person, outputType: Phrase }, function helloWorld(request, response){
  const name = request.entity.value;
  response.addChildEntity(Phrase(`Hello ${name}`))
});
```



## Development

### List Transforms

```bash
node index.js list
```





### Testing

```bash
node index.js <transform_name> <input_value>
```

