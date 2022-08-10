import { el } from "redom"
import { Dispatcher, StateUpdated } from "../playground"
import { SourceCode } from "../../assembler-emulator"
import { MemoryTracker } from "../memory_tracker"
import { GutterLine } from "./gutter_line"

export function Gutter(dispatcher: Dispatcher, assembled: SourceCode) {
  const memoryTracker = new MemoryTracker()
  const lines = assembled.sourceLines.map((l) => GutterLine(dispatcher, l, memoryTracker))

  dispatcher.register("StateUpdated", (_state: StateUpdated) => {
    lines.forEach(l => l.memoryUpdated && l.memoryUpdated())
  })

  return {
    el: el(".gutter", lines),
  }
}


