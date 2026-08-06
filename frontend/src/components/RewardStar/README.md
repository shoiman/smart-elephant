Usage

Import and render the `RewardStar` component. Provide an `onClick` handler.

Example:

```tsx
import { RewardStar } from 'src/shared/components'
import { useState } from 'react'

function Example() {
  const [seen, setSeen] = useState(false)
  if (seen) return null
  return (
    <RewardStar onClick={() => setSeen(true)} size={180} />
  )
}
```
