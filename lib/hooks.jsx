import useSWR from 'swr'

const fetcher = (url) => fetch(url).then((r) => r.json())

export function useBin() {
  const { data, mutate } = useSWR('/api/bin', fetcher)
  const bin = data && data.bin
  return [ bin, { mutate }]
}