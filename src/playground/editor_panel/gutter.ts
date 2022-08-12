import { list } from "redom"
import { Dispatcher, NewCodeLoaded } from "../playground"
import { SourceCode, SourceLine } from "../../assembler-emulator"
import { MemoryTracker } from "../memory_tracker"
import { GutterLine } from "./gutter_line"

function sourceLineKey(line: SourceLine) {
  console.log(line.type, line.line_id)
  return line.line_id
}

export function Gutter(dispatcher: Dispatcher, assembled: SourceCode) {
  const memoryTracker = new MemoryTracker()
  const el = list(".gutter", GutterLine, sourceLineKey, memoryTracker)
  dispatcher.register("NewCodeLoaded", (state: NewCodeLoaded) => {
    el.update(state.assembled.sourceLines, { dispatcher, memoryTracker })
  })

  el.update(assembled.sourceLines, { dispatcher, memoryTracker })

  return {
    el: el,
  }
}


