import { el, RedomElement } from "redom"
import { assemble, SourceCode } from "../assembler-emulator"
import { Editor } from "./editor"
import { Gutter } from "./editor_panel/gutter"
import { Dispatcher } from "./playground"


export class EditorPanel {

  cm_editor: HTMLElement
  el: HTMLElement
  source: string
  assembled: SourceCode
  gutter: RedomElement

  constructor(private dispatcher: Dispatcher, source: string) {
    this.source_changed(source)
    this.cm_editor = el(".editor-panel")
    this.gutter = Gutter(this.dispatcher, this.assembled)
    this.el = el(".playground-editor", this.gutter, this.cm_editor)
  }

  onmount() {
    new Editor(this.source, this.cm_editor, (s) => this.source_changed(s))
  }

  source_changed(s: string) {
    this.source = s
    this.assembled = assemble(this.dispatcher, this.source)
    return this.assembled
  }
}
