import { Dispatcher } from "../playground"
import { BlankLine as BLT } from "../../assembler-emulator"
import { el, text } from "redom"
import { EditorGutterLine } from "./gutter_line"

export function BlankLine(_dispatcher: Dispatcher, _line: BLT): EditorGutterLine {
  return {
    el: el("span.dummy-span", text("")),
  }
}



