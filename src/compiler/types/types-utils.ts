import * as d from '../../declarations';


export const COMPONENTS_DTS_HEADER = `/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */`;


export const indentTypes = (code: string) => {
  const INDENT_STRING = '  ';
  let indentSize = 0;

  return code
    .split('\n')
    .map(cl => {
      let newCode = cl.trim();
      if (newCode.length === 0) {
        return newCode;
      }
      if (newCode.startsWith('}') && indentSize > 0) {
        indentSize -= 1;
      }
      newCode = INDENT_STRING.repeat(indentSize) + newCode;
      if (newCode.endsWith('{')) {
        indentSize += 1;
      }
      return newCode;
    })
    .join('\n');
};


export const sortImportNames = (a: d.TypesMemberNameData, b: d.TypesMemberNameData) => {
  const aName = a.localName.toLowerCase();
  const bName = b.localName.toLowerCase();
  if (aName < bName) return -1;
  if (aName > bName) return 1;
  if (a.localName < b.localName) return -1;
  if (a.localName > b.localName) return 1;
  return 0;
};
