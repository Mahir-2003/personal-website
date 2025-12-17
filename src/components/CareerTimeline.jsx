import CareerCard from "./CareerCard.jsx"
import playstationLogo from "../assets/career/PlayStation_Color.svg"
import uwLogo from "../assets/career/uw-crest-color-web-digital.svg"
import ssecLogo from "../assets/career/SSEC Logo.jpg"
import messengerLogo from "../assets/career/wisco-messenger.png"
import cyberforceLogo from "../assets/career/cyberforce_logo_white.png"

const CareerTimeline = () => {
    const jobs = [
        {
            status: "Current",
            company: "UW-Madison Housing Department",
            position: "House Fellow (Resident Assistant)",
            description: [
                "Working at Sellery Residence Hall, building safe, respectful and inclusive communities for all residents"
            ],
            img: uwLogo
        },
                {
            status: "Previous",
            company: "Sony Interactive Entertainment",
            position: "Software Developer Intern",
            description: [
                "On the Unified Telemetry Team for Fall 2025"
            ],
            img: playstationLogo
        },
        {
            status: "Previous",
            company: "UW-Madison Space Science and Engineering Center",
            position: "Software Engineer Intern",
            description: [
                "Working on the NASA Cloud Mask Project, optimizing the codebase to be more memory efficient"
            ],
            img: ssecLogo

        },
        {
            status: "Previous",
            company: "UW-Madison Computer Science Department",
            position: "Peer Mentor / Undergraduate TA",
            description: [
                "Led office hours and provided individualized support in Python for a course with over 1,000 students, contributing to over 150 hours of coding and teaching assistance per semester",
                "Improved TA response times with a Python script leveraging Google Sheets API and macOS notifications"
            ],
            img: uwLogo 
        },
        {
            status: "Previous",
            company: "Wisconsin Messenger",
            position: "Software Engineer Intern",
            description: [
                "Built web scrapers using Python/BeautifulSoup, efficiently processing article information from over 1,000 articles weekly",
                "Designed a Python-based political sentiment analyzer with NLTK, classifying news articles as left, right or neutral to streamline editorial review"
            ],
            img: messengerLogo
        },
        {
            status: "Previous",
            company: "CyberForce",
            position: "Software Engineer Intern",
            description: [
                "Developed a mobile application for hiring intake, candidate screening and placement using Flutter and Firebase",
                "Engineered a personality assessment system with a 20-question quiz, matching users with cybersecurity specializations"
            ],
            img: cyberforceLogo
        }
    ]


    return (
        <div className="relative z-10 min-h-screen mb-12">
            <h2 className="text-2xl font-bold text-orange-400 mb-6">[ CAREER HISTORY ]</h2>
            <div className="space-y-6">
                {jobs.map((j, idx) => {
                    return <CareerCard key={idx} status={j.status} company={j.company} position={j.position} description={j.description} img={j.img}/>
                })}
            </div>
        </div>
    )
}

export default CareerTimeline;