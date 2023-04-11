import * as React from 'react'
import {rest} from 'msw'
import {setupServer} from 'msw/node'
import {render, screen, fireEvent} from '@testing-library/react-native';
//import '@testing-library/jest-dom'
import { RegistrationForm } from "./RegistrationForm";

const server = setupServer(
    rest.get('/register/username-available?username=foobar', (req, res, ctx) => {
        return res(ctx.json('false'))
    }),
)

describe('registration form test', () => {
    // const handleChange = jest.fn();
    // beforeAll(() => server.listen())
    // afterEach(() => server.resetHandlers())
    // afterAll(() => server.close())

    it('error message and disables submit if username not available', async () => {

        //ARRANGE
        // render(<RegistrationForm/>)

        ////ACT
        //const usernameField = screen.getByTestId('username');
        ////fireEvent.changeText(usernameField, 'foobar');

        ////ASSERT
        ////expect(handleChange).toHaveBeenCalledTimes(2);
        //expect(screen.findByText("username is not available"));
        //expect(screen.findByText('Register')).toBe();
    });
});



