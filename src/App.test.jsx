import { describe, expect, it } from 'vitest';
import App from './App';
import { render, screen } from '@testing-library/react';

describe("App test suite", () => {
    // it('1 plus 1 equals 2', () => {
    //     expect(1 + 1).toBe(2);
    // });
    // it('expect up to not equal down', () => {
    //     expect('up' !== 'down').toBe(true);
    // });
    // it('expect up to equal down', () => {
    //     expect('up').toEqual('down');
    // });
    // it('expect up to not match regular expression /down/', () => {
    //     expect('up').not.toMatch(/down/);
    // });
    //When a component or a portion of HTML is rendered, DOM Testing Library gives us 
    // a screen object that contains rendered content and all of the queries available 
    // to select various text or elements. screen also includes a method, .debug() that is 
    // very useful for exploring the contents of the of the screen while writing tests. 
    // When screen.debug() is added to the test, it outputs the rendered elements in neatly 
    // formatted html. Notice that everything inside of App is rendered into HTML, including 
    // its children components.
    it('contains a `list` html element', () => {
    render(<App />);
    expect(screen.getByRole('list')).toBeInTheDocument();
    screen.debug(screen.getByRole('heading', { level: 1 }));
  });
})