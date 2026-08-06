Usage

Import and render the `Popup` component. Provide `message` and `onClose`.

Example:

```tsx
import { Popup } from 'src/shared/components'
import { useState } from 'react'

function Example() {
  const [open, setOpen] = useState(true)
  return open ? (
    <Popup
      title="Hello"
      message="This is a popup message."
      onClose={() => setOpen(false)}
    />
  ) : null
}
```
