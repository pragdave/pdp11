import {parser} from "./pdp11"
import {LRLanguage, LanguageSupport, indentNodeProp, foldNodeProp, foldInside, delimitedIndent} from "@codemirror/language"
import {styleTags, tags as t} from "@lezer/highlight"

const Macro11Language = LRLanguage.define({
  parser: parser.configure({
    props: [
      indentNodeProp.add({
        Application: delimitedIndent({closing: ")", align: false})
      }),
      foldNodeProp.add({
        Application: foldInside
      }),
      styleTags({
        Identifier: t.variableName,
        Opcode: t.keyword,
        Boolean: t.bool,
        Number: t.number,
        Comma: t.punctuation,
        Register: t.atom,
        Equals: t.punctuation,
        String: t.string,
        Comment: t.comment,
        Label:   t.labelName,
        Directive: t.macroName,
      })
    ]
  }),
  languageData: {
    commentTokens: {line: ";"}
  }
})

// export const exampleCompletion = exampleLanguage.data.of({
//   autocomplete: completeFromList([
//     {label: "defun", type: "keyword"},
//     {label: "defvar", type: "keyword"},
//     {label: "let", type: "keyword"},
//     {label: "cons", type: "function"},
//     {label: "car", type: "function"},
//     {label: "cdr", type: "function"}
//   ])
// })

export function Macro11() {
  return new LanguageSupport(Macro11Language, [ ])
}
