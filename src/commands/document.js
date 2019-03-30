const { getDisplayFromKey, getTransformDisplay } = require('../utils');
const util = require('util');
const writeFile = util.promisify(require('fs').writeFile);

function documentFromConfig(transformName, transformConfig) {
  const markdown = `
    ## ${transformConfig.display || getTransformDisplay(transformConfig)}
    ${transformConfig.description || ''}
    
    | Param     | Value                               |
    | --------- | ----------------------------------- |
    | Name | ${transformName} |
    | InputType | ${transformConfig.inputType().type} |
    | OutputType | ${transformConfig.outputType().type} |
  `;
  return markdown;
}

function documentSettings(settings) {
  return `
    ### Settings
    | Parameter | Type | Default | Required | Popup | Description |
    | --------- | ---- | ------- | -------- | ----- | ----------- |
  `;
}

function documentTransforms(transforms) {
  const docsParts = Object.keys(transforms).map(transformName => {
    return documentFromConfig(transformName, transforms[transformName].config);
  });
  const finalString =
    '# Transforms\n' +
    docsParts
      .join('\n\n')
      .replace(/\t/gi, '')
      .replace(/^\s*/gim, '');
  writeFile('README.md', finalString)
    .then(() => console.log('Congrats, you now have docs!'))
    .catch(console.log);
}

module.exports = documentTransforms;
