import { el, setStyle, text } from "redom"
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

export function PGNumber(dispatcher: Dispatcher, val: number, cls?: string): PGNumberType {
  let base = 16
  let format = Formatters[base]

  const popup = el(".number-popup", { style: { display: "none" }}, [
    el(".b", text(binaryFormatter(val))),
    el(".o", text(octalFormatter(val))),
    el(".d", text(decimalFormatter(val))),
    el(".x", text(hexFormatter(val))),
  ])

  const span = el(`span.number.n-${base}`, text(format(val)), popup)
  span.onmouseenter = () => setStyle(popup, { display: "block" })
  span.onmouseleave = () => setStyle(popup, { display: "none" })

  dispatcher.register(ChangeBaseEventName, (event: NumberEvent) => {
    base = event.newBase
    format = Formatters[base]
    span.textContent = format(val)
  })

  return {
    el: span,
    update: (newVal: number) => {
      val = newVal
      span.textContent = format(val)
    }
  }
}
