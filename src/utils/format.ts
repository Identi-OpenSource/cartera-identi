export const formatDid = (didString: string) => {
  if (!didString) {
    return '' // Retorna una cadena vacía si no existe
  }

  const length = didString.length

  // Extrae los primeros 6 caracteres.
  const start = didString.slice(0, 24)

  // Extrae los últimos 6 caracteres.
  const end = didString.slice(length - 6)

  // Combina las partes con los puntos suspensivos.
  return `${start}...${end}`
}

export const formatCustomHash = (HashString: string, a: number, b: number) => {
  if (!HashString) {
    return '' // Retorna una cadena vacía si no existe
  }

  const length = HashString.length

  // Extrae los primeros 6 caracteres.
  const start = HashString.slice(0, a)

  // Extrae los últimos 6 caracteres.
  const end = HashString.slice(length - b)

  // Combina las partes con los puntos suspensivos.
  return `${start}...${end}`
}

export function capitalizeFirstLetter(str: string) {
  if (str) {
    const lowerStr = str.toLowerCase()
    return lowerStr.charAt(0).toUpperCase() + lowerStr.slice(1)
  }
  return str
}
