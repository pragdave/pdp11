import { el } from "redom"
import { EditorGutterLine } from "./gutter_line"
import { PGNumber, PGNumberType } from "../number"
import { CodegenLine as CLT } from "../../assembler-emulator"
import { Dispatcher, StateUpdated } from "../playground"
import { MemoryTracker } from "../memory_tracker"

function bytesIntoWords(address: number, length: number, bytes: number[]) {
  const words:  number[] = []

  let index = 0

  function byteAt(offset: number) {
    if (offset in bytes)
      return bytes[offset]
    else {
      console.log("Access unset memory at", address + offset)
      return 0
    }
  }

  if ((address & 1) === 1 && index < length)
    words.push(byteAt(index++) << 8)

  while (index < length - 1) {
    words.push(byteAt(index + 1) << 8 | byteAt(index))
    index += 2
  }

  if (index < length) 
    words.push(byteAt(index))

  return words
}

function pgnumbersFromWords(dispatcher: Dispatcher, words: number[]) {
  const result: PGNumberType[] = []
  for (let value of words) {
    const element = PGNumber(dispatcher, value)
    result.push(element)
  }
  return result
}



export function CodegenLine(dispatcher: Dispatcher, line: CLT, memoryTracker: MemoryTracker): EditorGutterLine {
  const address = line.address
  const length = line.generatedBytes.length
  let words= bytesIntoWords(address, length, line.generatedBytes)
  let elements: PGNumberType[] = pgnumbersFromWords(dispatcher, words) 
  const wordLines = []

  for (let i = 0; i < elements.length; i += 3) {
    const next3 = elements.slice(i, i+3)
    wordLines.push(el(".word-line", next3))
  }

  dispatcher.register("StateUpdated", (state: StateUpdated) => {
    memoryTracker.recordDeltas(state.deltas.memory_delta)
  })

  return {
    el: el(".gutter-line",
      el("span.address", PGNumber(dispatcher, address)),
      el(".generated-bytes", wordLines),
    ),
    memoryUpdated: () => {
      const bytes = memoryTracker.updatesIn(address, length)
      if (bytes && bytes.length) {
        words = bytesIntoWords(address, length, bytes)
      }
      elements.forEach((e, i) => e.update(words[i]))
    }
  }

}


