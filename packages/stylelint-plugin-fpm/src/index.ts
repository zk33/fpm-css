import customPropertyFilePrefix from "./rules/custom-property-file-prefix/index.js";
import globalClassFile from "./rules/global-class-file/index.js";
import globalVarContract from "./rules/global-var-contract/index.js";
import keyframesFilePrefix from "./rules/keyframes-file-prefix/index.js";
import modeClassCompound from "./rules/mode-class-compound/index.js";
import moduleVarOwner from "./rules/module-var-owner/index.js";
import noCrossFileNesting from "./rules/no-cross-file-nesting/index.js";
import nestedParentReference from "./rules/nested-parent-reference/index.js";
import noRootMedia from "./rules/no-root-media/index.js";
import noRestrictedTypeSelector from "./rules/no-restricted-type-selector/index.js";
import noXClassStyle from "./rules/no-x-class-style/index.js";
import selectorFilePrefix from "./rules/selector-file-prefix/index.js";

export {
  customPropertyFilePrefix,
  globalClassFile,
  globalVarContract,
  keyframesFilePrefix,
  modeClassCompound,
  moduleVarOwner,
  noCrossFileNesting,
  nestedParentReference,
  noRootMedia,
  noRestrictedTypeSelector,
  selectorFilePrefix,
  noXClassStyle
};

export default [
  selectorFilePrefix,
  keyframesFilePrefix,
  globalClassFile,
  noXClassStyle,
  modeClassCompound,
  noCrossFileNesting,
  nestedParentReference,
  noRootMedia,
  globalVarContract,
  customPropertyFilePrefix,
  moduleVarOwner,
  noRestrictedTypeSelector
];
