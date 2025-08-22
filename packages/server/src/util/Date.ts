export const formatDateTimeForSQL = (date: Date | null): string | null => {
  if (!date) {
    return null
  }

  return date.toISOString().slice(0, 19).replace(/T/, " ")
}

export const formatDateForSQL = (date: Date | null): string | null => {
  if (!date) {
    return null
  }

  return date.toISOString().slice(0, 10)
}
