/** 
 * @description These tests will be no loger maintained
 * @deprecated Testing library has been deprecated in V8 in favour of built in test runner
 * @docs https://github.com/storybookjs/testing-library?tab=readme-ov-file
 * 
*/

// import React from 'react';
// import '../stories/pollyfills'
// import { render, screen, fireEvent, act } from '@testing-library/react'
// import '@testing-library/jest-dom/extend-expect'
// import { Translation } from '../lib/Translation';


// xdescribe('When Translation flag is on', function () {
//   jest.setTimeout(10000)
//   const setupComponent = () => render(<Translation canShowTranslation>{'bonjour'}</Translation>)

//   test('Initial Values should render correctly', async () => {
//     let { container } = setupComponent()
//     await act(async () => {
//         await new Promise((r) => setTimeout(r, 2000))
//     })
//     expect(container.firstElementChild?.children[0].innerHTML.toString()).toEqual('bonjour')
//   })

//   test.skip('on translate to english from french (see translation)', async () => {
//     let { container } = setupComponent()
//     await act(async () => {
//         await new Promise((r) => setTimeout(r, 2000))
//     })
//     await act(async () => {
//         fireEvent.click(screen.getByTestId('seeTranslation'))
//         await new Promise((r) => setTimeout(r, 2000))
//     })
//     expect(container.firstElementChild?.children[1].innerHTML.toString()).toBe('Good morning')
//   })

//   test.skip('on translate back to french from english (see original)', async () => {
//     let { container } = setupComponent()
//     await act(async () => {
//         await new Promise((r) => setTimeout(r, 2000))
//     })
//     await act(async () => {
//         fireEvent.click(screen.getByTestId('seeTranslation'))
//         await new Promise((r) => setTimeout(r, 2000))
//     })
//     await act(async () => {
//         fireEvent.click(screen.getByTestId('seeOriginal'))
//         await new Promise((r) => setTimeout(r, 2000))
//     })
//     expect(container.firstElementChild?.children[0].innerHTML.toString()).toBe('bonjour')
//   })
   
// })

// describe('When Translation flag is off', function () {
//   jest.setTimeout(10000)
//   const setupComponent = () => render(<Translation>{'bonjour'}</Translation>)

//   test('Initial Values should render correctly', async () => {
//     let { container } = setupComponent()
//     await act(async () => {
//         await new Promise((r) => setTimeout(r, 2000))
//     })
//     expect(container.innerHTML.toString()).toEqual('bonjour')
//     expect(screen?.queryByTestId('seeTranslation')).not.toBeInTheDocument()
//     expect(screen?.queryByTestId('seeOriginal')).not.toBeInTheDocument()
//   })
// })
