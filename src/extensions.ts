import * as Blockly from "blockly";

// Blockly.Extensions.register("parent_tooltip_extension", function () {
//   // this refers to the block that the extension is being run on
//   var thisBlock = this;
//   this.setTooltip(function () {
//     var parent = thisBlock.getParent();
//     return (
//       (parent && parent.getInputsInline() && parent.tooltip) ||
//       Blockly.Msg["MATH_NUMBER_TOOLTIP"]
//     );
//   });
// });

Blockly.Extensions.register("pfx_non_deletable", function () {
  this.setDeletable(false);
});

// TODO?
// Blockly.Extensions.register("pfx_validator_", function () {
//
// });

// https://developers.google.com/blockly/guides/create-custom-blocks/mutators
const my_mutator: any = {
  updateShape_: function () {
    // TODO
  },
  // These are the serialization hooks for the lists_create_with block.
  saveExtraState: function () {
    return {
      itemCount: this.itemCount_,
    };
    /* {
        "type": "lists_create_with",
        "extraState": {
            "itemCount": 3 // or whatever the count is
        }
    } */
  },
  loadExtraState: function (state: any) {
    this.itemCount_ = state["itemCount"];
    // This is a helper function which adds or removes inputs from the block.
    this.updateShape_();
  },

  // These are the decompose and compose functions for the lists_create_with block.
  //   decompose: function (workspace: Blockly.Workspace) {
  decompose: function (workspace: any) {
    // This is a special sub-block that only gets created in the mutator UI.
    // It acts as our "top block"
    var topBlock = workspace.newBlock("lists_create_with_container");
    console.log({ topBlock, workspace });
    debugger;
    topBlock.initSvg();

    // Then we add one sub-block for each item in the list.
    var connection = topBlock.getInput("STACK").connection;
    for (var i = 0; i < this.itemCount_; i++) {
      var itemBlock = workspace.newBlock("lists_create_with_item");
      itemBlock.initSvg();
      connection.connect(itemBlock.previousConnection);
      connection = itemBlock.nextConnection;
    }

    // And finally we have to return the top-block.
    return topBlock;
  },

  // The container block is the top-block returned by decompose.
  compose: function (topBlock: any) {
    // First we get the first sub-block (which represents an input on our main block).
    var itemBlock = topBlock.getInputTargetBlock("STACK");

    // Then we collect up all of the connections of on our main block that are
    // referenced by our sub-blocks.
    // This relates to the saveConnections hook (explained below).
    var connections = [];
    while (itemBlock && !itemBlock.isInsertionMarker()) {
      // Ignore insertion markers!
      connections.push(itemBlock.valueConnection_);
      itemBlock =
        itemBlock.nextConnection && itemBlock.nextConnection.targetBlock();
    }

    // Then we disconnect any children where the sub-block associated with that
    // child has been deleted/removed from the stack.
    for (var i = 0; i < this.itemCount_; i++) {
      var connection = this.getInput("ADD" + i).connection.targetConnection;
      if (connection && connections.indexOf(connection) == -1) {
        connection.disconnect();
      }
    }

    // Then we update the shape of our block (removing or adding iputs as necessary).
    // `this` refers to the main block.
    this.itemCount_ = connections.length;
    this.updateShape_();

    // And finally we reconnect any child blocks.
    for (var i = 0; i < this.itemCount_; i++) {
      connections[i].reconnect(this, "ADD" + i);
    }
  },
  saveConnections: function (topBlock: any) {
    // First we get the first sub-block (which represents an input on our main block).
    var itemBlock = topBlock.getInputTargetBlock("STACK");

    // Then we go through and assign references to connections on our main block
    // (input.connection.targetConnection) to properties on our sub blocks
    // (itemBlock.valueConnection_).
    var i = 0;
    while (itemBlock) {
      // `this` refers to the main block (which is being "mutated").
      var input = this.getInput("ADD" + i);
      // This is the important line of this function!
      itemBlock.valueConnection_ = input && input.connection.targetConnection;
      i++;
      itemBlock =
        itemBlock.nextConnection && itemBlock.nextConnection.targetBlock();
    }
  },
};

Blockly.Extensions.registerMutator(
  "my_mutator",
  my_mutator,
  undefined
  //   ["controls_if_elseif", "controls_if_else"] // TODO
);
