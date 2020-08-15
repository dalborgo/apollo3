import React, { memo, useEffect, useState } from 'react'
import create from 'zustand'
import produce from 'immer'
import shallow from 'zustand/shallow'
import axios from 'axios'

const wait = delay => new Promise(resolve => setTimeout(resolve, delay))
const immer = config => (set, get) => config(fn => set(produce(fn)), get)
const [useStore] = create(immer(set => ({
  obj: {
    loading: false,
    second: 'ds',
    count: 0,
    details: '',
  },
  inc: async () => {
    await wait(1000)
    set(state => void state.obj.count++)
  },
  change: () => set(state => void (state.obj.loading = !state.obj.loading)),
  change2: () => set(state => void (state.obj.second = new Date())),
  set: fn => set(fn), //generico con immer
})))
const [useStoreFetch] = create(immer(set => ({
  json: {},
  myFetch: async event => {
    const name = event.currentTarget.name
    const response = await fetch(name)
    const json = await response.json()
    set(state => void (state.json = json)) //funziona con l'immer
  },
})))

// eslint-disable-next-line react/display-name
const AddToCartButton4Why = memo(() => {
  const change = useStore(state => state.change)
  const { loading } = useStore(state => ({ loading: state.loading }), shallow) //renderizzo solo se cambia state.loading ma non se cambia second
  console.log('%cRENDER_BUTTON4', 'color: orange')
  return (
    <div>
      <button
        onClick={change}
      >
        {loading ? 'Spegni qu' : 'Accendi qu'}
      </button>
    </div>
  )
})

AddToCartButton4Why.whyDidYouRender = true

// eslint-disable-next-line react/display-name
const Cart2 = memo(() => {
  const loading = useStore(state => state.obj.loading)
  console.log('%cRENDER_CART', 'color: cyan')
  return (
    <div className="cart">
      <div>My Cart</div>
      <AddToCartButton4Why/>
      {
        loading === false ?
          (
            <p>SPENTO qu</p>
          ) :
          (
            <p>ACCESO qu</p>
          )
      }
    </div>
  )
})

// eslint-disable-next-line react/display-name
const Header4Why = memo(() => {
  const loading = useStore(state => state.obj.loading)
  console.log('loading:', loading)
  console.log('%cRENDER_HEADER4', 'color: yellow')
  return (
    <div style={{ width: '100%', backgroundColor: loading ? 'red' : 'yellow' }}>
      HEADER qu
    </div>
  )
})

Header4Why.whyDidYouRender = true

// eslint-disable-next-line no-unused-vars
const [_, api] = create(set => ({
  uno: [-10, 0],
  due: [10, 5],
  advance (id) {
    set(state => void (state[id] = new Date()))
  },
}))

function Component ({ id }) {
  // Fetch initial state
  const [prova, setProva] = useState('')
  // Connect to the store on mount, disconnect on unmount, catch state-changes in a callback
  useEffect(() => api.subscribe(coords => {
    setProva(coords)
  }, state => state[id]), [id])
  return (
    <div>
      {JSON.stringify(prova, null, 2)}
      {id}
    </div>
  )
}

const Zustand = () => {
  const change2 = useStore(state => state.change2)
  const change = useStore(state => state.change)
  const inc = useStore(state => state.inc)
  const count = useStore(state => state.obj.count)
  const details = useStore(state => state.obj.details)
  const { myFetch, json } = useStoreFetch(state => ({ myFetch: state.myFetch, json: state.json }))
  const second = useStore(state => state.obj.second)
  const set = useStore(state => state.set)
  const [, setRender] = useState()
  console.log('render')
  console.log('second:', second)
  console.log('json:', json)
  console.log('count:', count)
  useEffect(() => {
    console.log('qua')
    
    function getFetchUrl () {
      return 'https://api.spacexdata.com/v4/launches/latest'
    }
    
    async function fetchData () {
      change()
      const result = await axios(getFetchUrl())
      set(state => void (state.obj.details = result.data.details))
      change()
    }
    
    fetchData().then()
  }, [change, set])
  return (
    <>
      <Component id={'uno'}/>
      <Component id={'due'}/>
      <button onClick={() => api.getState().advance('due')}>MIAO2</button>
      <button onClick={() => setRender(new Date())}>Render</button>
      <button onClick={change2}>Cambia</button>
      <button
        name="https://api.spacexdata.com/v4/launches/latest"
        onClick={myFetch}
      >
        Fetch
      </button>
      <button
        onClick={inc}
      >
        Cont
      </button>
      <button onClick={() => set(state => void (state.obj.second = new Date()))}>Cambia set</button>
      <Header4Why/>
      <br/>
      <div>{details}</div>
      <div>
        {
          <Cart2/>
        }
      </div>
    </>
  )
}

export default Zustand
