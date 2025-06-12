import global from '../styles/global.module.css';

export default function Home() {
    return (
        <div className={global.container}>
            <h1 className={global.title}>Welcome to the Home Page</h1>
        </div>
    );
}