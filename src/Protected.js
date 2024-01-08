import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Protected = (props) => {
    const { Component } = props;
    const navigate = useNavigate();
    const [authChecked, setAuthChecked] = useState(false)
    const isUserAuth = async () => {
        try {
            const isValidUser = await axios.get("http://localhost:3001/isUserAuthenticated", { headers: { Authorization: localStorage.getItem('token') } });
            return isValidUser.data.auth;
        } catch (err) {
            return false
        }
    }
    useEffect(() => {
        (async () => {
            const check = await isUserAuth();
            if (!check) {
                navigate("/login")
            }
            setAuthChecked(true)
        })()
    }, [])

    if (!authChecked) {
        return <></>
    }

    return (
        <>
            <Component />
        </>
    )
}

export default Protected;