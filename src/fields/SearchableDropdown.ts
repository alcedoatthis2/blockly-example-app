import * as Blockly from "blockly/core";
// import { FieldInput, FieldInputConfig } from "blockly/core/field_input";
import { dom } from "blockly/core/utils";

/*
- uz to stejne mas, ale custom - ja bych vykradl FieldDropdown,
    predevsim to jak se tam vytvari Dropdown -> Menu, MenuItem.
    Hlavne tedy metody createDropdown_ a createDropdown
    bacha, nebudes tam delat focus do dropdownu ale do toho inputu.
    (Nepotrebujeme vubec options.image a vsechno okolo renderovani obrazku kdyztak).
- Filter bych dal jako fci pres options do constructoru

*/

// FieldInput and FieldInputConfig are not exported from 'blockly/core/field_input'
// type ConfigType = FieldInputConfig & {
//   filterOptions?: (options: any, input: string) => any;
// };
type ConfigType = any;

type Option = [string, string];

export class SearchableDropdown extends Blockly.FieldTextInput {
  /**
   * Array holding info needed to unbind events.
   * Used for disposing.
   * @type {!Array<!Blockly.browserEvents.Data>}
   * @private
   */
  boundEvents_: Array<Blockly.browserEvents.Data> = [];
  rules: Option[] = [];
  filteredOptions: Option[] = [];
  optionsContainer: HTMLElement | null = null;
  customFilterOptions: ((options: Option[], input: string) => any) | undefined =
    undefined;

  constructor(rules: Option[], validator: any, config: ConfigType | undefined) {
    console.log("[SearchableDropdown.constructor] 0", {
      rules,
      validator,
    });
    var value = "";
    super(value, validator);

    console.log("[SearchableDropdown.constructor] 1", {
      rules,
      validator,
      this: this,
    });

    this.rules = rules || [];
    this.filteredOptions = rules || []; // TODO
    this.customFilterOptions = config?.filterOptions;
    this.setSpellcheck(false);
    this.setValidator(this.validate.bind(this));
  }

  validate(newValue: any): any {
    console.log("[SearchableDropdown.validate]", { newValue, this: this });
    if (this.optionsContainer) this.onHtmlInputChange_(undefined);
    return newValue;
  }

  static fromJson({ name, options, type }: any) {
    console.log("[SearchableDropdown.fromJson]", { options });
    // `this` might be a subclass of SearchableDropdown if that class doesn't
    // override the static fromJson method.
    return new this(options, undefined, undefined);
  }

  showEditor_() {
    console.log("[SearchableDropdown.showEditor_]", { this: this });
    if (this.optionsContainer) {
      return; // dropdown already open → do nothing
    }

    // debugger;

    // Set up the text input field first
    super.showEditor_();

    const div = Blockly.WidgetDiv.getDiv();
    if (!div?.firstChild) {
      // Mobile interface uses Blockly.dialog.setPrompt().
      return;
    }
    // Store reference to htmlInput for later
    const htmlInput = this.htmlInput_;

    // Create dropdown and add it to DropDownDiv
    const editor = this.dropdownCreate_();
    Blockly.DropDownDiv.getContentDiv().appendChild(editor);
    Blockly.DropDownDiv.setColour(
      (this as any).sourceBlock_.style.colourPrimary,
      (this as any).sourceBlock_.style.colourTertiary
    );
    // const focusManager = Blockly.getFocusManager();
    // debugger;
    Blockly.DropDownDiv.showPositionedByField(
      this,
      this.dropdownDispose_.bind(this),
      undefined,
      false // Without manageEphemeralFocus:false it crashes on focus conflict. Consequences?
    );

    // Keep focus on the text input
    if (htmlInput) {
      htmlInput.focus();
    }

    // Render initial options
    this.renderOptions();

    if (!this.optionsContainer) {
      throw new Error("optionsContainer is null after creation");
    }

    // Bind events
    this.boundEvents_.push(
      Blockly.browserEvents.bind(
        this.optionsContainer,
        "click",
        this,
        this.hide_
      )
    );
    this.boundEvents_.push(
      Blockly.browserEvents.bind(
        this.optionsContainer,
        "mousemove",
        this,
        this.onMouseMove
      )
    );
  }

  dropdownCreate_() {
    console.log(
      "[SearchableDropdown.dropdownCreate_] adding this.optionsContainer",
      { this: this }
    );
    this.optionsContainer = document.createElement("div");
    this.optionsContainer.className =
      "blocklyMenu goog-menu blocklyNonSelectable blocklyDropdownMenu";
    this.optionsContainer.id = "blocklySearchableDropdown";

    // 选项容器 == options container
    // this.renderOptions();

    return this.optionsContainer;
  }

  // Rendering filtered options
  renderOptions() {
    if (!this.optionsContainer) {
      throw new Error("optionsContainer is null in renderOptions");
    }
    if (!this.filteredOptions) {
      throw new Error("filteredOptions is null in renderOptions");
    }
    console.log("[SearchableDropdown.renderOptions]", { this: this });

    this.optionsContainer.innerHTML = "";
    this.filteredOptions.forEach(([text, value]: any, index: any) => {
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
      this.optionsContainer?.appendChild(menuItemContent);
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
    this.optionsContainer = null;
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

  valueToNote(value: any) {
    // return value;
    if (this.rules === undefined) return value;
    for (const [label, val] of this.rules) {
      if (val === value) {
        return label;
      }
    }
    return value;
  }

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
    let text: string | null = "";
    console.log("[SearchableDropdown.getText_] 0", {
      isBeingEdited: this.isBeingEdited_,
    });
    if (this.isBeingEdited_) {
      text = super.getText_();
    } else {
      text = this.valueToNote(this.getValue()) || null;
    }
    console.log("[SearchableDropdown.getText_] 1", {
      isBeingEdited: this.isBeingEdited_,
      text,
    });
    return text;
  }

  /**
   * Transform the provided value into a text to show in the HTML input.
   * @param {*} value The value stored in this field.
   * @returns {string} The text to show on the HTML input.
   */
  getEditorText_(value: any) {
    const text = this.valueToNote(value);
    console.log("[SearchableDropdown.getEditorText_]", {
      value,
      text,
      isBeingEdited: this.isBeingEdited_,
    });
    return text;
  }

  /**
   * Transform the text received from the HTML input (note) into a value
   * to store in this field.
   * @param {string} text Text received from the HTML input.
   * @returns {*} The value to store.
   */
  getValueFromEditorText_(text: any) {
    const value = this.noteToValue(text);
    console.log("[SearchableDropdown.getValueFromEditorText_]", {
      text,
      value,
      this: this,
    });
    return value;
  }

  /**
   * Redraw the pitch picker with the current pitch.
   * @private
   */
  updateGraph_() {
    console.log("[SearchableDropdown.filterOptions] 1", { this: this });
    if (!this.optionsContainer) {
      return;
    }
    console.log("[SearchableDropdown.filterOptions] 2", { this: this });
    const i = this.getValue() || 0;
    this.optionsContainer.style.backgroundPosition = -i * 37 + "px 0";
  }

  doClassValidation_(newValue: any) {
    if (newValue === null || newValue === undefined) {
      console.log(
        "[SearchableDropdown.doClassValidation_] ABORTING with null",
        { newValue }
      );
      return null;
    }
    const note = this.valueToNote(newValue);

    console.log("[SearchableDropdown.doClassValidation_]", {
      newValue,
      note,
    });

    // Without this, empty string does not display all options
    return newValue;

    if (note) {
      return newValue;
    }
    return null;
  }

  defaultFilterOptions(options: Option[], input: string) {
    const regex = new RegExp(input, "i");
    return options.filter(
      ([label, val]: any) => regex.test(label) || regex.test(val)
    );
  }

  filterOptions(keyword: any) {
    console.log("[SearchableDropdown.filterOptions]", { keyword, this: this });
    if (!this.rules) {
      throw new Error("options missing in filterOptions");
    }
    const filterFn = this.customFilterOptions || this.defaultFilterOptions;
    this.filteredOptions = filterFn(this.rules, keyword);

    if (!this.filteredOptions?.length) {
      // TODO: invalid value
      this.filteredOptions = [["No matching data", "No matching data"]];
    }
  }

  // Rewrite the processing logic when the input box content changes
  onHtmlInputChange_(e: any) {
    // why not called?
    // debugger;
    console.log("[SearchableDropdown.onHtmlInputChange_]", { e });
    // Filter options based on input and re-render dropdown
    const inputValue = this.htmlInput_?.value || "";
    this.filterOptions(inputValue);
    this.renderOptions();
  }
  bindEvents_() {
    super.bindEvents_();
  }
}

Blockly.fieldRegistry.register("field_searchable_dropdown", SearchableDropdown);

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
