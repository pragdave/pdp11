import { el, RedomElement } from "redom"

// global data, bounded by the scope of an HTML hierarchy
declare global {
  interface Window {
    playground_contexts: Record<number, any>
  }
}


let cid = 0

export class Context {

  el: RedomElement

  constructor(initial_value: any) {
    const id = `ctx-${cid++}`
    if (!window.playground_contexts)
      window.playground_contexts = {}
    window.playground_contexts[id] = initial_value

    this.el = el(".context-wrapper", { "data-contextid": id })
  }

  static current(from: HTMLElement): any {
    const contextEl = from.closest(".context-wrapper") as HTMLElement

    if (!contextEl)
      throw new Error("Context.current called, but no active context")

    const cid = contextEl.dataset.contextid
    const context = window.playground_contexts?.[cid]

    if (!context)
      throw new Error("Internal error: Context.current called, but context has no id")

    return context
  }
}

