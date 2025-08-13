function compararCoordenadas(
  coord1: number,
  coord2: number,
  tolerancia = 0.000001,
) {
  return Math.abs(coord1 - coord2) < tolerancia
}

export function compareArrayCoordenadas(
  arr1: any[],
  arr2: any[],
  tolerancia = 0.000001,
) {
  if (arr1.length !== arr2.length) {
    return false
  }

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i].length !== arr2[i].length) {
      return false // Si las coordenadas tienen diferente cantidad de elementos
    }
    for (let j = 0; j < arr1[i].length; j++) {
      if (!compararCoordenadas(arr1[i][j], arr2[i][j], tolerancia)) {
        return false
      }
    }
  }

  return true
}
