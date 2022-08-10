import { el, RedomComponent, RedomElement } from "redom"
import { assemble, LineType, SourceCode, SourceLine } from "../assembler-emulator"
import { Editor } from "./editor"
import { PGNumber, PGNumberType } from "./number"

import { AssignmentLine as ALT, BlankLine as BLT, CodegenLine as CLT, ErrorLine as ELT } from "../assembler-emulator"
import { Dispatcher, StateUpdated } from "./playground"
import { Address, Value } from "../assembler-emulator/emulator/machine_state"


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

type EditorGutterLine = RedomComponent & { memoryUpdated?: () => void }

function AssignmentLine(dispatcher: Dispatcher, line: ALT): EditorGutterLine {
  return {
    el: el(".gutter-line", el("span.assignment-value", PGNumber(dispatcher, line.value)))
  }
}

function BlankLine(_dispatcher: Dispatcher, _line: BLT): EditorGutterLine {
  return {
    el: null
  }
}


function CodegenLine(dispatcher: Dispatcher, line: CLT, memoryTracker: MemoryTracker): EditorGutterLine {
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

function ErrorLine(_dispatcher: Dispatcher, _line: ELT): EditorGutterLine {
  return {
    el: null
  }
}

type LineHandler = (dispatcher: Dispatcher, line: SourceLine, memoryTracker?: MemoryTracker) => EditorGutterLine
type LineTypeMapType = Record<LineType, LineHandler>

const LineTypeMap: LineTypeMapType = {
  AssignmentLine,
  BlankLine,
  CodegenLine,
  ErrorLine,
}

function GutterLine(dispatcher: Dispatcher, line: SourceLine, memoryTracker: MemoryTracker) {
  const height = `calc(${line.height_in_lines}*var(--line-height))`
  const handler = LineTypeMap[line.type](dispatcher, line, memoryTracker)
  return {
    el: el(".gutter-line-holder", {style: {height}}, handler),
    memoryUpdated: handler.memoryUpdated
  }
}



function Gutter(dispatcher: Dispatcher, assembled: SourceCode) {
  const memoryTracker = new MemoryTracker()
  const lines = assembled.sourceLines.map((l) => GutterLine(dispatcher, l, memoryTracker))

  dispatcher.register("StateUpdated", (_state: StateUpdated) => {
    lines.forEach(l => l.memoryUpdated && l.memoryUpdated())
  })

  return {
    el: el(".gutter", lines),
  }
}



class MemoryTracker {
  updateSeen: Map<Address, boolean> = new Map()
  memoryValues: Map<Address, number> = new Map()

  recordDeltas(deltas: Map<Address, Value>) {
    for (let [address, value] of deltas) {
      this.updateSeen.set(address, true)
      this.memoryValues.set(address, value)
    }
  }
  
  updatesIn(address: Address, length: number): number[] {
    let updatesSeen = false
    let i = 0
    while (i < length && !updatesSeen)
      updatesSeen = this.updateSeen.get(address + i++)

    if (!updatesSeen)
      return null

    const result: number[] = []
    for (i = 0; i < length; i++)
      result.push(this.memoryValues.get(address+i))

    this.updateSeen.clear()
    return result
  }
}

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
