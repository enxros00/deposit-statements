import { useState } from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'

import './App.css'
import './assets/css/style.css'
import Navbar from './components/Navbar/Navbar'
import Statement from './components/Statement/Statement'
import OnboardDipChip from './components/OnboardDipChip/OnboardDipChip';
import Home from './components/Home/Home'
import { domain as Domain} from "./utils/domain";

function App() {
  const [count, setCount] = useState(0)

  let domain = Domain();
  window.$API_URL = domain;
  window.$API_CUSTOMER_URL = domain + "services/customerapi/api/";
  window.$API_ONBOARD_URL = domain + "services/onboardingapi/api/";
  window.$API_COMMON_URL = domain + "services/commonapi/api/";
  window.$API_REPORT_URL = domain + "services/report/api/";
  window.$API_AUTHENTICATION_URL = domain + "services/authentication/api/";
  window.$API_AUTHENTICATION_SSO_URL = domain + "services/authentication/sso/authentication";

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path='/' element={<Navigate to="/Main" />} />
        <Route path='/Main' element={<OnboardDipChip />} />
        <Route path='/Statement' element={<Statement />} />
      </Routes>
    </div>
  )
}

export default App
