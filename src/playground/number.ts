import { el, setAttr, setChildren, setStyle, text } from "redom"
import { Dispatcher } from "./playground"


type AFormatter = (val: number) => string
export type ValidBase  = 2 | 8 | 10 | 16

type FormatterList = {
    [base in ValidBase]:   AFormatter;
}

const binaryFormatter  = (val: number) => val.toString(2).padStart(16, "0")
const octalFormatter   = (val: number) => val.toString(8).padStart(6, "0")
const decimalFormatter = (val: number) => val.toString()
const hexFormatter     = (val: number) => val.toString(16).padStart(4, "0")

const Formatters: FormatterList = {
  2:  binaryFormatter,
  8:  octalFormatter,
  10: decimalFormatter,
  16: hexFormatter,
}

export const AllBases = Object.keys(Formatters).map(b => parseInt(b))
export const SelectorBases = [ 8, 10, 16 ]


export const ChangeBaseEventName = "ChangeBase"

export type NumberEvent = {
  type: "ChangeBase",
    newBase: number
}

////////////////////////////////////////////////////////////////////////////////

export type PGNumberType = { el: HTMLSpanElement, update: (newVal: number) => void }

export function PGNumber(dispatcher: Dispatcher, val: number): PGNumberType {
  let base = 16
  let format = Formatters[base]

  function createPopup(val: number) {
    return el(".number-popup", { style: { display: "none" }}, [
      el(".b", text(binaryFormatter(val))),
      el(".o", text(octalFormatter(val))),
      el(".d", text(decimalFormatter(val))),
      el(".x", text(hexFormatter(val))),
    ])
  }

  let popup = createPopup(val)

  function replaceNumberInPlace(oldNumber: HTMLElement, newNumber: number) {
    const cls = `number n-${base}`
    const txt = format(newNumber)
    setAttr(oldNumber, { class: cls })
    setChildren(oldNumber, [ text(txt), popup])
    oldNumber.onmouseenter = () => setStyle(popup, { display: "block" })
    oldNumber.onmouseleave = () => setStyle(popup, { display: "none" })
    return oldNumber
  }

  const number = replaceNumberInPlace(el("span"), val)


  dispatcher.register(ChangeBaseEventName, (event: NumberEvent) => {
    base = event.newBase
    format = Formatters[base]
    replaceNumberInPlace(number, val)
  })

  return {
    el: number,
    update: (newVal: number) => {
      val = newVal
      popup = createPopup(val)
      replaceNumberInPlace(number, val)
    }
  }
}
