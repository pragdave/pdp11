import { el } from "redom"
import { assemble, SourceCode } from "../assembler-emulator"
import { Editor } from "./editor"
import { Gutter } from "./editor_panel/gutter"
import { Dispatcher, ToggleSetBreakpoint } from "./playground"


export class EditorPanel {

  cm_editor: HTMLElement
  el: HTMLElement
  source: string
  assembled: SourceCode
  gutter: ReturnType<typeof Gutter>
  editor: Editor
  breakpointAddresses: Set<number> = new Set()

  constructor(private dispatcher: Dispatcher, source: string) {
    this.assemble_source(source)
    this.cm_editor = el(".editor-panel")
    this.gutter = Gutter(this.dispatcher, this.assembled)
    this.el = el(".playground-editor", this.gutter, this.cm_editor)

    dispatcher.register("ToggleSetBreakpoint", (ev: ToggleSetBreakpoint) => {
      const address = ev.address
      if (address in this.breakpointAddresses)
        this.breakpointAddresses.delete(address)
        else
        this.breakpointAddresses.add(address)
      console.log("breakpoints", this.breakpointAddresses)
    })
  }

  onmount() {
    this.editor = new Editor(this.source, this.cm_editor, (s) => this.source_changed(s))
  }

  assemble_source(source: string) {
    this.source = source
    this.assembled = assemble(this.dispatcher, this.source)
    this.breakpointAddresses.clear()
  }

  breakpointSetAt(address: number): boolean {
    console.log("bp?", address, this.breakpointAddresses.has(address))
    return this.breakpointAddresses.has(address)
  }

  revert_to_original_source() {
    this.editor?.revert_to_original_source()
  }

  source_changed(source: string) {
    this.assemble_source(source)
    return this.assembled
  }
}
