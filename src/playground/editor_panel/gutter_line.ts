import { el, RedomComponent, setChildren, setStyle } from "redom"
import { Dispatcher } from "../playground"
import { LineType, SourceLine, CodegenLine as CGL } from "../../assembler-emulator"
import { AssignmentLine } from "./assignment_line"
import { BlankLine } from "./blank_line"
import { CodegenLine } from "./codegen_line"
import { ErrorLine } from "./error_line"
import { LineNumber } from "./line_number"
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

type Context = { dispatcher: Dispatcher, memoryTracker: MemoryTracker }

export function GutterLine() {
  const element = el(".gutter-line-holder") //, {style: {height}}, handler),

  return {
    el: element,

    update: (line: SourceLine, index: number, _items: SourceLine[], context: Context ) => {
      const { dispatcher, memoryTracker } = context
      const height = `calc(${line.height_in_lines}*var(--line-height))`
      const handler = LineTypeMap[line.type](dispatcher, line, memoryTracker)
      let line_pc = -1
      if (line.type == LineType.CodegenLine) {
        line_pc = (line as CGL).address
      }
      setChildren(element, [handler, LineNumber(dispatcher, index+1, line_pc)])
      setStyle(element, { height })
    }
  }
}



