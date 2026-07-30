import { useState } from "react";

function Counter() {
    console.log("Counter render");
    
    const [count, setCount] = useState(0);

    return (
        <div>
            <h2>{count}</h2>
            <button onClick={increment}>+</button>
        </div>
    );

    function increment() {
    setCount(count + 1);
}
}



export default Counter;