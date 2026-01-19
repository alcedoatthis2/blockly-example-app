/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview searchable dropdown field.
 * @author baich.info@gmail.com (Junius Cho)
 */

import * as Blockly from "blockly/core";

/**
 * searchable dropdown field.
 */

export class BlocklyFieldSearchableDropdown extends Blockly.FieldTextInput {
  /**
   * Array holding info needed to unbind events.
   * Used for disposing.
   * @type {!Array<!Blockly.browserEvents.Data>}
   * @private
   */
  boundEvents_ = [];

  constructor(rules: any, validator: any) {
    var value = "";
    super(value, validator);

    console.log("[BlocklyFieldSearchableDropdown.constructor]", {
      rules,
      validator,
      this: this,
    });
    // Disable spellcheck.
    (this as any).rules = rules;
    (this as any).filteredOptions = rules || [];
    this.setSpellcheck(false);
  }

  /**
   * Construct a BlocklyFieldSearchableDropdown from a JSON arg object.
   * @param {!Object} options A JSON object with options (pitch).
   * @returns {!BlocklyFieldSearchableDropdown} The new field instance.
   * @package
   * @nocollapse
   */
  static fromJson(options: any) {
    console.log("[BlocklyFieldSearchableDropdown.fromJson]", { options });
    // `this` might be a subclass of BlocklyFieldSearchableDropdown if that class doesn't
    // override the static fromJson method.
    return new this(options["pitch"], undefined);
  }

  /**
   * Show the inline free-text editor on top of the text and the pitch picker.
   * @protected
   */
  showEditor_() {
    console.log("[BlocklyFieldSearchableDropdown.showEditor_]", { this: this });
    if ((this as any).optionsContainer) {
      return; // dropdown already open → do nothing
    }

    // Set up the text input field first
    super.showEditor_();

    const div = Blockly.WidgetDiv.getDiv();
    if (!div?.firstChild) {
      // Mobile interface uses Blockly.dialog.setPrompt().
      return;
    }

    // Store reference to htmlInput for later
    const htmlInput = (this as any).htmlInput_;

    // Create dropdown and add it to DropDownDiv
    const editor = this.dropdownCreate_();
    Blockly.DropDownDiv.getContentDiv().appendChild(editor);

    Blockly.DropDownDiv.setColour(
      (this as any).sourceBlock_.style.colourPrimary,
      (this as any).sourceBlock_.style.colourTertiary
    );

    Blockly.DropDownDiv.showPositionedByField(
      this,
      this.dropdownDispose_.bind(this)
    );

    // Keep focus on the text input
    if (htmlInput) {
      htmlInput.focus();
    }

    // Render initial options
    this.renderOptions();

    // Bind events
    (this as any).boundEvents_.push(
      Blockly.browserEvents.bind(
        (this as any).optionsContainer,
        "click",
        this,
        this.hide_
      )
    );
    (this as any).boundEvents_.push(
      Blockly.browserEvents.bind(
        (this as any).optionsContainer,
        "mousemove",
        this,
        this.onMouseMove
      )
    );
  }

  /**
   * Create the pitch picker.
   * @returns {!Element} The newly created pitch picker.
   * @private
   */
  dropdownCreate_() {
    (this as any).optionsContainer = document.createElement("div");
    (this as any).optionsContainer.className =
      "blocklyMenu goog-menu blocklyNonSelectable blocklyDropdownMenu";
    (this as any).optionsContainer.id = "blocklySearchableDropdown";

    // 选项容器
    this.renderOptions();

    return (this as any).optionsContainer;
  }

  // Rendering filtered options
  renderOptions() {
    (this as any).optionsContainer.innerHTML = "";
    (this as any).filteredOptions.forEach(([text, value]: any, index: any) => {
      const menuItemContent = document.createElement("div");
      menuItemContent.className =
        "blocklyMenuItemContent goog-menuitem-content";
      const checkbox = document.createElement("div");
      checkbox.className =
        "blocklyMenuItemCheckbox goog-menuitem-checkbox" +
        (this.value_ == value ? " optionSelected" : "");

      const option = document.createElement("div");
      option.className = "blocklyMenuItem blocklySearchOption";
      option.textContent = text;
      option.dataset.value = value;
      option.addEventListener("click", () => this.onOptionSelected(value));
      menuItemContent.appendChild(checkbox);
      menuItemContent.appendChild(option);
      (this as any).optionsContainer.appendChild(menuItemContent);
    });
  }
  onOptionSelected(value: any) {
    this.setEditorValue_(value);
    // background: url(https://blockly-demo.appspot.com/static/media/sprites.png) no-repeat -48px -16px
    this.hide_();
  }
  /**
   * Dispose of events belonging to the pitch picker.
   * @private
   */
  dropdownDispose_() {
    for (const event of this.boundEvents_) {
      Blockly.browserEvents.unbind(event);
    }
    this.boundEvents_.length = 0;
    (this as any).optionsContainer = null;
  }

  /**
   * Hide the editor and picker.
   * @private
   */
  hide_() {
    Blockly.WidgetDiv.hide();
    Blockly.DropDownDiv.hideWithoutAnimation();
  }

  /**
   * Set the note to match the mouse's position.
   * @param {!Event} e Mouse move event.
   */
  onMouseMove(e: any) {
    // const bBox = this.optionsContainer.getBoundingClientRect();
    // const dy = e.clientY - bBox.top;
    // const note = Blockly.utils.math.clamp(Math.round(13.5 - dy / 7.5), 0, 12);
    // this.optionsContainer.style.backgroundPosition = -note * 37 + 'px 0';
    // this.setEditorValue_(note);
  }

  /**
   * Convert the machine-readable value (0-12) to human-readable text (C3-A4).
   * @param {number|string} value The provided value.
   * @returns {string|undefined} The respective pitch, or undefined if invalid.
   */
  valueToNote(value: any) {
    // return value;
    if ((this as any).rules === undefined) return value;
    for (const [a, b] of (this as any).rules) {
      if (b === value) {
        return a;
      }
    }
    return value;
  }

  /**
   * Convert the human-readable text (C3-A4) to machine-readable value (0-12).
   * @param {string} text The provided pitch.
   * @returns {number|undefined} The respective value, or undefined if invalid.
   */
  noteToValue(text: any) {
    return text;
  }

  /**
   * Get the text to be displayed on the field node.
   * @returns {?string} The HTML value if we're editing, otherwise null.
   * Null means the super class will handle it, likely a string cast of value.
   * @protected
   */
  getText_() {
    console.log("[BlocklyFieldSearchableDropdown.getText_]", {
      isBeingEdited: this.isBeingEdited_,
    });
    if (this.isBeingEdited_) {
      return super.getText_();
    }
    return this.valueToNote(this.getValue()) || null;
  }

  /**
   * Transform the provided value into a text to show in the HTML input.
   * @param {*} value The value stored in this field.
   * @returns {string} The text to show on the HTML input.
   */
  getEditorText_(value: any) {
    return this.valueToNote(value);
  }

  /**
   * Transform the text received from the HTML input (note) into a value
   * to store in this field.
   * @param {string} text Text received from the HTML input.
   * @returns {*} The value to store.
   */
  getValueFromEditorText_(text: any) {
    return this.noteToValue(text);
  }

  /**
   * Redraw the pitch picker with the current pitch.
   * @private
   */
  updateGraph_() {
    if (!(this as any).optionsContainer) {
      return;
    }
    const i = this.getValue() || 0;
    (this as any).optionsContainer.style.backgroundPosition = -i * 37 + "px 0";
  }

  /**
   * Ensure that only a valid value may be entered.
   * @param {*} opt_newValue The input value.
   * @returns {*} A valid value, or null if invalid.
   */
  doClassValidation_(opt_newValue: any) {
    if (opt_newValue === null || opt_newValue === undefined) {
      return null;
    }
    const note = this.valueToNote(opt_newValue);
    if (note) {
      return opt_newValue;
    }
    return null;
  }
  fielterOptions(keyword: any) {
    const regex = new RegExp(keyword, "i");
    if ((this as any).rules) {
      (this as any).filteredOptions = (this as any).rules.filter(
        ([a, b]: any) => regex.test(a) || regex.test(b)
      );
    }
    if (
      !(this as any).filteredOptions ||
      !(this as any).filteredOptions.length
    ) {
      (this as any).filteredOptions = [
        ["No matching data", "No matching data"],
      ];
    }
  }

  // Rewrite the processing logic when the input box content changes
  onHtmlInputChange_(e: any) {
    console.log("[BlocklyFieldSearchableDropdown.onHtmlInputChange_]", { e });
    // Filter options based on input and re-render dropdown
    const inputValue = (this as any).htmlInput_?.value || "";
    this.fielterOptions(inputValue);
    this.renderOptions();
  }
  bindEvents_() {
    super.bindEvents_();
  }
}

Blockly.fieldRegistry.register(
  "field_dropdown_pkg_copy",
  BlocklyFieldSearchableDropdown
);

/**
 * CSS for slider field.
 */
Blockly.Css.register(`
 /** Setup grid layout of DropDown */
.blocklyDropDownDiv {
    z-index: 10000 !important;
    background-color: white !important;
}
.blocklySearchOption:hover {
  background: #f0f0f0;
}
.optionSelected{
    background: url(https://blockly-demo.appspot.com/static/media/sprites.png) no-repeat -48px -16px;
    margin-top: 6px;
}
 `);
