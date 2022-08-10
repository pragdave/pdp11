import { el, text } from "redom"
import { Dispatcher } from "../../playground"
import { ChangeBaseEventName, SelectorBases } from "../../number"

let labelCount = 0

export function OneBase(_dispatcher: Dispatcher, base: number, checked?: boolean) {
  const label = `l${labelCount++}`
  
  return [ 
    el("input", { "data-base": base, id: label, type: "radio", value: base, name: "base", checked: checked }),
    el("label", { for: label }, text(base.toString()))
  ]
}


export function BaseSelector(dispatcher: Dispatcher) {

  let base = 16

  const selectors = el(".base-selector", SelectorBases.map(b=> OneBase(dispatcher, b, b == base)))
  selectors.onchange = (ev: Event) => {
    const newBase = (ev.target as HTMLElement)?.dataset.base || base.toString()
    dispatcher.dispatch({ type: ChangeBaseEventName, newBase: parseInt(newBase) })
  }

  return (
    el(".bases", [
      el("h3", text("Number base")),
      selectors,
    ]))
}


