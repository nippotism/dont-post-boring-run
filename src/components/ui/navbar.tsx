


import ThemeToggle from './dark-mode';
import { StravaDeauth } from '../strava_deauth';

export function Navbar() {
    const AthleteId = localStorage.getItem("strava_athlete_id");
    return (
        <nav className="bg-white shadow-md px-6 py-4 flex items-center dark:bg-black bg-opacity-90 dark:bg-opacity-90 backdrop-blur-sm justify-between">
                <ThemeToggle />
                <a 
                className="text-xl sm:text-4xl font-bold tracking-wider text-black font-calsans dark:text-white hover:underline hover:text-gray-800"
                href="/"
                >dontpostboringrun.com</a>
                <StravaDeauth accessToken={String(AthleteId)} onDeauth={() => {}} />
              </nav>
    )
}