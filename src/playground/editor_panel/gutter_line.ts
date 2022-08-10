import { el, RedomComponent } from "redom"
import { Dispatcher } from "../playground"
import { LineType, SourceLine } from "../../assembler-emulator"
import { AssignmentLine } from "./assignment_line"
import { BlankLine } from "./blank_line"
import { CodegenLine } from "./codegen_line"
import { ErrorLine } from "./error_line"
import { MemoryTracker } from "../memory_tracker"

export type EditorGutterLine = RedomComponent & { memoryUpdated?: () => void }


type LineHandler = (dispatcher: Dispatcher, line: SourceLine, memoryTracker?: MemoryTracker) => EditorGutterLine
type LineTypeMapType = Record<LineType, LineHandler>

const LineTypeMap: LineTypeMapType = {
  AssignmentLine,
  BlankLine,
  CodegenLine,
  ErrorLine,
}

export function GutterLine(dispatcher: Dispatcher, line: SourceLine, memoryTracker: MemoryTracker) {
  const height = `calc(${line.height_in_lines}*var(--line-height))`
  const handler = LineTypeMap[line.type](dispatcher, line, memoryTracker)
  return {
    el: el(".gutter-line-holder", {style: {height}}, handler),
    memoryUpdated: handler.memoryUpdated
  }
}



