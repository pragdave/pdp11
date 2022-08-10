import { RunningState } from "./emulator/machine_state"
import { PSW } from "./shared_state/psw"


// export enum ET {
//   tMemoryRead = "MemoryRead",
//     tMemoryWrite = "MemoryWrite",
//    tRegisterRead = "RegisterRead",
//     tRegisterWrite = "RegisterWrite",
//     tChangeRunningState = "ChangeRunningState",
//     tErrorEncountered = "ErrorEncountered",
//     tMemoryClear = "MemoryClear",
//     tRegistersClear = "RegistersClear",
//     tMemoryWriteBytes = "MemoryWriteBytes",
//     tTtyout = "ttyout",
//     tPrint = "print",
//     tPswUpdated = "pswUpdated",
// }

export type MemoryRead = {
  type: "MemoryRead"
  address: number
  value_read: number
  width:      number
}

export type MemoryWrite = {
  type: "MemoryWrite"
  address: number
  value_written: number
  width:      number
}

export type MemoryWriteBytes = {
  type: "MemoryWriteBytes"
  address: number
  values_written: number[]
}

export type RegisterRead = {
  type: "RegisterRead"
  address: number
  value_read: number
}

export type RegisterWrite = {
  type: "RegisterWrite"
  address: number
  value_written: number
}

export type ChangeRunningState = {
  type: "ChangeRunningState"
  runningState: RunningState
}

export type ErrorEncountered = {
  type: "ErrorEncountered"
  message: string
  last_pc: number
}

export type EmtTtyout = {
  type: "EmtTtyout",
  text: string,
}

export type EmtPrint = {
  type: "EmtPrint",
  text: string,
}

export type PswUpdated = {
  type: "PswUpdated",
  psw: number
}

export type MemoryClear = {
  type: "MemoryClear",
}

export type RegistersClear = {
  type: "RegistersClear",
}

export type EmulatorEvent 
  = MemoryRead
  | MemoryWrite
  | MemoryWriteBytes
  | RegisterRead
  | RegisterWrite
  | ChangeRunningState
  | ErrorEncountered
  | MemoryClear
  | RegistersClear
  | EmtTtyout
  | EmtPrint
  | PswUpdated

export type EmulatorEventCallback = (ev: EmulatorEvent) => void
export type EmulatorEventTypes = EmulatorEvent["type"]

// CONSTRUCTORS

export const ce = {
  event<T extends EmulatorEventTypes>(type: T) {
    return {
      type
    }
  },

  registersClear(): RegistersClear {
    return {
      type: "RegistersClear",
    }
  },

  memoryClear(): MemoryClear {
    return {
      type: "MemoryClear",
    }
  },

  changeRunningState(runningState: RunningState):ChangeRunningState {
    return {
      type: "ChangeRunningState",
      runningState
    }
  },

  memoryRead(address: number, value_read: number, width: number):MemoryRead {
    return {
      type: "MemoryRead",
      address,
      value_read,
      width,
    }
  },

  memoryWrite(address: number, value_written: number, width: number):MemoryWrite {
    return {
      type: "MemoryWrite",
      address,
      value_written,
      width,
    }
  },

  registerRead(address: number, value_read: number):RegisterRead {
    return {
      type: "RegisterRead",
      address,
      value_read,
    }
  },

  registerWrite(address: number, value_written: number):RegisterWrite {
    return {
      type: "RegisterWrite",
      address,
      value_written,
    }
  },

  memoryWriteBytes(address: number, values_written: number[]):MemoryWriteBytes {
    return {
      type: "MemoryWriteBytes",
      address,
      values_written,
    }
  },

  ttyout(text: string):EmtTtyout {
    return {
      type: "EmtTtyout",
      text,
    }
  },

  print(text: string):EmtPrint {
    return {
      type: "EmtPrint",
      text,
    }
  },

  pswUpdated(psw: PSW): PswUpdated {
    return {
      type: "PswUpdated",
      psw:  psw.toWord(),
    }
  }
}

