import { el } from "redom"
import { EditorGutterLine } from "../editor_panel"
import { PGNumber } from "../number"
import { Dispatcher } from "../playground"
import { AssignmentLine as ALT } from "../../assembler-emulator"

export function AssignmentLine(dispatcher: Dispatcher, line: ALT): EditorGutterLine {
  return {
    el: el(".gutter-line", el("span.assignment-value", PGNumber(dispatcher, line.value)))
  }
}


