import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PlanEditor from "../components/create-plan/PlanEditor";

function CreatePlanPage() {
    return (
        <div className="bg-[#E7F9FF] min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-1">
                <PlanEditor />
            </div>
            <Footer />
        </div>
    );
}

export default CreatePlanPage;
