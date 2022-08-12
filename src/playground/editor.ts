import { Decoration, EditorView, keymap, drawSelection, highlightSpecialChars, GutterMarker, gutter } from "@codemirror/view"
import { lineNumbers  } from "@codemirror/view"
import { EditorState, Range, RangeSet, StateEffect, StateField, Text } from "@codemirror/state"
import {defaultKeymap} from "@codemirror/commands"
import { AssembledLine, ErrorLine, LineType, SourceCode } from "../assembler-emulator"

import { Macro11 } from "./lang-macro11/index"
import { classHighlighter} from "@lezer/highlight"
import {syntaxHighlighting} from "@codemirror/language"
import { linter, lintGutter, Diagnostic } from "@codemirror/lint"

export type SourceChangedCB = (newSource: string, firstTime?: boolean) => SourceCode

// export function bytesIntoWords(address: number, bytes: number[]) {
//   if (!bytes)
//     return []

//   const words = []
//   const len = bytes.length
//   let index = 0

//   if ((address & 1) === 1 && index < len)
//     words.push(bytes[index++] << 8)

//   while (index < len - 1) {
//     words.push(bytes[index + 1] << 8 | bytes[index])
//     index += 2
//   }

//   if (index < len) 
//     words.push(bytes[index])

//   return words
// }


// local helper iterator used by CM hooks
type LineCallback = (editorLine: string, assembledLine: AssembledLine, pos: number, lineNo: number) => void
function forEachLine(doc: Text, assembled: SourceCode, cb: LineCallback) {
    let pos = 0, lineNo = 0
    for (let editorLine of doc.iterLines()) {
      let assembledLine = assembled.sourceLines[lineNo++]
      cb(editorLine, assembledLine, pos, lineNo)
      pos += editorLine.length + 1
  }
}

// calculate line heights based on the amount of generated code
function getLineHeights(assembled: SourceCode, doc: Text) {
  const spacers: Range<Decoration>[] = []

  forEachLine(doc, assembled, (_editorLine: string, assembledLine: AssembledLine, pos: number, _lineNo: number) => {
      if (assembledLine) {  // blank lines at the end of ignored by assembler
        const height = assembledLine.height_in_lines
        if (height > 1) {
          spacers.push(Decoration.line({
            attributes: {
              style: `padding-bottom: calc(var(--line-height)*${height - 1})`
            }
          }).range(pos))
        }
      }

  })
  return Decoration.set(spacers)
}


///////////////////////// hook that reassembles
//
const reassembleOnChanges = (sourceChangedCB: SourceChangedCB) => StateField.define<SourceCode>({
  create(state: EditorState) {
    return sourceChangedCB(state.doc.toString(), /* firsttime = */ true)
  },

  update(prev: SourceCode, tr): SourceCode {
    if (tr.docChanged) {
      return sourceChangedCB(tr.newDoc.toString())
    }
    else
      return prev
  },
})


//////////////////////// then set line heights
//
const updateLineHeights = (assemblerStateField: StateField<SourceCode>) => StateField.define({
  create(state: EditorState) {
    const assembled = state.field(assemblerStateField)
    return getLineHeights(assembled, state.doc)

  },

  update(prev, tr) {
    if (tr.docChanged) {
      const assembled = tr.startState.field(assemblerStateField)
      return getLineHeights(assembled, tr.newDoc)
    }
    else
      return prev
  },

  provide: f => EditorView.decorations.from(f)
})


//////////////////////// and break out errors
//
const extractErrors = (assemblerStateField: StateField<SourceCode>) => linter((view: EditorView) => {
  const diagnostics: Diagnostic[] = []
  const assembled = view.state.field(assemblerStateField)

  let pos = 0
  const doc = view.state.doc

  assembled.sourceLines.forEach((line: AssembledLine, i: number) => {
    if (line.type == LineType.ErrorLine) {
      const error = line as ErrorLine
      diagnostics.push({
        from: pos + error.col + 1,
        to: pos + error.col + error.symText.length + 1,
        severity: "error",
        message: error.message,
      })
    }
    pos += doc.line(i+1).length
  })
  return diagnostics
})

///////////////////////// show the PC

const currentLineMarker = new class extends GutterMarker {
  toDOM() { return document.createTextNode("▸") }
}

const pcEffect = StateEffect.define<{ pos: number }>({
})
const pcState = StateField.define<RangeSet<GutterMarker>>({
  create() {
    return RangeSet.empty 
  },
  update(set, transaction) {
    set = set.map(transaction.changes)
    for (let e of transaction.effects) {
      if (e.is(pcEffect)) {
        set = RangeSet.empty.update({add: [currentLineMarker.range(e.value.pos)]})
      }
    }
    return set
  }
})

const  pcGutterMarker = [
  pcState,
  gutter({
    class: "cm-pc-gutter",
    markers: v => v.state.field(pcState),
    initialSpacer: () => currentLineMarker,
  })
]

////////////////////////////////////////////////////////////////////////////////////////////////////

export class Editor {
  view: EditorView

  constructor(private source: string, private parent: HTMLElement, sourceChangedCB: SourceChangedCB) {
    const assembler = reassembleOnChanges(sourceChangedCB)
    this.view = new EditorView({
      doc: this.source,
      extensions: [
        keymap.of(defaultKeymap),
        drawSelection(),
        highlightSpecialChars(),
        assembler,
        updateLineHeights(assembler),
        // extractErrors(assembler),
        // lintGutter(),
        // pcGutterMarker,
        Macro11(),
        syntaxHighlighting(classHighlighter),
      ],
      parent: this.parent,
    })
  }

  // refresh(pc: number) {
  //   let pos = 0, lineNo = 0
  //   const assembled = this.view.state.field(this.assembler)
  //   for (let editorLine of this.view.state.doc.iterLines()) {
  //     let assembledLine = assembled.sourceLines[lineNo++]

  //     if (assembledLine.type == "CodegenLine" && (assembledLine as CodegenLine).address == pc) {
  //       this.view.dispatch({
  //         effects: pcEffect.of({ pos: this.view.lineBlockAt(pos).from })
  //       })
  //     }
  //     pos += editorLine.length + 1
  //   }
  // }

  revert_to_original_source() {
    const changes = [{ from: 0, to: this.view.state.doc.length, insert: this.source }]
    this.view.dispatch({ changes })
  }
}
