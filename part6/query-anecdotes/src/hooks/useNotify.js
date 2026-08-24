import { useContext } from 'react'
import { NotificationContext } from '../components/NotificationContextProvider'

const useNotify = () => useContext(NotificationContext)

export default useNotify