# channeljs
A lib to provide reactions on function call.
It looks like https://github.com/evgkch/channelsjs.git where you subscribe on a function call rather than sending a message.
Since any function has its own unique ref, there is no need to create an instance - the singleton provides the functionality.

## Usage
```typescript
// Import lib
import { cx, rx } from 'reagirjs';

{
    function click(x: number, y: number): void {}

    const listener = (_: void, x: number, y: number) => { /** Your Code */ }

    // Subscribe on click call
    rx.on(click, listener);

    // Subscribe on click call
    // Your subsctibtion will be terminated after the click will be called.
    // Do not need a reason to store your listeners
    rx.once(click, (_, x, y) => { /** Your Code */ });

    // Subscribe on click call using lambda function and store it in some var
    // Don not forget to store your lambda if you need to unsubscribe it
    const lambda = rx.on(click, (_, x, y) => { /** Your Code */ });

    // Subscribe on click call thought the weak ref.
    // Your subsctibtion will be alive while the ref is alive
    const ref = rx.onweak(click, (_, x, y) => { /** Your Code */ });

    // Call click func with x: 10, y: 20
    // After sending all listeners above will be work.
    // The second listener (that used 'once') will be terminated
    cx.call(click, 10, 20);

    // Deleting the first listener
    rx.off(click, listener);
}
// ...
// After a while (but not immediately) your 'ref' will be expired.
// Calling click another time execute only the third listener 'lambda',
// because the 'ref' listener terminated.
cx.call(click, 20, 30);
```
