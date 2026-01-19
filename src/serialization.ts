/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from "blockly/core";

const addRootStrategy = (workspace: Blockly.Workspace) => {
  Blockly.serialization.blocks.append(
    { type: "root_strategy", inputs: {} },
    workspace
  );
};

const storageKey = "mainWorkspace";

/**
 * Saves the state of the workspace to browser's local storage.
 * @param workspace Blockly workspace to save.
 */
export const save = function (workspace: Blockly.Workspace) {
  const data = Blockly.serialization.workspaces.save(workspace);
  console.log("Saving workspace data", { workspace, data });
  window.localStorage?.setItem(storageKey, JSON.stringify(data));
};

const disableLoadState = 0;

const deprecatedBlockTypes: any = [];

const processData = (data: any) => ({
  ...data,
  blocks: {
    ...data.blocks,
    blocks: data.blocks.blocks.filter(
      (node: any) => !deprecatedBlockTypes.includes(node.type)
    ),
  },
});

/**
 * Loads saved state from local storage into the given workspace.
 * @param workspace Blockly workspace to load into.
 */
export const load = function (workspace: Blockly.Workspace) {
  const data = window.localStorage?.getItem(storageKey);
  const dataParsed = data ? processData(JSON.parse(data)) : null;

  console.log("Loading workspace data", {
    workspace,
    dataParsed,
  });

  if (!dataParsed || disableLoadState) {
    // Don't emit events during loading.
    Blockly.Events.disable();
    // debugger;
    addRootStrategy(workspace);
    Blockly.Events.enable();
  } else {
    // Don't emit events during loading.
    Blockly.Events.disable();
    Blockly.serialization.workspaces.load(dataParsed, workspace, undefined);
    const roots = workspace.getBlocksByType("root_strategy");
    if (!roots.length) {
      debugger;
      addRootStrategy(workspace);
    }
    Blockly.Events.enable();
  }
};
