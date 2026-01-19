/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from "blockly";
import { jsonBlocks, jsBlocks } from "./blocks";
import { forBlock } from "./generators/javascript";
import { javascriptGenerator } from "blockly/javascript";
import { save, load } from "./serialization";
import { toolbox_all, toolbox_flyout, toolbox_custom } from "./toolbox";
import "./index.css";
import {
  blocks as spBlocks,
  unregisterProcedureBlocks,
} from "@blockly/block-shareable-procedures";
import "./extensions";
import "./fields/BlocklyFieldSearchableDropdown";
import "blockly-field-searchable-dropdown";

unregisterProcedureBlocks();
Blockly.common.defineBlocks(spBlocks);
Blockly.common.defineBlocks(jsonBlocks);
Blockly.common.defineBlocks(jsBlocks);
Object.assign(javascriptGenerator.forBlock, forBlock);

// Set up UI elements and inject Blockly
const codeDiv = document.getElementById("generatedCode")?.firstChild;
const outputDiv = document.getElementById("output");
const blocklyDiv = document.getElementById("blocklyDiv");

if (!blocklyDiv) {
  throw new Error(`div with id 'blocklyDiv' not found`);
}

const theme = Blockly.Theme.defineTheme("pfx", {
  name: "pfx",
  base: Blockly.Themes.Classic,
  blockStyles: {
    logic_blocks: {
      colourPrimary: "#4a148c",
      colourSecondary: "#AD7BE9",
      colourTertiary: "#CDB6E9",
      hat: "cap",
    },
  },
  categoryStyles: {
    custom_category: {
      colour: "#4a148c",
    },
  },
});

const workspace = Blockly.inject(blocklyDiv, {
  toolbox: toolbox_all,
  theme,
  // renderer: "thrasos", // https://developers.google.com/blockly/guides/create-custom-blocks/renderers/overview
});

console.log("Workspace created", {
  workspace,
  jsonBlocks,
  jsBlocks,
  spBlocks,
  Blockly,
});

// automatically disable any block not connected to the root block
workspace.addChangeListener(Blockly.Events.disableOrphans);

// This function resets the code and output divs, shows the
// generated code from the workspace, and evals the code.
// In a real application, you probably shouldn't use `eval`.
const runCode = () => {
  const code = javascriptGenerator.workspaceToCode(
    workspace as Blockly.Workspace
  );
  if (codeDiv) codeDiv.textContent = code;

  if (outputDiv) outputDiv.innerHTML = "";

  eval(code);
};

if (workspace) {
  // Load the initial state from storage and run the code.
  load(workspace);
  runCode();

  // Every time the workspace changes state, save the changes to storage.
  workspace.addChangeListener((e: Blockly.Events.Abstract) => {
    // UI events are things like scrolling, zooming, etc.
    // No need to save after one of these.
    if (e.isUiEvent) return;
    save(workspace);
  });

  // Whenever the workspace changes meaningfully, run the code again.
  workspace.addChangeListener((e: Blockly.Events.Abstract) => {
    // Don't run the code when the workspace finishes loading; we're
    // already running it once when the application starts.
    // Don't run the code during drags; we might have invalid state.
    if (
      e.isUiEvent ||
      e.type == Blockly.Events.FINISHED_LOADING ||
      workspace.isDragging()
    ) {
      return;
    }
    runCode();
  });
}
