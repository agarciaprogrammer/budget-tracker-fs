import global from '../styles/global.module.css';

export default function Home() {
    return (
      <div className={global.container}>
        <div className={global.header}>
            <h1 className={global.title}>Bienvenido a tu Control de Gastos</h1>
        </div>
      </div>
    );
}