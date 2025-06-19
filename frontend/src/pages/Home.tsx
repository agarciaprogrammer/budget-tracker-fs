import global from '../styles/global.module.css';
import WelcomeCard from '../components/WelcomeCard';

export default function Home() {
    return (
      <div className={global.container}>
        <WelcomeCard />
      </div>
    );
}