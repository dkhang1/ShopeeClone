import { createContext, useState } from 'react'
import { ExtendedPurchase } from 'src/types/purchase.type'
import { User } from 'src/types/user.type'
import { getAccessTokenFromLocal, getProfileFromLocal } from 'src/utils/auth'

interface AppContextInterface {
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  profile: User | null
  setProfile: React.Dispatch<React.SetStateAction<User | null>>
  extendedPurchase: ExtendedPurchase[]
  setEtendedPurchase: React.Dispatch<React.SetStateAction<ExtendedPurchase[]>>
  reset: () => void
}
const initialAppContext: AppContextInterface = {
  isAuthenticated: Boolean(getAccessTokenFromLocal()),
  setIsAuthenticated: () => null,
  profile: getProfileFromLocal(),
  setProfile: () => null,
  extendedPurchase: [],
  setEtendedPurchase: () => null,
  reset: () => null
}

export const AppContext = createContext<AppContextInterface>(initialAppContext)
export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialAppContext.isAuthenticated)
  const [extendedPurchase, setEtendedPurchase] = useState<ExtendedPurchase[]>(initialAppContext.extendedPurchase)
  const [profile, setProfile] = useState<User | null>(initialAppContext.profile)

  const reset = () => {
    setIsAuthenticated(false)
    setProfile(null)
    setEtendedPurchase([])
  }

  return (
    <AppContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, profile, setProfile, extendedPurchase, setEtendedPurchase, reset }}
    >
      {children}
    </AppContext.Provider>
  )
}
