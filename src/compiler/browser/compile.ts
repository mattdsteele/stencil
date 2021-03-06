import * as d from '../../declarations';
import { catchError } from '@utils';
import { getCompileOptions, getCompilerConfig, getTransformOptions } from './compile-options';
import { getPublicCompilerMeta } from '../transformers/add-component-meta-static';
import { initTypescript } from '../../sys/browser/browser-typescript';
import { transformCssToEsm } from '../style/css-to-esm';
import { transpileModule } from '../transpile/transpile-module';


export const compile = async (code: string, opts: d.CompileOptions = {}): Promise<d.CompileResults> => {
  const r: d.CompileResults = {
    diagnostics: [],
    code: (typeof code === 'string' ? code : ''),
    map: null,
    inputFilePath: (typeof opts.file === 'string' ? opts.file.trim() : 'module.tsx'),
    outputFilePath: null,
    inputOptions: null,
    imports: [],
    componentMeta: []
  };

  try {
    const config = getCompilerConfig();
    const fileName = r.inputFilePath;
    r.inputOptions = getCompileOptions(opts);

    if (fileName.endsWith('.d.ts')) {
      r.code = '';

    } else if (fileName.endsWith('.tsx') || fileName.endsWith('.ts') || fileName.endsWith('.jsx')) {
      initTypescript();

      const transformOpts = getTransformOptions(r.inputOptions);

      const transpileResults = transpileModule(config, code, transformOpts, r.inputFilePath);

      r.diagnostics.push(...transpileResults.diagnostics);

      if (typeof transpileResults.code === 'string') {
        r.code = transpileResults.code;
      }

      r.map = transpileResults.map;

      if (typeof transpileResults.sourceFilePath === 'string') {
        r.inputFilePath = transpileResults.sourceFilePath;
      }

      const moduleFile = transpileResults.moduleFile;
      if (moduleFile) {
        r.outputFilePath = moduleFile.jsFilePath;

        moduleFile.cmps.forEach(cmp => {
          r.componentMeta.push(getPublicCompilerMeta(cmp));
        });

        moduleFile.originalImports.forEach(originalImport => {
          r.imports.push({
            path: originalImport
          });
        });
      }

    } else if (fileName.endsWith('.css')) {
      const styleData = opts.data;
      const cssResults = transformCssToEsm(config, code, r.inputFilePath, styleData.tag, styleData.encapsulation, styleData.mode);
      r.code = cssResults.code;
      r.map = cssResults.map;
    }

  } catch (e) {
    catchError(r.diagnostics, e);
  }

  return r;
};
