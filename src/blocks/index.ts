import * as Blockly from "blockly/core";
import { addText } from "./text";
import { BlockDefinition } from "blockly/core/blocks";
import { BlocklyFieldSearchableDropdown } from "../fields/BlocklyFieldSearchableDropdown";
import { SearchableDropdown } from "../fields/SearchableDropdown";

// types missing
// import { FieldSearchable } from "blockly-field-searchable-dropdown";

// Blockly.Blocks["validator_example"] = {
//   init: function () {
//     // Remove all 'a' characters from the text input's value.
//     var validator = function (newValue) {
//       return newValue.replace(/\a/g, "");
//     };

//     var field = new Blockly.FieldTextInput("default");
//     field.setValidator(validator);

//     this.appendDummyInput().appendField(field);
//   },
// };

// Blockly.Blocks["root_strategy"] = {
//   init: function () {
//     this.jsonInit(rootStrategy);
//     this.setDeletable(false);

//     // how to add validator here?
//     // debugger;
//     // this.setMovable(false);
//     // this.setEditable(false);
//     // etc...
//   },
// };

const rootStrategy: BlockDefinition = {
  type: "root_strategy",
  message0: "Strategy %1",
  args0: [
    {
      type: "input_statement",
      name: "STRATEGIES",
      check: ["strategy_inner_type"],
    },
  ],
  extensions: ["pfx_non_deletable"],
  colour: 230,
};

const strategyInner: BlockDefinition = {
  type: "strategy_inner",
  message0: "Staregy inner %1",
  args0: [
    {
      type: "input_value",
      name: "ACTIONS",
    },
  ],
  previousStatement: ["strategy_inner_type"],
  nextStatement: null,
  //   nextStatement: ["strategy_inner_type"],
  colour: 120,
};

const simple_dropdown_1: BlockDefinition = {
  type: "simple_dropdown_1",
  message0: "simple_dropdown_1 %1",
  args0: [
    {
      type: "field_dropdown",
      name: "FRUIT",
      options: [
        ["Apple", "APPLE"],
        ["Banana", "BANANA"],
        ["Cherry", "CHERRY"],
        ["Date", "DATE"],
        ["Elderberry", "ELDERBERRY"],
        ["Fig", "FIG"],
        ["Grape", "GRAPE"],
        ["Honeydew", "HONEYDEW"],
      ],
    },
  ],
  colour: 120,
};

const dropdown_pkg_copy_json: BlockDefinition = {
  type: "dropdown_pkg_copy_json",
  message0: "dropdown_pkg_copy_json %1",
  args0: [
    {
      type: "field_dropdown_pkg_copy",
      name: "FRUIT",
      options: [
        ["Apple", "APPLE"],
        ["Banana", "BANANA"],
        ["Cherry", "CHERRY"],
        ["Date", "DATE"],
        ["Elderberry", "ELDERBERRY"],
        ["Fig", "FIG"],
        ["Grape", "GRAPE"],
        ["Honeydew", "HONEYDEW"],
      ],
    },
  ],
  colour: 120,
};

const dropdown_pkg_json: BlockDefinition = {
  type: "dropdown_pkg_json",
  message0: "dropdown_pkg_json %1",
  args0: [
    {
      type: "field_grid_dropdown",
      name: "FRUIT",
      options: [
        ["Apple", "APPLE"],
        ["Banana", "BANANA"],
        ["Cherry", "CHERRY"],
        ["Date", "DATE"],
        ["Elderberry", "ELDERBERRY"],
        ["Fig", "FIG"],
        ["Grape", "GRAPE"],
        ["Honeydew", "HONEYDEW"],
      ],
    },
  ],
  colour: 120,
};

const field_searchable_dropdown_json: BlockDefinition = {
  type: "field_searchable_dropdown_json",
  message0: "field_searchable_dropdown_json %1",
  args0: [
    {
      type: "field_searchable_dropdown",
      name: "FRUIT",
      options: [
        ["Apple", "APPLE"],
        ["Banana", "BANANA"],
        ["Cherry", "CHERRY"],
        ["Date", "DATE"],
        ["Elderberry", "ELDERBERRY"],
        ["Fig", "FIG"],
        ["Grape", "GRAPE"],
        ["Honeydew", "HONEYDEW"],
      ],
    },
  ],
  colour: 120,
};

const notStrategyInner: BlockDefinition = {
  type: "not_strategy_inner",
  message0: "Not staregy inner %1",
  args0: [
    {
      type: "input_value",
      name: "ACTIONS",
    },
  ],
  previousStatement: ["not_strategy_inner_type"],
  nextStatement: null,
  //   nextStatement: ["not_strategy_inner_type"],
  colour: 120,
};

const myAdd: BlockDefinition = {
  type: "my_add",
  message0: "%1 + %2",
  inputsInline: true,
  colour: 70,
  args0: [
    {
      type: "input_value",
      name: "num1",
      check: "Number",
    },
    {
      type: "input_value",
      name: "num2",
      check: "Number",
    },
  ],
  output: "Number",
};

// Create the block definitions for the JSON-only blocks.
// This does not register their definitions with Blockly.
// This file has no side effects!
export const jsonBlocks = Blockly.common.createBlockDefinitionsFromJsonArray([
  //   rootStrategy,
  strategyInner,
  notStrategyInner,
  addText,
  myAdd,
  simple_dropdown_1,
  dropdown_pkg_copy_json,
  dropdown_pkg_json,
  field_searchable_dropdown_json,
]);

const root_strategy: any = {
  init: function () {
    this.jsonInit(rootStrategy);
    this.data = "root_strategy init data";
    // this.setDeletable(false);
  },
  //   onchange: function (event: Blockly.Events.Abstract) {
  //     console.log("Root strategy block changed", { event, block: this });
  //     debugger;
  //   },
};

const field_validator: any = {
  init: function () {
    // Remove all 'a' characters from the text input's value.
    // var validator = function (newValue: string) {
    //   return newValue.replace(/\a/g, "");
    // };

    var field = new Blockly.FieldTextInput("default");
    // var field = new Blockly.FieldTextInput("default", validator);
    field.setValidator(this.validate);

    this.appendDummyInput().appendField(field, "VAL");
  },
  validate: function (newValue: string) {
    // this.getSourceBlock().setColour(colourHex);
    return newValue.replace(/\a/g, "");
  },
};

// interface MyBlock<T> extends Blockly.Block {

// }

type MyBlock<T> = Blockly.Block & T;
type CheckboxValidator = {
  validate: any;
  updateTextField: () => void;
  showTextField_: boolean;
};

type BoolString = "TRUE" | "FALSE";
const checkbox_validator: any = {
  init: function () {
    var field = new Blockly.FieldCheckbox(true);
    field.setValidator(this.validate);

    // debugger;

    this.appendDummyInput("MY_DUMMY")
      .appendField("checkbox:")
      .appendField(field, "CHCKBX");
  },
  validate: function (newValue: BoolString) {
    var sourceBlock = this.getSourceBlock();
    sourceBlock.showTextField_ = newValue == "TRUE";
    sourceBlock.updateTextField();

    return newValue;
  },
  updateTextField: function () {
    const that = this as Blockly.Block & { showTextField_: boolean };
    var input = that.getInput("MY_DUMMY");
    if (!input) {
      debugger;
      return;
    }
    if (that.showTextField_ && !that.getField("TEXT")) {
      input.appendField(new Blockly.FieldTextInput(), "TEXT");
    } else if (!that.showTextField_ && that.getField("TEXT")) {
      input.removeField("TEXT");
    }
  },
};

// https://developers.google.com/blockly/guides/create-custom-blocks/mutators
const my_mutator_example: any = {
  init: function () {
    this.appendDummyInput().appendField("My mutator example");
    this.setColour(290);
    // this.setMutator(new Blockly.Mutator([]));
    // this.itemCount_ = 0;
  },
  //   ...Blockly.Extensions.buildMutator([
  //     // List of block types that can be added.
  //     // In this case, we don't have any specific blocks to add.
  //   ]),
};

const dropdown_pkg_copy_js: any = {
  init: function () {
    this.appendDummyInput().appendField("dropdown_pkg_copy_js");
    this.setColour(20);
    var options: any = [
      ["Apple", "APPLE"],
      ["Banana", "BANANA"],
      ["Cherry", "CHERRY"],
      ["Date", "DATE"],
      ["Elderberry", "ELDERBERRY"],
      ["Fig", "FIG"],
      ["Grape", "GRAPE"],
      ["Honeydew", "HONEYDEW"],
    ];
    // TODO: why it's rendering value (not option label) and why dropdown is not working?
    this.appendDummyInput().appendField(
      new BlocklyFieldSearchableDropdown(options, this.validator),
      "FRUIT"
    );
  },
};

export const jsBlocks = {
  root_strategy,
  field_validator,
  checkbox_validator,
  my_mutator_example,
  dropdown_pkg_copy_js,
};
