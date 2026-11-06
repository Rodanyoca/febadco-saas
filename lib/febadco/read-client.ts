// No persistent cache, user scope, demo fallback or mutation capability.
export type Cell = string | number | boolean | null
export type Matrix = Cell[][]
export function mapHeaderRows(matrix: Matrix) {
  const headers = (matrix[0] ?? []).map(value => String(value ?? "").trim())
  const meaningful = headers.filter(Boolean)
  if (!meaningful.length || new Set(meaningful).size !== meaningful.length) throw new Error("En-têtes absents ou dupliqués.")
  return matrix.slice(1).filter(row => row.some(cell => cell !== null && String(cell).trim() !== ""))
    .map(row => Object.fromEntries(headers.flatMap((header, index) => header ? [[header, row[index] ?? ""]] : [])))
}
export function createReadClient(batch: (book: string, ranges: string[]) => Promise<Matrix[]>) {
  const inflight = new Map<string, Promise<Record<string, Matrix>>>()
  return {
    read(book: string, requested: string[]) {
      if (!book.trim() || !requested.length || requested.some(range => !range.trim())) return Promise.reject(new Error("Source ou plages manquantes."))
      const ranges = [...new Set(requested)].sort()
      const key = JSON.stringify([book, ranges])
      const pending = inflight.get(key)
      if (pending) return pending
      const promise = Promise.resolve().then(() => batch(book, ranges)).then(matrices => {
        if (matrices.length !== ranges.length) throw new Error("Réponse source incomplète.")
        return Object.fromEntries(ranges.map((range, index) => [range, matrices[index]]))
      }).finally(() => inflight.delete(key))
      inflight.set(key, promise)
      return promise
    },
  }
}
