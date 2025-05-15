import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PlanEditor from "../components/create-plan/PlanEditor";

function CreatePlanPage() {
    return (
        <div className="bg-[#E7F9FF]">
            <Navbar />
            <PlanEditor />
            <Footer />
        </div>
    )
}

export default CreatePlanPage;