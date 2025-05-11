import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "../../pages/Public/Login";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

// Create a mock store for Redux
const mockStore = configureStore([]);
const store = mockStore({
	users: {
		token: null,
		user: null,
	},
});

describe("Login Component", () => {
	let mockAxios;

	beforeEach(() => {
		// Set up axios mock adapter
		mockAxios = new MockAdapter(axios);
	});

	afterEach(() => {
		// Reset axios mock adapter
		mockAxios.reset();
	});

	test("renders the Login component", () => {
		render(
			<Provider store={store}>
				<Router>
					<Login />
				</Router>
			</Provider>
		);
		expect(screen.getByText(/Login/)).toBeInTheDocument();
	});

	test("validates input fields", async () => {
		render(
			<Provider store={store}>
				<Router>
					<Login />
				</Router>
			</Provider>
		);

		const loginButton = screen.getByText(/Login/);
		userEvent.click(loginButton);

		// Check for validation error messages
		expect(await screen.findByText(/Email is required/)).toBeInTheDocument();
		expect(await screen.findByText(/Password is required/)).toBeInTheDocument();
	});

	test("login success with correct credentials", async () => {
		render(
			<Provider store={store}>
				<Router>
					<Login />
				</Router>
			</Provider>
		);

		const emailInput = screen.getByPlaceholderText("Email");
		const passwordInput = screen.getByPlaceholderText("Password");
		const loginButton = screen.getByText(/Login/);

		userEvent.type(emailInput, "test@example.com");
		userEvent.type(passwordInput, "password123");

		// Mocking the axios response for successful login
		mockAxios.onPost("/login").reply(200, {
			token: "mocked_token",
			userData: { email: "test@example.com", name: "Test User" },
		});

		userEvent.click(loginButton);

		await waitFor(() =>
			expect(screen.getByText(/Logging in.../)).toBeInTheDocument()
		);

		// Ensure the login was successful by checking for a redirect or loading behavior
		expect(mockAxios.history.post[0].url).toBe("/login");
	});

	test("login failure with incorrect credentials", async () => {
		render(
			<Provider store={store}>
				<Router>
					<Login />
				</Router>
			</Provider>
		);

		const emailInput = screen.getByPlaceholderText("Email");
		const passwordInput = screen.getByPlaceholderText("Password");
		const loginButton = screen.getByText(/Login/);

		userEvent.type(emailInput, "wrong@example.com");
		userEvent.type(passwordInput, "wrongpassword");

		// Mocking the axios response for failed login
		mockAxios.onPost("/login").reply(400, {
			message: "Invalid Email or Password",
		});

		userEvent.click(loginButton);

		await waitFor(() =>
			expect(screen.getByText(/Invalid Email or Password/)).toBeInTheDocument()
		);
	});

	test("redirect to the register page when clicked on Create an Account link", () => {
		render(
			<Provider store={store}>
				<Router>
					<Login />
				</Router>
			</Provider>
		);

		const createAccountLink = screen.getByText(/Create an Account/);
		userEvent.click(createAccountLink);

		// Expect to navigate to the /register route
		expect(window.location.pathname).toBe("/register");
	});
});
