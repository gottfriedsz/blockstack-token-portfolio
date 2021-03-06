import { userSession } from 'utils/blockstack'
import { defaultConfig } from '../utils'
import { getPortfolio } from './portfolioActions'

export const FETCH_FILE_REQUEST = 'FETCH_FILE_REQUEST'
export const FETCH_FILE_SUCCESS = 'FETCH_FILE_SUCCESS'
export const FETCH_FILE_ERROR = 'FETCH_FILE_ERROR'
export const PUT_FILE_REQUEST = 'PUT_FILE_REQUEST'
export const PUT_FILE_SUCCESS = 'PUT_FILE_SUCCESS'
export const PUT_FILE_ERROR = 'PUT_FILE_ERROR'
export const FILE_REMOVE_ERRORS = 'FILE_REMOVE_ERRORS'
export const FILE_SETUP = 'FILE_SETUP'

export const getBlockstackFile = (path, decrypt = false, cb) => {
  return (dispatch) => {
    dispatch({ type: FETCH_FILE_REQUEST })

    return userSession.getFile(path, {decrypt})
      .then(
        (res) => {
          if (res !== null) {
            dispatch({
              type: FETCH_FILE_SUCCESS,
              payload: {
                isEncrypted: decrypt,
                content: res,
                path
              }
            })
            if (cb) dispatch(cb())
          } else {
            dispatch({ type: FILE_SETUP })
            dispatch({ type: FILE_REMOVE_ERRORS })
            if (path === 'preferences.json' || path === 'portfolio.json' || path === 'transactions.json') {
              dispatch(putBlockstackFile(path, JSON.stringify(defaultConfig[path]), true, getPortfolio))
            }
          }
        },

        (error) => {
          dispatch({ type: FETCH_FILE_ERROR, payload: error })
        }
      )
  }
}

export const putBlockstackFile = (path, content, encrypt = false, cb) => {
  return (dispatch) => {
    dispatch({ type: PUT_FILE_REQUEST })

    return userSession.putFile(path, content, {encrypt})
      .then(
        (res) => {
          dispatch({
            type: PUT_FILE_SUCCESS,
            payload: {
              isEncrypted: encrypt,
              content,
              path
            }
          })

          if (cb) dispatch(cb())
        },

        error => dispatch({ type: PUT_FILE_ERROR, payload: error })
      )
  }
}
