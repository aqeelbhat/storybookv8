// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'
import Worker from './workerMock'
global.URL.createObjectURL = jest.fn()
global.URL.revokeObjectURL = jest.fn()
window.Worker = Worker
