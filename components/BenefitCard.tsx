type BenefitCardProps = {
    icon: React.ReactNode;
    title: string;
    description: string;
  };
  
  export default function BenefitCard({ icon, title, description }: BenefitCardProps) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl bg-white p-6 shadow-md">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/30 text-2xl">
          {icon}
        </div>
        <h3 className="text-base font-semibold text-black">{title}</h3>
        <p className="text-sm text-black/70 text-center">{description}</p>
      </div>
    );
  }
  