import React, { createContext, useContext, useEffect, useReducer } from "react";
import { reducer } from "./reducer";
import { toast, Bounce } from 'react-toastify';
import {
  DISPLAY_ALERT,
  CLOSE_ALERT,
  EMPTY_FIELDS,
  REGISTER_USER_BEGIN,
  REGISTER_USER_SUCCESS,
  REGISTER_USER_ERROR,
  LOGIN_USER_BEGIN,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_ERROR,
  SHOW_SIDEBAR,
  LOGOUT_USER,
  UPDATE_USER_BEGIN,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR,
  HANDLE_CHANGE,
  CREATE_PROPERTY_BEGIN,
  CREATE_PROPERTY_SUCCESS,
  CREATE_PROPERTY_ERROR,
  GET_PROPERTIES_BEGIN,
  GET_PROPERTIES_SUCCESS,
} from "./action";
import axios from "axios";

// Create a context
export const AppContext = createContext();

const user = localStorage.getItem("user");
const jwtToken = localStorage.getItem("jwtToken");
const userLocation = localStorage.getItem("location");

export const initialState = {
  isLoading: false,
  showAlert: false,
  alertText: "",
  alertType: "",
  user: user ? JSON.parse(user) : null,
  token: jwtToken || null,
  userLocation: userLocation || "",
  propertyLocation: userLocation || "",
  showSidebar: false,
  isEditing: false,
  editPropertyId: '',
  owner: '',
  propertyLocation: '',
  propertyTypeOptions: ['rent', 'buy'],
  propertyType: 'rent',
  statusOptions: ['meeting', 'declined', 'pending'],
  status: 'pending',
  properties: [],
  totalProperties: 0,
  page: 1,
  numOfPages: 1
};

// Create a component that provides the context
export const AppProvider = ({ children }) => {
  // dispatch function to update the state
  const [state, dispatch] = useReducer(reducer, initialState);

  // axios instance
  const authFetch = axios.create({
    baseURL: "/api/v1",
    headers: {
      Authorization: `Bearer ${state.token}`,
    },
  });

  // update showAlert & show the alert message
  const displayAlert = (type) => {
    if (type === EMPTY_FIELDS) dispatch({ type: EMPTY_FIELDS });
    else dispatch({ type: DISPLAY_ALERT });

    // remove alert msg after 3 sec
    setTimeout(() => {
      dispatch({ type: CLOSE_ALERT });
    }, 3000);
  };

  const clearAlert = () =>{
    setTimeout(()=>{
      dispatch({ type: CLOSE_ALERT });
    }, 3000)
  }

  const storeInLocalStorage = (user, jwtToken, location) => {
    localStorage.setItem("user", JSON.stringify(user)); // we can only store strings in localStorage so convert obj to string
    localStorage.setItem("jwtToken", jwtToken);
    localStorage.setItem("location", location);
  };

  const removeFromLocalStorage = () => {
    // for logoutUser
    localStorage.removeItem("user");
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("location");
  };

  // register a new user (send user data)
  const registerUser = async (newUser) => {
    dispatch({ type: REGISTER_USER_BEGIN });
    try {
      const response = await axios.post("/api/v1/auth/register", newUser);
      const { user, jwtToken, location } = response.data;
      console.log(user, jwtToken, location);
      dispatch({
        type: REGISTER_USER_SUCCESS,
        payload: { user, jwtToken, location },
      });

      // store the user data, token & userLocation in localStorage
      storeInLocalStorage(user, jwtToken, location);
    } catch (err) {
      dispatch({
        type: REGISTER_USER_ERROR,
        payload: { msg: err.response.data.msg },
      });
      console.log(err.response);
    }
  };

  const loginUser = async (newUser) => {
    dispatch({ type: LOGIN_USER_BEGIN });
    try {
      const response = await axios.post("/api/v1/auth/login", newUser);
      const { user, jwtToken, location } = response.data;

      dispatch({
        type: LOGIN_USER_SUCCESS,
        payload: { user, jwtToken, location },
      });

      // store the user data, token & userLocation in localStorage
      storeInLocalStorage(user, jwtToken, location);
    } catch (err) {
      dispatch({
        type: LOGIN_USER_ERROR,
        payload: { msg: err.response.data.msg },
      });
      console.log(err.response);
    }
  };

  const toggleSidebar = () => {
    dispatch({ type: SHOW_SIDEBAR });
  };

  const logoutUser = () => {
    dispatch({ type: LOGOUT_USER });
    removeFromLocalStorage();
  };

  const updateUser = async (userData) => {
    dispatch({type: UPDATE_USER_BEGIN})
    try{
      const { data } = await authFetch.patch("/auth/update-user", userData);
      const { user, jwtToken, userLocation } = data;

      dispatch({type: UPDATE_USER_SUCCESS, payload: {user, jwtToken, userLocation}})
      storeInLocalStorage(user, jwtToken, location);
    } catch (err) {
      dispatch({type: UPDATE_USER_ERROR, payload: {msg: err.response.data.msg}})
      console.log(err);
    }
    clearAlert();
  };

  // for handling change in inputs of AddProperty comp
  const handleChangeInContext = (value, name) =>{
    dispatch({type: HANDLE_CHANGE, payload: {name: name, value: value}})
  }

  const createProperty = async() =>{
    dispatch({ type: CREATE_PROPERTY_BEGIN });
    try {
      const { owner, propertyLocation, propertyType, status } = state;
      await authFetch.post('/properties', {
        owner,
        propertyLocation,
        propertyType,
        status,
      });
 
      dispatch({ type: CREATE_PROPERTY_SUCCESS });
      toast.success('Property Listed Successfully!', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
        });

    } catch (error) {
      // if (error.response.status === 401) return;
      console.log(error)
      dispatch({
        type: CREATE_PROPERTY_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert();
  }

  const getAllProperties = async() =>{
    let url = `/properties`
    dispatch({type: GET_PROPERTIES_BEGIN})
    
    try{
      const res = await authFetch.get(url)
      console.log(res.data)
      const { properties, propertiesLength, numOfPages } = res.data;
      dispatch({
        type: GET_PROPERTIES_SUCCESS,
        payload: {
          properties, propertiesLength, numOfPages
        },
      });
      
    }catch(err){
      console.log(err)
    }
  };


  const setEditProperty = (id) => {
    console.log(id)
  };


  const deleteProperty = async (propertyId) => {
    console.log(propertyId)
  };


  return (
    <AppContext.Provider
      value={{
        ...state,
        displayAlert,
        clearAlert,
        registerUser,
        loginUser,
        toggleSidebar,
        logoutUser,
        updateUser,
        handleChangeInContext,
        createProperty,
        getAllProperties,
        setEditProperty,
        deleteProperty
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// custom hook to consume the context
export const useAppContext = () => {
  return useContext(AppContext); // return the result of useContext
};
