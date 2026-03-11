import BullLogo from "@/components/BullLogo";

const steps = [
  { number: 1, label: "ข้อมูลโรงงาน" },
  { number: 2, label: "ข้อมูลพนักงาน" },
  { number: 3, label: "ผู้จัดส่ง" },
  { number: 4, label: "นำเข้าข้อมูล" },
];

export default function SetupHeader({
  currentStep,
}: {
  currentStep: 1 | 2 | 3 | 4;
}) {
  return (
    <header className="bg-white border-b border-n-200 sticky top-0 z-10">
      <div className="max-w-[920px] mx-auto px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <BullLogo size={30} />
          <span className="text-[17px] font-extrabold text-n-900">
            Fresh<b className="text-p-500">Pro</b>
          </span>
        </div>

        {/* 4-step indicator */}
        <div className="flex items-center gap-1">
          {steps.map((step, i) => {
            const isDone = step.number < currentStep;
            const isActive = step.number === currentStep;
            return (
              <div key={step.number} className="flex items-center gap-1">
                {i > 0 && (
                  <div
                    className={`w-7 h-0.5 mx-0.5 ${isDone ? "bg-p-300" : "bg-n-200"}`}
                  />
                )}
                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-6 h-6 rounded-full text-[10.5px] font-bold flex items-center justify-center shrink-0 ${
                      isDone
                        ? "bg-fp-green text-white"
                        : isActive
                          ? "bg-p-500 text-white"
                          : "bg-n-200 text-n-400"
                    }`}
                  >
                    {isDone ? "✓" : step.number}
                  </div>
                  <span
                    className={`text-[12px] ${
                      isActive
                        ? "font-semibold text-n-800"
                        : isDone
                          ? "font-medium text-n-500"
                          : "font-medium text-n-400"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </header>
  );
}
