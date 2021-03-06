import * as d from '../../declarations';
import { isOutputTargetDistTypes } from '../../compiler/output-targets/output-utils';
import ts from 'typescript';


export const getTsOptionsToExtend = (config: d.Config) => {
  const tsOptions: ts.CompilerOptions = {
    experimentalDecorators: true,
    declaration: config.outputTargets.some(isOutputTargetDistTypes),
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.NodeJs,
    noEmitOnError: false,
    outDir: config.cacheDir,
    sourceMap: config.sourceMap,
  };
  return tsOptions;
};
