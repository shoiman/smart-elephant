function Greeting(props: { name: string }) {
    return (
        <div>
            <h2>Welcome to Smart Elephant, {props.name}!</h2>
        </div>
    );
}

export default Greeting;