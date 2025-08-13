export const auxiliar = async (execution: any, nombre: string, data?: any) => {
  try {
    const result = await execution(data)
    console.log(`${nombre} completado`)
    return result
  } catch (error) {
    console.error(`Error en ${nombre}:`, error)
  }
}
