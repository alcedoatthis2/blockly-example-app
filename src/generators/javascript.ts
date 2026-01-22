/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { Order } from "blockly/javascript";
import * as Blockly from "blockly/core";

// Export all the code generators for our custom blocks,
// but don't register them with Blockly yet.
// This file has no side effects!
export const forBlock = Object.create(null);

forBlock["add_text"] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator
) {
  const text = generator.valueToCode(block, "TEXT", Order.NONE) || "''";
  const addText = generator.provideFunction_(
    "addText",
    `function ${generator.FUNCTION_NAME_PLACEHOLDER_}(text) {

  // Add text to the output area.
  const outputDiv = document.getElementById('output');
  const textEl = document.createElement('p');
  textEl.innerText = text;
  outputDiv.appendChild(textEl);
}`
  );
  // Generate the function call for this block.
  const code = `${addText}(${text});\n`;
  return code;
};

forBlock["my_add"] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator
) {
  const num1 = generator.valueToCode(block, "num1", Order.ADDITION) || "0";
  const num2 = generator.valueToCode(block, "num2", Order.ADDITION) || "0";
  const code = `${num1} + ${num2}`;
  return [code, Order.ADDITION];
};

forBlock["root_strategy"] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator
) {
  const value = generator.statementToCode(block, "STRATEGIES");
  const code = `${value};\n`;
  return code;
};

forBlock["strategy_inner"] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator
) {
  const value = generator.statementToCode(block, "ACTIONS");
  const code = `${value};\n`;
  return code;
};

forBlock["not_strategy_inner"] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator
) {
  const value = generator.statementToCode(block, "ACTIONS");
  const code = `${value};\n`;
  return code;
};

forBlock["field_validator"] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator
) {
  console.log("field_validator generator", { block, generator });
  return "";
};

forBlock["checkbox_validator"] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator
) {
  console.log("checkbox_validator generator", { block, generator });
  return "";
};

forBlock["my_mutator_example"] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator
) {
  console.log("my_mutator_example generator", { block, generator });
  return "";
};

forBlock["dropdown_pkg_json"] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator
) {
  return "";
};

forBlock["dropdown_pkg_copy_json"] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator
) {
  return "";
};

forBlock["dropdown_pkg_copy_js"] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator
) {
  return "";
};

forBlock["field_searchable_dropdown_json"] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator
) {
  return "";
};

forBlock["field_searchable_dropdown_json"] = function (
  block: Blockly.Block,
  generator: Blockly.CodeGenerator
) {
  return "";
};
