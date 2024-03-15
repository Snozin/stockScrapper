import Home from './home/Home'
import { Prueba } from './prueba/Prueba'

import './App.css'
import { Suspense } from 'react'

function App() {
  return (
    <>
      {/* <Prueba /> */}

      <Suspense>
        <Home />
      </Suspense>
    </>
  )
}

export default App
