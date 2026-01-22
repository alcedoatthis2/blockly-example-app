import * as Blockly from "blockly";
export class FieldSearchableDropdown extends Blockly.FieldDropdown {
  private filterInput_: HTMLInputElement | null = null;
  private originalMenuGenerator: Blockly.MenuGenerator;
  //   private originalMenuGenerator: Blockly.FieldDropdownMenuGenerator;

  constructor(
    menuGenerator: Blockly.MenuGenerator,
    // menuGenerator: Blockly.FieldDropdownMenuGenerator,
    opt_validator?: Blockly.FieldValidator
  ) {
    // const validator = opt_validator || this.validate;
    super(menuGenerator, opt_validator);
    this.originalMenuGenerator = menuGenerator;
  }

  validate(newValue: string): string | null {
    this.updateMenu_();
    return newValue;
  }

  // Called when dropdown is about to be shown
  protected override showEditor_(e?: MouseEvent): void {
    console.log("[FieldSearchableDropdown.showEditor_]", { this: this });
    debugger;
    // Let parent create the basic dropdown structure
    super.showEditor_(e);

    // Now inject our search input
    const div = Blockly.DropDownDiv.getContentDiv();
    if (!div) return;

    // Create filter input at the very top
    this.filterInput_ = document.createElement("input");
    this.filterInput_.type = "text";
    this.filterInput_.placeholder = "Type to filter...";
    this.filterInput_.style.width = "calc(100% - 16px)";
    this.filterInput_.style.margin = "8px";
    this.filterInput_.style.padding = "6px 8px";
    this.filterInput_.style.boxSizing = "border-box";
    this.filterInput_.style.border = "1px solid #ccc";
    this.filterInput_.style.borderRadius = "4px";

    debugger;

    // Insert at the beginning
    div.insertBefore(this.filterInput_, div.firstChild);

    // Focus it
    setTimeout(() => this.filterInput_?.focus(), 0);

    // Listen for filtering
    this.filterInput_.addEventListener("input", () => this.updateMenu_());
    debugger;
    // Re-generate menu when shown (in case options are dynamic)
    this.updateMenu_();
  }

  private updateMenu_(): void {
    if (!this.filterInput_) return;

    const searchText = this.filterInput_.value.trim().toLowerCase();

    // Get fresh options (important if dynamic)
    let allOptions =
      typeof this.originalMenuGenerator === "function"
        ? this.originalMenuGenerator()
        : this.originalMenuGenerator;

    // Filter them
    if (searchText) {
      allOptions = allOptions.filter((item: any) =>
        item[0].toLowerCase().includes(searchText)
      );
      //   allOptions = allOptions.filter((item: [string, string]) =>
      //     item[0].toLowerCase().includes(searchText)
      //   );
    }

    // Update internal menu generator temporarily
    (this as any).menuGenerator_ = allOptions;

    console.log("[FieldSearchableDropdown.updateMenu_]", {
      searchText,
      allOptions,
    });
    debugger;

    // Force rebuild of the menu
    // Warning: this is a bit fragile – relies on internal implementation
    const menu = (this as any).menu_;
    if (menu) {
      // Clear old items
      while (menu.firstChild) {
        menu.removeChild(menu.firstChild);
      }
      // Re-populate
      (this as any).populate_(menu);
    }
  }

  // Clean up
  //   protected override dispose(): void {
  //     //   protected override disposeInternal_(): void {
  //     if (this.filterInput_) {
  //       this.filterInput_.remove();
  //       this.filterInput_ = null;
  //     }
  //     super.dispose?.();
  //     // super.disposeInternal_?.();
  //   }

  // Optional: make sure we reset filter when reopening
  //   protected onMenuHide_(): void {
  //     //   protected override onMenuHide_(): void {
  //     if (this.filterInput_) {
  //       this.filterInput_.value = "";
  //     }
  //     super.onMenuHide_?.();
  //   }
}

// Register the field so it can be used in JSON blocks too
Blockly.fieldRegistry.register(
  "field_searchable_dropdown_2",
  FieldSearchableDropdown
);
