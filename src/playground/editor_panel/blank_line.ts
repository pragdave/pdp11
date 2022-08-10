import { EditorGutterLine } from "../editor_panel"
import { Dispatcher } from "../playground"
import { BlankLine as BLT } from "../../assembler-emulator"

export function BlankLine(_dispatcher: Dispatcher, _line: BLT): EditorGutterLine {
  return {
    el: null
  }
}



