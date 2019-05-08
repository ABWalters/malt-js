# malt-js

Library for writing Maltego transforms in Node.

Write the transforms once, and have them run locally, as lambda scripts or as a Koa server.

## Example

```javascript
app.transform({ inputType: Person, outputType: Phrase }, function helloWorld(request, response){
  const name = request.entity.value;
  response.addChildEntity(Phrase(`Hello ${name}`))
});
```

## Usage
### Local Transform
Add as a local transform from the Maltego Client.



## Commands

### List Transforms
Provide a list of the transform names in the project
```bash
node index.js list
```


### Generate Docs
Generate markdown files for the transform project
```
node index.js document
```


### Testing
Manually test transforms from the command line
```bash
node index.js <transform_name> <input_value>
```

