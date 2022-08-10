//r import { Context    } from "./context"
// import { EditorPanel     } from "./editor_panel"
import { FrontPanel } from "./components/front_panel"
// import { Logger     } from "./logger"
// import { ET, Event } from "../assembler-emulator"
import { el, setChildren } from "redom"
import { EditorPanel } from "./editor_panel"
import { BaseDispatcher } from "../shared/dispatcher"
import { AssemblyDone, AssemblyEvent, Emulator, EmulatorEvent } from "../assembler-emulator"
import type { NumberEvent } from "./number"
import { StateDelta } from "../assembler-emulator/emulator/machine_state"


/////////// amalgamate all the different event sources, and create a 
//          dispatcher type that can use them

type CommandRun = { type: "CommandRun" }
type CommandStep = { type: "CommandStep" }
type CommandReset = { type: "CommandReset" }

export type StateUpdated = { type: "StateUpdated", deltas: StateDelta }

type LocalEvent = CommandRun | CommandStep | CommandReset | StateUpdated

type PlaygroundEvent = LocalEvent | AssemblyEvent | EmulatorEvent | NumberEvent

export class Dispatcher extends BaseDispatcher<PlaygroundEvent> { }


/////////// Handle the emulator start/stop stuff



export class Playground {

  private editor_panel: EditorPanel

  el: HTMLElement
  dispatcher: Dispatcher
  emulator: Emulator

  constructor(private defaultSource: string) {
    this.dispatcher = new Dispatcher()
    this.emulator = new Emulator(this.dispatcher)    

    this.dispatcher.register("AssemblyDone", (ev: AssemblyDone) => {
      const deltas = this.emulator.loadAssembledCode(ev.assembled)
      this.dispatcher.dispatch({
        type: "StateUpdated",
        deltas: deltas,
      })
    })

    this.dispatcher.register("CommandStep", () => this.step())

    this.el = el(".playground.visible") 
  }

  onmount() {
    this.editor_panel = new EditorPanel(this.dispatcher, this.defaultSource)
    setChildren(this.el,       [
        FrontPanel(this.dispatcher),
        this.editor_panel 
      ])
  }

  step() {
    const deltas = this.emulator.step()
    this.dispatcher.dispatch({
      type: "StateUpdated",
      deltas: deltas,
    })
  }
    // this.editor.clearAnyEmulatorErrors()
    // const emulationState = this.context.emulator.step()
    // this.updateFromEmulationState(emulationState)
    // switch (emulationState.processorState) {
    //   case PS.Paused:
    //   case PS.Running:
    //     break

    //   case PS.Halted:
    //     break

    //   default:
    //     throw new Error(`Unhandled processor state: ${emulationState.processorState}`)
    // }
    // return emulationState
  // }


  // run() {
  //   let state: void
  //   do 
  //     state = this.step()
  //   while (this.continueRunning(state))
  // }

  // continueRunning(_state: void) {
  //   // if (state.processorState !== PS.Paused)
  //   //   return false

  //   // if (this.editor.breakpointSetAt(state.registers[7])) {
  //   //   return false
  //   // }
  //   return true
  // }

  // reset() {
  //   // this.context.reset()
  //   // // this.updateFromEmulationState(this.context.emulator.getEmulationState())
  //   // this.frontPanel.reset()
  //   // this.editor.reset()
  // }

  // // updateFromEmulationState(emulationState) {
  // //   this.frontPanel.updateAfterBuild(emulationState)
  // //   this.editor.updateMemory(emulationState)

  // //   if (emulationState.additionalStatus) {
  // //     this.editor.addEmulatorErrorTo(emulationState.additionalStatus)
  // //   }
  // //   this.editor.highlightCurrentInstruction(emulationState.registers[7])
  // // }

  // resetButton() {

  // }

  // numberFormatChanged() {
  //   // this.frontPanel.redrawOnNumberFormatChange()
  //   // this.editor.redrawOnNumberFormatChange()
  // }

  // // emt functions
  // emtPrint(msg: string) {
  //   console.info(`.print: `, msg)
  //   // this.logger.print(msg)
  // }

  // emtTtyout(msg: string) {
  //   console.info(`.ttyout: `, msg)
  //   // this.logger.ttyout(msg)
  // }

  // // Hack? Nah... but there's a bug in CodeMirror that means we need to refresh the
  // // window if it is displayed in a dynamically sized container
  // refresh() {
  //   console.log("refreshing")
  //   // setTimeout(() => this.editor.refresh(), 10)
  // }
// }
}
