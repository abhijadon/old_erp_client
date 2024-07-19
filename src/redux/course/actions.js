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
import { request } from '@/request';

export const course = {
  resetState:
    (props = {}) =>
    async (dispatch) => {
      dispatch({
        type: RESET_STATE,
      });
    },
  resetAction:
    ({ actionType }) =>
    async (dispatch) => {
      dispatch({
        type: RESET_ACTION,
        keyState: actionType,
        payload: null,
      });
    },
  currentItem:
    ({ data }) =>
    async (dispatch) => {
      dispatch({
        type: CURRENT_ITEM,
        payload: { ...data },
      });
    },
  currentAction:
    ({ actionType, data }) =>
    async (dispatch) => {
      dispatch({
        type: CURRENT_ACTION,
        keyState: actionType,
        payload: { ...data },
      });
    },
  setFilter:
    ({ filterField, filterValue }) => ({
      type: SET_FILTER,
      payload: { filterField, filterValue },
    }),
  resetFilter:
    () => ({
      type: RESET_FILTER,
    }),
  setSearch:
    (query) => ({
      type: SET_SEARCH,
      payload: query,
    }),

  list:
    ({ entity, options = { page: 1, items: 10 } }) =>
    async (dispatch, getState) => {
      dispatch({
        type: REQUEST_LOADING,
        keyState: 'list',
        payload: null,
      });

      const { filter, search } = getState().course;

      // Construct the query parameters
      const filterFields = filter.filterField || [];
      const filterValues = filter.filterValue || [];

      // Build query string
      const queryParams = new URLSearchParams({
        page: options.page,
        items: options.items,
        q: search,
        ...filterFields.reduce((acc, field, index) => {
          acc[`filterField[${index}]`] = field;
          return acc;
        }, {}),
        ...filterValues.reduce((acc, value, index) => {
          acc[`filterValue[${index}]`] = value;
          return acc;
        }, {}),
      }).toString();

      try {
        let data = await request.list({ entity, options: queryParams });

        if (data.success === true) {
          const result = {
            items: data.result,
            pagination: {
              current: parseInt(data.pagination.page, 10),
              pageSize: options?.items || 10,
              total: parseInt(data.pagination.count, 10),
            },
          };
          dispatch({
            type: REQUEST_SUCCESS,
            keyState: 'list',
            payload: result,
          });
        } else {
          dispatch({
            type: REQUEST_FAILED,
            keyState: 'list',
            payload: null,
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        dispatch({
          type: REQUEST_FAILED,
          keyState: 'list',
          payload: null,
        });
      }
    },
     delete:
    ({ entity, id }) =>
    async (dispatch) => {
      dispatch({
        type: REQUEST_LOADING,
        keyState: 'delete',
        payload: null,
      });

      let data = await request.delete({ entity, id });

      if (data.success === true) {
        dispatch({
          type: REQUEST_SUCCESS,
          keyState: 'delete',
          payload: data.result,
        });
        dispatch({
          type: RESET_ACTION,
          keyState: 'delete',
        });
      } else {
        dispatch({
          type: REQUEST_FAILED,
          keyState: 'delete',
          payload: null,
        });
      }
    },
};
