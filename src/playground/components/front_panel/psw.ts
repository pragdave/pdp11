// import { PswModel } from '../../playground'
// import { Bit } from 'pdp11-assembler-emulator'

// function OneBit(props: { state: boolean, label: string, title: string }) {

//   function debug(val: boolean) {
//     console.log("In onebit", props.label, val)
//     return val
//   }

//   return (
//     <div class={`bit ${props.label} ${ debug(props.state) ? "is-set" : ""}`} title={props.title}>
//        {props.label}
//     </div>
//   )
// }

// export function PSW(props: {psw: PswModel}) {
//   const psw = props.psw[0]()

//   return (
//     <ul class="PSW">
//         <li><OneBit state={!!(psw & Bit.N)} label="N" title="last result was negative" /></li>
//         <li><OneBit state={!!(psw & Bit.Z)} label="Z" title="last result was zero" /></li>
//         <li><OneBit state={!!(psw & Bit.C)} label="C" title="last result generated unsigned carry" /></li>
//         <li><OneBit state={!!(psw & Bit.V)} label="V" title="last result overflowed the signed result" /></li>
//     </ul>
//   )
// }


