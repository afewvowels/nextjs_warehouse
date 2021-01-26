import styles from '@styles/templates.module.css'
import { useEffect, useState, useCallback } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useSWR from 'swr'

const fetcher = (...args) => fetch(...args).then(res => res.json())

function useFonts() {
  const { data, error } = useSWR(`/api/fonts`, fetcher)
  return { fonts: data, isLoading: !data && !error, isError: error }
}

const FontSelect = () => {
  const [font, set_font] = useState()

  const selectRef = useCallback(node => {
    if (node != null) {

    }
  }, [font])

  return(
  <select>

  </select>)
}

export default FontSelect