export interface PEvent {
  type: string
}

type DispatcherClient<Events> = (event: Events) => void

export class BaseDispatcher<Events extends PEvent> {

  clients: Record<string, DispatcherClient<Events>[]> = {}

  register(eventName: Events["type"], listener: DispatcherClient<Events>) {
    if (eventName in this.clients)
      this.clients[eventName].push(listener)
    else
      this.clients[eventName] = [ listener ]
  }

  dispatch(event: Events) {
    const listeners = this.clients[event.type]
    if (listeners) {
      listeners.forEach(listener => listener(event))
    }
  }
}


