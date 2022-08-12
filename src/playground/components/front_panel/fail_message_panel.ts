import { Dispatcher, StateUpdated } from "../../playground"
import { PGNumber } from "../../number"
import { el, setAttr, text } from "redom"

export function FailMessagePanel(dispatcher: Dispatcher) {

  const pc = PGNumber(dispatcher, 0)

  const msgText = text("")

  const failMsg = el(".failMsg", [ 
    el(".msg", [
      el("div.label", [ text("Execution failed at:"), pc ]),
      msgText,
    ]),
  ])


  dispatcher.register("StateUpdated", (ev: StateUpdated) => {
    const failure = ev.deltas.additional_status
    if (failure) {
      msgText.textContent = failure.message
      pc.update(failure.pc)
      setAttr(failMsg, { className: "failMsg" })
    }
    else {
      setAttr(failMsg, { className: "failMsg hidden" })
    }
  })

  return failMsg
}
