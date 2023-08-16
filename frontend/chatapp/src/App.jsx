
import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home  from './components/Home'
import Message from './components/message/Message';

export default function App() {
  return (
    <>

<BrowserRouter>
<Routes>
  
      
    <Route path='/' element={<Home />} />

    <Route path='/message' element={<Message />} />
    

    
  
</Routes>
</BrowserRouter>

    </>
  )
}
