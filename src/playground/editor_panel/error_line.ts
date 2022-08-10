import { EditorGutterLine } from "../editor_panel"
import { Dispatcher } from "../playground"
import { ErrorLine as ELT } from "../../assembler-emulator"

export function ErrorLine(_dispatcher: Dispatcher, _line: ELT): EditorGutterLine {
  return {
    el: null
  }
}



