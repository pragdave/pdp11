import { ce, EmulatorEvent } from "../event_stream"
import { Memory }     from "../shared_state/memory"
import { PSW }        from "../shared_state/psw"
import { Registers, RegisterValues }  from "../shared_state/registers"
import { SourceCode } from "../shared_state/source_code"
import { Dispatcher } from "../../playground/playground"

export type MSMemory = Memory
export type MSRegisters = Registers

// processor state
export enum RunningState  {
  Paused,
  Running,
  Trapped,
  Halted,
  Waiting,
}

export interface Callbacks {
  emtTtyout: (msg: string) => void
  emtPrint:  (msg: string) => void
}


export enum RW { RW="RW",  WR="WR",  W="W", R="R" }
type Width = 1 | 2

export type AccessInfo = {
  address: number,
  value:   number,
  width:   Width
  rw:      RW,
}

export type AccessTracker = Record<number, AccessInfo>

export interface AdditionalStatus {
  message: string,
  pc: number
}

//TODO: remove?
export interface EmulationStatus {
  memory:    MSMemory
  registers: RegisterValues,
  psw:       PSW
  runningState:    RunningState
  memory_accesses:   AccessTracker
  register_accesses: AccessTracker
  additionalStatus:  AdditionalStatus
}

export type Address = number
export type Register = number
export type Value = number

export interface StateDelta {
  memory_delta: Map<Address, Value>,
  register_delta: Map<Register, Value>,
  running_state: RunningState,
  additional_status?: AdditionalStatus
  psw: PSW,
}

export interface EventDispatcher {
  dispatch: (ev: EmulatorEvent| EmulatorEvent[])  => void
}

export interface MemoryWriteRecorder {
  record_memory_write(address: Address, value: Value): void
}

export interface RegisterWriteRecorder {
  record_register_write(address: Register, value: Value): void
}

export class MachineState implements EventDispatcher, MemoryWriteRecorder, RegisterWriteRecorder {

  memory: MSMemory
  registers: MSRegisters
  runningState: RunningState
  memory_accesses: AccessTracker = {}
  register_accesses: AccessTracker = {}
  deltas: StateDelta

  constructor(private dispatcher: Dispatcher) {
    this.reset()
  }

  capture_updates(to_do: () => void) {
    this.reset_deltas()
    to_do()
    this.deltas.psw = this.psw
    this.deltas.running_state = this.runningState
    return this.deltas
  }

  reset_deltas() {
    this.deltas = {
      memory_delta: new Map(),
      register_delta: new Map(),
      running_state: this.runningState,
      psw: this.memory.psw,
    }
  }

  dispatch(ev: EmulatorEvent| EmulatorEvent[]) {
      if (Array.isArray(ev)) {
        ev.forEach(e => this.dispatcher.dispatch(e))
      }
      else {
        this.dispatcher.dispatch(ev)
      }
  }

  reset() {
    this.memory = new Memory(this)
    this.registers = new Registers(this)
    this.runningState = RunningState.Paused
    this.reset_deltas()
    // this.dispatch([V
    //   ce.memoryClear(), 
    //   ce.registersClear(),
    //   ce.changeRunningState(RunningState.Paused),
    // ])
  }

  record_register_write(reg: Register, value: Value) {
    this.deltas.register_delta.set(reg, value)
  }

  record_memory_write(address: Address, value: Value) {
    this.deltas.memory_delta.set(address, value)
  }

  get psw() { return this.memory.psw }

  loadAssembledCode(assemblerOutput: SourceCode) {
    this.memory.clear()
    this.registers.clear()

    if (assemblerOutput.errorCount === 0) {
      assemblerOutput.toMemory().forEach(([addr, bytes]) => {
        const startAddr = addr
        if (bytes && bytes.length > 0) {
          for (let byte of bytes) {
            this.memory.setByte(addr++, byte)
          }
          this.dispatch(ce.memoryWriteBytes(startAddr, bytes))
        }
      })
      this.registers[7] = assemblerOutput.start_address
      this.registers[6] = 56 * 1024
    }
  }
  
}
