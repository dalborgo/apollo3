import React, { useRef } from 'react'
import create from 'zustand'
import produce from 'immer'

const [useStore, api] = create(set => ({
  a: 'defaultState',
  set: fn => set(produce(fn)),
}))

const Mio = props => {
  const a = useStore(state => state.a)
  return (
    <div>
      {a}
    </div>
  )
}

const ExampleComponent = ({ a }) => {
  const initialState = { a }
  const ref = useRef(initialState)
  const state = ref.current
  const store = useStore()
  console.log('render')
  
  return (
    <div
      onClick={
        () =>
          store.set(state => {
            state.a = 'nextState'
          })
      }
    >
      <Mio/>
    </div>
  )
}

export default ExampleComponent
