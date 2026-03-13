import * as React from "react"

type UnitSystem = "metric" | "imperial"

interface Settings {
  units: UnitSystem
  setUnits: (u: UnitSystem) => void
}

const SettingsContext = React.createContext<Settings>({
  units: "metric",
  setUnits: () => {},
})

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [units, setUnitsState] = React.useState<UnitSystem>("metric")

  React.useEffect(() => {
    const stored = localStorage.getItem("bioboost-units")
    if (stored === "metric" || stored === "imperial") {
      setUnitsState(stored)
    }
  }, [])

  const setUnits = (u: UnitSystem) => {
    setUnitsState(u)
    localStorage.setItem("bioboost-units", u)
  }

  return (
    <SettingsContext.Provider value={{ units, setUnits }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  return React.useContext(SettingsContext)
}
