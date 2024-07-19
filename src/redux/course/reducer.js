import {
  RESET_STATE,
  CURRENT_ACTION,
  CURRENT_ITEM,
  REQUEST_FAILED,
  REQUEST_LOADING,
  REQUEST_SUCCESS,
  RESET_ACTION,
  SET_FILTER,
  RESET_FILTER,
  SET_SEARCH,
} from './types';

const INITIAL_STATE = {
  current: {
    result: null,
  },
  list: {
    result: {
      items: [],
      pagination: {
        current: 1,
        pageSize: 10,
        showSizeChanger: false,
        total: 1,
      },
    },
    isLoading: false,
    isSuccess: false,
  },
  filter: {
    filterField: [], // Changed to an array
    filterValue: [], // Changed to an array
  },
  search: '', // Add search initial state
};

const erpReducer = (state = INITIAL_STATE, action) => {
  const { payload, keyState } = action;
  switch (action.type) {
    case RESET_STATE:
      return INITIAL_STATE;
    case CURRENT_ITEM:
      return {
        ...state,
        current: {
          result: payload,
        },
      };
    case REQUEST_LOADING:
      return {
        ...state,
        [keyState]: {
          ...state[keyState],
          isLoading: true,
        },
      };
    case REQUEST_FAILED:
      return {
        ...state,
        [keyState]: {
          ...state[keyState],
          isLoading: false,
          isSuccess: false,
        },
      };
    case REQUEST_SUCCESS:
      return {
        ...state,
        [keyState]: {
          result: payload,
          isLoading: false,
          isSuccess: true,
        },
      };
    case CURRENT_ACTION:
      return {
        ...state,
        [keyState]: {
          ...state[keyState],
          current: payload,
        },
      };
    case RESET_ACTION:
      return {
        ...state,
        [keyState]: {
          ...INITIAL_STATE[keyState],
        },
      };
    case SET_SEARCH:
      return {
        ...state,
        search: action.payload,
      };
    case SET_FILTER:
      return {
        ...state,
        filter: {
          filterField: [...state.filter.filterField, action.payload.filterField],
          filterValue: [...state.filter.filterValue, action.payload.filterValue],
        },
      };
    case RESET_FILTER:
      return {
        ...state,
        filter: INITIAL_STATE.filter,
        search: state.search, // Preserve search state
      };
    default:
      return state;
  }
};

export default erpReducer;
