import Calculator from "@/components/Calculator";
import FAQ from "@/components/FAQ";
import Hero from "@/components/Hero";
import InvestmentPlans from "@/components/InvestmentPlans";
import LandingCta from "@/components/LandingCta";
import Process from "@/components/process";
import Stats from "@/components/stats";

export default function Home() {
    return (
        <div>
            <Hero/>
            <InvestmentPlans/>
            <Calculator/>
            <Process/>
            <Stats/>
            <FAQ/>
            <LandingCta/>
        </div>
    );
}
