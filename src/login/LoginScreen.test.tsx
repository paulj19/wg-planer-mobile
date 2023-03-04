import {BASE_URL_DEV, PATH_LOGIN, PATH_VALIDATE_ACCESS_TOKEN} from "../lib/UrlPaths";
import React from 'react';
import App from "../App";
import axios from "../lib/axiosConfig";
import {getByTestId, render, screen} from '@testing-library/react';
import 'core-js';
import {HomeScreen} from "../Home/HomeScreen";
const secureStorage = require("../util/storage/SecureStore")
import '@testing-library/jest-dom'
import {fireEvent} from "@testing-library/react";
import userEvent from '@testing-library/user-event';

const flushPromises = require('flush-promises');

describe("login screen test",() => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should get a valid accessToken and navigate to home screen', async () => {
        secureStorage.getItemValue = jest.fn().mockReturnValue("testAccessToken123");
        // jest.mock('../util/storage/SecureStore', () => ({ getItemValue: jest.fn() }))
        // getItemValue.mockImplementation(() => Promise.resolve('test1234'))
        const axiosSpy = jest.spyOn(axios, 'get');
        render(<App/>);
        await flushPromises();
        expect(axiosSpy).toHaveBeenCalledWith(PATH_VALIDATE_ACCESS_TOKEN)
        //expect(await screen.getByText(/home screen/i)).toBeInTheDocument();
        expect(await screen.findByText(/home screen/)).toBeInTheDocument();
    });
    it('should get accessToken as null and navigate to login screen', async () => {
        secureStorage.getItemValue = jest.fn().mockReturnValue(null);
        // jest.mock('../util/storage/SecureStore', () => ({ getItemValue: jest.fn() }))
        // getItemValue.mockImplementation(() => Promise.resolve('test1234'))
        const axiosSpy = jest.spyOn(axios, 'get');
        render(<App/>);
        await flushPromises();
        expect(axiosSpy).not.toHaveBeenCalled()
        expect(await screen.findAllByText(/Login/i)).toHaveLength(2);
    });
    it('should navigate to home page when login success', async () => {
        secureStorage.getItemValue = jest.fn().mockReturnValue(null);
        // jest.mock('../util/storage/SecureStore', () => ({ getItemValue: jest.fn() }))
        // getItemValue.mockImplementation(() => Promise.resolve('test1234'))
        const axiosSpy = jest.spyOn(axios, 'get');
        render(<App/>);
        await flushPromises();
        await userEvent.type(screen.getByPlaceholderText("username"), 'user');
        await userEvent.type(screen.getByPlaceholderText("password"), 'Password123!');
        //await userEvent.click(screen.getByRole('button', {name: /Login/i, hidden: true}));
        await userEvent.click(screen.findByText(/Login/i)[1]);
        await userEvent.click(screen.findByText(/Login/i)[0]);
        await expect(axiosSpy).toHaveBeenCalledWith(PATH_LOGIN)
        //expect(await screen.getByText(/home screen/i)).toBeInTheDocument();
        expect(await screen.findByText(/home screen/)).toBeInTheDocument();
    });
})
//load login screen/app without any tokens stored
//verify calls /validate with null
//redirect to login page/stays in login page

//load login page with access token
//calls /validate
//gets new access token or same access token
//verify stores and redirects to home page
//sets authstate correctly